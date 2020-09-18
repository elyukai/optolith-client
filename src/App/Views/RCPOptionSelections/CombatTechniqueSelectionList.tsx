import * as React from "react"
import { elemF, filter, List, map, toArray } from "../../../Data/List"
import { fromJust, isJust, Just } from "../../../Data/Maybe"
import { elems } from "../../../Data/OrderedMap"
import { fnull, OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { CombatTechniquesSelection } from "../../Models/Wiki/professionSelections/CombatTechniquesSelection"
import { CombatTechniquesSecondSelection } from "../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { CombatTechniqueSelectionListItem } from "./CombatTechniqueSelectionListItem"

const SDA = StaticData.A
const CTA = CombatTechnique.A
const CTSA = CombatTechniquesSelection.A
const CTSSA = CombatTechniquesSecondSelection.A

export const isCombatTechniqueSelectionValid =
  (actives: OrderedSet<string>) =>
  (activeSeconds: OrderedSet<string>) =>
  (selection: Record<CombatTechniquesSelection>): Tuple<[boolean]> => {
    const first = OrderedSet.size (actives) === CTSA.amount (selection)
    const msecond = CTSA.second (selection)

    if (isJust (msecond)) {
      return Tuple (first && OrderedSet.size (activeSeconds) === CTSSA.amount (fromJust (msecond)))
    }

    return Tuple (first && fnull (activeSeconds))
  }

export const getCombatTechniques =
  (wiki: StaticDataRecord) =>
  (selection: Record<CombatTechniquesSelection>) =>
    filter (pipe (CTA.id, elemF (CTSA.sid (selection))))
           (elems (SDA.combatTechniques (wiki)))

interface Props {
  activeFirst: OrderedSet<string>
  activeSecond: OrderedSet<string>
  list: List<Record<CombatTechnique>>
  staticData: StaticDataRecord
  selection: Record<CombatTechniquesSelection>
  setCombatTechniqueId (id: string): void
  setCombatTechniqueSecondId (id: string): void
}

export const CombatTechniqueSelectionList: React.FC<Props> = props => {
  const {
    activeFirst,
    activeSecond,
    list,
    selection,
    setCombatTechniqueId,
    setCombatTechniqueSecondId,
    staticData,
  } = props

  const countFirst = CTSA.amount (selection) === 1
                     ? translate (staticData) ("rcpselectoptions.combattechnique.one")
                     : CTSA.amount (selection) === 2
                     ? translate (staticData) ("rcpselectoptions.combattechnique.two")
                     : "..."

  const textFirst =
    translateP (staticData)
               ("rcpselectoptions.combattechniqueselection")
               (List<string | number> (
                 countFirst,
                 CTSA.value (selection) + 6
               ))

  const firstElem = (
    <>
      <h4>{textFirst}</h4>
      <ul>
        {pipe_ (
          list,
          map (e => (
            <CombatTechniqueSelectionListItem
              key={CTA.id (e)}
              active={activeFirst}
              amount={CTSA.amount (selection)}
              combatTechnique={e}
              disabled={Just (activeSecond)}
              toggleCombatTechniqueId={setCombatTechniqueId}
              />
          )),
          toArray
        )}
      </ul>
    </>
  )

  const msecond = CTSA.second (selection)

  if (isJust (msecond)) {
    const second = fromJust (msecond)

    const countSecond = CTSSA.amount (second) === 1
                        ? translate (staticData) ("rcpselectoptions.combattechnique.one")
                        : CTSSA.amount (second) === 2
                        ? translate (staticData) ("rcpselectoptions.combattechnique.two")
                        : "..."

    const textSecond =
      translateP (staticData)
                 ("rcpselectoptions.combattechniquesecondselection")
                 (List<string | number> (
                   countSecond,
                   CTSSA.value (second) + 6
                 ))

    return (
      <div className="ct list">
        {firstElem}
        <h4>{textSecond}</h4>
        <ul>
          {pipe_ (
            list,
            map (e => (
              <CombatTechniqueSelectionListItem
                key={CTA.id (e)}
                active={activeSecond}
                amount={CTSSA.amount (second)}
                combatTechnique={e}
                disabled={Just (activeFirst)}
                toggleCombatTechniqueId={setCombatTechniqueSecondId}
                />
            )),
            toArray
          )}
        </ul>
      </div>
    )
  }

  return (
    <div className="ct list">
      {firstElem}
    </div>
  )
}
