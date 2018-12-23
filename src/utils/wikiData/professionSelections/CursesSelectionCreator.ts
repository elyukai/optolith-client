import { CursesSelection, ProfessionSelectionIds } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const CursesSelectionCreator =
  fromDefault<CursesSelection> ({
    id: ProfessionSelectionIds.CURSES,
    value: 0,
  })

export const CursesSelectionG = makeGetters (CursesSelectionCreator)

export const createCursesSelection =
  (points: number) => CursesSelectionCreator ({ value: points })
