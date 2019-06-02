import * as React from "react";
import { fromMaybe, listToMaybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Blessing } from "../../Models/Wiki/Blessing";
import { Book } from "../../Models/Wiki/Book";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiBlessingInfoProps {
  books: OrderedMap<string, Record<Book>>
  x: Record<Blessing>
  l10n: L10nRecord
}

const BA = Blessing.A

export function WikiBlessingInfo (props: WikiBlessingInfoProps) {
  const { x, l10n } = props

  const traditions = fromMaybe ("") (listToMaybe (translate (l10n) ("aspectlist")))

  // if (["nl-BE"].includes(l10n.id)) {
  //   return (
  //     <WikiBoxTemplate className="blessing" title={x.name}>
  //       <WikiProperty l10n={l10n} title="info.aspect">{traditions}</WikiProperty>
  //     </WikiBoxTemplate>
  //   )
  // }

  return (
    <WikiBoxTemplate className="blessing" title={BA.name (x)}>
      <Markdown className="no-indent" source={BA.effect (x)} />
      <WikiProperty l10n={l10n} title="range">{BA.range (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="duration">{BA.duration (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="targetcategory">{BA.target (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="aspect">{traditions}</WikiProperty>
      <WikiSource {...props} acc={BA} />
    </WikiBoxTemplate>
  )
}
