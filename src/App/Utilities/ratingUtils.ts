import { bind, elem, Maybe } from "../../Data/Maybe"
import { lookup, OrderedMap } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { EntryRating } from "../Models/Hero/heroTypeHelpers"
import { ActiveActivatable, ActiveActivatableAL_ } from "../Models/View/ActiveActivatable"
import { InactiveActivatable } from "../Models/View/InactiveActivatable"

export const isActiveRated =
  (showRating: boolean) =>
  (rating: Maybe<OrderedMap<string, EntryRating>>) =>
  (item: Record<ActiveActivatable>) =>
  (category: EntryRating) =>
    showRating
    && elem (category)
            (bind (rating) (lookup (ActiveActivatableAL_.id (item))))

export const isInactiveRated =
  (showRating: boolean) =>
  (rating: Maybe<OrderedMap<string, EntryRating>>) =>
  (item: Record<InactiveActivatable>) =>
  (category: EntryRating) =>
    showRating
    && elem (category)
            (bind (rating) (lookup (InactiveActivatable.A.id (item))))
