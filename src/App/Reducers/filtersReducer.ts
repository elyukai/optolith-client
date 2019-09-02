import { cnst, ident } from "../../Data/Function";
import { set } from "../../Data/Lens";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { SetCombatTechniquesFilterTextAction } from "../Actions/CombatTechniquesActions";
import { SetCulturesFilterTextAction } from "../Actions/CultureActions";
import { SetActiveAdvantagesFilterTextAction, SetActiveDisadvantagesFilterTextAction, SetInactiveAdvantagesFilterTextAction, SetInactiveDisadvantagesFilterTextAction } from "../Actions/DisAdvActions";
import { SetEquipmentFilterTextAction, SetItemTemplatesFilterTextAction, SetZoneArmorFilterTextAction } from "../Actions/EquipmentActions";
import { SetHerolistFilterTextAction } from "../Actions/HerolistActions";
import { SetActiveLiturgicalChantsFilterTextAction, SetInactiveLiturgicalChantsFilterTextAction } from "../Actions/LiturgicalChantActions";
import { SetTabAction } from "../Actions/LocationActions";
import { SetProfessionsFilterTextAction } from "../Actions/ProfessionActions";
import { SetRacesFilterTextAction } from "../Actions/RaceActions";
import { SetSkillsFilterTextAction } from "../Actions/SkillActions";
import { SetActiveSpecialAbilitiesFilterTextAction, SetInactiveSpecialAbilitiesFilterTextAction } from "../Actions/SpecialAbilitiesActions";
import { SetActiveSpellsFilterTextAction, SetInactiveSpellsFilterTextAction } from "../Actions/SpellsActions";
import { ActionTypes } from "../Constants/ActionTypes";

type Action = SetTabAction
            | SetHerolistFilterTextAction
            | SetActiveAdvantagesFilterTextAction
            | SetActiveDisadvantagesFilterTextAction
            | SetActiveLiturgicalChantsFilterTextAction
            | SetActiveSpecialAbilitiesFilterTextAction
            | SetActiveSpellsFilterTextAction
            | SetCombatTechniquesFilterTextAction
            | SetCulturesFilterTextAction
            | SetEquipmentFilterTextAction
            | SetInactiveAdvantagesFilterTextAction
            | SetInactiveDisadvantagesFilterTextAction
            | SetInactiveDisadvantagesFilterTextAction
            | SetInactiveLiturgicalChantsFilterTextAction
            | SetInactiveSpecialAbilitiesFilterTextAction
            | SetInactiveSpellsFilterTextAction
            | SetItemTemplatesFilterTextAction
            | SetProfessionsFilterTextAction
            | SetRacesFilterTextAction
            | SetSkillsFilterTextAction
            | SetZoneArmorFilterTextAction

export interface FiltersState {
  "@@name": "FiltersState"
  herolistFilterText: string
  racesFilterText: string
  culturesFilterText: string
  professionsFilterText: string
  advantagesFilterText: string
  inactiveAdvantagesFilterText: string
  disadvantagesFilterText: string
  inactiveDisadvantagesFilterText: string
  skillsFilterText: string
  combatTechniquesFilterText: string
  specialAbilitiesFilterText: string
  inactiveSpecialAbilitiesFilterText: string
  spellsFilterText: string
  inactiveSpellsFilterText: string
  liturgicalChantsFilterText: string
  inactiveLiturgicalChantsFilterText: string
  equipmentFilterText: string
  itemTemplatesFilterText: string
  hitZoneArmorFilterText: string
  petsFilterText: string
}

export const FiltersState =
  fromDefault ("FiltersState")
              <FiltersState> ({
                herolistFilterText: "",
                racesFilterText: "",
                culturesFilterText: "",
                professionsFilterText: "",
                advantagesFilterText: "",
                inactiveAdvantagesFilterText: "",
                disadvantagesFilterText: "",
                inactiveDisadvantagesFilterText: "",
                skillsFilterText: "",
                combatTechniquesFilterText: "",
                specialAbilitiesFilterText: "",
                inactiveSpecialAbilitiesFilterText: "",
                spellsFilterText: "",
                inactiveSpellsFilterText: "",
                liturgicalChantsFilterText: "",
                inactiveLiturgicalChantsFilterText: "",
                equipmentFilterText: "",
                itemTemplatesFilterText: "",
                hitZoneArmorFilterText: "",
                petsFilterText: "",
              })

export const FiltersStateL = makeLenses (FiltersState)

const rcpFiltersReducer =
  (action: Action): ident<Record<FiltersState>> => {
  switch (action.type) {
    case ActionTypes.SET_RACES_FILTER_TEXT:
      return set (FiltersStateL.racesFilterText)
                 (action.payload.filterText)

    case ActionTypes.SET_CULTURES_FILTER_TEXT:
      return set (FiltersStateL.culturesFilterText)
                 (action.payload.filterText)

    case ActionTypes.SET_PROFESSIONS_FILTER_TEXT:
      return set (FiltersStateL.professionsFilterText)
                 (action.payload.filterText)

    default:
      return ident
  }
}

const disAdvantageFiltersReducer =
  (action: Action): ident<Record<FiltersState>> => {
    switch (action.type) {
      case ActionTypes.SET_ADVANTAGES_FILTER_TEXT:
        return set (FiltersStateL.advantagesFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_INACTIVE_ADVANTAGES_FILTER_TEXT:
        return set (FiltersStateL.inactiveAdvantagesFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_DISADVANTAGES_FILTER_TEXT:
        return set (FiltersStateL.disadvantagesFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_INACTIVE_DISADVANTAGES_FILTER_TEXT:
        return set (FiltersStateL.inactiveDisadvantagesFilterText)
                   (action.payload.filterText)

      default:
        return ident
    }
  }

const abilityFiltersReducer =
  (action: Action): ident<Record<FiltersState>> => {
    switch (action.type) {
      case ActionTypes.SET_SKILLS_FILTER_TEXT:
        return set (FiltersStateL.skillsFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT:
        return set (FiltersStateL.combatTechniquesFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT:
        return set (FiltersStateL.specialAbilitiesFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT:
        return set (FiltersStateL.inactiveSpecialAbilitiesFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_SPELLS_FILTER_TEXT:
        return set (FiltersStateL.spellsFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_INACTIVE_SPELLS_FILTER_TEXT:
        return set (FiltersStateL.inactiveSpellsFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT:
        return set (FiltersStateL.liturgicalChantsFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT:
        return set (FiltersStateL.inactiveLiturgicalChantsFilterText)
                   (action.payload.filterText)

      default:
        return ident
    }
  }

const belongingsFiltersReducer =
  (action: Action): ident<Record<FiltersState>> => {
    switch (action.type) {
      case ActionTypes.SET_EQUIPMENT_FILTER_TEXT:
        return set (FiltersStateL.equipmentFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_ITEM_TEMPLATES_FILTER_TEXT:
        return set (FiltersStateL.itemTemplatesFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_ZONE_ARMOR_FILTER_TEXT:
        return set (FiltersStateL.hitZoneArmorFilterText)
                   (action.payload.filterText)

      default:
        return ident
    }
  }

export const filtersReducer =
  (action: Action): ident<Record<FiltersState>> => {
    switch (action.type) {
      case ActionTypes.SET_TAB:
        return cnst (FiltersState.default)

      case ActionTypes.SET_HEROLIST_FILTER_TEXT:
        return set (FiltersStateL.herolistFilterText)
                   (action.payload.filterText)

      case ActionTypes.SET_RACES_FILTER_TEXT:
      case ActionTypes.SET_CULTURES_FILTER_TEXT:
      case ActionTypes.SET_PROFESSIONS_FILTER_TEXT:
        return rcpFiltersReducer (action)

      case ActionTypes.SET_ADVANTAGES_FILTER_TEXT:
      case ActionTypes.SET_INACTIVE_ADVANTAGES_FILTER_TEXT:
      case ActionTypes.SET_DISADVANTAGES_FILTER_TEXT:
      case ActionTypes.SET_INACTIVE_DISADVANTAGES_FILTER_TEXT:
        return disAdvantageFiltersReducer (action)

      case ActionTypes.SET_SKILLS_FILTER_TEXT:
      case ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT:
      case ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT:
      case ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT:
      case ActionTypes.SET_SPELLS_FILTER_TEXT:
      case ActionTypes.SET_INACTIVE_SPELLS_FILTER_TEXT:
      case ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT:
      case ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT:
        return abilityFiltersReducer (action)

      case ActionTypes.SET_EQUIPMENT_FILTER_TEXT:
      case ActionTypes.SET_ITEM_TEMPLATES_FILTER_TEXT:
      case ActionTypes.SET_ZONE_ARMOR_FILTER_TEXT:
        return belongingsFiltersReducer (action)

      default:
        return ident
    }
  }
