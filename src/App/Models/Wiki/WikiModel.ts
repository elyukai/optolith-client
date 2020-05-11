import { OrderedMap } from "../../../Data/OrderedMap"
import { fromDefault, makeLenses, Record, RecordCreator } from "../../../Data/Record"
import { DerivedCharacteristicId } from "../../Utilities/YAML/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { NumIdName } from "../NumIdName"
import { Advantage } from "./Advantage"
import { AnimistForce } from "./AnimistForce"
import { Attribute } from "./Attribute"
import { BlessedTradition } from "./BlessedTradition"
import { Blessing } from "./Blessing"
import { Book } from "./Book"
import { Cantrip } from "./Cantrip"
import { CombatTechnique } from "./CombatTechnique"
import { Condition } from "./Condition"
import { Culture } from "./Culture"
import { Curse } from "./Curse"
import { DerivedCharacteristic } from "./DerivedCharacteristic"
import { Disadvantage } from "./Disadvantage"
import { DominationRitual } from "./DominationRitual"
import { ElvenMagicalSong } from "./ElvenMagicalSong"
import { EquipmentPackage } from "./EquipmentPackage"
import { ExperienceLevel } from "./ExperienceLevel"
import { FocusRule } from "./FocusRule"
import { GeodeRitual } from "./GeodeRitual"
import { ItemTemplate } from "./ItemTemplate"
import { L10n } from "./L10n"
import { LiturgicalChant } from "./LiturgicalChant"
import { MagicalDance } from "./MagicalDance"
import { MagicalMelody } from "./MagicalMelody"
import { MagicalTradition } from "./MagicalTradition"
import { OptionalRule } from "./OptionalRule"
import { PactCategory } from "./PactCategory"
import { Profession } from "./Profession"
import { ProfessionVariant } from "./ProfessionVariant"
import { Race } from "./Race"
import { RaceVariant } from "./RaceVariant"
import { RogueSpell } from "./RogueSpell"
import { Skill } from "./Skill"
import { SkillGroup } from "./SkillGroup"
import { SpecialAbility } from "./SpecialAbility"
import { Spell } from "./Spell"
import { State } from "./State"
import { SelectOption } from "./sub/SelectOption"
import { ZibiljaRitual } from "./ZibiljaRitual"

export type StaticDataRecord = Record<StaticData>

export interface StaticData {
  "@@name": "StaticData"
  advantages: StrMap<Record<Advantage>>
  animistForces: StrMap<Record<AnimistForce>>
  arcaneBardTraditions: OrderedMap<number, Record<NumIdName>>
  arcaneDancerTraditions: OrderedMap<number, Record<NumIdName>>
  armorTypes: OrderedMap<number, Record<NumIdName>>
  aspects: OrderedMap<number, Record<NumIdName>>
  attributes: StrMap<Record<Attribute>>
  blessedTraditions: StrMap<Record<BlessedTradition>>
  blessings: StrMap<Record<Blessing>>
  books: StrMap<Record<Book>>
  brews: OrderedMap<number, Record<NumIdName>>
  cantrips: StrMap<Record<Cantrip>>
  combatSpecialAbilityGroups: OrderedMap<number, Record<NumIdName>>
  combatTechniqueGroups: OrderedMap<number, Record<NumIdName>>
  combatTechniques: StrMap<Record<CombatTechnique>>
  conditions: StrMap<Record<Condition>>
  cultures: StrMap<Record<Culture>>
  curses: StrMap<Record<Curse>>
  derivedCharacteristics: OrderedMap<DerivedCharacteristicId, Record<DerivedCharacteristic>>
  disadvantages: StrMap<Record<Disadvantage>>
  dominationRituals: StrMap<Record<DominationRitual>>
  elvenMagicalSongs: StrMap<Record<ElvenMagicalSong>>
  itemTemplates: StrMap<Record<ItemTemplate>>
  equipmentGroups: OrderedMap<number, Record<NumIdName>>
  equipmentPackages: StrMap<Record<EquipmentPackage>>
  experienceLevels: StrMap<Record<ExperienceLevel>>
  eyeColors: OrderedMap<number, Record<NumIdName>>
  focusRules: StrMap<Record<FocusRule>>
  geodeRituals: StrMap<Record<GeodeRitual>>
  hairColors: OrderedMap<number, Record<NumIdName>>
  liturgicalChantEnhancements: OrderedMap<number, Record<SelectOption>>
  liturgicalChantGroups: OrderedMap<number, Record<NumIdName>>
  liturgicalChants: StrMap<Record<LiturgicalChant>>
  magicalDances: StrMap<Record<MagicalDance>>
  magicalMelodies: StrMap<Record<MagicalMelody>>
  magicalTraditions: StrMap<Record<MagicalTradition>>
  optionalRules: StrMap<Record<OptionalRule>>
  pacts: OrderedMap<number, Record<PactCategory>>
  professions: StrMap<Record<Profession>>
  professionVariants: StrMap<Record<ProfessionVariant>>
  properties: OrderedMap<number, Record<NumIdName>>
  races: StrMap<Record<Race>>
  raceVariants: StrMap<Record<RaceVariant>>
  reaches: OrderedMap<number, Record<NumIdName>>
  rogueSpells: StrMap<Record<RogueSpell>>
  skillGroups: OrderedMap<number, Record<SkillGroup>>
  skills: StrMap<Record<Skill>>
  socialStatuses: OrderedMap<number, Record<NumIdName>>
  specialAbilities: StrMap<Record<SpecialAbility>>
  specialAbilityGroups: OrderedMap<number, Record<NumIdName>>
  spellEnhancements: OrderedMap<number, Record<SelectOption>>
  spellGroups: OrderedMap<number, Record<NumIdName>>
  spells: StrMap<Record<Spell>>
  states: StrMap<Record<State>>
  subjects: OrderedMap<number, Record<NumIdName>>
  tribes: OrderedMap<number, Record<NumIdName>>
  ui: Record<L10n>
  zibiljaRituals: StrMap<Record<ZibiljaRitual>>
}

export const StaticData: RecordCreator<StaticData> =
  fromDefault ("StaticData")
              <StaticData> ({
                advantages: OrderedMap.empty,
                animistForces: OrderedMap.empty,
                arcaneBardTraditions: OrderedMap.empty,
                arcaneDancerTraditions: OrderedMap.empty,
                armorTypes: OrderedMap.empty,
                aspects: OrderedMap.empty,
                attributes: OrderedMap.empty,
                blessedTraditions: OrderedMap.empty,
                blessings: OrderedMap.empty,
                books: OrderedMap.empty,
                brews: OrderedMap.empty,
                cantrips: OrderedMap.empty,
                combatSpecialAbilityGroups: OrderedMap.empty,
                combatTechniqueGroups: OrderedMap.empty,
                combatTechniques: OrderedMap.empty,
                conditions: OrderedMap.empty,
                cultures: OrderedMap.empty,
                curses: OrderedMap.empty,
                derivedCharacteristics: OrderedMap.empty,
                disadvantages: OrderedMap.empty,
                dominationRituals: OrderedMap.empty,
                elvenMagicalSongs: OrderedMap.empty,
                itemTemplates: OrderedMap.empty,
                equipmentGroups: OrderedMap.empty,
                equipmentPackages: OrderedMap.empty,
                experienceLevels: OrderedMap.empty,
                eyeColors: OrderedMap.empty,
                focusRules: OrderedMap.empty,
                geodeRituals: OrderedMap.empty,
                hairColors: OrderedMap.empty,
                liturgicalChantEnhancements: OrderedMap.empty,
                liturgicalChantGroups: OrderedMap.empty,
                liturgicalChants: OrderedMap.empty,
                magicalDances: OrderedMap.empty,
                magicalMelodies: OrderedMap.empty,
                magicalTraditions: OrderedMap.empty,
                optionalRules: OrderedMap.empty,
                pacts: OrderedMap.empty,
                professions: OrderedMap.empty,
                professionVariants: OrderedMap.empty,
                properties: OrderedMap.empty,
                races: OrderedMap.empty,
                raceVariants: OrderedMap.empty,
                reaches: OrderedMap.empty,
                rogueSpells: OrderedMap.empty,
                skillGroups: OrderedMap.empty,
                skills: OrderedMap.empty,
                socialStatuses: OrderedMap.empty,
                specialAbilities: OrderedMap.empty,
                specialAbilityGroups: OrderedMap.empty,
                spellEnhancements: OrderedMap.empty,
                spellGroups: OrderedMap.empty,
                spells: OrderedMap.empty,
                states: OrderedMap.empty,
                subjects: OrderedMap.empty,
                tribes: OrderedMap.empty,
                ui: L10n.default,
                zibiljaRituals: OrderedMap.empty,
              })

export const StaticDataL = makeLenses (StaticData)
