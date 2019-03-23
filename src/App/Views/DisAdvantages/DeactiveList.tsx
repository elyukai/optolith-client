import * as React from 'react';
import { ActivateArgs, ActiveViewObject, DeactiveViewObject, EntryRating, UIMessagesObject } from '../../App/Models/Hero/heroTypeHelpers';
import { ActivatableAddList } from '../../components/ActivatableAddList';
import { List, Maybe, OrderedMap, Record } from '../../Utilities/dataUtils';

export interface InactiveListProps {
  inactiveList: Maybe<List<
    Record<ActiveViewObject>
    | Record<DeactiveViewObject>
  >>;
  locale: UIMessagesObject;
  rating: Maybe<OrderedMap<string, EntryRating>>;
  showRating: boolean;
  addToList (args: ActivateArgs): void;
  selectForInfo (id: string): void;
}

export function InactiveList (props: InactiveListProps) {
  return (
    <ActivatableAddList {...props} hideGroup />
  );
}
