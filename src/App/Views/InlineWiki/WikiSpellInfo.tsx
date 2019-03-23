import * as React from 'react';
import { SecondaryAttribute } from '../../App/Models/Hero/heroTypeHelpers';
import { UIMessages } from '../../App/Models/View/viewTypeHelpers';
import { Attribute, Book, SpecialAbility, Spell } from '../../App/Models/Wiki/wikiTypeHelpers';
import { WikiCastingTime } from './Elements/WikiCastingTime';
import { WikiCost } from './Elements/WikiCost';
import { WikiDuration } from './Elements/WikiDuration';
import { WikiEffect } from './Elements/WikiEffect';
import { WikiExtensions } from './Elements/WikiExtensions';
import { WikiImprovementCost } from './Elements/WikiImprovementCost';
import { WikiRange } from './Elements/WikiRange';
import { WikiSkillCheck } from './Elements/WikiSkillCheck';
import { WikiSource } from './Elements/WikiSource';
import { WikiSpellProperty } from './Elements/WikiSpellProperty';
import { WikiSpellTraditions } from './Elements/WikiSpellTraditions';
import { WikiTargetCategory } from './Elements/WikiTargetCategory';
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
