import * as React from "react"
import { thrush } from "../../../../Data/Function"
import { fmap } from "../../../../Data/Functor"
import { intercalate, List } from "../../../../Data/List"
import { bind, mapMaybe, Maybe, maybe } from "../../../../Data/Maybe"
import { lookup, lookupF } from "../../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Attribute } from "../../../Models/Wiki/Attribute"
import { DerivedCharacteristic } from "../../../Models/Wiki/DerivedCharacteristic"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { CheckModifier } from "../../../Models/Wiki/wikiTypeHelpers"
import { minus } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybeWith } from "../../../Utilities/ReactUtils"
import { WikiProperty } from "../WikiProperty"

const SDA = StaticData.A
const DCA = DerivedCharacteristic.A

const getSpiName = pipe (SDA.derivedCharacteristics, lookup ("SPI"), maybe ("") (DCA.short))
const getTouName = pipe (SDA.derivedCharacteristics, lookup ("TOU"), maybe ("") (DCA.short))

export const getCheckModStr: (staticData: StaticDataRecord) => (id: CheckModifier) => string
                            = staticData => id => id === "SPI"
                                                  ? getSpiName (staticData)
                                                  : id === "TOU"
                                                  ? getTouName (staticData)
                                                  : id === "SPI/2"
                                                  ? translate (staticData)
                                                              ("inlinewiki.spirithalf.short")
                                                  : translate (staticData)
                                                              ("inlinewiki.spiritortoughness.short")

interface Accessors<A extends RecordIBase<any>> {
  check: (r: Record<A>) => List<string>
  checkmod?: (r: Record<A>) => Maybe<CheckModifier>
}

export interface WikiSkillCheckProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiSkillCheckProps<A>) => ReturnType<React.FC>

export const WikiSkillCheck: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  const checkString =
    pipe_ (
      x,
      acc.check,
      mapMaybe (pipe (lookupF (SDA.attributes (staticData)), fmap (Attribute.A.short))),
      intercalate ("/")
    )

  const checkmod = bind (Maybe (acc.checkmod)) (thrush (x))

  const mod = fmap (getCheckModStr (staticData)) (checkmod)

  return (
    <WikiProperty staticData={staticData} title="inlinewiki.check">
      {checkString}
      {renderMaybeWith (str => `(${minus}${str})`) (mod)}
    </WikiProperty>
  )
}
