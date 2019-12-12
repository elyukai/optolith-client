import * as React from "react";
import { map } from "../../../Data/List";
import { joinMaybeList, Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { MagicalGroup } from "../../Constants/Groups";
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

  switch (gr) {
    case MagicalGroup.Spells:
    case MagicalGroup.Rituals: {
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

    case MagicalGroup.Curses:
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

    case MagicalGroup.ElvenMagicalSongs:
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

    case MagicalGroup.Zaubermelodien:
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

    case MagicalGroup.Zaubertaenze:
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

    case MagicalGroup.Herrschaftsrituale:
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

    case MagicalGroup.Schelmenzauber:
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

    case MagicalGroup.Animistenkräfte:
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

    case MagicalGroup.Geodenrituale:
      // zw. Property und Source sollte prerequisites sein
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

    case MagicalGroup.Zibiljarituale:
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

    default:
      return null
  }
}
