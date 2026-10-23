import type * as Gen from "@optolith/database-schema/gen"
import type { Character } from "./domain/character.ts"

export type CharacterIPCActions = {
  toggleIncludeAllPublications: () => void
  togglePublication: (id: Gen.Publication_ID) => void
  toggleFocusRule: (id: Gen.FocusRule_ID) => void
  toggleOptionalRule: (id: Gen.OptionalRule_ID) => void
  incrementDerivedCharacteristic: (id: Gen.DerivedCharacteristic_ID) => void
  decrementDerivedCharacteristic: (id: Gen.DerivedCharacteristic_ID) => void
  incrementRated: (
    entity: "Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique",
    id: Gen.Skill_ID,
  ) => void
  decrementRated: (
    entity: "Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique",
    id: Gen.Skill_ID,
  ) => void
  incrementRatedToMax: (
    entity: "Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique",
    id: Gen.Skill_ID,
  ) => void
  decrementRatedToMin: (
    entity: "Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique",
    id: Gen.Skill_ID,
  ) => void
}

type Selectors = Character["selectors"]

export type CharacterIPCSelectors = {
  [K in keyof Selectors]: ReturnType<Selectors[K]>
}

export const defaultCharacterIPCSelectors: CharacterIPCSelectors = {
  characterOverviews: [],
  name: "",
  startExperienceLevel: undefined,
  currentExperienceLevel: undefined,
  race: undefined,
  raceVariant: undefined,
  includeAllPublications: false,
  publications: [],
  focusRules: [],
  optionalRules: [],
  isInCharacterCreation: false,
  canRemove: false,
  adventurePointsStats: {
    total: 0,
    spent: 0,
    available: 0,
    spentOnAdvantages: 0,
    spentOnMagicalAdvantages: 0,
    spentOnBlessedAdvantages: 0,
    spentOnDisadvantages: 0,
    spentOnMagicalDisadvantages: 0,
    spentOnBlessedDisadvantages: 0,
    spentOnRace: 0,
    spentOnProfession: 0,
    spentOnAttributes: 0,
    spentOnSkills: 0,
    spentOnCombatTechniques: 0,
    spentOnSpells: 0,
    spentOnCantrips: 0,
    spentOnLiturgicalChants: 0,
    spentOnBlessings: 0,
    spentOnSpecialAbilities: 0,
    spentOnEnergies: 0,
  },
  attributes: [],
  attributesTotal: 0,
  derivedCharacteristics: [],
  activeAdvantages: [],
  inactiveAdvantages: [],
  activeDisadvantages: [],
  inactiveDisadvantages: [],
  skills: [],
  closeCombatTechniques: [],
  rangedCombatTechniques: [],
  activeSpecialAbilities: [],
  inactiveSpecialAbilities: [],
}
