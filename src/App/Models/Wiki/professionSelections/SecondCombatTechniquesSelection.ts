import { fromDefault } from "../../../../Data/Record"

export interface CombatTechniquesSecondSelection {
  "@@name": "CombatTechniquesSecondSelection"
  amount: number
  value: number
}

export const CombatTechniquesSecondSelection =
  fromDefault ("CombatTechniquesSecondSelection")
              <CombatTechniquesSecondSelection> ({
                amount: 0,
                value: 0,
              })
