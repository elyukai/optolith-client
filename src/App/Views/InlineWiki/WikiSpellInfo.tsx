import * as React from "react";
import { map } from "../../../Data/List";
import { joinMaybeList, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { MagicalGroup } from "../../Constants/Groups";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
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
  l10n: L10nRecord
  wiki: WikiModelRecord
  x: Record<Spell>
  spellExtensions: Maybe<Record<SpecialAbility>>
}

const WA = WikiModel.A
const SpA = Spell.A

export const WikiSpellInfo: React.FC<WikiSpellInfoProps> = props => {
  const { l10n, x, spellExtensions, wiki } = props

  const attributes = WA.attributes (wiki)
  const books = WA.books (wiki)

  const name = Spell.A.name (x)
  const gr = Spell.A.gr (x)

  switch (gr) {
    case MagicalGroup.Spells:
    case MagicalGroup.Rituals: {
      const mextensions = getExtensionsForEntry (SpA.id (x)) (spellExtensions)

      const add_srcs = pipe_ (mextensions, joinMaybeList, map (SelectOption.A.src))

      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCastingTime l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiRange l10n={l10n} x={x} acc={SpA} />
          <WikiDuration l10n={l10n} x={x} acc={SpA} />
          <WikiTargetCategory l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiSpellTraditions l10n={l10n} x={x} acc={SpA} />
          <WikiImprovementCost l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiExtensions
            l10n={l10n}
            x={x}
            extensions={mextensions}
            acc={SpA}
            />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            addSrcs={add_srcs}
            />
        </WikiBoxTemplate>
      )
    }

    case MagicalGroup.Curses:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiDuration l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.ElvenMagicalSongs:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiDuration l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiImprovementCost l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.Zaubermelodien:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCastingTime l10n={l10n} x={x} acc={SpA} />
          <WikiDuration l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiSpellTraditions l10n={l10n} x={x} acc={SpA} />
          <WikiImprovementCost l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.Zaubertaenze:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCastingTime l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiSpellTraditions l10n={l10n} x={x} acc={SpA} />
          <WikiImprovementCost l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.Herrschaftsrituale:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiDuration l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.Schelmenzauber:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCastingTime l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiSpellTraditions l10n={l10n} x={x} acc={SpA} />
          <WikiImprovementCost l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
        )

    case MagicalGroup.Animistenkräfte:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiDuration l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiSpellTraditions l10n={l10n} x={x} acc={SpA} />
          <WikiImprovementCost l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.Geodenrituale:
      // zw. Property und Source sollte prerequisites sein
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCastingTime l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiRange l10n={l10n} x={x} acc={SpA} />
          <WikiDuration l10n={l10n} x={x} acc={SpA} />
          <WikiTargetCategory l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.Zibiljarituale:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            attributes={attributes}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
          <WikiEffect l10n={l10n} x={x} acc={SpA} />
          <WikiCastingTime l10n={l10n} x={x} acc={SpA} />
          <WikiCost l10n={l10n} x={x} acc={SpA} />
          <WikiRange l10n={l10n} x={x} acc={SpA} />
          <WikiDuration l10n={l10n} x={x} acc={SpA} />
          <WikiTargetCategory l10n={l10n} x={x} acc={SpA} />
          <WikiSpellProperty l10n={l10n} x={x} acc={SpA} />
          <WikiImprovementCost l10n={l10n} x={x} acc={SpA} />
          <WikiSource
            books={books}
            l10n={l10n}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    default:
      return null
  }
}
