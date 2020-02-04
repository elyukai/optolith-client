import * as React from "react"
import { fromMaybe, listToMaybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { Blessing } from "../../Models/Wiki/Blessing"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { Markdown } from "../Universal/Markdown"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

export interface WikiBlessingInfoProps {
  l10n: L10nRecord
  wiki: WikiModelRecord
  x: Record<Blessing>
}

const WA = WikiModel.A
const BA = Blessing.A

export const WikiBlessingInfo: React.FC<WikiBlessingInfoProps> = props => {
  const { x, l10n, wiki } = props

  const books = WA.books (wiki)

  const traditions = fromMaybe ("") (listToMaybe (translate (l10n) ("aspectlist")))

  return (
    <WikiBoxTemplate className="blessing" title={BA.name (x)}>
      <Markdown className="no-indent" source={BA.effect (x)} />
      <WikiProperty l10n={l10n} title="range">{BA.range (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="duration">{BA.duration (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="targetcategory">{BA.target (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="aspect">{traditions}</WikiProperty>
      <WikiSource
        books={books}
        l10n={l10n}
        x={x}
        acc={BA}
        />
    </WikiBoxTemplate>
  )
}
