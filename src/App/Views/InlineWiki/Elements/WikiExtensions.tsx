import * as React from "react"
import { equals } from "../../../../Data/Eq"
import { filter, flength, List, map, toArray } from "../../../../Data/List"
import { bindF, elem, ensure, Maybe, maybe, sum } from "../../../../Data/Maybe"
import { compare } from "../../../../Data/Num"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { L10nKey, L10nRecord } from "../../../Models/Wiki/L10n"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { ReactReturn, renderMaybe } from "../../../Utilities/ReactUtils"
import { comparingR, sortByMulti } from "../../../Utilities/sortBy"
import { Markdown } from "../../Universal/Markdown"

interface Accessors<A extends RecordIBase<any>> {
  id: (r: Record<A>) => string
  category: (r: Record<A>) => Category
}

export interface WikiExtensionsProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  extensions: Maybe<List<Record<SelectOption>>>
  l10n: L10nRecord
}

const SOA = SelectOption.A

type FC = <A extends RecordIBase<any>> (props: WikiExtensionsProps<A>) => ReturnType<React.FC>

export const WikiExtensions: FC = props => {
  const {
    x,
    acc,
    extensions,
    l10n,
  } = props

  const category = acc.category (x)

  let key: L10nKey = "spellextensions"

  if (category === Category.LITURGICAL_CHANTS) {
    key = "liturgicalchantextensions"
  }

  return maybe (null as ReactReturn)
               ((exs: List<Record<SelectOption>>) => (
                 <>
                   <p className="extensions-title">
                     <span>{translate (l10n) (key)}</span>
                   </p>
                   <ul className="extensions">
                     {pipe_ (
                       exs,
                       map (e => {
                         const requiredSR = Maybe.product (SOA.level (e)) * 4 + 4
                         const srText = `${translate (l10n) ("skillrating.short")} ${requiredSR}`
                         const ap = Maybe.sum (SOA.cost (e))
                         const apText = `${ap} ${translate (l10n) ("adventurepoints.short")}`
                         const desc = renderMaybe (SOA.description (e))

                         return (
                           <Markdown
                             key={SOA.id (e)}
                             source={`*${SOA.name (e)}* (${srText}, ${apText}): ${desc}`}
                             isListElement
                             />
                         )
                       }),
                       toArray
                     )}
                   </ul>
                 </>
               ))
               (extensions)
}

const sortExts = sortByMulti ([ comparingR (pipe (SelectOption.A.cost, sum)) (compare) ])

export const getExtensionsForEntry =
  (id: string) =>
    pipe (
      bindF (SpecialAbility.A.select),
      bindF (pipe (
        filter (pipe (SelectOption.A.target, elem (id))),
        sortExts,
        ensure<List<Record<SelectOption>>> (pipe (flength, equals (3)))
      ))
    )
