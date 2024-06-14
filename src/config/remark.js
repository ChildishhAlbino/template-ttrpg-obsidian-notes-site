import { remark } from "remark"
import remarkFrontmatter from "remark-frontmatter";
import remarkParseFrontmatter from "remark-parse-frontmatter"
import remarkLinkTransformer from 'remark-link-transformer';

// Used internally to parse the vault to run any generation tasks on it at deploy time.
export const FRONTMATTER_PROCESSOR = remark()
    .use(remarkFrontmatter)
    .use(remarkParseFrontmatter);
// A small little plugin I hacked together to turn internal page heading links from looking like
// `Page#<Heading Text>` into `<Heading Text>`
export const REMARK_PLUGINS = [remarkLinkTransformer]