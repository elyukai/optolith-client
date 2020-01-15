import * as React from "react";
import { elemF, filter, List, map, subscript, toArray } from "../../../Data/List";
import { elems } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { CantripsSelection } from "../../Models/Wiki/professionSelections/CantripsSelection";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { translate, translateP } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { CantripSelectionListItem } from "./CantripSelectionListItem";

const WA = WikiModel.A
const CSA = CantripsSelection.A
const CA = Cantrip.A

export const isCantripsSelectionValid =
  (actives: OrderedSet<string>) =>
  (selection: Record<CantripsSelection>): boolean =>
    OrderedSet.size (actives) === CSA.amount (selection)

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

  const nums = translate (l10n) ("cantripcounter")
  const cantrips = React.useMemo (() => getCantrips (wiki) (selection), [ wiki, selection ])
  const amount = CSA.amount (selection)

  return (
    <div className="cantrips list">
      <h4>
        {translateP (l10n)
                    ("cantripsfromlist")
                    (List (renderMaybe (subscript (nums) (amount - 1))))}
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
