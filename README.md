# Template for using Obsidian Vaults to deploy a Public and Private notes website for a TTRPG campaign.
This template is built using:
- [Astro](https://docs.astro.build/en/getting-started/); the underlying meta-framework.
- [Starlight](https://starlight.astro.build/); the UI Components and content management system.
- [Starlight-Obsidian](https://starlight-obsidian.vercel.app/getting-started/); a plugin for Starlight that bridges the gap between Starlight and an Obisidan Vault.
- Additional creature comforts and customizations I made to suit my needs.


## Getting Started
1. Install deps with package manager of choice.
2. Configure your Astro SSR adapter - I used Vercel but this should work with most of them.
3. Open either of the vaults in Obsidian and setup any plugins you want. I basically limit it to the git plugin and style stuff.
    - Adding plugins that affect the actual rendered markdown might not work with Astro so YMMV.
4. `npm run pub` or `npm run priv` to see the respected vault in the dev server.
5. Export `MODE=PRIVATE` or `MODE=PUBLIC` with `npm run build` to build the deployable package for that vault.

## Categories
Categories are statically generated pages based on the tags property of a notes frontmatter - this is done at deploy time. They are arbitrary and can change with your needs but need to be manually adjusted in code.

## 404 Page
Empty links will navigate to a 404 page regardless of location - if the hyperlink is found in another page, it can be displayed as a stub conditionally. Check out `404.astro` for that logic.