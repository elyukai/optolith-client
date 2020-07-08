import { List, NonEmptyList } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { V } from "../../Utilities/Variant"
import { Item } from "../Hero/Item"
import { OverridePrerequisite } from "../Prerequisites.gen"
import { CultureCombined } from "../View/CultureCombined"
import { ProfessionCombined } from "../View/ProfessionCombined"
import { RaceCombined } from "../View/RaceCombined"
import { Advantage } from "./Advantage"
import { Attribute } from "./Attribute"
import { Blessing } from "./Blessing"
import { Cantrip } from "./Cantrip"
import { CombatTechnique } from "./CombatTechnique"
import { Culture } from "./Culture"
import { Disadvantage } from "./Disadvantage"
import { ItemTemplate } from "./ItemTemplate"
import { LiturgicalChant } from "./LiturgicalChant"
import { ProfessionRequireActivatable, RequireActivatable } from "./prerequisites/ActivatableRequirement"
import { CultureRequirement } from "./prerequisites/CultureRequirement"
import { RequireIncreasable } from "./prerequisites/IncreasableRequirement"
import { PactRequirement } from "./prerequisites/PactRequirement"
import { RequirePrimaryAttribute } from "./prerequisites/PrimaryAttributeRequirement"
import { ProfessionRequireIncreasable } from "./prerequisites/ProfessionRequireIncreasable"
import { RaceRequirement } from "./prerequisites/RaceRequirement"
import { SexRequirement } from "./prerequisites/SexRequirement"
import { SocialPrerequisite } from "./prerequisites/SocialPrerequisite"
import { Profession } from "./Profession"
import { CantripsSelection } from "./professionSelections/CantripsSelection"
import { CombatTechniquesSelection } from "./professionSelections/CombatTechniquesSelection"
import { CursesSelection } from "./professionSelections/CursesSelection"
import { LanguagesScriptsSelection } from "./professionSelections/LanguagesScriptsSelection"
import { VariantCombatTechniquesSelection } from "./professionSelections/RemoveCombatTechniquesSelection"
import { VariantCombatTechniquesSecondSelection } from "./professionSelections/RemoveSecondCombatTechniquesSelection"
import { VariantSpecializationSelection } from "./professionSelections/RemoveSpecializationSelection"
import { CombatTechniquesSecondSelection } from "./professionSelections/SecondCombatTechniquesSelection"
import { SkillsSelection } from "./professionSelections/SkillsSelection"
import { SpecializationSelection } from "./professionSelections/SpecializationSelection"
import { TerrainKnowledgeSelection } from "./professionSelections/TerrainKnowledgeSelection"
import { ProfessionVariant } from "./ProfessionVariant"
import { Race } from "./Race"
import { RaceVariant } from "./RaceVariant"
import { Skill } from "./Skill"
import { SpecialAbility } from "./SpecialAbility"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SelectOption } from "./sub/SelectOption"
import { SourceLink } from "./sub/SourceLink"

export interface WikiEntryByCategory {
  "ADVANTAGES": Advantage
  "ATTRIBUTES": Attribute
  "BLESSINGS": Blessing
  "CANTRIPS": Cantrip
  "COMBAT_TECHNIQUES": CombatTechnique
  "CULTURES": Culture
  "DISADVANTAGES": Disadvantage
  "LITURGIES": LiturgicalChant
  "PROFESSIONS": Profession
  "PROFESSION_VARIANTS": ProfessionVariant
  "RACES": Race
  "RACE_VARIANTS": RaceVariant
  "SPECIAL_ABILITIES": SpecialAbility
  "SPELLS": Spell
  "TALENTS": Skill
}

export interface WikiEntryRecordByCategory {
  "ADVANTAGES": Record<Advantage>
  "ATTRIBUTES": Record<Attribute>
  "BLESSINGS": Record<Blessing>
  "CANTRIPS": Record<Cantrip>
  "COMBAT_TECHNIQUES": Record<CombatTechnique>
  "CULTURES": Record<Culture>
  "DISADVANTAGES": Record<Disadvantage>
  "LITURGIES": Record<LiturgicalChant>
  "PROFESSIONS": Record<Profession>
  "PROFESSION_VARIANTS": Record<ProfessionVariant>
  "RACES": Record<Race>
  "RACE_VARIANTS": Record<RaceVariant>
  "SPECIAL_ABILITIES": Record<SpecialAbility>
  "SPELLS": Record<Spell>
  "TALENTS": Record<Skill>
}

export type EntryWithGroup = V<"CombatTechnique", CombatTechnique>
                           | V<"LiturgicalChant", LiturgicalChant>
                           | V<"SpecialAbility", SpecialAbility>
                           | V<"Spell", Spell>
                           | V<"Skill", Skill>

export type IncreasableEntry = V<"Attribute", Attribute>
                             | V<"Spell", Spell>
                             | V<"LiturgicalChant", LiturgicalChant>
                             | V<"Skill", Skill>
                             | V<"CombatTechnique", CombatTechnique>

export type SkillishEntry = V<"Spell", Spell>
                          | V<"LiturgicalChant", LiturgicalChant>
                          | V<"Skill", Skill>
                          | V<"CombatTechnique", CombatTechnique>

export type ActivatableSkillEntry = V<"Spell", Spell>
                                  | V<"LiturgicalChant", LiturgicalChant>

export type Entry = EntryWithCategory
                  | Record<ItemTemplate>

export type InlineWikiEntry = V<"RaceCombined", RaceCombined>
                            | V<"CultureCombined", CultureCombined>
                            | V<"ProfessionCombined", ProfessionCombined>
                            | V<"Advantage", Advantage>
                            | V<"Disadvantage", Disadvantage>
                            | V<"Skill", Skill>
                            | V<"CombatTechnique", CombatTechnique>
                            | V<"SpecialAbility", SpecialAbility>
                            | V<"Spell", Spell>
                            | V<"Cantrip", Cantrip>
                            | V<"LiturgicalChant", LiturgicalChant>
                            | V<"Blessing", Blessing>
                            | V<"Item", Item>
                            | V<"ItemTemplate", ItemTemplate>

export type EntryWithCategory = V<"Race", Race>
                              | V<"RaceVariant", RaceVariant>
                              | V<"Culture", Culture>
                              | V<"Profession", Profession>
                              | V<"ProfessionVariant", ProfessionVariant>
                              | V<"Attribute", Attribute>
                              | V<"Advantage", Advantage>
                              | V<"Disadvantage", Disadvantage>
                              | V<"Skill", Skill>
                              | V<"CombatTechnique", CombatTechnique>
                              | V<"SpecialAbility", SpecialAbility>
                              | V<"Spell", Spell>
                              | V<"Cantrip", Cantrip>
                              | V<"LiturgicalChant", LiturgicalChant>
                              | V<"Blessing", Blessing>

export enum ProfessionSelectionIds {
  SPECIALIZATION = "SPECIALISATION",
  LANGUAGES_SCRIPTS = "LANGUAGES_SCRIPTS",
  COMBAT_TECHNIQUES = "COMBAT_TECHNIQUES",
  COMBAT_TECHNIQUES_SECOND = "COMBAT_TECHNIQUES_SECOND",
  CANTRIPS = "CANTRIPS",
  CURSES = "CURSES",
  SKILLS = "SKILLS",
  SPECIAL_ABILITY = "SPECIAL_ABILITY",
  TERRAIN_KNOWLEDGE = "TERRAIN_KNOWLEDGE",
  GUILD_MAGE_UNFAMILIAR_SPELL = "GUILD_MAGE_UNFAMILIAR_SPELL",
}

export type AnyProfessionSelection = V<"SpecializationSelection", SpecializationSelection>
                                   | V<"LanguagesScriptsSelection", LanguagesScriptsSelection>
                                   | V<"CombatTechniquesSelection", CombatTechniquesSelection>
                                   | V<
                                       "CombatTechniquesSecondSelection",
                                       CombatTechniquesSecondSelection
                                     >
                                   | V<"CantripsSelection", CantripsSelection>
                                   | V<"CursesSelection", CursesSelection>
                                   | V<"SkillsSelection", SkillsSelection>
                                   | V<"TerrainKnowledgeSelection", TerrainKnowledgeSelection>

export type AnyProfessionVariantSelection = VariantSpecializationSelection
                                          | Record<LanguagesScriptsSelection>
                                          | VariantCombatTechniquesSelection
                                          | VariantCombatTechniquesSecondSelection
                                          | Record<CantripsSelection>
                                          | Record<CursesSelection>
                                          | Record<SkillsSelection>
                                          | Record<TerrainKnowledgeSelection>

export type AllRequirements = "RCP"
                            | AllRequirementObjects

export type ActivatablePrerequisites = List<AllRequirements>

export type LevelAwarePrerequisites = ActivatablePrerequisites
                                    | OrderedMap<number, ActivatablePrerequisites>

type Prerequisites_tIndex = Readonly<{
  sex?: OverridePrerequisite
  race?: OverridePrerequisite
  culture?: OverridePrerequisite
  pact?: OverridePrerequisite
  social?: OverridePrerequisite
  primaryAttribute?: OverridePrerequisite
  activatable: OrderedMap<number, OverridePrerequisite>
  activatableMultiEntry: OrderedMap<number, OverridePrerequisite>
  activatableMultiSelect: OrderedMap<number, OverridePrerequisite>
  increasable: OrderedMap<number, OverridePrerequisite>
  increasableMultiEntry: OrderedMap<number, OverridePrerequisite>
}>


export type PrerequisitesIndex = Readonly<Prerequisites_tIndex & {
  levels: OrderedMap<number, Prerequisites_tIndex>
}>

export interface ActivatableBase {
  id: string
  name: string
  cost: Maybe<number | List<number>>
  input: Maybe<string>
  max: Maybe<number>
  prerequisites: LevelAwarePrerequisites
  prerequisitesText: Maybe<string>

  /**
   * 0-based index as key!
   */
  prerequisitesTextIndex: PrerequisitesIndex
  prerequisitesTextStart: Maybe<string>
  prerequisitesTextEnd: Maybe<string>
  tiers: Maybe<number>
  select: Maybe<List<Record<SelectOption>>>
  gr: number
  category: Category
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export interface AdvantageDisadvantageBase extends ActivatableBase {
  rules: string
  range: Maybe<string>
  actions: Maybe<string>
  apValue: Maybe<string>
  apValueAppend: Maybe<string>
}

export type CheckModifier = "SPI" | "TOU" | "SPI/2" | "SPI/TOU"

export interface SkillExtension extends SelectOption {
  target: Just<string>
  tier: Just<1 | 2 | 3>
  effect: string
}

export type Activatable = V<"Advantage", Advantage>
                        | V<"Disadvantage", Disadvantage>
                        | V<"SpecialAbility", SpecialAbility>

export type EntryWithCheck = V<"Spell", Spell>
                           | V<"LiturgicalChant", LiturgicalChant>
                           | V<"Skill", Skill>

export type Skillish = V<"Spell", Spell>
                     | V<"LiturgicalChant", LiturgicalChant>
                     | V<"Skill", Skill>
                     | V<"CombatTechnique", CombatTechnique>

export type SID = string | number | NonEmptyList<number>

export interface ValueOptionalDependency {

  /**
   * The skill/spell/chant rating or rather attribute value.
   */
  value: number

  /**
   * The entry that created this dependency.
   */
  origin: string
}

export interface ActiveDependency {
  active: Maybe<boolean>
  sid: Maybe<SID>
  sid2: Maybe<string | number>
  tier: Maybe<number>
}

export interface ActiveOptionalDependency extends ActiveDependency {
  origin: string
}

export type ProfessionDependency = V<"SexRequirement", SexRequirement>
                                 | V<"RaceRequirement", RaceRequirement>
                                 | V<"CultureRequirement", CultureRequirement>

export type ProfessionPrerequisite = V<"ProfessionRequireActivatable", ProfessionRequireActivatable>
                                   | V<"ProfessionRequireIncreasable", ProfessionRequireIncreasable>

export type AbilityRequirement = V<"RequireActivatable", RequireActivatable>
                               | V<"RequireIncreasable", RequireIncreasable>

export type DependentPrerequisite = V<"RequireActivatable", RequireActivatable>
                                  | V<"RequireIncreasable", RequireIncreasable>
                                  | V<"RequirePrimaryAttribute", RequirePrimaryAttribute>

export type PrerequisitesWithIds = V<"RequireActivatable", RequireActivatable>
                                 | V<"RequireIncreasable", RequireIncreasable>
                                 | V<"RequirePrimaryAttribute", RequirePrimaryAttribute>
                                 | V<"SexRequirement", SexRequirement>
                                 | V<"RaceRequirement", RaceRequirement>
                                 | V<"CultureRequirement", CultureRequirement>
                                 | V<"PactRequirement", PactRequirement>

export type AllRequirementObjects = V<"RequireActivatable", RequireActivatable>
                                  | V<"RequireIncreasable", RequireIncreasable>
                                  | V<"RequirePrimaryAttribute", RequirePrimaryAttribute>
                                  | V<"SexRequirement", SexRequirement>
                                  | V<"RaceRequirement", RaceRequirement>
                                  | V<"CultureRequirement", CultureRequirement>
                                  | V<"PactRequirement", PactRequirement>
                                  | V<"SocialPrerequisite", SocialPrerequisite>
