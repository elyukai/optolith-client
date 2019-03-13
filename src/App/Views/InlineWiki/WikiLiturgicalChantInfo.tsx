import * as React from 'react';
import { SecondaryAttribute } from '../../App/Models/Hero/heroTypeHelpers';
import { UIMessages } from '../../App/Models/View/viewTypeHelpers';
import { Attribute, Book, LiturgicalChant, SpecialAbility } from '../../App/Models/Wiki/wikiTypeHelpers';
import { WikiCastingTime } from './elements/WikiCastingTime';
import { WikiCost } from './elements/WikiCost';
import { WikiDuration } from './elements/WikiDuration';
import { WikiEffect } from './elements/WikiEffect';
import { WikiExtensions } from './elements/WikiExtensions';
import { WikiImprovementCost } from './elements/WikiImprovementCost';
import { WikiLiturgicalChantTraditions } from './elements/WikiLiturgicalChantTraditions';
import { WikiRange } from './elements/WikiRange';
import { WikiSkillCheck } from './elements/WikiSkillCheck';
import { WikiSource } from './elements/WikiSource';
import { WikiTargetCategory } from './elements/WikiTargetCategory';
import { WikiBoxTemplate } from './WikiBoxTemplate';

export interface WikiLiturgicalChantInfoProps {
  attributes: Map<string, Attribute>;
  books: Map<string, Book>;
  derivedCharacteristics: Map<string, SecondaryAttribute>;
  currentObject: LiturgicalChant;
  locale: UIMessages;
  liturgicalChantExtensions: SpecialAbility | undefined;
}

export function WikiLiturgicalChantInfo(props: WikiLiturgicalChantInfoProps) {
  const {
    currentObject: {
      name,
    },
    liturgicalChantExtensions,
    locale
  } = props;

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="liturgicalchant" title={name}>
        <WikiSkillCheck {...props} />
        <WikiLiturgicalChantTraditions {...props} />
        <WikiImprovementCost {...props} />
      </WikiBoxTemplate>
    );
  }

  return (
    <WikiBoxTemplate className="liturgicalchant" title={name}>
      <WikiSkillCheck {...props} />
      <WikiEffect {...props} />
      <WikiCastingTime {...props} />
      <WikiCost {...props} />
      <WikiRange {...props} />
      <WikiDuration {...props} />
      <WikiTargetCategory {...props} />
      <WikiLiturgicalChantTraditions {...props} />
      <WikiImprovementCost {...props} />
      <WikiExtensions {...props} extensions={liturgicalChantExtensions} />
      <WikiSource {...props} />
    </WikiBoxTemplate>
  );
}
