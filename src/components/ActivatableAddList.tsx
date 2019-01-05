import * as React from 'react';
import { isRated } from '../App/Utils/ratingUtils';
import { ActivatableAddListItemContainer } from '../containers/InactiveActivatableContainer';
import { ActivateArgs, ActiveViewObject, DeactiveViewObject, EntryRating, UIMessagesObject } from '../types/data';
import { getFullName } from '../utils/activatable/activatableNameUtils';
import { isActiveViewObject } from '../utils/activatable/checkActivatableUtils';
import { List, Maybe, OrderedMap, Record } from '../utils/dataUtils';
import { ListView } from './List';
import { ListItem } from './ListItem';
import { ListItemName } from './ListItemName';
import { ListPlaceholder } from './ListPlaceholder';
import { Scroll } from './Scroll';

export interface ActivatableAddListProps {
  hideGroup?: boolean;
  inactiveList: Maybe<List<
    Record<ActiveViewObject>
    | Record<DeactiveViewObject>
  >>;
  locale: UIMessagesObject;
  rating?: Maybe<OrderedMap<string, EntryRating>>;
  showRating?: boolean;
  addToList (args: ActivateArgs): void;
  selectForInfo (id: string): void;
}

export function ActivatableAddList (props: ActivatableAddListProps) {
  const { inactiveList: maybeInactiveList, locale, rating, showRating } = props;

  if (
    !Maybe.isJust (maybeInactiveList)
    || Maybe.elem (true) (maybeInactiveList .fmap (List.null))
  ) {
    return <ListPlaceholder locale={locale} noResults type="inactiveSpecialAbilities" />;
  }

  const normalizedRating = Maybe.normalize (rating);

  const isRatedWithRating = isRated (showRating) (normalizedRating);

  return (
    <Scroll>
      <ListView>
        {Maybe.fromJust (maybeInactiveList)
          .map (item => {
            if (isActiveViewObject (item)) {
              const name = getFullName (item);

              return (
                <ListItem key={`${item .get ('id')}_${item .get ('index')}`} disabled>
                  <ListItemName name={name} />
                </ListItem>
              );
            }

            const isRatedForItem = isRatedWithRating (item);

            return (
              <ActivatableAddListItemContainer
                {...props}
                key={item .get ('id')}
                item={item}
                isImportant={isRatedForItem (EntryRating.Essential)}
                isTypical={isRatedForItem (EntryRating.Common)}
                isUntypical={isRatedForItem (EntryRating.Uncommon)}
                />
            );
          })}
      </ListView>
    </Scroll>
  );
}
