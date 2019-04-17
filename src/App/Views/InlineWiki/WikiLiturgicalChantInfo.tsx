import * as React from "react";
import { SecondaryAttribute } from "../../Models/Hero/heroTypeHelpers";
import { UIMessages } from "../../Models/View/viewTypeHelpers";
import { Attribute, Book, LiturgicalChant, SpecialAbility } from "../../Models/Wiki/wikiTypeHelpers";
import { WikiCastingTime } from "./Elements/WikiCastingTime";
import { WikiCost } from "./Elements/WikiCost";
import { WikiDuration } from "./Elements/WikiDuration";
import { WikiEffect } from "./Elements/WikiEffect";
import { WikiExtensions } from "./Elements/WikiExtensions";
import { WikiImprovementCost } from "./Elements/WikiImprovementCost";
import { WikiLiturgicalChantTraditions } from "./Elements/WikiLiturgicalChantTraditions";
import { WikiRange } from "./Elements/WikiRange";
import { WikiSkillCheck } from "./Elements/WikiSkillCheck";
import { WikiSource } from "./Elements/WikiSource";
import { WikiTargetCategory } from "./Elements/WikiTargetCategory";
import { WikiBoxTemplate } from "./WikiBoxTemplate";

export interface WikiLiturgicalChantInfoProps {
  attributes: Map<string, Attribute>
  books: Map<string, Book>
  derivedCharacteristics: Map<string, SecondaryAttribute>
  currentObject: LiturgicalChant
  locale: UIMessages
  liturgicalChantExtensions: SpecialAbility | undefined
}

export function WikiLiturgicalChantInfo(props: WikiLiturgicalChantInfoProps) {
  const {
    currentObject: {
      name,
    },
    liturgicalChantExtensions,
    locale
  } = props

  if (["nl-BE"].includes(locale.id)) {
    return (
      <WikiBoxTemplate className="liturgicalchant" title={name}>
        <WikiSkillCheck {...props} />
        <WikiLiturgicalChantTraditions {...props} />
        <WikiImprovementCost {...props} />
      </WikiBoxTemplate>
    )
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
  )
}
