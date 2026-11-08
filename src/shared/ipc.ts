import type * as Gen from "@optolith/database-schema/gen"
import type { SerializedSelectedRCPOptions } from "../main_window/routes/characters/character/raceCultureProfession/RCPOptionSelections/SelectedRCPOptions.ts"
import type { SerializedActivatableInstance } from "./domain/activatable/activatable.ts"
import type { Character } from "./domain/character.ts"

export type CharacterIPCActions = {
  setName: (newName: string) => void
  rerollHairColor: () => void
  rerollEyeColor: () => void
  rerollSize: () => void
  rerollWeight: () => void
  setAge: (newAge: string) => void
  setCharacteristics: (newCharacteristics: string) => void
  setDateOfBirth: (newDateOfBirth: string) => void
  setFamily: (newFamily: string) => void
  setOtherInfo: (newOtherInfo: string) => void
  setPlaceOfBirth: (newPlaceOfBirth: string) => void
  setPredefinedEyeColor: (newPredefinedEyeColor: Gen.EyeColor_ID) => void
  setPredefinedHairColor: (newPredefinedHairColor: Gen.HairColor_ID) => void
  setSize: (newSize: string) => void
  setSocialStatus: (newSocialStatus: Gen.SocialStatus_ID) => void
  setTitle: (newTitle: string) => void
  setWeight: (newWeight: string) => void
  toggleIncludeAllPublications: () => void
  togglePublication: (id: Gen.Publication_ID) => void
  toggleFocusRule: (id: Gen.FocusRule_ID) => void
  toggleOptionalRule: (id: Gen.OptionalRule_ID) => void
  setOptionalRuleOption: (id: Gen.OptionalRule_ID, optionId: Gen.OptionalRuleOption_ID) => void
  toggleAlternativeRule: (id: Gen.OptionalRule_ID) => void
  setRaceVariant: (id: Gen.RaceVariant_ID) => void
  setCulture: (id: Gen.Culture_ID) => void
  setProfessionPackage: (id: Gen.ProfessionPackage_ID) => void
  setProfessionVariant: (id: Gen.ProfessionVariant_ID | undefined) => void
  setCustomProfessionName: (newCustomProfessionName: string) => void
  applyRaceCultureProfession: (options: SerializedSelectedRCPOptions) => void
  incrementDerivedCharacteristic: (id: Gen.DerivedCharacteristic_ID) => void
  decrementDerivedCharacteristic: (id: Gen.DerivedCharacteristic_ID) => void
  incrementDerivedCharacteristicPermanentlyLost: (id: Gen.DerivedCharacteristic_ID) => void
  addDerivedCharacteristicPermanentlyLost: (id: Gen.DerivedCharacteristic_ID, value: number) => void
  decrementDerivedCharacteristicPermanentlyLost: (id: Gen.DerivedCharacteristic_ID) => void
  incrementDerivedCharacteristicBoughtBack: (id: Gen.DerivedCharacteristic_ID) => void
  decrementDerivedCharacteristicBoughtBack: (id: Gen.DerivedCharacteristic_ID) => void
  incrementRated: (entity: Gen.RatedIdentifier["kind"], id: string) => void
  decrementRated: (entity: Gen.RatedIdentifier["kind"], id: string) => void
  incrementRatedToMax: (entity: Gen.RatedIdentifier["kind"], id: string) => void
  decrementRatedToMin: (entity: Gen.RatedIdentifier["kind"], id: string) => void
  addTinyActivatable: (entity: Gen.TinyActivatableIdentifier["kind"], id: string) => void
  removeTinyActivatable: (entity: Gen.TinyActivatableIdentifier["kind"], id: string) => void
  activateRated: (entity: Gen.SkillWithEnhancementsIdentifier["kind"], id: string) => void
  deactivateRated: (entity: Gen.SkillWithEnhancementsIdentifier["kind"], id: string) => void
  addActivatable: (
    entity: Gen.ActivatableIdentifier["kind"],
    id: string,
    instance: SerializedActivatableInstance,
  ) => void
  setActivatableLevel: (
    entity: Gen.ActivatableIdentifier["kind"],
    id: string,
    index: number,
    newLevel: number,
  ) => void
  removeActivatable: (entity: Gen.ActivatableIdentifier["kind"], id: string, index: number) => void
}

type Selectors = Character["selectors"]

export type CharacterIPCSelectors = {
  [K in keyof Selectors]: ReturnType<Selectors[K]>
}

export const defaultCharacterIPCSelectors: CharacterIPCSelectors = {
  id: "",
  name: "",
  avatar: undefined,
  sexName: "",
  showSexualCharacteristics: false,
  startExperienceLevel: undefined,
  currentExperienceLevel: undefined,
  canAddAdventurePoints: false,
  showFinishCharacterCreation: false,
  canFinishCharacterCreation: false,
  canDefineCustomProfessionName: false,
  phase: "RaceCultureProfession",
  availableHairColors: [],
  availableEyeColors: [],
  randomHeightCalculationString: undefined,
  randomWeightCalculationString: undefined,
  availableSocialStatuses: [],
  availableHairColorsIdDice: [],
  availableEyeColorsIdDice: [],
  age: undefined,
  characteristics: undefined,
  dateOfBirth: undefined,
  family: undefined,
  otherInfo: undefined,
  placeOfBirth: undefined,
  eyeColor: undefined,
  predefinedEyeColor: undefined,
  hairColor: undefined,
  predefinedHairColor: undefined,
  size: undefined,
  socialStatus: undefined,
  title: undefined,
  weight: undefined,
  isRaceSelected: false,
  race: undefined,
  raceId: undefined,
  raceVariant: undefined,
  raceVariantId: undefined,
  raceName: undefined,
  races: [],
  raceVariants: [],
  isCultureSelected: false,
  cultureId: undefined,
  cultureName: undefined,
  cultures: [],
  professionId: undefined,
  professionVersionId: undefined,
  professionPackageId: undefined,
  professionVariantId: undefined,
  professionName: undefined,
  professions: [],
  professionVariants: [],
  isVariantSelectionRequired: false,
  raceCultureProfessionSelectOptions: undefined,
  includeAllPublications: false,
  publications: [],
  focusRules: [],
  optionalRules: [],
  alternativeRules: [],
  isInCharacterCreation: false,
  isCharacterCreationFinished: false,
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
    spentOnCantrips: 0,
    spentOnSpells: 0,
    spentOnMagicalActions: 0,
    spentOnLiturgicalChants: 0,
    spentOnBlessings: 0,
    spentOnSpecialAbilities: 0,
    spentOnEnergies: 0,
  },
  attributes: [],
  attributesTotal: 0,
  attributesTotalMaximum: 0,
  derivedCharacteristics: [],
  maximumAdventurePointsForMagicalAdvantagesAndDisadvantages: 0,
  activeAdvantages: [],
  inactiveAdvantages: [],
  activeDisadvantages: [],
  inactiveDisadvantages: [],
  skills: [],
  closeCombatTechniques: [],
  rangedCombatTechniques: [],
  isSpellcaster: false,
  isBlessedOne: false,
  activeCantrips: [],
  inactiveCantrips: [],
  activeSpells: [],
  inactiveSpells: [],
  activeRituals: [],
  inactiveRituals: [],
  activeBlessings: [],
  inactiveBlessings: [],
  activeLiturgicalChants: [],
  inactiveLiturgicalChants: [],
  activeCeremonies: [],
  inactiveCeremonies: [],
  activeSpecialAbilities: [],
  inactiveSpecialAbilities: [],
}
