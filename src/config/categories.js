import { getAllFilesForFolder } from "./utils";
import { FRONTMATTER_PROCESSOR } from "./remark";
import { writeFile } from "fs/promises"
import { WIKI_PATH } from "./wiki";

// Categories are groupings of Obsidian tags - I used the following structure but you can tweak these to fit your campaign
const CATEGORY_TAGS = {
    people: ["good", "bad", "player", "dead", "bbeg", "neutral"],
    places: ["town", "city", "capitol", "country", "continent", "planet", "monument", "poi"],
    entities: ["party", "organisation", "family", "collective", "religon"],
    things: ["PIT", "item", "magical", "race", "class"]
}

export const CATEGORIES = Object.keys(CATEGORY_TAGS);

// Ensure you match the keys from the above list to this list or things won't be nice.
export const CATEGORY_EMOJI = {
    people: "👨‍👩‍👧‍👦",
    places: "🗺️",
    things: "🪙",
    entities: "🏛️"
}

export function getCategories() {
    return CATEGORIES
}

export function getCategoryEmoji() {
    return CATEGORY_EMOJI;
}

export async function createCategoryMap() {
    const categoryMap = {}
    for (const category of CATEGORIES) {
        categoryMap[category] = []
    }
    const files = await getAllFilesForFolder(WIKI_PATH)
    for (const file of files) {
        getRawFileCategories(categoryMap, file)
    }
    await createMapFile(categoryMap)
    await createEmojiFile(CATEGORY_EMOJI)
}

function getRawFileCategories(categoryMap, { baseRef, fileName, content }) {
    try {
        const { data } = FRONTMATTER_PROCESSOR.processSync(content)
        const tags = data?.frontmatter?.tags || [];
        for (const category of CATEGORIES) {
            const checklist = CATEGORY_TAGS[category]
            for (const tag of tags) {
                const match = checklist.includes(tag)
                if (match) {
                    (categoryMap[category]).push({ ref: baseRef, name: fileName })
                    break
                }
            }
        }
    } catch (e) {
        console.error(e, { baseRef, fileName })
    }
}

async function createMapFile(categoryMap) {
    const outputPath = "./public/category-map.json"
    await writeFile(outputPath, JSON.stringify(categoryMap), { flag: "w" })
}

async function createEmojiFile(emojiMap) {
    const outputPath = "./public/category-emoji.json"
    await writeFile(outputPath, JSON.stringify(emojiMap), { flag: "w" })
}