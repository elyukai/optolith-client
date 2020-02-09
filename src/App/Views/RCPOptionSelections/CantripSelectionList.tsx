import * as React from "react"
import { elemF, filter, List, map, toArray } from "../../../Data/List"
import { elems } from "../../../Data/OrderedMap"
import { OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { CantripsSelection } from "../../Models/Wiki/professionSelections/CantripsSelection"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { CantripSelectionListItem } from "./CantripSelectionListItem"

const WA = WikiModel.A
const CSA = CantripsSelection.A
const CA = Cantrip.A

export const isCantripsSelectionValid =
  (actives: OrderedSet<string>) =>
  (selection: Record<CantripsSelection>): Tuple<[boolean]> =>
    Tuple (OrderedSet.size (actives) === CSA.amount (selection))

const getCantrips =
  (wiki: WikiModelRecord) =>
  (selection: Record<CantripsSelection>) =>
    filter (pipe (Cantrip.A.id, elemF (CSA.sid (selection))))
           (elems (WA.cantrips (wiki)))

interface Props {
  l10n: L10nRecord
  wiki: WikiModelRecord
  active: OrderedSet<string>
  selection: Record<CantripsSelection>
  toggleCantripId (id: string): void
}

export const CantripSelectionList: React.FC<Props> = props => {
  const { l10n, wiki, active, selection, toggleCantripId } = props

  const cantrips = React.useMemo (() => getCantrips (wiki) (selection), [ wiki, selection ])
  const amount = CSA.amount (selection)
  const count = amount === 1
                ? translate (l10n) ("rcpselectoptions.cantrip.one")
                : amount === 2
                ? translate (l10n) ("rcpselectoptions.cantrip.two")
                : "..."

  return (
    <div className="cantrips list">
      <h4>
        {translateP (l10n)
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
