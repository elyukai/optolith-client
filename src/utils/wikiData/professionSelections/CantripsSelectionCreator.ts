import { CantripsSelection, ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters, Omit } from '../../structures/Record';

const CantripsSelectionCreator =
  fromDefault<CantripsSelection> ({
    id: ProfessionSelectionIds.CANTRIPS,
    amount: 0,
    sid: List.empty,
  })

export const CantripsSelectionG = makeGetters (CantripsSelectionCreator)

export const createCantripsSelection =
  (xs: Omit<CantripsSelection, 'id'>) =>
    CantripsSelectionCreator ({ ...xs, id: ProfessionSelectionIds.CANTRIPS })
