import * as React from 'react';
import { translate, UIMessagesObject } from '../App/Utils/I18n';
import { Just, List, Maybe, Record } from '../Utilities/dataUtils';
import { sortObjects } from '../Utilities/FilterSortUtils';
import { Option, RadioButtonGroup } from './RadioButtonGroup';

export type SortNames =
  'name'
  | 'dateModified'
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
    dateModified: translate (locale, 'options.sortorder.datemodified'),
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
            sort (Maybe.fromJust (option as Just<string>));
          }
        }
      }
      array={
        sortObjects (
          options .map (e => Record.of<Option> ({ name: SORT_NAMES[e], value: e })),
          locale .get ('id')
        )
      }
      />
  );
}
