import { DeactiveViewObject, EntryRating } from '../types/data';
import { bind_, elem, Maybe } from './structures/Maybe';
import { lookup, OrderedMap } from './structures/OrderedMap';
import { Record } from './structures/Record';
import { ActiveActivatable } from './viewData/ActiveActivatable';

export const isRated =
  (showRating: boolean) =>
  (rating: Maybe<OrderedMap<string, EntryRating>>) =>
  (item: Record<DeactiveViewObject> | Record<ActiveActivatable>) =>
  (category: EntryRating) =>
    showRating
    && elem (category)
            (bind_ (lookup<string, EntryRating> (ActiveActivatable.A.id (item)))
                   (rating))
