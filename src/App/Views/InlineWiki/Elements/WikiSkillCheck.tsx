import * as React from "react"
import { thrush } from "../../../../Data/Function"
import { fmap } from "../../../../Data/Functor"
import { intercalate, List } from "../../../../Data/List"
import { bind, mapMaybe, Maybe } from "../../../../Data/Maybe"
import { lookupF, OrderedMap } from "../../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Attribute } from "../../../Models/Wiki/Attribute"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers"
import { minus } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybeWith } from "../../../Utilities/ReactUtils"
import { WikiProperty } from "../WikiProperty"

export const getCheckModStr: (l10n: L10nRecord) => (id: CheckModifier) => string
                            = l10n => id => id === "SPI"
                                            ? translate (l10n) ("spirit.short")
                                            : id === "TOU"
                                            ? translate (l10n) ("toughness.short")
                                            : id === "SPI/2"
                                            ? translate (l10n) ("inlinewiki.spirithalf.short")
                                            : translate (l10n)
                                                        ("inlinewiki.spiritortoughness.short")

interface Accessors<A extends RecordIBase<any>> {
  check: (r: Record<A>) => List<string>
  checkmod?: (r: Record<A>) => Maybe<CheckModifier>
}

export interface WikiSkillCheckProps<A extends RecordIBase<any>> {
  attributes: OrderedMap<string, Record<Attribute>>
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiSkillCheckProps<A>) => ReturnType<React.FC>

export const WikiSkillCheck: FC = props => {
  const {
    attributes,
    x,
    acc,
    l10n,
  } = props

  const checkString =
    pipe_ (
      x,
      acc.check,
      mapMaybe (pipe (lookupF (attributes), fmap (Attribute.A.short))),
      intercalate ("/")
    )

  const checkmod = bind (Maybe (acc.checkmod)) (thrush (x))

  const mod = fmap (getCheckModStr (l10n)) (checkmod)

  return (
    <WikiProperty l10n={l10n} title="inlinewiki.check">
      {checkString}
      {renderMaybeWith (str => `(${minus}${str})`) (mod)}
    </WikiProperty>
  )
}
