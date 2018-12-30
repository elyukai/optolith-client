import { fromDefault } from '../../structures/Record';
import { ProfessionSelectionIds } from '../wikiTypeHelpers';

export interface CursesSelection {
  id: ProfessionSelectionIds.CURSES;
  value: number;
}

export const CursesSelection =
  fromDefault<CursesSelection> ({
    id: ProfessionSelectionIds.CURSES,
    value: 0,
  })
