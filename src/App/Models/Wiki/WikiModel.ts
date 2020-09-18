import { DerivedCharacteristicId } from "../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { OrderedMap } from "../../../Data/OrderedMap"
import { fromDefault, makeLenses, Record, RecordCreator } from "../../../Data/Record"
import { NumIdName } from "../NumIdName"
import { Advantage } from "./Advantage"
import { AnimistForce } from "./AnimistForce"
import { ArcaneBardTradition } from "./ArcaneBardTradition"
import { ArcaneDancerTradition } from "./ArcaneDancerTradition"
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
  advantages: OrderedMap<string, Record<Advantage>>
  animistForces: OrderedMap<string, Record<AnimistForce>>
  arcaneBardTraditions: OrderedMap<number, Record<ArcaneBardTradition>>
  arcaneDancerTraditions: OrderedMap<number, Record<ArcaneDancerTradition>>
  armorTypes: OrderedMap<number, Record<NumIdName>>
  aspects: OrderedMap<number, Record<NumIdName>>
  attributes: OrderedMap<string, Record<Attribute>>
  blessedTraditions: OrderedMap<string, Record<BlessedTradition>>
  blessings: OrderedMap<string, Record<Blessing>>
  books: OrderedMap<string, Record<Book>>
  brews: OrderedMap<number, Record<NumIdName>>
  cantrips: OrderedMap<string, Record<Cantrip>>
  combatSpecialAbilityGroups: OrderedMap<number, Record<NumIdName>>
  combatTechniqueGroups: OrderedMap<number, Record<NumIdName>>
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  conditions: OrderedMap<string, Record<Condition>>
  cultures: OrderedMap<string, Record<Culture>>
  curses: OrderedMap<string, Record<Curse>>
  derivedCharacteristics: OrderedMap<DerivedCharacteristicId, Record<DerivedCharacteristic>>
  disadvantages: OrderedMap<string, Record<Disadvantage>>
  dominationRituals: OrderedMap<string, Record<DominationRitual>>
  elvenMagicalSongs: OrderedMap<string, Record<ElvenMagicalSong>>
  itemTemplates: OrderedMap<string, Record<ItemTemplate>>
  equipmentGroups: OrderedMap<number, Record<NumIdName>>
  equipmentPackages: OrderedMap<string, Record<EquipmentPackage>>
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>
  eyeColors: OrderedMap<number, Record<NumIdName>>
  focusRules: OrderedMap<string, Record<FocusRule>>
  geodeRituals: OrderedMap<string, Record<GeodeRitual>>
  hairColors: OrderedMap<number, Record<NumIdName>>
  liturgicalChantEnhancements: OrderedMap<number, Record<SelectOption>>
  liturgicalChantGroups: OrderedMap<number, Record<NumIdName>>
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>
  magicalDances: OrderedMap<string, Record<MagicalDance>>
  magicalMelodies: OrderedMap<string, Record<MagicalMelody>>
  magicalTraditions: OrderedMap<string, Record<MagicalTradition>>
  optionalRules: OrderedMap<string, Record<OptionalRule>>
  pacts: OrderedMap<number, Record<PactCategory>>
  professions: OrderedMap<string, Record<Profession>>
  professionVariants: OrderedMap<string, Record<ProfessionVariant>>
  properties: OrderedMap<number, Record<NumIdName>>
  races: OrderedMap<string, Record<Race>>
  raceVariants: OrderedMap<string, Record<RaceVariant>>
  reaches: OrderedMap<number, Record<NumIdName>>
  rogueSpells: OrderedMap<string, Record<RogueSpell>>
  skillGroups: OrderedMap<number, Record<SkillGroup>>
  skills: OrderedMap<string, Record<Skill>>
  socialStatuses: OrderedMap<number, Record<NumIdName>>
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
  specialAbilityGroups: OrderedMap<number, Record<NumIdName>>
  spellEnhancements: OrderedMap<number, Record<SelectOption>>
  spellGroups: OrderedMap<number, Record<NumIdName>>
  spells: OrderedMap<string, Record<Spell>>
  states: OrderedMap<string, Record<State>>
  subjects: OrderedMap<number, Record<NumIdName>>
  tribes: OrderedMap<number, Record<NumIdName>>
  ui: Record<L10n>
  zibiljaRituals: OrderedMap<string, Record<ZibiljaRitual>>
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
