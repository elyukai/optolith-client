import { ProfessionSelectionIds } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

export interface CursesSelection {
  id: ProfessionSelectionIds.CURSES;
  value: number;
}

export const CursesSelection =
  fromDefault<CursesSelection> ({
    id: ProfessionSelectionIds.CURSES,
    value: 0,
  })

export const CursesSelectionG = makeGetters (CursesSelection)
