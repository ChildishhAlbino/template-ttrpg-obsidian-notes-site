import { MODE } from "./envvars";


export function getFavicon() {
    return MODE === "pub" ? "/images/public-icon.svg" : "/images/private-icon.svg"
}