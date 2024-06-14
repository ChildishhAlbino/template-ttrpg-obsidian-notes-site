import { MODE } from "./envvars";


export function getTitle() {
    return MODE == "pub" ? 'The Guild TTRPG Wiki' : "Mor'Thal Vault"
}