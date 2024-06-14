import { readdir, readFile, writeFile } from "fs/promises"
import { statSync } from "fs"
import { join } from "path"

const BANNED_FILE_NAMES = ["index"]
const MARKDOWN_EXTENSION_REGEX = /(.md(x)*)/g
const MARKDOWN_HEADING_REGEX = /#{1,6}\s(.+)(?=\n)/g
const MARKDOWN_WIKILINK_REGEX = /\[\[([^.]+?)\|*\]\]/g

export async function getAllFilesForFolder(path) {
    const rootFolderContents = await readdir(path)
    const directories = rootFolderContents.filter(item => {
        const itemPath = join(path, item)
        const isDirectory = statSync(itemPath).isDirectory()
        return isDirectory
    })
    const partialFiles = rootFolderContents.filter(item => {
        const itemPath = join(path, item)
        const isDirectory = statSync(itemPath).isDirectory()
        const isBannedFile = BANNED_FILE_NAMES.includes(item.replace(MARKDOWN_EXTENSION_REGEX, ""))
        return !isDirectory && !isBannedFile
    }).map(item => {
        const fileName = item.replace(MARKDOWN_EXTENSION_REGEX, "")
        return {
            filePath: join(path, item),
            fileName,
            baseRef: getBaseRef(fileName)
        }
    })
    const files = await Promise.all(partialFiles.map(async (item) => {
        const content = await readFile(item.filePath, { encoding: 'utf8', flag: 'r' })
        return {
            ...item,
            content
        }
    }))

    const nestedFiles = await Promise.all(directories.map(item => {
        const itemPath = join(path, item)
        return getAllFilesForFolder(itemPath)
    }))
    return ([...files, ...nestedFiles]).flat()
}

export async function getFoldersInDirectory(path) {
    const rootFolderContents = await readdir(path)
    const directories = rootFolderContents.filter(item => {
        const itemPath = join(path, item)
        const isDirectory = statSync(itemPath).isDirectory()
        return isDirectory
    })
    return directories
}

export function getFilePermalinks({ fileName, content }) {
    const baseFilePermalink = transformNameToPermalink(fileName)
    const rawMatches = content.match(MARKDOWN_HEADING_REGEX)
    const headingPermalinks = rawMatches?.map(match => {
        const headingCleanupRegex = /#{1,6}\s/
        const headingText = match.replace(headingCleanupRegex, "")
        const permalinkHeading = transformNameToPermalink(headingText.trim())
        return [`${baseFilePermalink}#${permalinkHeading}`, `#${permalinkHeading}`]
    }) || []
    const results = [baseFilePermalink, ...headingPermalinks.flat()]
    return results
}

export function getRawFileReferences({ fileName, content }) {
    const rawMatches = content.matchAll(MARKDOWN_WIKILINK_REGEX)
    const matches = [...rawMatches]
    const references = matches?.map(match => {
        const group = match[1]
        const indexOfAlias = group.indexOf("|")
        const reference = indexOfAlias > -1 ? group.substring(0, indexOfAlias) : group
        return reference
    }) || []
    const asSet = new Set(references)
    return {
        fileName,
        references: [...asSet]
    }
}

// this could probably be a reduce
export function getReferrerenceMap(fileReferences) {
    const referenceMap = {}
    for (const fileReference of fileReferences) {
        const { fileName, references } = fileReference
        const uniqueBaseRefs = [...new Set(references.map(ref => getBaseRef(ref)))]

        uniqueBaseRefs.forEach(ref => {
            if (ref !== fileName) {
                const baseReference = getBaseRef(ref)
                const refItem = { name: fileName, ref: getBaseRef(fileName) }
                const exists = referenceMap[baseReference]
                if (exists) {
                    exists.push(refItem)
                } else {
                    referenceMap[baseReference] = [refItem]
                }
            }
        })
    }

    const keys = Object.keys(referenceMap)
    for (const key of keys) {
        const value = referenceMap[key]
        referenceMap[key] = [...(new Set(value))]
    }
    return referenceMap
}

export function getBaseRef(ref) {
    const hash = "#"
    if (ref[0] === hash) { return normaliseRef(ref) }
    const indexOfHash = ref.indexOf("#")
    const res = indexOfHash > -1 ? ref.substring(0, indexOfHash) : ref
    return normaliseRef(res)
}

function normaliseRef(ref) {
    return transformNameToPermalink(ref)
}

export function getStubs(referenceMap, permalinks) {
    const keys = Object.keys(referenceMap)
    const stubs = keys.filter(key => {
        const refKey = transformNameToPermalink(key)
        return !permalinks.includes(refKey)
    })
    return stubs
}

export async function createReferencesFile(referenceMap) {
    const outputPath = "./public/reference-map.json"
    await writeFile(outputPath, JSON.stringify(referenceMap), { flag: "w" })
}

export function transformNameToPermalink(item) {
    return item
        .replace(/ /g, '-')
        .replaceAll("'", "")
        .replaceAll("[", "")
        .replaceAll("]", "")
        .replaceAll(",", "")
        .toLowerCase()
}

/**
 * Known to cause issues with hyphenated words
 */
export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}