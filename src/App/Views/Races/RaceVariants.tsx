import * as R from 'ramda';
import * as React from 'react';
import { RaceCombined } from '../../App/Models/View/viewTypeHelpers';
import { Option, RadioButtonGroup } from '../../components/RadioButtonGroup';
import { UIMessagesObject } from '../../types/ui';
import { List, Maybe, Record } from '../../Utilities/dataUtils';
import { sortObjects } from '../../Utilities/FilterSortUtils';

export interface RaceVariantsProps {
  currentId: Maybe<string>;
  currentVariantId: Maybe<string>;
  locale: UIMessagesObject;
  races: Maybe<List<Record<RaceCombined>>>;
  selectRaceVariant (id: string): void;
}

export function RaceVariants (props: RaceVariantsProps) {
  const { currentId, currentVariantId, locale, races, selectRaceVariant } = props;

  const variantsList =
    races
      .bind (
        List.find (
          R.pipe (
            Record.get<RaceCombined, 'id'> ('id'),
            Maybe.elem_ (currentId)
          )
        )
      )
      .fmap (
        R.pipe (
          Record.get<RaceCombined, 'mappedVariants'> ('mappedVariants'),
          List.map (e => Record.of<Option> ({
            name: e .get ('name'),
            value: e .get ('id'),
          })),
          list => sortObjects (list, locale .get ('id'))
        )
      )
      .bind (
        Maybe.ensure<List<Record<Option>>> (R.pipe (List.null, R.not))
      );

  if (Maybe.isJust (variantsList)) {
    return (
      <RadioButtonGroup
        active={currentVariantId}
        onClickJust={selectRaceVariant}
        array={Maybe.fromJust (variantsList)}
        />
    );
  }

  return null;
}
