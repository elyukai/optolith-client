import * as React from "react";
import { equals } from "../../../../Data/Eq";
import { filter, flength, map, toArray } from "../../../../Data/List";
import { bindF, elem, ensure, Maybe, maybeR } from "../../../../Data/Maybe";
import { Record, RecordBase } from "../../../../Data/Record";
import { Categories } from "../../../Constants/Categories";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { sortRecordsByName } from "../../../Utilities/sortBy";
import { Markdown } from "../../Universal/Markdown";

interface Accessors<A extends RecordBase> {
  id: (r: Record<A>) => string
  category: (r: Record<A>) => Categories
}

export interface WikiExtensionsProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  extensions: Maybe<Record<SpecialAbility>>
  l10n: L10nRecord
}

export function WikiExtensions<A extends RecordBase> (props: WikiExtensionsProps<A>) {
  const {
    x,
    acc,
    extensions,
    l10n,
  } = props

  const category = acc.category (x)

  let key: keyof L10n = "spellextensions"

  if (category === Categories.LITURGIES) {
    key = "liturgicalchantextensions"
  }

  return pipe_ (
    extensions,
    bindF (SpecialAbility.A.select),
    bindF (pipe (
      filter (pipe (SelectOption.A.target, elem (acc.id (x)))),
      sortRecordsByName (L10n.A.id (l10n)),
      ensure (pipe (flength, equals (3)))
    )),
    maybeR (null)
           (exs => (
             <>
               <p className="extensions-title">
                 <span>{translate (l10n) (key)}</span>
               </p>
               <ul className="extensions">
                 {pipe_ (
                   exs,
                   map (({ cost, effect, id, name, tier }) => {
                     const srText = `${translate (l10n) ("skillrating.short")} ${tier * 4 + 4}`
                     const apText = `${cost} ${translate (l10n) ("adventurepoints.short")}`

                     return (
                       <Markdown
                         key={id}
                         source={`*${name}* (${srText}, ${apText}): ${effect}`}
                         isListElement
                         />
                     )
                   }),
                   toArray
                 )}
               </ul>
             </>
           ))
  )
}
