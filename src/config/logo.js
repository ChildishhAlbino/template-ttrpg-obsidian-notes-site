import { MODE } from "./envvars";

const actualMode = MODE === "priv" ? "private" : "public"
const MODE_SYMBOL = "{MODE}"
const THEME_SYMBOL = "{THEME}"

const TEMPLATE = `./src/assets/images/${MODE_SYMBOL}-logo-${THEME_SYMBOL}.svg`

export function getLightLogo() {
    return getLogo(actualMode, "light")
}

export function getDarkLogo() {
    return getLogo(actualMode, "dark")
}


function getLogo(mode, theme) {
    return TEMPLATE.replace(MODE_SYMBOL, mode).replace(THEME_SYMBOL, theme)
}