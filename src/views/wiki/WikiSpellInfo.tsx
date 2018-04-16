import * as React from 'react';
import { SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { Attribute, Book, SpecialAbility, Spell } from '../../types/wiki';
import { WikiCastingTime } from './elements/WikiCastingTime';
import { WikiCost } from './elements/WikiCost';
import { WikiDuration } from './elements/WikiDuration';
import { WikiEffect } from './elements/WikiEffect';
import { WikiExtensions } from './elements/WikiExtensions';
import { WikiImprovementCost } from './elements/WikiImprovementCost';
import { WikiRange } from './elements/WikiRange';
import { WikiSkillCheck } from './elements/WikiSkillCheck';
import { WikiSource } from './elements/WikiSource';
import { WikiSpellProperty } from './elements/WikiSpellProperty';
import { WikiSpellTraditions } from './elements/WikiSpellTraditions';
import { WikiTargetCategory } from './elements/WikiTargetCategory';
import { WikiBoxTemplate } from './WikiBoxTemplate';

export interface WikiSpellInfoProps {
  attributes: Map<string, Attribute>;
  books: Map<string, Book>;
  derivedCharacteristics: Map<string, SecondaryAttribute>;
  currentObject: Spell;
  locale: UIMessages;
  spellExtensions: SpecialAbility | undefined;
}

export function WikiSpellInfo(props: WikiSpellInfoProps) {
  const {
    currentObject,
    locale,
    spellExtensions
  } = props;

  const {
    name,
    gr,
  } = currentObject;

  if (['nl-BE'].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="spell" title={name}>
        <WikiSkillCheck {...props} />
        <WikiSpellProperty {...props} />
        <WikiSpellTraditions {...props} />
        <WikiImprovementCost {...props} />
      </WikiBoxTemplate>
    );
  }


  switch (gr) {
    case 1: // Spells
    case 2: // Rituals
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} />
          <WikiEffect {...props} />
          <WikiCastingTime {...props} />
          <WikiCost {...props} />
          <WikiRange {...props} />
          <WikiDuration {...props} />
          <WikiTargetCategory {...props} />
          <WikiSpellProperty {...props} />
          <WikiSpellTraditions {...props} />
          <WikiImprovementCost {...props} />
          <WikiExtensions {...props} extensions={spellExtensions} />
          <WikiSource {...props} />
        </WikiBoxTemplate>
      );
    case 3: // Curses
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} />
          <WikiEffect {...props} />
          <WikiCost {...props} />
          <WikiDuration {...props} />
          <WikiTargetCategory {...props} />
          <WikiSource {...props} />
        </WikiBoxTemplate>
      );
    case 4: // Elven Magical Songs
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} />
          <WikiEffect {...props} />
          <WikiDuration {...props} />
          <WikiCost {...props} />
          <WikiSpellProperty {...props} />
          <WikiImprovementCost {...props} />
          <WikiSource {...props} />
        </WikiBoxTemplate>
      );
    case 5:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} />
          <WikiEffect {...props} />
          <WikiCastingTime {...props} />
          <WikiDuration {...props} />
          <WikiCost {...props} />
          <WikiSpellProperty {...props} />
          <WikiSpellTraditions {...props} />
          <WikiImprovementCost {...props} />
          <WikiSource {...props} />
        </WikiBoxTemplate>
      );
    case 6:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} />
          <WikiEffect {...props} />
          <WikiCastingTime {...props} />
          <WikiCost {...props} />
          <WikiSpellProperty {...props} />
          <WikiSpellTraditions {...props} />
          <WikiImprovementCost {...props} />
          <WikiSource {...props} />
        </WikiBoxTemplate>
      );
  }

  return null;
}
