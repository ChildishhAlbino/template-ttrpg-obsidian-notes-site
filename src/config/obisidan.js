import { MODE } from "./envvars";


export function getVault() {
    return MODE === "PRIVATE" ? "./src/vaults/private/" : "./src/vaults/public/"
}