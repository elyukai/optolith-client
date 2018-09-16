import * as React from 'react';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Race, UIMessages } from '../../types/view';
import { sortObjects } from '../../utils/FilterSortUtils';

export interface RaceVariantsProps {
  currentId?: string;
  currentVariantId?: string;
  locale: UIMessages;
  races: Race[];
  selectRaceVariant(id: string): void;
}

export function RaceVariants(props: RaceVariantsProps) {
  const { currentId, currentVariantId, locale, races, selectRaceVariant } = props;

  const race = races.find(e => e.id === currentId);

  const variants: { name: string; value: string | undefined }[] = race ? sortObjects(race.variants.map(e => {
    const { id, name } = e;
    return {
      name,
      value: id,
    };
  }), locale.id) : [];

  if (variants.length > 0) {
    return <RadioButtonGroup
      active={currentVariantId}
      onClick={selectRaceVariant}
      array={variants}
      />;
  }
  return null;
}
