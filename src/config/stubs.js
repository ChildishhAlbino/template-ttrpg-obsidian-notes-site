import {
    getAllFilesForFolder,
    getRawFileReferences,
    getReferrerenceMap,
    createReferencesFile
} from './utils';
import { WIKI_PATH } from './wiki';

// USE THIS FOR SMART DATE REDIRECTS
const SMART_DATE_REDIRECT_REGEX = /\d{1,2}(th|rd|st)-of-.*-(\d+-(fe|br|ag))/g

export async function createReferenceMap() {
    const files = await getAllFilesForFolder(WIKI_PATH)
    const references = files.map(getRawFileReferences)
    const referenceMap = getReferrerenceMap(references)
    await createReferencesFile(referenceMap)
}