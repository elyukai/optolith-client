import * as React from 'react';
import { isRated } from '../App/Utils/ratingUtils';
import { ActiveViewObject, DeactivateArgs, EntryRating, UIMessagesObject } from '../types/data';
import { List, Maybe, OrderedMap, Record } from '../utils/dataUtils';
import { ActivatableRemoveListItem } from './ActivatableRemoveListItem';
import { ListView } from './List';
import { ListPlaceholder } from './ListPlaceholder';
import { Scroll } from './Scroll';

export interface ActivatableRemoveListProps {
  filterText: string;
  hideGroup?: boolean;
  list: Maybe<List<Record<ActiveViewObject>>>;
  locale: UIMessagesObject;
  isRemovingEnabled: boolean;
  rating?: Maybe<OrderedMap<string, EntryRating>>;
  showRating?: boolean;
  setLevel (id: string, index: number, level: number): void;
  removeFromList (args: DeactivateArgs): void;
  selectForInfo (id: string): void;
}

export function ActivatableRemoveList (props: ActivatableRemoveListProps) {
  const { filterText, list, locale, rating, showRating } = props;

  if (!Maybe.isJust (list) || Maybe.elem (true) (list .fmap (List.null))) {
    return (
      <ListPlaceholder
        locale={locale}
        noResults={filterText.length > 0}
        type="specialAbilities"
        />
    );
  }

  const normalizedRating = Maybe.normalize (rating);

  const isRatedWithRating = isRated (showRating) (normalizedRating);

  return (
    <Scroll>
      <ListView>
        {
          Maybe.fromJust (list)
            .map (item => (
              <ActivatableRemoveListItem
                {...props}
                key={`${item .get ('id')}_${item .get ('index')}`}
                item={item}
                isImportant={isRatedWithRating (item) (EntryRating.Essential)}
                isTypical={isRatedWithRating (item) (EntryRating.Common)}
                isUntypical={isRatedWithRating (item) (EntryRating.Uncommon)}
                />
            ))
            .toArray ()
        }
      </ListView>
    </Scroll>
  );
}
