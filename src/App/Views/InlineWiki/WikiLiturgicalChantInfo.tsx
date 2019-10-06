import * as React from "react";
import { map } from "../../../Data/List";
import { joinMaybeList, Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Book } from "../../Models/Wiki/Book";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { pipe_ } from "../../Utilities/pipe";
import { WikiCastingTime } from "./Elements/WikiCastingTime";
import { WikiCost } from "./Elements/WikiCost";
import { WikiDuration } from "./Elements/WikiDuration";
import { WikiEffect } from "./Elements/WikiEffect";
import { getExtensionsForEntry, WikiExtensions } from "./Elements/WikiExtensions";
import { WikiImprovementCost } from "./Elements/WikiImprovementCost";
import { WikiLiturgicalChantTraditions } from "./Elements/WikiLiturgicalChantTraditions";
import { WikiRange } from "./Elements/WikiRange";
import { WikiSkillCheck } from "./Elements/WikiSkillCheck";
import { WikiSource } from "./Elements/WikiSource";
import { WikiTargetCategory } from "./Elements/WikiTargetCategory";
import { WikiBoxTemplate } from "./WikiBoxTemplate";

export interface WikiLiturgicalChantInfoProps {
  attributes: OrderedMap<string, Record<Attribute>>
  books: OrderedMap<string, Record<Book>>
  x: Record<LiturgicalChant>
  l10n: L10nRecord
  liturgicalChantExtensions: Maybe<Record<SpecialAbility>>
}

const LCA = LiturgicalChant.A

export function WikiLiturgicalChantInfo (props: WikiLiturgicalChantInfoProps) {
  const { liturgicalChantExtensions, x } = props

  const mextensions = getExtensionsForEntry (LCA.id (x)) (liturgicalChantExtensions)

  const add_srcs = pipe_ (mextensions, joinMaybeList, map (SelectOption.A.src))

  return (
    <WikiBoxTemplate className="liturgicalchant" title={LCA.name (x)}>
      <WikiSkillCheck {...props} acc={LCA} />
      <WikiEffect {...props} acc={LCA} />
      <WikiCastingTime {...props} acc={LCA} />
      <WikiCost {...props} acc={LCA} />
      <WikiRange {...props} acc={LCA} />
      <WikiDuration {...props} acc={LCA} />
      <WikiTargetCategory {...props} acc={LCA} />
      <WikiLiturgicalChantTraditions {...props} acc={LCA} />
      <WikiImprovementCost {...props} acc={LCA} />
      <WikiSource {...props} acc={LCA} />
      <WikiExtensions {...props} extensions={mextensions} acc={LCA} />
      <WikiSource {...props} addSrcs={add_srcs} />
    </WikiBoxTemplate>
  )
}
