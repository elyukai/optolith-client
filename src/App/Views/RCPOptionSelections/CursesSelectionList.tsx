import * as React from "react"
import { List, map, toArray } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { size, sum } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { Rules } from "../../Models/Hero/Rules"
import { CursesSelection } from "../../Models/Wiki/professionSelections/CursesSelection"
import { Spell } from "../../Models/Wiki/Spell"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translateP } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { filterByAvailability } from "../../Utilities/RulesUtils"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { getAllWikiEntriesByGroup } from "../../Utilities/WikiUtils"
import { CursesSelectionListItem } from "./CursesSelectionListItem"

const SDA = StaticData.A
const CSA = CursesSelection.A
const SA = Spell.A

export const isCursesSelectionValid =
  (actives: StrMap<number>) =>
  (selection: Record<CursesSelection>): Pair<boolean, number> => {
    const ap_total = CSA.value (selection)
    const ap_spent = (size (actives) + sum (actives)) * 2
    const ap_left = ap_total - ap_spent

    return Pair (ap_left === 0, ap_left)
  }

const getCurses =
  (staticData: StaticDataRecord) =>
  (rules: Record<Rules>) =>
    pipe_ (
      getAllWikiEntriesByGroup (SDA.spells (staticData)) (List (3)),
      filterByAvailability (SA.src) (Pair (SDA.books (staticData), rules)),
      sortRecordsByName (staticData)
    )

interface Props {
  staticData: StaticDataRecord
  rules: Record<Rules>
  active: StrMap<number>
  ap_left: number
  selection: Record<CursesSelection>
  adjustCurseValue: (id: string) => (method: Maybe<"add" | "remove">) => void
}

export const CursesSelectionList: React.FC<Props> = props => {
  const { active, ap_left, rules, selection, adjustCurseValue, staticData } = props

  const ap_total = CSA.value (selection)

  const curses = getCurses (staticData) (rules)

  return (
    <div className="curses list">
      <h4>
        {translateP (staticData)
                    ("rcpselectoptions.cursestotalingapleft")
                    (List (ap_total, ap_left))}
      </h4>
      <ul>
        {pipe_ (
          curses,
          map (curse => (
            <CursesSelectionListItem
              key={SA.id (curse)}
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
