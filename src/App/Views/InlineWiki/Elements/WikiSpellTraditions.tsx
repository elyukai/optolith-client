import * as React from "react"
import { ident } from "../../../../Data/Function"
import { fmap } from "../../../../Data/Functor"
import { consF, elem, intercalate, List } from "../../../../Data/List"
import { mapMaybe, Maybe } from "../../../../Data/Maybe"
import { find, lookupF } from "../../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../../Data/Record"
import { MagicalTradition } from "../../../Constants/Groups"
import { NumIdName } from "../../../Models/NumIdName"
import { ArcaneBardTradition } from "../../../Models/Wiki/ArcaneBardTradition"
import { ArcaneDancerTradition } from "../../../Models/Wiki/ArcaneDancerTradition"
import { MagicalTradition as MagicalTraditionR } from "../../../Models/Wiki/MagicalTradition"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { sortStrings } from "../../../Utilities/sortBy"
import { WikiProperty } from "../WikiProperty"

const SDA = StaticData.A
const NINA = NumIdName.A
const MTA = MagicalTraditionR.A
const ABTA = ArcaneBardTradition.A
const ADTA = ArcaneDancerTradition.A

interface Accessors<A extends RecordIBase<any>> {
  subtradition: (r: Record<A>) => List<number>
  tradition: (r: Record<A>) => List<MagicalTradition>
}

export interface WikiSpellTraditionsProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiSpellTraditionsProps<A>) => ReturnType<React.FC>

export const WikiSpellTraditions: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  const trad = acc.tradition (x)
  const subtrad = acc.subtradition (x)

  if (elem (MagicalTradition.Animists) (trad)) {
    return (
      <WikiProperty staticData={staticData} title="inlinewiki.tribaltraditions">
        {pipe_ (
          subtrad,
          mapMaybe (pipe (lookupF (SDA.tribes (staticData)), fmap (NINA.name))),
          sortStrings (staticData),
          intercalate (", ")
        )}
      </WikiProperty>
    )
  }

  if (elem (MagicalTradition.ArcaneBards) (trad)) {
    return (
      <WikiProperty staticData={staticData} title="inlinewiki.musictradition">
        {pipe_ (
          subtrad,
          mapMaybe (pipe (lookupF (SDA.arcaneBardTraditions (staticData)), fmap (ABTA.name))),
          sortStrings (staticData),
          intercalate (", ")
        )}
      </WikiProperty>
    )
  }

  if (elem (MagicalTradition.ArcaneDancers) (trad)) {
    return (
      <WikiProperty staticData={staticData} title="inlinewiki.musictradition">
        {pipe_ (
          subtrad,
          mapMaybe (pipe (lookupF (SDA.arcaneDancerTraditions (staticData)), fmap (ADTA.name))),
          sortStrings (staticData),
          intercalate (", ")
        )}
      </WikiProperty>
    )
  }

  const getTrad = (numId: number) => find ((mt: Record<MagicalTraditionR>) =>
                                            Maybe.elem (numId) (MTA.numId (mt)))
                                          (SDA.magicalTraditions (staticData))

  return (
    <WikiProperty staticData={staticData} title="inlinewiki.traditions">
      {pipe_ (
        trad,
        mapMaybe (pipe (getTrad, fmap (MTA.name))),
        elem (MagicalTradition.General) (trad)
          ? consF (translate (staticData) ("spells.traditions.general"))
          : ident,
        sortStrings (staticData),
        intercalate (", ")
      )}
    </WikiProperty>
  )
}
