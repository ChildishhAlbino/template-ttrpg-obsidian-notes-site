import { visit } from 'unist-util-visit'

const HASH = "#"

const defaultOptions = {}

export default function remarkLinkTransformer(options) {
    const optionsAsString = JSON.stringify(options)
    const optionsProvided = optionsAsString !== "{}"
    if (!!options && optionsProvided) {
        throw Error("This plugin does not accept options at the moment.")
    }
    const { } = { ...defaultOptions, ...options }
    return (tree) => {
        visit(tree, "link", (node) => {
            const [textChild] = node.children
            const childExists = textChild != null
            const includesHash = node.url.includes(HASH)
            if (childExists && includesHash) {
                const hashIndex = textChild.value.indexOf(HASH)
                textChild.value = textChild.value.substring(hashIndex + 1)
            }
        })
    }
}