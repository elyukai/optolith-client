import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses } from "../../../Data/Record";

export interface AdventurePointsCategories {
  "@@name": "AdventurePointsCategories"
  total: number
  spent: number
  available: number
  spentOnAdvantages: number
  spentOnMagicalAdvantages: number
  spentOnBlessedAdvantages: number
  spentOnDisadvantages: number
  spentOnMagicalDisadvantages: number
  spentOnBlessedDisadvantages: number
  spentOnAttributes: number
  spentOnSkills: number
  spentOnCombatTechniques: number
  spentOnSpells: number
  spentOnLiturgicalChants: number
  spentOnCantrips: number
  spentOnBlessings: number
  spentOnSpecialAbilities: number
  spentOnEnergies: number
  spentOnRace: number
  spentOnProfession: Maybe<number>
}

export const AdventurePointsCategories =
  fromDefault ("AdventurePointsCategories")
              <AdventurePointsCategories> ({
                total: 0,
                spent: 0,
                available: 0,
                spentOnAdvantages: 0,
                spentOnMagicalAdvantages: 0,
                spentOnBlessedAdvantages: 0,
                spentOnDisadvantages: 0,
                spentOnMagicalDisadvantages: 0,
                spentOnBlessedDisadvantages: 0,
                spentOnAttributes: 0,
                spentOnSkills: 0,
                spentOnCombatTechniques: 0,
                spentOnSpells: 0,
                spentOnLiturgicalChants: 0,
                spentOnCantrips: 0,
                spentOnBlessings: 0,
                spentOnSpecialAbilities: 0,
                spentOnEnergies: 0,
                spentOnRace: 0,
                spentOnProfession: Nothing,
              })

export const AdventurePointsCategoriesL = makeLenses (AdventurePointsCategories)
