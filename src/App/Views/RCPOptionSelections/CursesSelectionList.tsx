import * as React from "react"
import { List, map, toArray } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { OrderedMap, size, sum } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { Rules } from "../../Models/Hero/Rules"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { CursesSelection } from "../../Models/Wiki/professionSelections/CursesSelection"
import { Spell } from "../../Models/Wiki/Spell"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { translateP } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { filterByAvailability } from "../../Utilities/RulesUtils"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { getAllWikiEntriesByGroup } from "../../Utilities/WikiUtils"
import { CursesSelectionListItem } from "./CursesSelectionListItem"

const WA = WikiModel.A
const CSA = CursesSelection.A
const SA = Spell.A

export const isCursesSelectionValid =
  (actives: OrderedMap<string, number>) =>
  (selection: Record<CursesSelection>): Pair<boolean, number> => {
    const ap_total = CSA.value (selection)
    const ap_spent = (size (actives) + sum (actives)) * 2
    const ap_left = ap_total - ap_spent

    return Pair (ap_left === 0, ap_left)
  }

const getCurses =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (rules: Record<Rules>) =>
    pipe_ (
      getAllWikiEntriesByGroup (WA.spells (wiki)) (List (3)),
      filterByAvailability (SA.src) (Pair (WA.books (wiki), rules)),
      sortRecordsByName (l10n)
    )

interface Props {
  l10n: L10nRecord
  wiki: WikiModelRecord
  rules: Record<Rules>
  active: OrderedMap<string, number>
  ap_left: number
  selection: Record<CursesSelection>
  adjustCurseValue: (id: string) => (method: Maybe<"add" | "remove">) => void
}

export const CursesSelectionList: React.FC<Props> = props => {
  const { active, ap_left, l10n, rules, selection, adjustCurseValue, wiki } = props

  const ap_total = CSA.value (selection)

  const curses = getCurses (l10n) (wiki) (rules)

  return (
    <div className="curses list">
      <h4>{translateP (l10n) ("cursestotalingapleft") (List (ap_total, ap_left))}</h4>
      <ul>
        {pipe_ (
          curses,
          map (curse => (
            <CursesSelectionListItem
              apLeft={ap_left}
              curse={curse}
              active={active}
              adjustCurseValue={adjustCurseValue}
              />
          )),
          toArray
        )}
      </ul>
    </div>
  )
}
