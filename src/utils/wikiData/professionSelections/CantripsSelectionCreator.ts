import { CantripsSelection, ProfessionSelectionIds } from '../../../types/wiki';
import { List } from '../../structures/List';
import { fromDefault, makeGetters } from '../../structures/Record';
import { RequiredExceptIdFunction } from '../sub/typeHelpers';

const CantripsSelectionCreator =
  fromDefault<CantripsSelection> ({
    id: ProfessionSelectionIds.CANTRIPS,
    amount: 0,
    sid: List.empty,
  })

export const CantripsSelectionG = makeGetters (CantripsSelectionCreator)

export const createCantripsSelection:
  RequiredExceptIdFunction<CantripsSelection> =
    CantripsSelectionCreator
