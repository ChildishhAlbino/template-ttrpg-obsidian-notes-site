import { defineConfig } from 'astro/config';
import starlightImageZoom from 'starlight-image-zoom'
import starlight from '@astrojs/starlight';
import starlightObsidian, { obsidianSidebarGroup } from 'starlight-obsidian';
import tailwind from '@astrojs/tailwind';
import { getTitle } from './src/config/title';
import { GIT_BRANCH, PUBLIC_VERCEL_GIT_COMMIT_REF } from './src/config/envvars';
import { getDarkLogo, getLightLogo } from './src/config/logo';
import { getVault } from './src/config/obisidan';
import vercel from "@astrojs/vercel/serverless";
import { createReferenceMap } from './src/config/stubs';
import { getFavicon } from './src/config/favicon';
import { createCategoryMap } from './src/config/categories';
import { getSidebar } from './src/config/sidebar';
import { REMARK_PLUGINS } from './src/config/remark';
const gitBranch = PUBLIC_VERCEL_GIT_COMMIT_REF || GIT_BRANCH;

await createReferenceMap()
console.log("Created reference-map.json");
await createCategoryMap()
console.log("Created category-map.json");

const STARLIGHT_OBSIDIAN = starlightObsidian({
	vault: getVault(),
	output: "vault",
	autoLinkHeadings: true,
	sidebar: {
		label: "🔒 Vault",
		collapsedFolders: true
	},
	// IF YOU RUN INTO ISSUES WITH CONFLICTING FRONTMATTER PROPERTIES - CHECK THE DOCS FOR THIS...
	copyStarlightFrontmatter: true
})

const sidebar = await getSidebar()
export const starlightConfig = starlight({
	plugins: [STARLIGHT_OBSIDIAN, starlightImageZoom()],
	title: getTitle(),
	logo: {
		light: getLightLogo(),
		dark: getDarkLogo(),
		replacesTitle: true
	},
	favicon: getFavicon(),
	social: {},
	pagination: false,
	sidebar: [
		...sidebar,
		// UNCOMMENT THIS IF YOU WANT YOUR SIDEBAR TO BE AUTO POPULATED. I manually defined mine to make it more aesthetic and controllable.
		// obsidianSidebarGroup
	],
	customCss: ['./src/tailwind.css'],
	editLink: {
		// edit or remove this it's up to you
		baseUrl: `https://github.com/ChildishhAlbino/template-ttrpg-obsidian-notes-site`
	},
	disable404Route: true
})
// https://astro.build/config
export default defineConfig({
	markdown: {
		// Applied to .md and .mdx files
		remarkPlugins: REMARK_PLUGINS
	},
	integrations: [starlightConfig, tailwind({
		// Disable the default base styles:
		applyBaseStyles: false
	})],
	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp'
		}
	},
	output: "server",
	adapter: vercel({
		isr: true
	})
});