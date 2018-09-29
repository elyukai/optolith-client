import { ActiveViewObject, DeactiveViewObject, EntryRating } from '../types/data';
import { Maybe, OrderedMap, Record } from './dataUtils';

export const isRated = (showRating: boolean | undefined) =>
  (rating: Maybe<OrderedMap<string, EntryRating>>) =>
    (item: Record<DeactiveViewObject> | Record<ActiveViewObject>) =>
      (category: EntryRating) =>
        showRating
        && Maybe.elem
          (category)
          (rating .bind (OrderedMap.lookup (item .get ('id'))));
