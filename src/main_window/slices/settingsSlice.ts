/* eslint-disable max-len */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
  CharactersSortOrder,
  CombatTechniquesSortOrder,
  CulturesSortOrder,
  CulturesVisibilityFilter,
  EquipmentSortOrder,
  LiturgiesSortOrder,
  ProfessionsGroupVisibilityFilter,
  ProfessionsSortOrder,
  ProfessionsVisibilityFilter,
  RacesSortOrder,
  SkillsSortOrder,
  SpecialAbilitiesSortOrder,
  SpellsSortOrder,
} from "../../shared/domain/sortOrders.ts"
import { init } from "../init.ts"
import { RootState } from "../store.ts"

type SettingsState = {
  locale: string | undefined
  fallbackLocale: string | undefined
  isEditAfterCreationEnabled: boolean
  areAnimationsEnabled: boolean
  charactersSortOrder: CharactersSortOrder
  racesSortOrder: RacesSortOrder
  culturesSortOrder: CulturesSortOrder
  culturesVisibilityFilter: CulturesVisibilityFilter
  professionsSortOrder: ProfessionsSortOrder
  professionsVisibilityFilter: ProfessionsVisibilityFilter
  professionsGroupVisibilityFilter: ProfessionsGroupVisibilityFilter
  advantagesDisadvantagesCultureRatingVisibility: boolean
  skillsSortOrder: SkillsSortOrder
  skillsCultureRatingVisibility: boolean
  combatTechniquesSortOrder: CombatTechniquesSortOrder
  specialAbilitiesSortOrder: SpecialAbilitiesSortOrder
  spellsSortOrder: SpellsSortOrder
  spellsUnfamiliarVisibility: boolean
  liturgiesSortOrder: LiturgiesSortOrder
  equipmentSortOrder: EquipmentSortOrder
  // equipmentGroupVisibilityFilter: EquipmentGroup
  enableActiveItemHints: boolean
  sheetCheckAttributeValueVisibility: boolean
  sheetUseParchment: boolean
  sheetZoomFactor: number
  // meleeItemTemplatesCombatTechniqueFilter: Maybe<MeleeCombatTechniqueId>
  // rangedItemTemplatesCombatTechniqueFilter: Maybe<RangedCombatTechniqueId>
}

const initialSettingsState: SettingsState = {
  locale: "de-DE",
  fallbackLocale: undefined,
  isEditAfterCreationEnabled: false,
  areAnimationsEnabled: true,
  charactersSortOrder: CharactersSortOrder.Name,
  racesSortOrder: RacesSortOrder.Name,
  culturesSortOrder: CulturesSortOrder.Name,
  culturesVisibilityFilter: CulturesVisibilityFilter.Common,
  professionsSortOrder: ProfessionsSortOrder.Name,
  professionsVisibilityFilter: ProfessionsVisibilityFilter.Common,
  professionsGroupVisibilityFilter: ProfessionsGroupVisibilityFilter.All,
  advantagesDisadvantagesCultureRatingVisibility: true,
  skillsSortOrder: SkillsSortOrder.Group,
  skillsCultureRatingVisibility: true,
  combatTechniquesSortOrder: CombatTechniquesSortOrder.Name,
  specialAbilitiesSortOrder: SpecialAbilitiesSortOrder.Group,
  spellsSortOrder: SpellsSortOrder.Name,
  spellsUnfamiliarVisibility: true,
  liturgiesSortOrder: LiturgiesSortOrder.Name,
  equipmentSortOrder: EquipmentSortOrder.Name,
  enableActiveItemHints: false,
  sheetCheckAttributeValueVisibility: false,
  sheetUseParchment: false,
  sheetZoomFactor: 1.0,
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {
    setLocale: (state, action: PayloadAction<string | undefined>) => {
      state.locale = action.payload
    },
    setFallbackLocale: (state, action: PayloadAction<string | undefined>) => {
      state.fallbackLocale = action.payload
    },
    setIsEditAfterCreationEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEditAfterCreationEnabled = action.payload
    },
    setAreAnimationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.areAnimationsEnabled = action.payload
    },
    changeCharactersSortOrder: (state, action: PayloadAction<CharactersSortOrder>) => {
      state.charactersSortOrder = action.payload
    },
    changeRacesSortOrder: (state, action: PayloadAction<RacesSortOrder>) => {
      state.racesSortOrder = action.payload
    },
    changeCulturesSortOrder: (state, action: PayloadAction<CulturesSortOrder>) => {
      state.culturesSortOrder = action.payload
    },
    changeCulturesVisibilityFilter: (state, action: PayloadAction<CulturesVisibilityFilter>) => {
      state.culturesVisibilityFilter = action.payload
    },
    changeProfessionsSortOrder: (state, action: PayloadAction<ProfessionsSortOrder>) => {
      state.professionsSortOrder = action.payload
    },
    changeProfessionsVisibilityFilter: (
      state,
      action: PayloadAction<ProfessionsVisibilityFilter>,
    ) => {
      state.professionsVisibilityFilter = action.payload
    },
    changeProfessionsGroupVisibilityFilter: (
      state,
      action: PayloadAction<ProfessionsGroupVisibilityFilter>,
    ) => {
      state.professionsGroupVisibilityFilter = action.payload
    },
    switchAdvantagesDisadvantagesCultureRatingVisibility: state => {
      state.advantagesDisadvantagesCultureRatingVisibility =
        !state.advantagesDisadvantagesCultureRatingVisibility
    },
    changeSkillsSortOrder: (state, action: PayloadAction<SkillsSortOrder>) => {
      state.skillsSortOrder = action.payload
    },
    switchSkillsCultureRatingVisibility: state => {
      state.skillsCultureRatingVisibility = !state.skillsCultureRatingVisibility
    },
    changeCombatTechniquesSortOrder: (state, action: PayloadAction<CombatTechniquesSortOrder>) => {
      state.combatTechniquesSortOrder = action.payload
    },
    changeSpecialAbilitiesSortOrder: (state, action: PayloadAction<SpecialAbilitiesSortOrder>) => {
      state.specialAbilitiesSortOrder = action.payload
    },
    changeSpellsSortOrder: (state, action: PayloadAction<SpellsSortOrder>) => {
      state.spellsSortOrder = action.payload
    },
    changeSpellsUnfamiliarVisibility: (state, action: PayloadAction<boolean>) => {
      state.spellsUnfamiliarVisibility = action.payload
    },
    changeLiturgiesSortOrder: (state, action: PayloadAction<LiturgiesSortOrder>) => {
      state.liturgiesSortOrder = action.payload
    },
    changeEquipmentSortOrder: (state, action: PayloadAction<EquipmentSortOrder>) => {
      state.equipmentSortOrder = action.payload
    },
    changeEnableActiveItemHints: (state, action: PayloadAction<boolean>) => {
      state.enableActiveItemHints = action.payload
    },
    changeSheetCheckAttributeValueVisibility: (state, action: PayloadAction<boolean>) => {
      state.sheetCheckAttributeValueVisibility = action.payload
    },
    changeSheetUseParchment: (state, action: PayloadAction<boolean>) => {
      state.sheetUseParchment = action.payload
    },
    changeSheetZoomFactor: (state, action: PayloadAction<number>) => {
      state.sheetZoomFactor = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(init, (state, action) => {
      state.locale = action.payload.globalSettings.locale
      state.fallbackLocale = action.payload.globalSettings.fallbackLocale
      state.isEditAfterCreationEnabled = action.payload.globalSettings.isEditAfterCreationEnabled
      state.areAnimationsEnabled = action.payload.globalSettings.areAnimationsEnabled
    })
  },
})

export const {
  setLocale,
  setFallbackLocale,
  setIsEditAfterCreationEnabled,
  setAreAnimationsEnabled,
  changeCharactersSortOrder,
  changeRacesSortOrder,
  changeCulturesSortOrder,
  changeCulturesVisibilityFilter,
  changeProfessionsSortOrder,
  changeProfessionsVisibilityFilter,
  changeProfessionsGroupVisibilityFilter,
  switchAdvantagesDisadvantagesCultureRatingVisibility,
  changeSkillsSortOrder,
  switchSkillsCultureRatingVisibility,
  changeCombatTechniquesSortOrder,
  changeSpecialAbilitiesSortOrder,
  changeSpellsSortOrder,
  changeSpellsUnfamiliarVisibility,
  changeLiturgiesSortOrder,
  changeEquipmentSortOrder,
  changeEnableActiveItemHints,
  changeSheetCheckAttributeValueVisibility,
  changeSheetUseParchment,
  changeSheetZoomFactor,
} = settingsSlice.actions

export const selectLocale = (state: RootState) => state.settings.locale
export const selectFallbackLocale = (state: RootState) => state.settings.fallbackLocale
export const selectIsEditAfterCreationEnabled = (state: RootState) =>
  state.settings.isEditAfterCreationEnabled
export const selectAreAnimationsEnabled = (state: RootState) => state.settings.areAnimationsEnabled
export const selectCharactersSortOrder = (state: RootState) => state.settings.charactersSortOrder
export const selectRacesSortOrder = (state: RootState) => state.settings.racesSortOrder
export const selectCulturesSortOrder = (state: RootState) => state.settings.culturesSortOrder
export const selectCulturesVisibilityFilter = (state: RootState) =>
  state.settings.culturesVisibilityFilter
export const selectProfessionsSortOrder = (state: RootState) => state.settings.professionsSortOrder
export const selectProfessionsVisibilityFilter = (state: RootState) =>
  state.settings.professionsVisibilityFilter
export const selectProfessionsGroupVisibilityFilter = (state: RootState) =>
  state.settings.professionsGroupVisibilityFilter
export const selectAdvantagesDisadvantagesCultureRatingVisibility = (state: RootState) =>
  state.settings.advantagesDisadvantagesCultureRatingVisibility
export const selectSkillsSortOrder = (state: RootState) => state.settings.skillsSortOrder
export const selectSkillsCultureRatingVisibility = (state: RootState) =>
  state.settings.skillsCultureRatingVisibility
export const selectCombatTechniquesSortOrder = (state: RootState) =>
  state.settings.combatTechniquesSortOrder
export const selectSpecialAbilitiesSortOrder = (state: RootState) =>
  state.settings.specialAbilitiesSortOrder
export const selectSpellsSortOrder = (state: RootState) => state.settings.spellsSortOrder
export const selectSpellsUnfamiliarVisibility = (state: RootState) =>
  state.settings.spellsUnfamiliarVisibility
export const selectLiturgiesSortOrder = (state: RootState) => state.settings.liturgiesSortOrder
export const selectEquipmentSortOrder = (state: RootState) => state.settings.equipmentSortOrder
// export const selectEquipmentGroupVisibilityFilter = (state: RootState) => state.settings.equipmentGroupVisibilityFilter
export const selectEnableActiveItemHints = (state: RootState) =>
  state.settings.enableActiveItemHints
export const selectSheetCheckAttributeValueVisibility = (state: RootState) =>
  state.settings.sheetCheckAttributeValueVisibility
export const selectSheetUseParchment = (state: RootState) => state.settings.sheetUseParchment
export const selectSheetZoomFactor = (state: RootState) => state.settings.sheetZoomFactor
// export const selectMeleeItemTemplatesCombatTechniqueFilter = (state: RootState) => state.settings.meleeItemTemplatesCombatTechniqueFilter
// export const selectRangedItemTemplatesCombatTechniqueFilter = (state: RootState) => state.settings.rangedItemTemplatesCombatTechniqueFilter

export const settingsReducer = settingsSlice.reducer
