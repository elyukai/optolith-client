import * as React from 'react';
import { ProfessionCombined } from '../../App/Models/View/viewTypeHelpers';
import { Option, RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Sex } from '../../types/data';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { sortObjects } from '../../utils/FilterSortUtils';
import { translate, UIMessagesObject } from '../../utils/I18n';

export interface ProfessionVariantsProps {
  currentProfessionId: Maybe<string>;
  currentProfessionVariantId: Maybe<string>;
  locale: UIMessagesObject;
  professions: List<Record<ProfessionCombined>>;
  sex: Maybe<Sex>;
  selectProfessionVariant (id: Maybe<string>): void;
}

export function ProfessionVariants (props: ProfessionVariantsProps) {
  const {
    currentProfessionId,
    currentProfessionVariantId,
    locale,
    professions,
    selectProfessionVariant,
    sex: maybeSex,
  } = props;

  const variants =
    Maybe.liftM2<Record<ProfessionCombined>, Sex, List<Record<Option>>>
      (profession => sex => sortObjects (
        profession .get ('mappedVariants') .map (variant => {

          const name = variant .get ('name');

          const finalName = name instanceof Record ? name .get (sex) : name;

          return Record.of<Option> ({
            name: `${finalName} (${profession .get ('ap') + variant .get ('ap')} AP)`,
            value: variant .get ('id'),
          });
        }),
        locale .get ('id')
      )
        .cons (
          Record.of<Option> ({
            name: translate (locale, 'professions.options.novariant'),
          })
        ))
      (professions .find (e => Maybe.elem (e .get ('id')) (currentProfessionId)))
      (maybeSex);

  if (Maybe.isJust (variants)) {
    return <RadioButtonGroup
      active={currentProfessionVariantId}
      onClick={selectProfessionVariant}
      array={Maybe.fromJust (variants)}
      />;
  }

  return null;
}
