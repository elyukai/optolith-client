import * as React from "react";
import { map } from "../../../Data/List";
import { joinMaybeList, Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Book } from "../../Models/Wiki/Book";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { pipe_ } from "../../Utilities/pipe";
import { WikiCastingTime } from "./Elements/WikiCastingTime";
import { WikiCost } from "./Elements/WikiCost";
import { WikiDuration } from "./Elements/WikiDuration";
import { WikiEffect } from "./Elements/WikiEffect";
import { getExtensionsForEntry, WikiExtensions } from "./Elements/WikiExtensions";
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
    case 2: {
      const mextensions = getExtensionsForEntry (SpA.id (x)) (spellExtensions)

      const add_srcs = pipe_ (mextensions, joinMaybeList, map (SelectOption.A.src))

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
          <WikiSource {...props} acc={SpA} />
          <WikiExtensions {...props} extensions={mextensions} acc={SpA} />
          <WikiSource {...props} addSrcs={add_srcs} />
        </WikiBoxTemplate>
      )
    }

    // Curses
    case 3:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiDuration {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
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

    // Zaubermelodien
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

    // Zaubertänze
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

    // Herrschaftsrituale
    case 7:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiDuration {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )

    case 8: // Schelmenzauber
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

    case 9: // Animistenkräfte
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck {...props} acc={SpA} />
          <WikiEffect {...props} acc={SpA} />
          <WikiCost {...props} acc={SpA} />
          <WikiDuration {...props} acc={SpA} />
          <WikiSpellProperty {...props} acc={SpA} />
          <WikiSpellTraditions {...props} acc={SpA} />
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )

    case 10: // Geodenrituale zw. Property und Source sollte prerequisites sein
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
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )

    case 11: // Zibiljarituale
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
          <WikiImprovementCost {...props} acc={SpA} />
          <WikiSource {...props} acc={SpA} />
        </WikiBoxTemplate>
      )
  }

  return null
}
