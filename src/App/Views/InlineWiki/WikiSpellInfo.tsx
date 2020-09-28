import * as React from "react"
import { map } from "../../../Data/List"
import { joinMaybeList, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { MagicalGroup } from "../../Constants/Groups"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { Spell } from "../../Models/Wiki/Spell"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { pipe_ } from "../../Utilities/pipe"
import { WikiCastingTime } from "./Elements/WikiCastingTime"
import { WikiCost } from "./Elements/WikiCost"
import { WikiDuration } from "./Elements/WikiDuration"
import { WikiEffect } from "./Elements/WikiEffect"
import { getExtensionsForEntry, WikiExtensions } from "./Elements/WikiExtensions"
import { WikiImprovementCost } from "./Elements/WikiImprovementCost"
import { WikiRange } from "./Elements/WikiRange"
import { WikiSkillCheck } from "./Elements/WikiSkillCheck"
import { WikiSource } from "./Elements/WikiSource"
import { WikiSpellProperty } from "./Elements/WikiSpellProperty"
import { WikiSpellTraditions } from "./Elements/WikiSpellTraditions"
import { WikiTargetCategory } from "./Elements/WikiTargetCategory"
import { WikiBoxTemplate } from "./WikiBoxTemplate"

export interface WikiSpellInfoProps {
  staticData: StaticDataRecord
  x: Record<Spell>
  spellExtensions: Maybe<Record<SpecialAbility>>
}

const SpA = Spell.A

export const WikiSpellInfo: React.FC<WikiSpellInfoProps> = props => {
  const { x, spellExtensions, staticData } = props

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
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCastingTime staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiRange staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiTargetCategory staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiSpellTraditions staticData={staticData} x={x} acc={SpA} />
          <WikiImprovementCost staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiExtensions
            staticData={staticData}
            x={x}
            extensions={mextensions}
            acc={SpA}
            />
          <WikiSource
            staticData={staticData}
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
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.ElvenMagicalSongs:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiImprovementCost staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.MagicalMelodies:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCastingTime staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiSpellTraditions staticData={staticData} x={x} acc={SpA} />
          <WikiImprovementCost staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.MagicalDances:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCastingTime staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiSpellTraditions staticData={staticData} x={x} acc={SpA} />
          <WikiImprovementCost staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.DominationRituals:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.RogueSpells:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCastingTime staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiRange staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiSpellTraditions staticData={staticData} x={x} acc={SpA} />
          <WikiImprovementCost staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
        )

    case MagicalGroup.AnimistForces:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiSpellTraditions staticData={staticData} x={x} acc={SpA} />
          <WikiImprovementCost staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.GeodeRituals:
      // zw. Property und Source sollte prerequisites sein
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCastingTime staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiRange staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiTargetCategory staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    case MagicalGroup.ZibiljaRituals:
      return (
        <WikiBoxTemplate className="spell" title={name}>
          <WikiSkillCheck
            staticData={staticData}
            x={x}
            acc={SpA}
            />
          <WikiEffect staticData={staticData} x={x} acc={SpA} />
          <WikiCastingTime staticData={staticData} x={x} acc={SpA} />
          <WikiCost staticData={staticData} x={x} acc={SpA} />
          <WikiRange staticData={staticData} x={x} acc={SpA} />
          <WikiDuration staticData={staticData} x={x} acc={SpA} />
          <WikiTargetCategory staticData={staticData} x={x} acc={SpA} />
          <WikiSpellProperty staticData={staticData} x={x} acc={SpA} />
          <WikiImprovementCost staticData={staticData} x={x} acc={SpA} />
          <WikiSource
            staticData={staticData}
            x={x}
            acc={SpA}
            />
        </WikiBoxTemplate>
      )

    default:
      return null
  }
}
