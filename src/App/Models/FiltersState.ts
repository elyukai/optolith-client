import { fromDefault, makeLenses } from "../../Data/Record"

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

// eslint-disable-next-line @typescript-eslint/no-redeclare
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
