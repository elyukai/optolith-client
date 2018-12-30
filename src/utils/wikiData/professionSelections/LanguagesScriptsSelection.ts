import { fromDefault } from '../../structures/Record';
import { ProfessionSelectionIds } from '../wikiTypeHelpers';

export interface LanguagesScriptsSelection {
  id: ProfessionSelectionIds.LANGUAGES_SCRIPTS;
  value: number;
}

export const LanguagesScriptsSelection =
  fromDefault<LanguagesScriptsSelection> ({
    id: ProfessionSelectionIds.LANGUAGES_SCRIPTS,
    value: 0,
  })
