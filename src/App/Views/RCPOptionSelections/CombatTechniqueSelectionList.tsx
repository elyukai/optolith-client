import * as React from "react"
import { elemF, filter, List, map, toArray } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { elems } from "../../../Data/OrderedMap"
import { OrderedSet } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { CombatTechniquesSelection } from "../../Models/Wiki/professionSelections/CombatTechniquesSelection"
import { CombatTechniquesSecondSelection } from "../../Models/Wiki/professionSelections/SecondCombatTechniquesSelection"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { CombatTechniqueSelectionListItem } from "./CombatTechniqueSelectionListItem"

const WA = WikiModel.A
const CTA = CombatTechnique.A
const CTSA = CombatTechniquesSelection.A
const CTSSA = CombatTechniquesSecondSelection.A

export const isFirstCombatTechniqueSelectionValid =
  (actives: OrderedSet<string>) =>
  (selection: Record<CombatTechniquesSelection>): Tuple<[boolean]> =>
    Tuple (OrderedSet.size (actives) === CTSA.amount (selection))

export const isSecondCombatTechniqueSelectionValid =
  (actives: OrderedSet<string>) =>
  (selection: Record<CombatTechniquesSecondSelection>): Tuple<[boolean]> =>
    Tuple (OrderedSet.size (actives) === CTSSA.amount (selection))

export const getFirstCombatTechniques =
  (wiki: WikiModelRecord) =>
  (selection: Record<CombatTechniquesSelection>) =>
    filter (pipe (CTA.id, elemF (CTSA.sid (selection))))
           (elems (WA.combatTechniques (wiki)))

export const getSecondCombatTechniques =
  (wiki: WikiModelRecord) =>
  (selection: Record<CombatTechniquesSecondSelection>) =>
    filter (pipe (CTA.id, elemF (CTSSA.sid (selection))))
           (elems (WA.combatTechniques (wiki)))

interface Props {
  active: OrderedSet<string>
  disabled?: OrderedSet<string>
  amount: number
  list: List<Record<CombatTechnique>>
  l10n: L10nRecord
  value: number
  second?: boolean
  setCombatTechniqueId (id: string): void
}

export const CombatTechniqueSelectionList: React.FC<Props> = props => {
  const { active, amount, setCombatTechniqueId, disabled, list, l10n, value } = props

  const mdisabled = Maybe (disabled)

  const count = amount === 1
                ? translate (l10n) ("rcpselectoptions.combattechnique.one")
                : amount === 2
                ? translate (l10n) ("rcpselectoptions.combattechnique.two")
                : "..."

  const text =
    translateP (l10n)
               ("rcpselectoptions.combattechniqueselection")
               (List<string | number> (
                 count,
                 value + 6
               ))

  return (
    <div className="ct list">
      <h4>{text}</h4>
      <ul>
        {pipe_ (
          list,
          map (e => (
            <CombatTechniqueSelectionListItem
              active={active}
              amount={amount}
              combatTechnique={e}
              disabled={mdisabled}
              toggleCombatTechniqueId={setCombatTechniqueId}
              />
          )),
          toArray
        )}
      </ul>
    </div>
  )
}
