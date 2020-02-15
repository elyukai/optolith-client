import * as React from "react"
import { elemF, filter, List, map, toArray } from "../../../Data/List"
import { elems } from "../../../Data/OrderedMap"
import { OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { CantripsSelection } from "../../Models/Wiki/professionSelections/CantripsSelection"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { CantripSelectionListItem } from "./CantripSelectionListItem"

const SDA = StaticData.A
const CSA = CantripsSelection.A
const CA = Cantrip.A

export const isCantripsSelectionValid =
  (actives: OrderedSet<string>) =>
  (selection: Record<CantripsSelection>): Tuple<[boolean]> =>
    Tuple (OrderedSet.size (actives) === CSA.amount (selection))

const getCantrips =
  (wiki: StaticDataRecord) =>
  (selection: Record<CantripsSelection>) =>
    filter (pipe (Cantrip.A.id, elemF (CSA.sid (selection))))
           (elems (SDA.cantrips (wiki)))

interface Props {
  staticData: StaticDataRecord
  active: OrderedSet<string>
  selection: Record<CantripsSelection>
  toggleCantripId (id: string): void
}

export const CantripSelectionList: React.FC<Props> = props => {
  const { staticData, active, selection, toggleCantripId } = props

  const cantrips = React.useMemo (
    () => getCantrips (staticData) (selection),
    [ staticData, selection ]
  )

  const amount = CSA.amount (selection)
  const count = amount === 1
                ? translate (staticData) ("rcpselectoptions.cantrip.one")
                : amount === 2
                ? translate (staticData) ("rcpselectoptions.cantrip.two")
                : "..."

  return (
    <div className="cantrips list">
      <h4>
        {translateP (staticData)
                    ("rcpselectoptions.cantripsfromlist")
                    (List (count))}
      </h4>
      <ul>
        {pipe_ (
          cantrips,
          map (cantrip => (
            <CantripSelectionListItem
              key={CA.id (cantrip)}
              cantrip={cantrip}
              active={active}
              selection={selection}
              toggleCantripId={toggleCantripId}
              />
          )),
          toArray
        )}
      </ul>
    </div>
  )
}
