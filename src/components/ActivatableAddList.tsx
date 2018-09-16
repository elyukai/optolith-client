import * as React from 'react';
import { ActivateArgs, ActiveViewObject, DeactiveViewObject, Instance, UIMessages } from '../types/data';
import { ActivatableAddListItemContainer } from './ActivatableAddListItem';
import { ListView } from './List';
import { ListItem } from './ListItem';
import { ListItemName } from './ListItemName';
import { ListPlaceholder } from './ListPlaceholder';
import { Scroll } from './Scroll';

export interface ActivatableAddListProps {
  hideGroup?: boolean;
  list: (ActiveViewObject | DeactiveViewObject)[];
  locale: UIMessages;
  rating?: { [id: string]: string };
  showRating?: boolean;
  addToList(args: ActivateArgs): void;
  get(id: string): Instance | undefined;
  selectForInfo?(id: string): void;
}

export function ActivatableAddList(props: ActivatableAddListProps) {
  const { list, locale, rating, showRating } = props;

  if (list.length === 0) {
    return <ListPlaceholder locale={locale} noResults type="inactiveSpecialAbilities" />;
  }

  return (
    <Scroll>
      <ListView>
        {list.map(item => {
          if (isActiveViewObject(item)) {
            const name = getFullName(item);
            return (
              <ListItem key={`${item.id}_${item.index}`} disabled>
                <ListItemName name={name} />
              </ListItem>
            );
          }
          return (
            <ActivatableAddListItemContainer
              {...props}
              key={item.id}
              item={item}
              isImportant={showRating && rating && rating[item.id] === 'IMP'}
              isTypical={showRating && rating && rating[item.id] === 'TYP'}
              isUntypical={showRating && rating && rating[item.id] === 'UNTYP'}
              />
          );
        })}
      </ListView>
    </Scroll>
  );
}
