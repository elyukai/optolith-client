import { ActiveActivatable } from "../App/Models/View/ActiveActivatable";
import { bindF, elem, Maybe } from "../Data/Maybe";
import { lookup, OrderedMap } from "../Data/OrderedMap";
import { Record } from "../Data/Record";
import { DeactiveViewObject, EntryRating } from "../types/data";

export const isRated =
  (showRating: boolean) =>
  (rating: Maybe<OrderedMap<string, EntryRating>>) =>
  (item: Record<DeactiveViewObject> | Record<ActiveActivatable>) =>
  (category: EntryRating) =>
    showRating
    && elem (category)
            (bindF (lookup<string, EntryRating> (ActiveActivatable.A.id (item)))
                   (rating))
