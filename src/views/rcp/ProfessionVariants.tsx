import * as React from 'react';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Profession, UIMessages } from '../../types/view';
import { sortObjects } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';

export interface ProfessionVariantsProps {
  currentProfessionId?: string;
  currentProfessionVariantId?: string;
  locale: UIMessages;
  professions: Profession[];
  sex: 'm' | 'f';
  selectProfessionVariant(id: string): void;
}

export function ProfessionVariants(props: ProfessionVariantsProps) {
  const { currentProfessionId, currentProfessionVariantId, locale, professions, selectProfessionVariant, sex } = props;

  const profession = professions.find(e => e.id === currentProfessionId);

  const variants: { name: string; value: string | undefined }[] = profession ? [
    { name: translate(locale, 'professions.options.novariant'), value: undefined },
    ...sortObjects(profession.variants.map(e => {
      const { ap, id } = e;
      let { name } = e;
      if (typeof name === 'object') {
        name = name[sex];
      }
      return {
        name: `${name} (${profession.ap + ap} AP)`,
        value: id,
      };
    }), locale.id)
  ] : [];

  if (variants.length > 1) {
    return <RadioButtonGroup
      active={currentProfessionVariantId}
      onClick={selectProfessionVariant}
      array={variants}
      />;
  }
  return null;
}
