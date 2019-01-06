import * as React from 'react';
import { ActiveViewObject, DeactivateArgs, EntryRating, UIMessagesObject } from '../../App/Models/Hero/heroTypeHelpers';
import { ActivatableRemoveList } from '../../components/ActivatableRemoveList';
import { List, Maybe, OrderedMap, Record } from '../../utils/dataUtils';

export interface ActiveListProps {
  filterText: string;
  list: Maybe<List<Record<ActiveViewObject>>>;
  locale: UIMessagesObject;
  rating: Maybe<OrderedMap<string, EntryRating>>;
  showRating: boolean;
  isRemovingEnabled: boolean;
  removeFromList (args: DeactivateArgs): void;
  setLevel (id: string, index: number, level: number): void;
  selectForInfo (id: string): void;
}

export function ActiveList (props: ActiveListProps) {
  return (
    <ActivatableRemoveList {...props} hideGroup />
  );
}
