import { LanguagesScriptsSelection, ProfessionSelectionIds } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const LanguagesScriptsSelectionCreator =
  fromDefault<LanguagesScriptsSelection> ({
    id: ProfessionSelectionIds.LANGUAGES_SCRIPTS,
    value: 0,
  })

export const LanguagesScriptsSelectionG = makeGetters (LanguagesScriptsSelectionCreator)

export const createLanguagesScriptsSelection =
  (points: number) => LanguagesScriptsSelectionCreator ({ value: points })
