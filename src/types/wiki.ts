import { Categories } from '../constants/Categories';
import { List, OrderedMap, Record, Tuple } from '../utils/dataUtils';

export type WikiRecord = Record<WikiAll>;

export interface WikiAll {
  readonly books: OrderedMap<string, Record<Book>>;
  readonly experienceLevels: OrderedMap<string, Record<ExperienceLevel>>;
  readonly races: OrderedMap<string, Record<Race>>;
  readonly raceVariants: OrderedMap<string, Record<RaceVariant>>;
  readonly cultures: OrderedMap<string, Record<Culture>>;
  readonly professions: OrderedMap<string, Record<Profession>>;
  readonly professionVariants: OrderedMap<string, Record<ProfessionVariant>>;
  readonly attributes: OrderedMap<string, Record<Attribute>>;
  readonly advantages: OrderedMap<string, Record<Advantage>>;
  readonly disadvantages: OrderedMap<string, Record<Disadvantage>>;
  readonly specialAbilities: OrderedMap<string, Record<SpecialAbility>>;
  readonly skills: OrderedMap<string, Record<Skill>>;
  readonly combatTechniques: OrderedMap<string, Record<CombatTechnique>>;
  readonly spells: OrderedMap<string, Record<Spell>>;
  readonly cantrips: OrderedMap<string, Record<Cantrip>>;
  readonly liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>;
  readonly blessings: OrderedMap<string, Record<Blessing>>;
  readonly itemTemplates: OrderedMap<string, Record<ItemTemplate>>;
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
  Record<CombatTechnique> |
  Record<LiturgicalChant> |
  Record<SpecialAbility> |
  Record<Spell> |
  Record<Skill>;

export type WikiActivatable =
  Record<Advantage> |
  Record<Disadvantage> |
  Record<SpecialAbility>;

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
  readonly attributeAdjustmentsSelection: Tuple<number, List<string>>;
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
  readonly commonAdvantagesText?: string;
  readonly commonDisadvantages: List<string>;
  readonly commonDisadvantagesText?: string;
  readonly uncommonAdvantages: List<string>;
  readonly uncommonAdvantagesText?: string;
  readonly uncommonDisadvantages: List<string>;
  readonly uncommonDisadvantagesText?: string;
  readonly hairColors?: List<number>;
  readonly eyeColors?: List<number>;
  readonly sizeBase?: number;
  readonly sizeRandom?: List<Record<Die>>;
  readonly weightBase: number;
  readonly weightRandom: List<Record<Die>>;
  readonly variants: List<string>;
  readonly category: Categories.RACES;
  readonly src: List<Record<SourceLink>>;
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
  readonly commonAdvantagesText?: string;
  readonly commonDisadvantages: List<string>;
  readonly commonDisadvantagesText?: string;
  readonly uncommonAdvantages: List<string>;
  readonly uncommonAdvantagesText?: string;
  readonly uncommonDisadvantages: List<string>;
  readonly uncommonDisadvantagesText?: string;
  readonly hairColors?: List<number>;
  readonly eyeColors?: List<number>;
  readonly sizeBase?: number;
  readonly sizeRandom?: List<Record<Die>>;
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
  readonly commonMundaneProfessions?: string;
  readonly commonMagicProfessions?: string;
  readonly commonBlessedProfessions?: string;
  readonly commonAdvantages: List<string>;
  readonly commonAdvantagesText?: string;
  readonly commonDisadvantages: List<string>;
  readonly commonDisadvantagesText?: string;
  readonly uncommonAdvantages: List<string>;
  readonly uncommonAdvantagesText?: string;
  readonly uncommonDisadvantages: List<string>;
  readonly uncommonDisadvantagesText?: string;
  readonly commonSkills: List<string>;
  readonly uncommonSkills: List<string>;
  readonly culturalPackageSkills: List<Record<IncreaseSkill>>;
  readonly category: Categories.CULTURES;
  readonly src: List<Record<SourceLink>>;
  /**
   * Markdown supported.
   */
  readonly commonNames: string;
}

export type CommonProfession = boolean | Record<CommonProfessionObject>;

export interface CommonProfessionObject {
  readonly list: List<string | number>;
  readonly reverse: boolean;
}

export interface SpecializationSelection {
  readonly id: ProfessionSelectionIds.SPECIALISATION;
  readonly sid: string | List<string>;
}

export interface RemoveSpecializationSelection {
  readonly id: ProfessionSelectionIds.SPECIALISATION;
  readonly active: boolean;
}

export type VariantSpecializationSelection =
  Record<SpecializationSelection> |
  Record<RemoveSpecializationSelection>;

export interface LanguagesScriptsSelection {
  readonly id: ProfessionSelectionIds.LANGUAGES_SCRIPTS;
  readonly value: number;
}

export interface CombatTechniquesSelection {
  readonly id: ProfessionSelectionIds.COMBAT_TECHNIQUES;
  readonly amount: number;
  readonly value: number;
  readonly sid: List<string>;
}

export interface RemoveCombatTechniquesSelection {
  readonly id: ProfessionSelectionIds.COMBAT_TECHNIQUES;
  readonly active: boolean;
}

export type VariantCombatTechniquesSelection =
  Record<CombatTechniquesSelection> |
  Record<RemoveCombatTechniquesSelection>;

export interface CombatTechniquesSecondSelection {
  readonly id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;
  readonly amount: number;
  readonly value: number;
  readonly sid: List<string>;
}

export interface RemoveCombatTechniquesSecondSelection {
  readonly id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;
  readonly active: boolean;
}

export type VariantCombatTechniquesSecondSelection =
  Record<CombatTechniquesSecondSelection> |
  Record<RemoveCombatTechniquesSecondSelection>;

export interface CantripsSelection {
  readonly id: ProfessionSelectionIds.CANTRIPS;
  readonly amount: number;
  readonly sid: List<string>;
}

export interface CursesSelection {
  readonly id: ProfessionSelectionIds.CURSES;
  readonly value: number;
}

export interface SkillsSelection {
  readonly id: ProfessionSelectionIds.SKILLS;
  /**
   * If specified, only choose from skills of the specified group.
   */
  readonly gr?: number;
  /**
   * The AP value the user can spend.
   */
  readonly value: number;
}

export interface TerrainKnowledgeSelection {
  readonly id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE;
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
  TERRAIN_KNOWLEDGE = 'TERRAIN_KNOWLEDGE',
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
  readonly m: string;
  readonly f: string;
}

export interface Profession {
  readonly id: string;
  readonly name: string | Record<NameBySex>;
  readonly subname?: string | Record<NameBySex>;
  readonly ap: number;
  readonly apOfActivatables: number;
  readonly dependencies: List<ProfessionDependency>;
  readonly prerequisites: List<ProfessionPrerequisite>;
  readonly prerequisitesStart?: string;
  readonly prerequisitesEnd?: string;
  readonly selections: ProfessionSelections;
  readonly specialAbilities: List<Record<ProfessionRequiresActivatableObject>>;
  readonly combatTechniques: List<Record<IncreaseSkill>>;
  readonly skills: List<Record<IncreaseSkill>>;
  readonly spells: List<Record<IncreaseSkill>>;
  readonly liturgicalChants: List<Record<IncreaseSkill>>;
  readonly blessings: List<string>;
  readonly twelveBlessingsAdd?: string;
  readonly suggestedAdvantages: List<string>;
  readonly suggestedAdvantagesText?: string;
  readonly suggestedDisadvantages: List<string>;
  readonly suggestedDisadvantagesText?: string;
  readonly unsuitableAdvantages: List<string>;
  readonly unsuitableAdvantagesText?: string;
  readonly unsuitableDisadvantages: List<string>;
  readonly unsuitableDisadvantagesText?: string;
  readonly isVariantRequired?: boolean;
  readonly variants: List<string>;
  readonly category: Categories.PROFESSIONS;
  readonly gr: number;
  /**
   * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the
   * Twelve Gods" or "Fighter".
   */
  readonly subgr: number;
  readonly src: List<Record<SourceLink>>;
}

export interface ProfessionVariant {
  readonly id: string;
  readonly name: string | Record<NameBySex>;
  readonly ap: number;
  readonly apOfActivatables: number;
  readonly dependencies: List<ProfessionDependency>;
  readonly prerequisites: List<ProfessionPrerequisite>;
  readonly selections: ProfessionVariantSelections;
  readonly specialAbilities: List<Record<ProfessionRequiresActivatableObject>>;
  readonly combatTechniques: List<Record<IncreaseSkill>>;
  readonly skills: List<Record<IncreaseSkill>>;
  readonly spells: List<Record<IncreaseSkill>>;
  readonly liturgicalChants: List<Record<IncreaseSkill>>;
  readonly blessings: List<string>;
  readonly precedingText?: string;
  readonly fullText?: string;
  readonly concludingText?: string;
  readonly category: Categories.PROFESSION_VARIANTS;
}

export interface IncreaseSkill {
  id: string;
  value: number;
}

export interface SelectionObject {
  id: string | number;
  name: string;
  cost?: number;
  req?: List<AllRequirementObjects>;
  prerequisites?: List<AllRequirementObjects>;
  target?: string;
  tier?: number;
  spec?: List<string>;
  specInput?: string;
  applications?: List<Record<Application>>;
  applicationsInput?: string;
  talent?: Tuple<string, number>;
  gr?: number;
}

export type AllRequirements = 'RCP' | AllRequirementObjects;
export type ActivatablePrerequisites = List<AllRequirements>;

export type LevelAwarePrerequisites =
  ActivatablePrerequisites |
  OrderedMap<number, ActivatablePrerequisites>;

interface ActivatableBase {
  readonly id: string;
  readonly name: string;
  readonly cost: string | number | List<number>;
  readonly input?: string;
  readonly max?: number;
  readonly prerequisites: LevelAwarePrerequisites;
  readonly prerequisitesText?: string;
  /**
   * 0-based index as key!
   */
  readonly prerequisitesTextIndex: OrderedMap<number, string | false>;
  readonly prerequisitesTextStart?: string;
  readonly prerequisitesTextEnd?: string;
  readonly tiers?: number;
  readonly select?: List<Record<SelectionObject>>;
  readonly gr: number;
  readonly src: List<Record<SourceLink>>;
}

interface AdvantageDisadvantageBase extends ActivatableBase {
  readonly rules: string;
  readonly range?: string;
  readonly actions?: string;
  readonly apValue?: string;
  readonly apValueAppend?: string;
}

export interface Advantage extends AdvantageDisadvantageBase {
  readonly category: Categories.ADVANTAGES;
}

export interface Disadvantage extends AdvantageDisadvantageBase {
  readonly category: Categories.DISADVANTAGES;
}

export interface SpecialAbility extends ActivatableBase {
  readonly category: Categories.SPECIAL_ABILITIES;
  readonly extended?: List<string | List<string>>;
  readonly nameInWiki?: string;
  readonly subgr?: number;
  readonly combatTechniques?: string;
  readonly rules?: string;
  readonly effect?: string;
  readonly volume?: string;
  readonly penalty?: string;
  readonly aeCost?: string;
  readonly protectiveCircle?: string;
  readonly wardingCircle?: string;
  readonly bindingCost?: string;
  readonly property?: number | string;
  readonly aspect?: number | string;
  readonly apValue?: string;
  readonly apValueAppend?: string;
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
  readonly special?: string;
  readonly src: List<Record<SourceLink>>;
}

export type CheckModifier = 'SPI' | 'TOU';

export interface LiturgicalChant {
  readonly id: string;
  readonly name: string;
  readonly aspects: List<number>;
  readonly category: Categories.LITURGIES;
  readonly check: List<string>;
  readonly checkmod?: CheckModifier;
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
  readonly src: List<Record<SourceLink>>;
}

export interface Blessing {
  readonly id: string;
  readonly name: string;
  readonly aspects: List<number>;
  readonly tradition: List<number>;
  readonly prerequisites: List<AllRequirementObjects>;
  readonly category: Categories.BLESSINGS;
  readonly effect: string;
  readonly range: string;
  readonly duration: string;
  readonly target: string;
  readonly src: List<Record<SourceLink>>;
}

export interface Spell {
  readonly id: string;
  readonly name: string;
  readonly category: Categories.SPELLS;
  readonly check: List<string>;
  readonly checkmod?: CheckModifier;
  readonly gr: number;
  readonly ic: number;
  readonly property: number;
  readonly tradition: List<number>;
  readonly subtradition: List<number>;
  readonly prerequisites: List<AllRequirementObjects>;
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
  readonly src: List<Record<SourceLink>>;
}

export interface SkillExtension extends SelectionObject {
  readonly target: string;
  readonly tier: 1 | 2 | 3;
  readonly effect: string;
}

export interface Cantrip {
  readonly id: string;
  readonly name: string;
  readonly property: number;
  readonly tradition: List<number>;
  readonly prerequisites: List<AllRequirementObjects>;
  readonly category: Categories.CANTRIPS;
  readonly effect: string;
  readonly range: string;
  readonly duration: string;
  readonly target: string;
  readonly note?: string;
  readonly src: List<Record<SourceLink>>;
}

export interface Skill {
  readonly id: string;
  readonly name: string;
  readonly category: Categories.TALENTS;
  readonly check: List<string>;
  readonly encumbrance: string;
  readonly gr: number;
  readonly ic: number;
  readonly applications?: List<Record<Application>>;
  readonly applicationsInput?: string;
  readonly tools?: string;
  readonly quality: string;
  readonly failed: string;
  readonly critical: string;
  readonly botch: string;
  readonly src: string;
}

export interface Application {
  readonly id: number;
  readonly name: string;
  readonly prerequisites?: List<AllRequirementObjects>;
}

export interface ItemTemplate {
  readonly id: string;
  readonly name: string;
  readonly addPenalties?: boolean;
  readonly ammunition?: string;
  readonly amount?: number;
  readonly armorType?: number;
  readonly at?: number;
  readonly combatTechnique?: string;
  readonly damageBonus?: Record<PrimaryAttributeDamageThreshold>;
  readonly damageDiceNumber?: number;
  readonly damageDiceSides?: number;
  readonly damageFlat?: number;
  readonly enc?: number;
  readonly forArmorZoneOnly?: boolean;
  readonly gr: number;
  readonly improvisedWeaponGroup?: number;
  readonly iniMod?: number;
  readonly isParryingWeapon?: boolean;
  readonly isTemplateLocked: boolean;
  readonly isTwoHandedWeapon?: boolean;
  readonly length?: number;
  readonly loss?: number;
  readonly movMod?: number;
  readonly pa?: number;
  readonly price?: number;
  readonly pro?: number;
  readonly range?: [number, number, number];
  readonly reach?: number;
  readonly reloadTime?: number;
  readonly stabilityMod?: number;
  readonly stp?: number;
  readonly template?: string;
  readonly weight?: number;
  readonly where?: string;
  readonly note?: string;
  readonly rules?: string;
  readonly advantage?: string;
  readonly disadvantage?: string;
  readonly src?: List<Record<SourceLink>>;
}

export interface PrimaryAttributeDamageThreshold {
  readonly primary?: string;
  readonly threshold: number | List<number>;
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
  active?: boolean;
  sid?: SID;
  sid2?: string | number;
  tier?: number;
}

export interface ActiveOptionalDependency extends ActiveDependency {
  origin: string;
}

export interface RequiresActivatableObject {
  id: string | List<string>;
  active: boolean;
  sid?: SID;
  sid2?: string | number;
  tier?: number;
}

export interface ProfessionRequiresActivatableObject extends RequiresActivatableObject {
  id: string;
  sid?: string | number;
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
  value: 'm' | 'f';
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
  domain?: number | List<number>;
  level?: number;
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
