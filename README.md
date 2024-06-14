# Template for using Obsidian Vaults to deploy a Public and Private notes website for a TTRPG campaign.

1. Install deps with package manager of choice.
2. Configure your Astro SSR adapter - I used Vercel but this should work with most of them.
3. Open either of the vaults in Obsidian and setup any plugins you want. I basically limit it to the git plugin and style stuff.
4. Profit

## Categories
Categories are statically generated pages based on the tags property of a notes frontmatter - this is done at deploy time. They are arbitrary and can change with you needs but need to be manually adjusted in code.

## 404 Page
Empty links will navigate to a 404 page regardless of location - if the hyperlink is found in another page, it can be displayed as a stub conditionally. Check out 404.astro for that logic.