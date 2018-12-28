import { ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';

export interface CantripsSelection {
  id: ProfessionSelectionIds.CANTRIPS;
  amount: number;
  sid: List<string>;
}

export const CantripsSelection =
  fromDefault<CantripsSelection> ({
    id: ProfessionSelectionIds.CANTRIPS,
    amount: 0,
    sid: List.empty,
  })

export const CantripsSelectionG = makeGetters (CantripsSelection)
