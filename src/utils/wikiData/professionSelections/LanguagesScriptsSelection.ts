import { ProfessionSelectionIds } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

export interface LanguagesScriptsSelection {
  id: ProfessionSelectionIds.LANGUAGES_SCRIPTS;
  value: number;
}

export const LanguagesScriptsSelection =
  fromDefault<LanguagesScriptsSelection> ({
    id: ProfessionSelectionIds.LANGUAGES_SCRIPTS,
    value: 0,
  })

export const LanguagesScriptsSelectionG = makeGetters (LanguagesScriptsSelection)
