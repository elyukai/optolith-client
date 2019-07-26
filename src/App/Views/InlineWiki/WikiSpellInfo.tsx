import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Book } from "../../Models/Wiki/Book";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { WikiCastingTime } from "./Elements/WikiCastingTime";
import { WikiCost } from "./Elements/WikiCost";
import { WikiDuration } from "./Elements/WikiDuration";
import { WikiEffect } from "./Elements/WikiEffect";
import { WikiExtensions } from "./Elements/WikiExtensions";
import { WikiImprovementCost } from "./Elements/WikiImprovementCost";
import { WikiRange } from "./Elements/WikiRange";
import { WikiSkillCheck } from "./Elements/WikiSkillCheck";
import { WikiSource } from "./Elements/WikiSource";
import { WikiSpellProperty } from "./Elements/WikiSpellProperty";
import { WikiSpellTraditions } from "./Elements/WikiSpellTraditions";
import { WikiTargetCategory } from "./Elements/WikiTargetCategory";
import { WikiBoxTemplate } from "./WikiBoxTemplate";

export interface WikiSpellInfoProps {
  attributes: OrderedMap<string, Record<Attribute>>
  books: OrderedMap<string, Record<Book>>
  x: Record<Spell>
  l10n: L10nRecord
  spellExtensions: Maybe<Record<SpecialAbility>>
}

const SpA = Spell.A

export function WikiSpellInfo (props: WikiSpellInfoProps) {
  const { x, spellExtensions } = props

  const name = Spell.A.name (x)
  const gr = Spell.A.gr (x)

  // if (["nl-BE"].includes(l10n.id)) {
  //   return (
  //     <WikiBoxTemplate className="spell" title={name}>
  //       <WikiSkillCheck {...props} />
  //       <WikiSpellProperty {...props} />
  //       <WikiSpellTraditions {...props} />
  //       <WikiImprovementCost {...props} />
  //     </WikiBoxTemplate>
  //   )
  // }


  switch (gr) {
    // Spells
    case 1:
    // Rituals
    case 2:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCastingTime {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiRange {...props} acc={SpA} />
          <WikiDuration {...props} acc={SpA} />
          <WikiTargetCategory {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiExtensions {...props} extensions={spellExtensions} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
    // Curses
    case 3:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiDuration {...props} acc={SpA} />
          <WikiTargetCategory {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
    // Elven Magical Songs
    case 4:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiDuration {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
    case 5:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCastingTime {...props} acc={SpA} />
          <WikiDuration {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
    case 6:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCastingTime {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
    case 7:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCastingTime {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
    case 8:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCastingTime {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
        )
    case 9:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCastingTime {...props} acc={SpA} />
          <WikiDuration {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
    case 10:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCastingTime {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
    case 11:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCastingTime {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
  }

  return null
}
