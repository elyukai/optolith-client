import { Categories } from '../constants/Categories';
import { Just, List, Maybe, ReadMap, Tuple } from '../utils/dataUtils';
import * as Reusable from './reusable.d';
import { AllRequirementTypes } from './reusable.d';

export interface WikiAll {
  readonly books: ReadMap<string, Book>;
  readonly experienceLevels: ReadMap<string, ExperienceLevel>;
  readonly races: ReadMap<string, Race>;
  readonly raceVariants: ReadMap<string, RaceVariant>;
  readonly cultures: ReadMap<string, Culture>;
  readonly professions: ReadMap<string, Profession>;
  readonly professionVariants: ReadMap<string, ProfessionVariant>;
  readonly attributes: ReadMap<string, Attribute>;
  readonly advantages: ReadMap<string, Advantage>;
  readonly disadvantages: ReadMap<string, Disadvantage>;
  readonly specialAbilities: ReadMap<string, SpecialAbility>;
  readonly skills: ReadMap<string, Skill>;
  readonly combatTechniques: ReadMap<string, CombatTechnique>;
  readonly spells: ReadMap<string, Spell>;
  readonly cantrips: ReadMap<string, Cantrip>;
  readonly liturgicalChants: ReadMap<string, LiturgicalChant>;
  readonly blessings: ReadMap<string, Blessing>;
  readonly itemTemplates: ReadMap<string, ItemTemplate>;
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

export type EntryWithGroup =
  CombatTechnique |
  LiturgicalChant |
  SpecialAbility |
  Spell |
  Skill;

export type WikiActivatable =
  Advantage |
  Disadvantage |
  SpecialAbility;

export type SkillishEntry =
  Spell |
  LiturgicalChant |
  Skill |
  CombatTechnique;

export type Entry =
  Race |
  RaceVariant |
  Culture |
  Profession |
  ProfessionVariant |
  Advantage |
  Disadvantage |
  Skill |
  CombatTechnique |
  SpecialAbility |
  Spell |
  Cantrip |
  LiturgicalChant |
  Blessing |
  ItemTemplate;

export type EntryWithCategory =
  Race |
  RaceVariant |
  Culture |
  Profession |
  ProfessionVariant |
  Advantage |
  Disadvantage |
  Skill |
  CombatTechnique |
  SpecialAbility |
  Spell |
  Cantrip |
  LiturgicalChant |
  Blessing;

export interface Book {
  readonly id: string;
  readonly short: string;
  readonly name: string;
}

export interface SourceLink {
  readonly id: string;
  readonly page: number;
}

export interface ExperienceLevel {
  readonly id: string;
  readonly name: string;
  readonly ap: number;
  readonly maxAttributeValue: number;
  readonly maxSkillRating: number;
  readonly maxCombatTechniqueRating: number;
  readonly maxTotalAttributeValues: number;
  readonly maxSpellsLiturgies: number;
  readonly maxUnfamiliarSpells: number;
}

export interface Race {
  readonly id: string;
  readonly name: string;
  readonly ap: number;
  readonly lp: number;
  readonly spi: number;
  readonly tou: number;
  readonly mov: number;
  readonly attributeAdjustments: List<Tuple<number, string>>;
  readonly attributeAdjustmentsSelection: List<Tuple<number, List<string>>>;
  readonly attributeAdjustmentsText: string;
  readonly commonCultures: List<string>;
  readonly automaticAdvantages: List<string>;
  readonly automaticAdvantagesCost: [number, number, number];
  readonly automaticAdvantagesText: string;
  readonly stronglyRecommendedAdvantages: List<string>;
  readonly stronglyRecommendedAdvantagesText: string;
  readonly stronglyRecommendedDisadvantages: List<string>;
  readonly stronglyRecommendedDisadvantagesText: string;
  readonly commonAdvantages: List<string>;
  readonly commonAdvantagesText: Maybe<string>;
  readonly commonDisadvantages: List<string>;
  readonly commonDisadvantagesText: Maybe<string>;
  readonly uncommonAdvantages: List<string>;
  readonly uncommonAdvantagesText: Maybe<string>;
  readonly uncommonDisadvantages: List<string>;
  readonly uncommonDisadvantagesText: Maybe<string>;
  readonly hairColors: Maybe<List<number>>;
  readonly eyeColors: Maybe<List<number>>;
  readonly sizeBase: Maybe<number>;
  readonly sizeRandom: Maybe<List<Die>>;
  readonly weightBase: number;
  readonly weightRandom: List<Die>;
  readonly variants: List<string>;
  readonly category: Categories.RACES;
  readonly src: List<SourceLink>;
}

export interface Die {
  readonly sides: number;
  readonly amount: number;
}

export interface RaceVariant {
  readonly id: string;
  readonly name: string;
  readonly commonCultures: List<string>;
  readonly commonAdvantages: List<string>;
  readonly commonAdvantagesText: Maybe<string>;
  readonly commonDisadvantages: List<string>;
  readonly commonDisadvantagesText: Maybe<string>;
  readonly uncommonAdvantages: List<string>;
  readonly uncommonAdvantagesText: Maybe<string>;
  readonly uncommonDisadvantages: List<string>;
  readonly uncommonDisadvantagesText: Maybe<string>;
  readonly hairColors: Maybe<List<number>>;
  readonly eyeColors: Maybe<List<number>>;
  readonly sizeBase: Maybe<number>;
  readonly sizeRandom: Maybe<List<Die>>;
  readonly category: Categories.RACE_VARIANTS;
}

export interface Culture {
  readonly id: string;
  readonly name: string;
  readonly culturalPackageAdventurePoints: number;
  readonly languages: List<number>;
  readonly scripts: List<number>;
  readonly socialStatus: List<number>;
  readonly areaKnowledge: string;
  readonly areaKnowledgeShort: string;
  readonly commonProfessions: List<CommonProfession>;
  readonly commonMundaneProfessions: Maybe<string>;
  readonly commonMagicProfessions: Maybe<string>;
  readonly commonBlessedProfessions: Maybe<string>;
  readonly commonAdvantages: List<string>;
  readonly commonAdvantagesText: Maybe<string>;
  readonly commonDisadvantages: List<string>;
  readonly commonDisadvantagesText: Maybe<string>;
  readonly uncommonAdvantages: List<string>;
  readonly uncommonAdvantagesText: Maybe<string>;
  readonly uncommonDisadvantages: List<string>;
  readonly uncommonDisadvantagesText: Maybe<string>;
  readonly commonSkills: List<string>;
  readonly uncommonSkills: List<string>;
  readonly culturalPackageSkills: List<IncreaseSkill>;
  readonly category: Categories.CULTURES;
  readonly src: List<SourceLink>;
  /**
   * Markdown supported.
   */
  readonly commonNames: string;
}

export type CommonProfession = boolean | CommonProfessionObject;

export interface CommonProfessionObject {
  readonly list: List<string | number>;
  readonly reverse: boolean;
}

export interface SpecializationSelection {
  readonly id: 'SPECIALISATION';
  readonly sid: string | List<string>;
}

export interface RemoveSpecializationSelection {
  readonly id: 'SPECIALISATION';
  readonly active: boolean;
}

export type VariantSpecializationSelection =
  SpecializationSelection |
  RemoveSpecializationSelection;

export interface LanguagesScriptsSelection {
  readonly id: 'LANGUAGES_SCRIPTS';
  readonly value: number;
}

export interface CombatTechniquesSelection {
  readonly id: 'COMBAT_TECHNIQUES';
  readonly amount: number;
  readonly value: number;
  readonly sid: List<string>;
}

export interface RemoveCombatTechniquesSelection {
  readonly id: 'COMBAT_TECHNIQUES';
  readonly active: boolean;
}

export type VariantCombatTechniquesSelection =
  CombatTechniquesSelection |
  RemoveCombatTechniquesSelection;

export interface CombatTechniquesSecondSelection {
  readonly id: 'COMBAT_TECHNIQUES_SECOND';
  readonly amount: number;
  readonly value: number;
  readonly sid: List<string>;
}

export interface RemoveCombatTechniquesSecondSelection {
  readonly id: 'COMBAT_TECHNIQUES_SECOND';
  readonly active: boolean;
}

export type VariantCombatTechniquesSecondSelection =
  CombatTechniquesSecondSelection |
  RemoveCombatTechniquesSecondSelection;

export interface CantripsSelection {
  readonly id: 'CANTRIPS';
  readonly amount: number;
  readonly sid: List<string>;
}

export interface CursesSelection {
  readonly id: 'CURSES';
  readonly value: number;
}

export interface SkillsSelection {
  readonly id: 'SKILLS';
  /**
   * If specified, only choose from skills of the specified group.
   */
  readonly gr: Maybe<number>;
  /**
   * The AP value the user can spend.
   */
  readonly value: number;
}

export interface TerrainKnowledgeSelection {
  readonly id: 'TERRAIN_KNOWLEDGE';
  readonly sid: List<number>;
}

export enum ProfessionSelectionIds {
  SPECIALISATION = 'SPECIALISATION',
  LANGUAGES_SCRIPTS = 'LANGUAGES_SCRIPTS',
  COMBAT_TECHNIQUES = 'COMBAT_TECHNIQUES',
  COMBAT_TECHNIQUES_SECOND = 'COMBAT_TECHNIQUES_SECOND',
  CANTRIPS = 'CANTRIPS',
  CURSES = 'CURSES',
  SKILLS = 'SKILLS',
}
export type ProfessionSelection =
  SpecializationSelection |
  LanguagesScriptsSelection |
  CombatTechniquesSelection |
  CombatTechniquesSecondSelection |
  CantripsSelection |
  CursesSelection |
  SkillsSelection |
  TerrainKnowledgeSelection;

export type ProfessionVariantSelection =
  VariantSpecializationSelection |
  LanguagesScriptsSelection |
  VariantCombatTechniquesSelection |
  VariantCombatTechniquesSecondSelection |
  CantripsSelection |
  CursesSelection |
  SkillsSelection |
  TerrainKnowledgeSelection;

export type ProfessionSelections = List<ProfessionSelection>;
export type ProfessionVariantSelections = List<ProfessionVariantSelection>;

export interface ProfessionNameForSexes {
  readonly m: string;
  readonly f: string;
}

export interface Profession {
  readonly id: string;
  readonly name: string | ProfessionNameForSexes;
  readonly subname: Maybe<string | ProfessionNameForSexes>;
  readonly ap: number;
  readonly apOfActivatables: number;
  readonly dependencies: List<ProfessionDependencyObject>;
  readonly prerequisites: List<Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject>;
  readonly prerequisitesStart: Maybe<string>;
  readonly prerequisitesEnd: Maybe<string>;
  readonly selections: ProfessionSelections;
  readonly specialAbilities: List<Reusable.ProfessionRequiresActivatableObject>;
  readonly combatTechniques: List<IncreaseSkill>;
  readonly skills: List<IncreaseSkill>;
  readonly spells: List<IncreaseSkill>;
  readonly liturgicalChants: List<IncreaseSkill>;
  readonly blessings: List<string>;
  readonly twelveBlessingsAdd: Maybe<string>;
  readonly suggestedAdvantages: List<string>;
  readonly suggestedAdvantagesText: Maybe<string>;
  readonly suggestedDisadvantages: List<string>;
  readonly suggestedDisadvantagesText: Maybe<string>;
  readonly unsuitableAdvantages: List<string>;
  readonly unsuitableAdvantagesText: Maybe<string>;
  readonly unsuitableDisadvantages: List<string>;
  readonly unsuitableDisadvantagesText: Maybe<string>;
  readonly isVariantRequired: Maybe<boolean>;
  readonly variants: List<string>;
  readonly category: Categories.PROFESSIONS;
  readonly gr: number;
  /**
   * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the Twelve Gods" or "Fighter".
   */
  readonly subgr: number;
  readonly src: List<SourceLink>;
}

export interface ProfessionVariant {
  readonly id: string;
  readonly name: string | ProfessionNameForSexes;
  readonly ap: number;
  readonly apOfActivatables: number;
  readonly dependencies: List<ProfessionDependencyObject>;
  readonly prerequisites: List<Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject>;
  readonly selections: ProfessionVariantSelections;
  readonly specialAbilities: List<Reusable.ProfessionRequiresActivatableObject>;
  readonly combatTechniques: List<IncreaseSkill>;
  readonly skills: List<IncreaseSkill>;
  readonly spells: List<IncreaseSkill>;
  readonly liturgicalChants: List<IncreaseSkill>;
  readonly blessings: List<string>;
  readonly precedingText: Maybe<string>;
  readonly fullText: Maybe<string>;
  readonly concludingText: Maybe<string>;
  readonly category: Categories.PROFESSION_VARIANTS;
}

export interface IncreaseSkill {
  id: string;
  value: number;
}

export interface SelectionObject {
  id: string | number;
  name: string;
  cost: Maybe<number>;
  req: Maybe<List<AllRequirementTypes>>;
  prerequisites: Maybe<List<AllRequirementTypes>>;
  target: Maybe<string>;
  tier: Maybe<number>;
  spec: Maybe<List<string>>;
  specInput: Maybe<string>;
  applications: Maybe<List<Application>>;
  applicationsInput: Maybe<string>;
  talent: Maybe<Tuple<string, number>>;
  gr: Maybe<number>;
}

export type ProfessionDependencyObject =
  Reusable.SexRequirement |
  Reusable.RaceRequirement |
  Reusable.CultureRequirement;

export type AbilityRequirementObject =
  Reusable.RequiresActivatableObject |
  Reusable.RequiresIncreasableObject;

export type AllRequirements = 'RCP' | AllRequirementTypes;
export type ActivatablePrerequisites = List<AllRequirements>;

export type LevelAwarePrerequisites =
  ActivatablePrerequisites |
  ReadMap<number, ActivatablePrerequisites>;

interface ActivatableBase {
  readonly id: string;
  readonly name: string;
  readonly cost: string | number | List<number>;
  readonly input: Maybe<string>;
  readonly max: Maybe<number>;
  readonly prerequisites: LevelAwarePrerequisites;
  readonly prerequisitesText: Maybe<string>;
  /**
   * 0-based index as key!
   */
  readonly prerequisitesTextIndex: ReadMap<number, string | false>;
  readonly prerequisitesTextStart: Maybe<string>;
  readonly prerequisitesTextEnd: Maybe<string>;
  readonly tiers: Maybe<number>;
  readonly select: Maybe<List<SelectionObject>>;
  readonly gr: number;
  readonly src: List<SourceLink>;
}

interface AdvantageDisadvantageBase extends ActivatableBase {
  readonly rules: string;
  readonly range: Maybe<string>;
  readonly actions: Maybe<string>;
  readonly apValue: Maybe<string>;
  readonly apValueAppend: Maybe<string>;
}

export interface Advantage extends AdvantageDisadvantageBase {
  readonly category: Categories.ADVANTAGES;
}

export interface Disadvantage extends AdvantageDisadvantageBase {
  readonly category: Categories.DISADVANTAGES;
}

export interface SpecialAbility extends ActivatableBase {
  readonly category: Categories.SPECIAL_ABILITIES;
  readonly extended: Maybe<List<string | List<string>>>;
  readonly nameInWiki: Maybe<string>;
  readonly subgr: Maybe<number>;
  readonly combatTechniques: Maybe<string>;
  readonly rules: Maybe<string>;
  readonly effect: Maybe<string>;
  readonly volume: Maybe<string>;
  readonly penalty: Maybe<string>;
  readonly aeCost: Maybe<string>;
  readonly protectiveCircle: Maybe<string>;
  readonly wardingCircle: Maybe<string>;
  readonly bindingCost: Maybe<string>;
  readonly property: Maybe<number | string>;
  readonly aspect: Maybe<number | string>;
  readonly apValue: Maybe<string>;
  readonly apValueAppend: Maybe<string>;
}

export interface Attribute {
  readonly id: string;
  readonly name: string;
  readonly category: Categories.ATTRIBUTES;
  readonly short: string;
}

export interface CombatTechnique {
  readonly id: string;
  readonly name: string;
  readonly category: Categories.COMBAT_TECHNIQUES;
  readonly gr: number;
  readonly ic: number;
  readonly bf: number;
  readonly primary: List<string>;
  readonly special: Maybe<string>;
  readonly src: List<SourceLink>;
}

export interface LiturgicalChant {
  readonly id: string;
  readonly name: string;
  readonly aspects: List<number>;
  readonly category: Categories.LITURGIES;
  readonly check: [string, string, string];
  readonly checkmod: Maybe<"SPI" | "TOU">;
  readonly gr: number;
  readonly ic: number;
  readonly tradition: List<number>;
  readonly effect: string;
  readonly castingTime: string;
  readonly castingTimeShort: string;
  readonly cost: string;
  readonly costShort: string;
  readonly range: string;
  readonly rangeShort: string;
  readonly duration: string;
  readonly durationShort: string;
  readonly target: string;
  readonly src: List<SourceLink>;
}

export interface Blessing {
  readonly id: string;
  readonly name: string;
  readonly aspects: List<number>;
  readonly tradition: List<number>;
  readonly prerequisites: List<AllRequirementTypes>;
  readonly category: Categories.BLESSINGS;
  readonly effect: string;
  readonly range: string;
  readonly duration: string;
  readonly target: string;
  readonly src: List<SourceLink>;
}

export interface Spell {
  readonly id: string;
  readonly name: string;
  readonly category: Categories.SPELLS;
  readonly check: [string, string, string];
  readonly checkmod: Maybe<"SPI" | "TOU">;
  readonly gr: number;
  readonly ic: number;
  readonly property: number;
  readonly tradition: List<number>;
  readonly subtradition: List<number>;
  readonly prerequisites: List<AllRequirementTypes>;
  readonly effect: string;
  readonly castingTime: string;
  readonly castingTimeShort: string;
  readonly cost: string;
  readonly costShort: string;
  readonly range: string;
  readonly rangeShort: string;
  readonly duration: string;
  readonly durationShort: string;
  readonly target: string;
  readonly src: List<SourceLink>;
}

export interface SkillExtension extends SelectionObject {
  readonly target: Just<string>;
  readonly tier: Just<1 | 2 | 3>;
  readonly effect: Just<string>;
}

export interface Cantrip {
  readonly id: string;
  readonly name: string;
  readonly property: number;
  readonly tradition: List<number>;
  readonly prerequisites: List<AllRequirementTypes>;
  readonly category: Categories.CANTRIPS;
  readonly effect: string;
  readonly range: string;
  readonly duration: string;
  readonly target: string;
  readonly note: Maybe<string>;
  readonly src: List<SourceLink>;
}

export interface Skill {
  readonly id: string;
  readonly name: string;
  readonly category: Categories.TALENTS;
  readonly check: List<string>;
  readonly encumbrance: string;
  readonly gr: number;
  readonly ic: number;
  readonly applications: Maybe<Application[]>;
  readonly applicationsInput: Maybe<string>;
  readonly tools: Maybe<string>;
  readonly quality: string;
  readonly failed: string;
  readonly critical: string;
  readonly botch: string;
  readonly src: string;
}

export interface Application {
  readonly id: number;
  readonly name: string;
  readonly prerequisites: Maybe<AllRequirementTypes[]>;
}

export interface ItemTemplate {
  readonly id: string;
  readonly name: string;
  readonly addPenalties: Maybe<boolean>;
  readonly ammunition: Maybe<string>;
  readonly amount: Maybe<number>;
  readonly armorType: Maybe<number>;
  readonly at: Maybe<number>;
  readonly combatTechnique: Maybe<string>;
  readonly damageBonus: Maybe<PrimaryAttributeDamageThreshold>;
  readonly damageDiceNumber: Maybe<number>;
  readonly damageDiceSides: Maybe<number>;
  readonly damageFlat: Maybe<number>;
  readonly enc: Maybe<number>;
  readonly forArmorZoneOnly: Maybe<boolean>;
  readonly gr: number;
  readonly improvisedWeaponGroup: Maybe<number>;
  readonly iniMod: Maybe<number>;
  readonly isParryingWeapon: Maybe<boolean>;
  readonly isTemplateLocked: boolean;
  readonly isTwoHandedWeapon: Maybe<boolean>;
  readonly length: Maybe<number>;
  readonly loss: Maybe<number>;
  readonly movMod: Maybe<number>;
  readonly pa: Maybe<number>;
  readonly price: Maybe<number>;
  readonly pro: Maybe<number>;
  readonly range: Maybe<[number, number, number]>;
  readonly reach: Maybe<number>;
  readonly reloadTime: Maybe<number>;
  readonly stabilityMod: Maybe<number>;
  readonly stp: Maybe<number>;
  readonly template: Maybe<string>;
  readonly weight: Maybe<number>;
  readonly where: Maybe<string>;
  readonly note: Maybe<string>;
  readonly rules: Maybe<string>;
  readonly advantage: Maybe<string>;
  readonly disadvantage: Maybe<string>;
  readonly src: Maybe<List<SourceLink>>;
}

export interface PrimaryAttributeDamageThreshold {
  readonly primary: Maybe<string>;
  readonly threshold: number | List<number>;
}

export type Activatable = Advantage | Disadvantage | SpecialAbility;
export type Skillish = Spell | LiturgicalChant | Skill | CombatTechnique;
