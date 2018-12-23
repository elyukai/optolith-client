import { Categories } from '../constants/Categories';
import { List } from '../utils/structures/List';
import { Just, Maybe } from '../utils/structures/Maybe';
import { OrderedMap } from '../utils/structures/OrderedMap';
import { Pair } from '../utils/structures/Pair';
import { Record } from '../utils/structures/Record';
import { Sex } from './data';

export type WikiRecord = Record<WikiAll>;

export interface WikiAll {
  books: OrderedMap<string, Record<Book>>;
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>;
  races: OrderedMap<string, Record<Race>>;
  raceVariants: OrderedMap<string, Record<RaceVariant>>;
  cultures: OrderedMap<string, Record<Culture>>;
  professions: OrderedMap<string, Record<Profession>>;
  professionVariants: OrderedMap<string, Record<ProfessionVariant>>;
  attributes: OrderedMap<string, Record<Attribute>>;
  advantages: OrderedMap<string, Record<Advantage>>;
  disadvantages: OrderedMap<string, Record<Disadvantage>>;
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>;
  skills: OrderedMap<string, Record<Skill>>;
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>;
  spells: OrderedMap<string, Record<Spell>>;
  cantrips: OrderedMap<string, Record<Cantrip>>;
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>;
  blessings: OrderedMap<string, Record<Blessing>>;
  itemTemplates: OrderedMap<string, Record<ItemTemplate>>;
}

export interface WikiEntryByCategory {
  'ADVANTAGES': Advantage;
  'ATTRIBUTES': Attribute;
  'BLESSINGS': Blessing;
  'CANTRIPS': Cantrip;
  'COMBAT_TECHNIQUES': CombatTechnique;
  'CULTURES': Culture;
  'DISADVANTAGES': Disadvantage;
  'LITURGIES': LiturgicalChant;
  'PROFESSIONS': Profession;
  'PROFESSION_VARIANTS': ProfessionVariant;
  'RACES': Race;
  'RACE_VARIANTS': RaceVariant;
  'SPECIAL_ABILITIES': SpecialAbility;
  'SPELLS': Spell;
  'TALENTS': Skill;
}

export interface WikiEntryRecordByCategory {
  'ADVANTAGES': Record<Advantage>;
  'ATTRIBUTES': Record<Attribute>;
  'BLESSINGS': Record<Blessing>;
  'CANTRIPS': Record<Cantrip>;
  'COMBAT_TECHNIQUES': Record<CombatTechnique>;
  'CULTURES': Record<Culture>;
  'DISADVANTAGES': Record<Disadvantage>;
  'LITURGIES': Record<LiturgicalChant>;
  'PROFESSIONS': Record<Profession>;
  'PROFESSION_VARIANTS': Record<ProfessionVariant>;
  'RACES': Record<Race>;
  'RACE_VARIANTS': Record<RaceVariant>;
  'SPECIAL_ABILITIES': Record<SpecialAbility>;
  'SPELLS': Record<Spell>;
  'TALENTS': Record<Skill>;
}

export type EntryWithGroup =
  Record<CombatTechnique> |
  Record<LiturgicalChant> |
  Record<SpecialAbility> |
  Record<Spell> |
  Record<Skill>;

export type WikiActivatable =
  Record<Advantage> |
  Record<Disadvantage> |
  Record<SpecialAbility>;

export type IncreasableEntry =
  Record<Attribute> |
  Record<Spell> |
  Record<LiturgicalChant> |
  Record<Skill> |
  Record<CombatTechnique>;

export type SkillishEntry =
  Record<Spell> |
  Record<LiturgicalChant> |
  Record<Skill> |
  Record<CombatTechnique>;

export type Entry =
  Record<Race> |
  Record<RaceVariant> |
  Record<Culture> |
  Record<Profession> |
  Record<ProfessionVariant> |
  Record<Attribute> |
  Record<Advantage> |
  Record<Disadvantage> |
  Record<Skill> |
  Record<CombatTechnique> |
  Record<SpecialAbility> |
  Record<Spell> |
  Record<Cantrip> |
  Record<LiturgicalChant> |
  Record<Blessing> |
  Record<ItemTemplate>;

export type EntryWithCategory =
  Record<Race> |
  Record<RaceVariant> |
  Record<Culture> |
  Record<Profession> |
  Record<ProfessionVariant> |
  Record<Attribute> |
  Record<Advantage> |
  Record<Disadvantage> |
  Record<Skill> |
  Record<CombatTechnique> |
  Record<SpecialAbility> |
  Record<Spell> |
  Record<Cantrip> |
  Record<LiturgicalChant> |
  Record<Blessing>;

export interface Book {
  id: string;
  short: string;
  name: string;
}

export interface SourceLink {
  id: string;
  page: number;
}

export interface ExperienceLevel {
  id: string;
  name: string;
  ap: number;
  maxAttributeValue: number;
  maxSkillRating: number;
  maxCombatTechniqueRating: number;
  maxTotalAttributeValues: number;
  maxSpellsLiturgies: number;
  maxUnfamiliarSpells: number;
}

export interface Race {
  id: string;
  name: string;
  ap: number;
  lp: number;
  spi: number;
  tou: number;
  mov: number;
  attributeAdjustments: List<Pair<string, number>>;
  attributeAdjustmentsSelection: Pair<number, List<string>>;
  attributeAdjustmentsText: string;
  commonCultures: List<string>;
  automaticAdvantages: List<string>;
  automaticAdvantagesText: string;
  stronglyRecommendedAdvantages: List<string>;
  stronglyRecommendedAdvantagesText: string;
  stronglyRecommendedDisadvantages: List<string>;
  stronglyRecommendedDisadvantagesText: string;
  commonAdvantages: List<string>;
  commonAdvantagesText: Maybe<string>;
  commonDisadvantages: List<string>;
  commonDisadvantagesText: Maybe<string>;
  uncommonAdvantages: List<string>;
  uncommonAdvantagesText: Maybe<string>;
  uncommonDisadvantages: List<string>;
  uncommonDisadvantagesText: Maybe<string>;
  hairColors: Maybe<List<number>>;
  eyeColors: Maybe<List<number>>;
  sizeBase: Maybe<number>;
  sizeRandom: Maybe<List<Record<Die>>>;
  weightBase: number;
  weightRandom: List<Record<Die>>;
  variants: List<string>;
  category: Categories.RACES;
  src: List<Record<SourceLink>>;
}

export interface Die {
  sides: number;
  amount: number;
}

export interface RaceVariant {
  id: string;
  name: string;
  commonCultures: List<string>;
  commonAdvantages: List<string>;
  commonAdvantagesText: Maybe<string>;
  commonDisadvantages: List<string>;
  commonDisadvantagesText: Maybe<string>;
  uncommonAdvantages: List<string>;
  uncommonAdvantagesText: Maybe<string>;
  uncommonDisadvantages: List<string>;
  uncommonDisadvantagesText: Maybe<string>;
  hairColors: Maybe<List<number>>;
  eyeColors: Maybe<List<number>>;
  sizeBase: Maybe<number>;
  sizeRandom: Maybe<List<Record<Die>>>;
  category: Categories.RACE_VARIANTS;
}

export interface Culture {
  id: string;
  name: string;
  culturalPackageAdventurePoints: number;
  languages: List<number>;
  scripts: List<number>;
  socialStatus: List<number>;
  areaKnowledge: string;
  areaKnowledgeShort: string;
  commonProfessions: List<CommonProfession>;
  commonMundaneProfessions: Maybe<string>;
  commonMagicProfessions: Maybe<string>;
  commonBlessedProfessions: Maybe<string>;
  commonAdvantages: List<string>;
  commonAdvantagesText: Maybe<string>;
  commonDisadvantages: List<string>;
  commonDisadvantagesText: Maybe<string>;
  uncommonAdvantages: List<string>;
  uncommonAdvantagesText: Maybe<string>;
  uncommonDisadvantages: List<string>;
  uncommonDisadvantagesText: Maybe<string>;
  commonSkills: List<string>;
  uncommonSkills: List<string>;
  /**
   * Markdown supported.
   */
  commonNames: string;
  culturalPackageSkills: List<Record<IncreaseSkill>>;
  category: Categories.CULTURES;
  src: List<Record<SourceLink>>;
}

export type CommonProfession = boolean | Record<CommonProfessionObject>;

export interface CommonProfessionObject {
  list: List<string | number>;
  reverse: boolean;
}

export interface SpecializationSelection {
  id: ProfessionSelectionIds.SPECIALIZATION;
  sid: string | List<string>;
}

export interface RemoveSpecializationSelection {
  id: ProfessionSelectionIds.SPECIALIZATION;
  active: false;
}

export type VariantSpecializationSelection =
  Record<SpecializationSelection> |
  Record<RemoveSpecializationSelection>;

export interface LanguagesScriptsSelection {
  id: ProfessionSelectionIds.LANGUAGES_SCRIPTS;
  value: number;
}

export interface CombatTechniquesSelection {
  id: ProfessionSelectionIds.COMBAT_TECHNIQUES;
  amount: number;
  value: number;
  sid: List<string>;
}

export interface RemoveCombatTechniquesSelection {
  id: ProfessionSelectionIds.COMBAT_TECHNIQUES;
  active: false;
}

export type VariantCombatTechniquesSelection =
  Record<CombatTechniquesSelection> |
  Record<RemoveCombatTechniquesSelection>;

export interface CombatTechniquesSecondSelection {
  id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;
  amount: number;
  value: number;
  sid: List<string>;
}

export interface RemoveCombatTechniquesSecondSelection {
  id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;
  active: false;
}

export type VariantCombatTechniquesSecondSelection =
  Record<CombatTechniquesSecondSelection> |
  Record<RemoveCombatTechniquesSecondSelection>;

export interface CantripsSelection {
  id: ProfessionSelectionIds.CANTRIPS;
  amount: number;
  sid: List<string>;
}

export interface CursesSelection {
  id: ProfessionSelectionIds.CURSES;
  value: number;
}

export interface SkillsSelection {
  id: ProfessionSelectionIds.SKILLS;
  /**
   * If specified, only choose from skills of the specified group.
   */
  gr: Maybe<number>;
  /**
   * The AP value the user can spend.
   */
  value: number;
}

export interface TerrainKnowledgeSelection {
  id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE;
  sid: List<number>;
}

export enum ProfessionSelectionIds {
  SPECIALIZATION = 'SPECIALISATION',
  LANGUAGES_SCRIPTS = 'LANGUAGES_SCRIPTS',
  COMBAT_TECHNIQUES = 'COMBAT_TECHNIQUES',
  COMBAT_TECHNIQUES_SECOND = 'COMBAT_TECHNIQUES_SECOND',
  CANTRIPS = 'CANTRIPS',
  CURSES = 'CURSES',
  SKILLS = 'SKILLS',
  TERRAIN_KNOWLEDGE = 'TERRAIN_KNOWLEDGE',
}

export interface ProfessionAdjustmentSelections {
  [ProfessionSelectionIds.CANTRIPS]?: Record<CantripsSelection>;
  [ProfessionSelectionIds.COMBAT_TECHNIQUES]?: VariantCombatTechniquesSelection;
  [ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND]?: VariantCombatTechniquesSecondSelection;
  [ProfessionSelectionIds.CURSES]?: Record<CursesSelection>;
  [ProfessionSelectionIds.LANGUAGES_SCRIPTS]?: Record<LanguagesScriptsSelection>;
  [ProfessionSelectionIds.SPECIALIZATION]?: VariantSpecializationSelection;
  [ProfessionSelectionIds.SKILLS]?: Record<SkillsSelection>;
  [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]?: Record<TerrainKnowledgeSelection>;
}

export type ProfessionSelection =
  Record<SpecializationSelection> |
  Record<LanguagesScriptsSelection> |
  Record<CombatTechniquesSelection> |
  Record<CombatTechniquesSecondSelection> |
  Record<CantripsSelection> |
  Record<CursesSelection> |
  Record<SkillsSelection> |
  Record<TerrainKnowledgeSelection>;

export type ProfessionVariantSelection =
  VariantSpecializationSelection |
  Record<LanguagesScriptsSelection> |
  VariantCombatTechniquesSelection |
  VariantCombatTechniquesSecondSelection |
  Record<CantripsSelection> |
  Record<CursesSelection> |
  Record<SkillsSelection> |
  Record<TerrainKnowledgeSelection>;

export type ProfessionSelections =
  List<ProfessionSelection>;

export type ProfessionVariantSelections =
  List<ProfessionVariantSelection>;

export interface NameBySex {
  m: string;
  f: string;
}

export interface Profession {
  id: string;
  name: string | Record<NameBySex>;
  subname: Maybe<string | Record<NameBySex>>;
  ap: number;
  apOfActivatables: number;
  dependencies: List<ProfessionDependency>;
  prerequisites: List<ProfessionPrerequisite>;
  prerequisitesStart: Maybe<string>;
  prerequisitesEnd: Maybe<string>;
  selections: ProfessionSelections;
  specialAbilities: List<Record<ProfessionRequiresActivatableObject>>;
  combatTechniques: List<Record<IncreaseSkill>>;
  skills: List<Record<IncreaseSkill>>;
  spells: List<Record<IncreaseSkill>>;
  liturgicalChants: List<Record<IncreaseSkill>>;
  blessings: List<string>;
  suggestedAdvantages: List<string>;
  suggestedAdvantagesText: Maybe<string>;
  suggestedDisadvantages: List<string>;
  suggestedDisadvantagesText: Maybe<string>;
  unsuitableAdvantages: List<string>;
  unsuitableAdvantagesText: Maybe<string>;
  unsuitableDisadvantages: List<string>;
  unsuitableDisadvantagesText: Maybe<string>;
  isVariantRequired: boolean;
  variants: List<string>;
  category: Categories.PROFESSIONS;
  gr: number;
  /**
   * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the
   * Twelve Gods" or "Fighter".
   */
  subgr: number;
  src: List<Record<SourceLink>>;
}

export interface ProfessionVariant {
  id: string;
  name: string | Record<NameBySex>;
  ap: number;
  apOfActivatables: number;
  dependencies: List<ProfessionDependency>;
  prerequisites: List<ProfessionPrerequisite>;
  selections: ProfessionVariantSelections;
  specialAbilities: List<Record<ProfessionRequiresActivatableObject>>;
  combatTechniques: List<Record<IncreaseSkill>>;
  skills: List<Record<IncreaseSkill>>;
  spells: List<Record<IncreaseSkill>>;
  liturgicalChants: List<Record<IncreaseSkill>>;
  blessings: List<string>;
  precedingText: Maybe<string>;
  fullText: Maybe<string>;
  concludingText: Maybe<string>;
  category: Categories.PROFESSION_VARIANTS;
}

export interface IncreaseSkill {
  id: string;
  value: number;
}

export interface SelectionObject {
  id: string | number;
  name: string;
  cost: Maybe<number>;
  // req: Maybe<List<AllRequirementObjects>>;
  prerequisites: Maybe<List<AllRequirementObjects>>;
  target: Maybe<string>;
  tier: Maybe<number>;
  spec: Maybe<List<string>>;
  specInput: Maybe<string>;
  applications: Maybe<List<Record<Application>>>;
  applicationsInput: Maybe<string>;
  talent: Maybe<Pair<string, number>>;
  gr: Maybe<number>;
}

export type AllRequirements = 'RCP' | AllRequirementObjects;
export type ActivatablePrerequisites = List<AllRequirements>;

export type LevelAwarePrerequisites =
  ActivatablePrerequisites |
  OrderedMap<number, ActivatablePrerequisites>;

interface ActivatableBase {
  id: string;
  name: string;
  cost: string | number | List<number>;
  input: Maybe<string>;
  max: Maybe<number>;
  prerequisites: LevelAwarePrerequisites;
  prerequisitesText: Maybe<string>;
  /**
   * 0-based index as key!
   */
  prerequisitesTextIndex: OrderedMap<number, string | false>;
  prerequisitesTextStart: Maybe<string>;
  prerequisitesTextEnd: Maybe<string>;
  tiers: Maybe<number>;
  select: Maybe<List<Record<SelectionObject>>>;
  gr: number;
  src: List<Record<SourceLink>>;
}

interface AdvantageDisadvantageBase extends ActivatableBase {
  rules: string;
  range: Maybe<string>;
  actions: Maybe<string>;
  apValue: Maybe<string>;
  apValueAppend: Maybe<string>;
}

export interface Advantage extends AdvantageDisadvantageBase {
  category: Categories.ADVANTAGES;
}

export interface Disadvantage extends AdvantageDisadvantageBase {
  category: Categories.DISADVANTAGES;
}

export interface SpecialAbility extends ActivatableBase {
  category: Categories.SPECIAL_ABILITIES;
  extended: Maybe<List<string | List<string>>>;
  nameInWiki: Maybe<string>;
  subgr: Maybe<number>;
  combatTechniques: Maybe<string>;
  rules: Maybe<string>;
  effect: Maybe<string>;
  volume: Maybe<string>;
  penalty: Maybe<string>;
  aeCost: Maybe<string>;
  protectiveCircle: Maybe<string>;
  wardingCircle: Maybe<string>;
  bindingCost: Maybe<string>;
  property: Maybe<number | string>;
  aspect: Maybe<number | string>;
  apValue: Maybe<string>;
  apValueAppend: Maybe<string>;
}

export interface Attribute {
  id: string;
  name: string;
  category: Categories.ATTRIBUTES;
  short: string;
}

export interface CombatTechnique {
  id: string;
  name: string;
  category: Categories.COMBAT_TECHNIQUES;
  gr: number;
  ic: number;
  bf: number;
  primary: List<string>;
  special: Maybe<string>;
  src: List<Record<SourceLink>>;
}

export type CheckModifier = 'SPI' | 'TOU';

export interface LiturgicalChant {
  id: string;
  name: string;
  aspects: List<number>;
  category: Categories.LITURGIES;
  check: List<string>;
  checkmod: Maybe<CheckModifier>;
  gr: number;
  ic: number;
  tradition: List<number>;
  effect: string;
  castingTime: string;
  castingTimeShort: string;
  cost: string;
  costShort: string;
  range: string;
  rangeShort: string;
  duration: string;
  durationShort: string;
  target: string;
  src: List<Record<SourceLink>>;
}

export interface Blessing {
  id: string;
  name: string;
  aspects: List<number>;
  tradition: List<number>;
  category: Categories.BLESSINGS;
  effect: string;
  range: string;
  duration: string;
  target: string;
  src: List<Record<SourceLink>>;
}

export interface Spell {
  id: string;
  name: string;
  category: Categories.SPELLS;
  check: List<string>;
  checkmod: Maybe<CheckModifier>;
  gr: number;
  ic: number;
  property: number;
  tradition: List<number>;
  subtradition: List<number>;
  prerequisites: List<AllRequirementObjects>;
  effect: string;
  castingTime: string;
  castingTimeShort: string;
  cost: string;
  costShort: string;
  range: string;
  rangeShort: string;
  duration: string;
  durationShort: string;
  target: string;
  src: List<Record<SourceLink>>;
}

export interface SkillExtension extends SelectionObject {
  target: Just<string>;
  tier: Just<1 | 2 | 3>;
  effect: string;
}

export interface Cantrip {
  id: string;
  name: string;
  property: number;
  tradition: List<number>;
  category: Categories.CANTRIPS;
  effect: string;
  range: string;
  duration: string;
  target: string;
  note: Maybe<string>;
  src: List<Record<SourceLink>>;
}

export interface Skill {
  id: string;
  name: string;
  category: Categories.TALENTS;
  check: List<string>;
  encumbrance: string;
  gr: number;
  ic: number;
  applications: Maybe<List<Record<Application>>>;
  applicationsInput: Maybe<string>;
  tools: Maybe<string>;
  quality: string;
  failed: string;
  critical: string;
  botch: string;
  src: string;
}

export interface Application {
  id: number;
  name: string;
  prerequisites: Maybe<List<AllRequirementObjects>>;
}

export interface ItemTemplate {
  id: string;
  name: string;
  addPenalties: Maybe<boolean>;
  ammunition: Maybe<string>;
  amount: number;
  armorType: Maybe<number>;
  at: Maybe<number>;
  combatTechnique: Maybe<string>;
  damageBonus: Maybe<Record<PrimaryAttributeDamageThreshold>>;
  damageDiceNumber: Maybe<number>;
  damageDiceSides: Maybe<number>;
  damageFlat: Maybe<number>;
  enc: Maybe<number>;
  forArmorZoneOnly: Maybe<boolean>;
  gr: number;
  improvisedWeaponGroup: Maybe<number>;
  iniMod: Maybe<number>;
  isParryingWeapon: Maybe<boolean>;
  isTemplateLocked: boolean;
  isTwoHandedWeapon: Maybe<boolean>;
  length: Maybe<number>;
  loss: Maybe<number>;
  movMod: Maybe<number>;
  pa: Maybe<number>;
  price: Maybe<number>;
  pro: Maybe<number>;
  range: Maybe<List<number>>;
  reach: Maybe<number>;
  reloadTime: Maybe<number>;
  stabilityMod: Maybe<number>;
  stp: Maybe<number>;
  template: string;
  weight: Maybe<number>;
  note: Maybe<string>;
  rules: Maybe<string>;
  advantage: Maybe<string>;
  disadvantage: Maybe<string>;
  src: List<Record<SourceLink>>;
}

export interface PrimaryAttributeDamageThreshold {
  primary: Maybe<string>;
  threshold: number | List<number>;
}

export type Activatable =
  Record<Advantage> |
  Record<Disadvantage> |
  Record<SpecialAbility>;

export type Skillish =
  Record<Spell> |
  Record<LiturgicalChant> |
  Record<Skill> |
  Record<CombatTechnique>;

export type SID = string | number | List<number>;

export interface ValueOptionalDependency {
  /**
   * The skill/spell/chant rating or rather attribute value.
   */
  value: number;
  /**
   * The entry that created this dependency.
   */
  origin: string;
}

export interface ActiveDependency {
  active: Maybe<boolean>;
  sid: Maybe<SID>;
  sid2: Maybe<string | number>;
  tier: Maybe<number>;
}

export interface ActiveOptionalDependency extends ActiveDependency {
  origin: string;
}

export interface RequiresActivatableObject {
  id: string | List<string>;
  active: boolean;
  sid: Maybe<SID>;
  sid2: Maybe<string | number>;
  tier: Maybe<number>;
}

export interface ProfessionRequiresActivatableObject extends RequiresActivatableObject {
  id: string;
  sid: Maybe<string | number>;
}

export interface RequiresIncreasableObject {
  id: string | List<string>;
  value: number;
}

export interface ProfessionRequiresIncreasableObject extends RequiresIncreasableObject {
  id: string;
}

export interface RequiresPrimaryAttribute {
  id: 'ATTR_PRIMARY';
  value: number;
  type: 1 | 2;
}

export interface SexRequirement {
  id: 'SEX';
  value: Sex;
}

export interface RaceRequirement {
  id: 'RACE';
  value: number | List<number>;
}

export interface CultureRequirement {
  id: 'CULTURE';
  value: number | List<number>;
}

export interface PactRequirement {
  id: 'PACT';
  category: number;
  domain: Maybe<number | List<number>>;
  level: Maybe<number>;
}

export type ProfessionDependency =
  Record<SexRequirement> |
  Record<RaceRequirement> |
  Record<CultureRequirement>;

export type ProfessionPrerequisite =
  Record<ProfessionRequiresActivatableObject> |
  Record<ProfessionRequiresIncreasableObject>;

export type AbilityRequirement =
  Record<RequiresActivatableObject> |
  Record<RequiresIncreasableObject>;

export type DependentPrerequisite =
  Record<RequiresActivatableObject> |
  Record<RequiresIncreasableObject> |
  Record<RequiresPrimaryAttribute>;

export type AllRequirementObjects =
  Record<RequiresActivatableObject> |
  Record<RequiresIncreasableObject> |
  Record<RequiresPrimaryAttribute> |
  Record<SexRequirement> |
  Record<RaceRequirement> |
  Record<CultureRequirement> |
  Record<PactRequirement>;
