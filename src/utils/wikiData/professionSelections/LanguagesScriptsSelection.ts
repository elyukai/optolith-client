import { fromDefault, Record } from '../../structures/Record';
import { ProfessionSelection, ProfessionSelectionIds } from '../wikiTypeHelpers';

export interface LanguagesScriptsSelection {
  id: ProfessionSelectionIds
  value: number
}

export const LanguagesScriptsSelection =
  fromDefault<LanguagesScriptsSelection> ({
    id: ProfessionSelectionIds.LANGUAGES_SCRIPTS,
    value: 0,
  })

export const isLanguagesScriptsSelection =
  (obj: ProfessionSelection): obj is Record<LanguagesScriptsSelection> =>
    LanguagesScriptsSelection.A.id (obj) === ProfessionSelectionIds.LANGUAGES_SCRIPTS
