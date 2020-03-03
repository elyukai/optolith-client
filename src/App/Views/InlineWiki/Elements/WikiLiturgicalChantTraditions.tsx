import * as React from "react"
import { ident } from "../../../../Data/Function"
import { fmap } from "../../../../Data/Functor"
import { consF, elem, foldr, intercalate, List } from "../../../../Data/List"
import { fromJust, fromMaybe, isNothing, Just, mapMaybe, Maybe } from "../../../../Data/Maybe"
import { alter, any, find, insert, lookupF, OrderedMap } from "../../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Aspect, BlessedTradition } from "../../../Constants/Groups"
import { NumIdName } from "../../../Models/NumIdName"
import { BlessedTradition as BlessedTraditionR } from "../../../Models/Wiki/BlessedTradition"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { getTraditionOfAspect } from "../../../Utilities/Increasable/liturgicalChantUtils"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { sortStrings } from "../../../Utilities/sortBy"
import { WikiProperty } from "../WikiProperty"

const SDA = StaticData.A
const BTA = BlessedTraditionR.A
const NINA = NumIdName.A

interface Accessors<A extends RecordIBase<any>> {
  aspects: (r: Record<A>) => List<Aspect>
  tradition: (r: Record<A>) => List<BlessedTradition>
}

export interface WikiLiturgicalChantTraditionsProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiLiturgicalChantTraditionsProps<A>) =>
  ReturnType<React.FC>

export const WikiLiturgicalChantTraditions: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  const getTrad: (numId: number) => Maybe<Record<BlessedTraditionR>>
                = numId => find ((bt: Record<BlessedTraditionR>) => BTA.numId (bt) === numId)
                                (SDA.blessedTraditions (staticData))

  const getAspectName = pipe (lookupF (SDA.aspects (staticData)), fmap (NINA.name))

  const curr_traditions = acc.tradition (x)
  const curr_aspects = acc.aspects (x)

  return pipe_ (
    curr_aspects,
    foldr ((asp: Aspect) => {
            const trad = getTraditionOfAspect (asp)

            return any ((bt: Record<BlessedTraditionR>) => BTA.numId (bt) === trad)
                       (SDA.blessedTraditions (staticData))
              ? alter (pipe (fromMaybe (List<number> ()), consF (asp), Just)) (trad)
              : ident as ident<OrderedMap<number, List<number>>>
          })
          (OrderedMap.empty),
    elem (1) (curr_aspects) ? insert (1) (List (1)) : ident,
    elem (14) (curr_traditions) ? insert (14) (List ()) : ident,
    OrderedMap.foldrWithKey ((t: number) => (as: List<number>) => {
                              if (t === 1) {
                                return consF (
                                  translate (staticData) ("liturgicalchants.aspects.general")
                                )
                              }

                              const mmain_trad = getTrad (t)

                              if (isNothing (mmain_trad)) {
                                return ident as ident<List<string>>
                              }

                              const main_trad = fromJust (mmain_trad)

                              const mpossible_aspects = BTA.aspects (main_trad)

                              if (isNothing (mpossible_aspects)) {
                                return consF (BTA.name (main_trad))
                              }

                              const mapped_aspects = mapMaybe (getAspectName) (as)

                              const complete_aspects =
                                intercalate (` ${translate (staticData) ("general.and")} `)
                                            (sortStrings (staticData) (mapped_aspects))

                              return consF (`${BTA.name (main_trad)} (${complete_aspects})`)
                            })
                            (List ()),
    sortStrings (staticData),
    traditions => (
      <WikiProperty staticData={staticData} title="inlinewiki.traditions">
        {intercalate (", ") (traditions)}
      </WikiProperty>
    )
  )
}
