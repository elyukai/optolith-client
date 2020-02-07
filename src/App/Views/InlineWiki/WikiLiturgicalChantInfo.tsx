import * as React from "react"
import { map } from "../../../Data/List"
import { joinMaybeList, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { pipe_ } from "../../Utilities/pipe"
import { WikiCastingTime } from "./Elements/WikiCastingTime"
import { WikiCost } from "./Elements/WikiCost"
import { WikiDuration } from "./Elements/WikiDuration"
import { WikiEffect } from "./Elements/WikiEffect"
import { getExtensionsForEntry, WikiExtensions } from "./Elements/WikiExtensions"
import { WikiImprovementCost } from "./Elements/WikiImprovementCost"
import { WikiLiturgicalChantTraditions } from "./Elements/WikiLiturgicalChantTraditions"
import { WikiRange } from "./Elements/WikiRange"
import { WikiSkillCheck } from "./Elements/WikiSkillCheck"
import { WikiSource } from "./Elements/WikiSource"
import { WikiTargetCategory } from "./Elements/WikiTargetCategory"
import { WikiBoxTemplate } from "./WikiBoxTemplate"

export interface WikiLiturgicalChantInfoProps {
  l10n: L10nRecord
  wiki: WikiModelRecord
  x: Record<LiturgicalChant>
  liturgicalChantExtensions: Maybe<Record<SpecialAbility>>
}

const WA = WikiModel.A
const LCA = LiturgicalChant.A

export const WikiLiturgicalChantInfo: React.FC<WikiLiturgicalChantInfoProps> = props => {
  const { l10n, liturgicalChantExtensions, x, wiki } = props

  const attributes = WA.attributes (wiki)
  const books = WA.books (wiki)

  const mextensions = getExtensionsForEntry (LCA.id (x)) (liturgicalChantExtensions)

  const add_srcs = pipe_ (mextensions, joinMaybeList, map (SelectOption.A.src))

  return (
    <WikiBoxTemplate className="liturgicalchant" title={LCA.name (x)}>
      <WikiSkillCheck
        attributes={attributes}
        l10n={l10n}
        x={x}
        acc={LCA}
        />
      <WikiEffect l10n={l10n} x={x} acc={LCA} />
      <WikiCastingTime l10n={l10n} x={x} acc={LCA} />
      <WikiCost l10n={l10n} x={x} acc={LCA} />
      <WikiRange l10n={l10n} x={x} acc={LCA} />
      <WikiDuration l10n={l10n} x={x} acc={LCA} />
      <WikiTargetCategory l10n={l10n} x={x} acc={LCA} />
      <WikiLiturgicalChantTraditions l10n={l10n} x={x} acc={LCA} />
      <WikiImprovementCost l10n={l10n} x={x} acc={LCA} />
      <WikiSource
        books={books}
        l10n={l10n}
        x={x}
        acc={LCA}
        />
      <WikiExtensions
        l10n={l10n}
        x={x}
        extensions={mextensions}
        acc={LCA}
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
