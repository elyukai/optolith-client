import * as React from "react"
import { subscript } from "../../../Data/List"
import { maybeRNullF } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { Markdown } from "../Universal/Markdown"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

export interface WikiCantripInfoProps {
  l10n: L10nRecord
  wiki: WikiModelRecord
  x: Record<Cantrip>
}

const WA = WikiModel.A
const CA = Cantrip.A

export const WikiCantripInfo: React.FC<WikiCantripInfoProps> = props => {
  const { x, l10n, wiki } = props

  const books = WA.books (wiki)

  return (
    <WikiBoxTemplate className="cantrip" title={CA.name (x)}>
      <Markdown className="no-indent" source={CA.effect (x)} />
      <WikiProperty l10n={l10n} title="inlinewiki.range">{CA.range (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="inlinewiki.duration">{CA.duration (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="inlinewiki.targetcategory">{CA.target (x)}</WikiProperty>
      {maybeRNullF (subscript (translate (l10n) ("propertylist")) (CA.property (x) - 1))
                   (str => (
                     <WikiProperty l10n={l10n} title="inlinewiki.property">{str}</WikiProperty>
                   ))}
      {maybeRNullF (CA.note (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="inlinewiki.notes">{str}</WikiProperty>
                   ))}
      <WikiSource
        books={books}
        x={x}
        l10n={l10n}
        acc={CA}
        />
    </WikiBoxTemplate>
  )
}
