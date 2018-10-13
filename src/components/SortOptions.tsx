import * as React from 'react';
import { Just, List, Maybe, Record } from '../utils/dataUtils';
import { sortObjects } from '../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../utils/I18n';
import { RadioButtonGroup } from './RadioButtonGroup';

export type SortNames =
  'name'
  | 'group'
  | 'groupname'
  | 'where'
  | 'cost'
  | 'ap'
  | 'ic'
  | 'property'
  | 'aspect'
  | 'weight';

export interface SortOptionsProps {
  locale: UIMessagesObject;
  options: List<SortNames>;
  sortOrder: string;
  sort (option: string): void;
}

export function SortOptions (props: SortOptionsProps) {
  const { locale, options, sort, sortOrder, ...other } = props;

  const SORT_NAMES = {
    name: translate (locale, 'options.sortorder.alphabetically'),
    group: translate (locale, 'options.sortorder.group'),
    groupname: translate (locale, 'options.sortorder.group'),
    where: translate (locale, 'options.sortorder.location'),
    cost: translate (locale, 'options.sortorder.cost'),
    ap: translate (locale, 'options.sortorder.ap'),
    ic: translate (locale, 'options.sortorder.improvementcost'),
    property: translate (locale, 'options.sortorder.property'),
    aspect: translate (locale, 'options.sortorder.aspect'),
    weight: translate (locale, 'options.sortorder.weight'),
  };

  return (
    <RadioButtonGroup
      {...other}
      active={sortOrder}
      onClick={
        option => {
          if (Maybe.isJust (option)) {
            sort (Maybe.fromJust (option));
          }
        }
      }
      array={
        sortObjects (
          options .map (e => Record.of ({ name: SORT_NAMES[e], value: e })),
          locale .get ('id')
        )
          .map (Record.toObject)
          .map (e => ({ ...e, value: Just (e.value) }))
      }
      />
  );
}
