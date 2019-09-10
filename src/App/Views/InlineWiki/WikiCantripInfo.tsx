import * as React from "react";
import { subscript } from "../../../Data/List";
import { maybeRNullF } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Book } from "../../Models/Wiki/Book";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiCantripInfoProps {
  books: OrderedMap<string, Record<Book>>
  x: Record<Cantrip>
  l10n: L10nRecord
}

const CA = Cantrip.A

export function WikiCantripInfo (props: WikiCantripInfoProps) {
  const { x, l10n, books } = props

  return (
    <WikiBoxTemplate className="cantrip" title={CA.name (x)}>
      <Markdown className="no-indent" source={CA.effect (x)} />
      <WikiProperty l10n={l10n} title="range">{CA.range (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="duration">{CA.duration (x)}</WikiProperty>
      <WikiProperty l10n={l10n} title="targetcategory">{CA.target (x)}</WikiProperty>
      {maybeRNullF (subscript (translate (l10n) ("propertylist")) (CA.property (x) - 1))
                   (str => (
                     <WikiProperty l10n={l10n} title="property">{str}</WikiProperty>
                   ))}
      {maybeRNullF (CA.note (x))
                   (str => (
                     <WikiProperty l10n={l10n} title="notes">{str}</WikiProperty>
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
