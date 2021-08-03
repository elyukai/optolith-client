import * as React from "react"
import { equals } from "../../../../Data/Eq"
import { filter, flength, List, map, toArray } from "../../../../Data/List"
import { bindF, elem, ensure, Maybe, maybe, sum } from "../../../../Data/Maybe"
import { compare } from "../../../../Data/Num"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { L10nKey } from "../../../Models/Wiki/L10n"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../../Utilities/I18n"
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
  staticData: StaticDataRecord
}

const SOA = SelectOption.A

type FC = <A extends RecordIBase<any>> (props: WikiExtensionsProps<A>) => ReturnType<React.FC>

export const WikiExtensions: FC = props => {
  const {
    x,
    acc,
    extensions,
    staticData,
  } = props

  const category = acc.category (x)

  let key: L10nKey = "inlinewiki.spellenhancements"

  if (category === Category.LITURGICAL_CHANTS) {
    key = "inlinewiki.liturgicalchantenhancements"
  }

  return maybe (null as ReactReturn)
               ((exs: List<Record<SelectOption>>) => (
                 <>
                   <p className="extensions-title">
                     <span>{translate (staticData) (key)}</span>
                   </p>
                   <ul className="extensions">
                     {pipe_ (
                       exs,
                       map (e => {
                         const requiredSR = Maybe.product (SOA.level (e)) * 4 + 4

                         const text = translateP (staticData)
                                                 (category === Category.LITURGICAL_CHANTS
                                                   ? "inlinewiki.liturgicalchantenhancements.title"
                                                   : "inlinewiki.spellenhancements.title")
                                                 (List<string | number> (
                                                   SOA.name (e),
                                                   requiredSR,
                                                   Maybe.sum (SOA.cost (e)),
                                                   renderMaybe (SOA.description (e))
                                                 ))

                         return (
                           <li>
                             <Markdown
                               key={SOA.id (e)}
                               source={text}
                               />
                           </li>
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
