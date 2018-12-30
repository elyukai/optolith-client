import { List } from '../../structures/List';
import { fromDefault } from '../../structures/Record';
import { ProfessionSelectionIds } from '../wikiTypeHelpers';

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
