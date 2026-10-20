import type {
  Attribute_ID,
  DerivedCharacteristic_ID,
  Skill_ID,
} from "@optolith/database-schema/gen"
import type { AdventurePointsStats } from "./domain/character.ts"
import type { DisplayedDerivedCharacteristic } from "./domain/energy.ts"
import type { DisplayedAttribute } from "./domain/rated/attribute.ts"
import type { DisplayedSkill } from "./domain/rated/skill.ts"

export type CharacterIPCActions = {
  incrementAttribute: (id: Attribute_ID) => void
  decrementAttribute: (id: Attribute_ID) => void
  incrementAttributeToMax: (id: Attribute_ID) => void
  decrementAttributeToMin: (id: Attribute_ID) => void
  incrementDerivedCharacteristic: (id: DerivedCharacteristic_ID) => void
  decrementDerivedCharacteristic: (id: DerivedCharacteristic_ID) => void
  incrementSkill: (id: Skill_ID) => void
  decrementSkill: (id: Skill_ID) => void
  incrementSkillToMax: (id: Skill_ID) => void
  decrementSkillToMin: (id: Skill_ID) => void
}

export type CharacterIPCSelectors = {
  adventurePointsStats: AdventurePointsStats
  attributes: DisplayedAttribute[]
  attributesTotal: number
  derivedCharacteristics: DisplayedDerivedCharacteristic[]
  skills: DisplayedSkill[]
}

export const defaultCharacterIPCSelectors: CharacterIPCSelectors = {
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
  skills: [],
}
