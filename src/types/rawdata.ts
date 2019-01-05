import { ProfessionSelectionIds } from '../App/Models/Wiki/wikiTypeHelpers';
import { StringKeyObject } from '../Data/Record';
import * as UI from './ui';

export interface RawUser {
  id: string;
  displayName: string;
}

export interface RawHero {
  readonly id: string;
  readonly name: string;
  readonly avatar?: string;
  readonly ap: {
    total: number;
    spent: number;
  };
  readonly r?: string;
  readonly rv?: string;
  readonly c?: string;
  readonly p?: string;
  professionName?: string;
  readonly pv?: string;
  readonly sex: 'm' | 'f';
  readonly dateCreated: string;
  readonly dateModified: string;
  player?: RawUser;
  rules: RawRules;
  readonly clientVersion: string;
  readonly phase: number;
  readonly el: string;
  readonly pers: {
    family?: string;
    placeofbirth?: string;
    dateofbirth?: string;
    age?: string;
    haircolor?: number;
    eyecolor?: number;
    size?: string;
    weight?: string;
    title?: string;
    socialstatus?: number;
    characteristics?: string;
    otherinfo?: string;
    cultureAreaKnowledge?: string;
  };
  readonly activatable: StringKeyObject<RawActiveObject[]>;
  readonly attr: {
    values: { id: string; value: number }[];
    readonly attributeAdjustmentSelected: string;
    lp: number;
    ae: number;
    kp: number;
    permanentLP?: {
      lost: number;
    };
    permanentAE: {
      lost: number;
      redeemed: number;
    };
    permanentKP: {
      lost: number;
      redeemed: number;
    };
  };
  readonly talents: StringKeyObject<number>;
  readonly ct: StringKeyObject<number>;
  readonly spells: StringKeyObject<number>;
  readonly cantrips: string[];
  readonly liturgies: StringKeyObject<number>;
  readonly blessings: string[];
  readonly belongings: {
    items: StringKeyObject<RawCustomItem>;
    armorZones?: StringKeyObject<RawArmorZone>;
    purse: {
      d: string;
      s: string;
      h: string;
      k: string;
    };
  };
  readonly pets?: StringKeyObject<RawPet>;
}

export interface RawActiveObject {
  sid?: string | number;
  sid2?: string | number;
  tier?: number;
  cost?: number;
}

export interface RawRules {
  higherParadeValues: number;
  attributeValueLimit: boolean;
  enableAllRuleBooks: boolean;
  enabledRuleBooks: string[];
  enableLanguageSpecializations: boolean;
}

export type RawHerolist = StringKeyObject<RawHero>;

export interface RawRace {
  id: string;
  ap: number;
  le: number;
  sk: number;
  zk: number;
  gs: number;
  attr: [number, number][];
  attr_sel: [number, number[]];
  typ_cultures: string[];
  auto_adv: string[];
  autoAdvCost: [number, number, number];
  imp_adv: string[];
  imp_dadv: string[];
  typ_adv: string[];
  typ_dadv: string[];
  untyp_adv: string[];
  untyp_dadv: string[];
  hair?: number[];
  eyes?: number[];
  size?: (number | [number, number])[];
  weight: (number | [number, number])[];
  vars: string[];
  src: string[];
}

export interface RawRaceVariant {
  id: string;
  typ_cultures: string[];
  typ_adv: string[];
  typ_dadv: string[];
  untyp_adv: string[];
  untyp_dadv: string[];
  hair?: number[];
  eyes?: number[];
  size?: (number | [number, number])[];
}

export interface RawRaceLocale {
  id: string;
  name: string;
  attributeAdjustments: string;
  automaticAdvantages: string;
  stronglyRecommendedAdvantages: string;
  stronglyRecommendedDisadvantages: string;
  commonAdvantages?: string;
  commonDisadvantages?: string;
  uncommonAdvantages?: string;
  uncommonDisadvantages?: string;
  src: number[];
}

export interface RawRaceVariantLocale {
  id: string;
  name: string;
  commonAdvantages?: string;
  commonDisadvantages?: string;
  uncommonAdvantages?: string;
  uncommonDisadvantages?: string;
}

export interface RawCommonProfessionObject {
  list: (string | number)[];
  reverse: boolean;
}

export interface RawCulture {
  id: string;
  ap: number;
  lang: number[];
  literacy: number[];
  social: number[];
  typ_prof: (boolean | RawCommonProfessionObject)[];
  typ_adv: string[];
  typ_dadv: string[];
  untyp_adv: string[];
  untyp_dadv: string[];
  typ_talents: string[];
  untyp_talents: string[];
  talents: [string, number][];
  src: string[];
}

export interface RawCultureLocale {
  id: string;
  name: string;
  areaKnowledgeShort: string;
  areaKnowledge: string;
  commonMundaneProfessions?: string;
  commonMagicProfessions?: string;
  commonBlessedProfessions?: string;
  commonAdvantages?: string;
  commonDisadvantages?: string;
  uncommonAdvantages?: string;
  uncommonDisadvantages?: string;
  commonNames: string;
  src: number[];
}

export interface RawProfession {
  id: string;
  ap: number;
  apOfActivatables: number;
  pre_req: RawProfessionDependency[];
  req: RawProfessionPrerequisite[];
  sel: RawProfessionSelections;
  sa: RawProfessionRequiresActivatableObject[];
  combattech: [string, number][];
  talents: [string, number][];
  spells: [string, number][];
  chants: [string, number][];
  blessings: string[];
  typ_adv: string[];
  typ_dadv: string[];
  untyp_adv: string[];
  untyp_dadv: string[];
  vars: string[];
  gr: number;
  sgr: number;
  src: string[];
}

export interface RawProfessionLocale {
  id: string;
  name: string | { m: string; f: string };
  subname?: string | { m: string; f: string };
  req: RawProfessionPrerequisite[];
  prerequisitesStart?: string;
  prerequisitesEnd?: string;
  twelveBlessingsAdd?: string;
  suggestedAdvantages?: string;
  suggestedDisadvantages?: string;
  unsuitableAdvantages?: string;
  unsuitableDisadvantages?: string;
  src: number[];
}

export interface RawProfessionVariant {
  id: string;
  ap: number;
  apOfActivatables: number;
  pre_req: RawProfessionDependency[];
  req: (RawProfessionRequiresActivatableObject | RawProfessionRequiresIncreasableObject)[];
  sel: RawProfessionVariantSelections;
  sa: RawProfessionRequiresActivatableObject[];
  combattech: [string, number][];
  talents: [string, number][];
  spells: [string, number][];
  chants: [string, number][];
  blessings: string[];
}

export interface RawProfessionVariantLocale {
  id: string;
  name: string | { m: string; f: string };
  precedingText?: string;
  fullText?: string;
  concludingText?: string;
}

export interface RawSpecializationSelection {
  readonly id: ProfessionSelectionIds.SPECIALIZATION;
  readonly sid: string | string[];
}

export interface RawRemoveSpecializationSelection {
  readonly id: ProfessionSelectionIds.SPECIALIZATION;
  readonly active: boolean;
}

export type RawVariantSpecializationSelection =
  RawSpecializationSelection |
  RawRemoveSpecializationSelection;

export interface RawLanguagesScriptsSelection {
  readonly id: ProfessionSelectionIds.LANGUAGES_SCRIPTS;
  readonly value: number;
}

export interface RawCombatTechniquesSelection {
  readonly id: ProfessionSelectionIds.COMBAT_TECHNIQUES;
  readonly amount: number;
  readonly value: number;
  readonly sid: string[];
}

export interface RawRemoveCombatTechniquesSelection {
  readonly id: ProfessionSelectionIds.COMBAT_TECHNIQUES;
  readonly active: boolean;
}

export type RawVariantCombatTechniquesSelection =
  RawCombatTechniquesSelection |
  RawRemoveCombatTechniquesSelection;

export interface RawCombatTechniquesSecondSelection {
  readonly id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;
  readonly amount: number;
  readonly value: number;
  readonly sid: string[];
}

export interface RawRemoveCombatTechniquesSecondSelection {
  readonly id: ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;
  readonly active: boolean;
}

export type RawVariantCombatTechniquesSecondSelection =
  RawCombatTechniquesSecondSelection |
  RawRemoveCombatTechniquesSecondSelection;

export interface RawCantripsSelection {
  readonly id: ProfessionSelectionIds.CANTRIPS;
  readonly amount: number;
  readonly sid: string[];
}

export interface RawCursesSelection {
  readonly id: ProfessionSelectionIds.CURSES;
  readonly value: number;
}

export interface RawSkillsSelection {
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

export interface RawTerrainKnowledgeSelection {
  readonly id: ProfessionSelectionIds.TERRAIN_KNOWLEDGE;
  readonly sid: number[];
}

export type RawProfessionSelection =
  RawSpecializationSelection |
  RawLanguagesScriptsSelection |
  RawCombatTechniquesSelection |
  RawCombatTechniquesSecondSelection |
  RawCantripsSelection |
  RawCursesSelection |
  RawSkillsSelection |
  RawTerrainKnowledgeSelection;

export type RawProfessionVariantSelection =
  RawVariantSpecializationSelection |
  RawLanguagesScriptsSelection |
  RawVariantCombatTechniquesSelection |
  RawVariantCombatTechniquesSecondSelection |
  RawCantripsSelection |
  RawCursesSelection |
  RawSkillsSelection |
  RawTerrainKnowledgeSelection;

export type RawProfessionSelections =
  RawProfessionSelection[];

export type RawProfessionVariantSelections =
  RawProfessionVariantSelection[];

export interface RawAdvantage {
  id: string;
  ap: number | number[] | string;
  tiers?: number;
  max?: number;
  sel?: RawSelectionObject[];
  req: AllRawRequirements[];
  reqIndex: string[];
  gr: number;
  src: string[];
}

export interface RawAdvantageLocale {
  id: string;
  name: string;
  sel?: RawSelectionObject[];
  input?: string;
  rules: string;
  range?: string;
  actions?: string;
  apValue?: string;
  apValueAppend?: string;
  req?: string;
  /**
   * 0-based index as key!
   */
  reqIndex: {
    [key: number]: string;
  };
  reqStart?: string;
  reqEnd?: string;
  src: number[];
}

export interface RawAttribute {
  id: string;
}

export interface RawAttributeLocale {
  id: string;
  name: string;
  short: string;
}

export interface RawCombatTechnique {
  id: string;
  skt: number;
  leit: string[];
  bf: number;
  gr: number;
  src: string[];
}

export interface RawCombatTechniqueLocale {
  id: string;
  name: string;
  special?: string;
  src: number[];
}

export interface RawDisadvantage extends RawAdvantage {}

export interface RawDisadvantageLocale extends RawAdvantageLocale {}

export interface RawLiturgy {
  id: string;
  check: [string, string, string];
  mod?: 'SPI' | 'TOU';
  skt: number;
  trad: number[];
  aspc: number[];
  gr: number;
  src: string[];
}

export interface RawLiturgyLocale {
  id: string;
  name: string;
  effect: string;
  castingtime: string;
  castingtimeShort: string;
  kpcost: string;
  kpcostShort: string;
  range: string;
  rangeShort: string;
  duration: string;
  durationShort: string;
  target: string;
  src: number[];
}

export interface RawBlessing {
  id: string;
  aspc: number[];
  trad: number[];
  src: string[];
}

export interface RawBlessingLocale {
  id: string;
  name: string;
  effect: string;
  range: string;
  duration: string;
  target: string;
  src: number[];
}

export interface RawSpecialAbility {
  id: string;
  ap: number | number[] | string;
  tiers?: number;
  max?: number;
  sel?: RawSelectionObject[];
  req: AllRawRequirements[] | [number, AllRawRequirements[]][];
  gr: number;
  subgr?: number;
  extended?: (string | string[])[];
  property?: number;
  aspect?: number;
  reqIndex: string[];
  src: string[];
}

export interface RawSpecialAbilityLocale {
  id: string;
  name: string;
  sel?: RawSelectionObject[];
  input?: string;
  nameInWiki?: string;
  rules?: string;
  effect?: string;
  volume?: string;
  penalty?: string;
  combatTechniques?: string;
  aeCost?: string;
  protectiveCircle?: string;
  wardingCircle?: string;
  bindingCost?: string;
  property?: string;
  aspect?: string;
  apValue?: string;
  apValueAppend?: string;
  req?: string;
  /**
   * 0-based index as key!
   */
  reqIndex: {
    [key: number]: string;
  };
  reqStart?: string;
  reqEnd?: string;
  src: number[];
}

export interface RawSelectionObject {
  id: string | number;
  name: string;
  cost?: number;
  req?: AllRawRequirementObjects[];
  prerequisites?: AllRawRequirementObjects[];
  target?: string;
  tier?: number;
  talent?: [string, number];
  gr?: number;
}

export interface RawApplication {
  readonly id: number;
  readonly name: string;
  readonly prerequisites?: AllRawRequirementObjects[];
}

export interface RawSpell {
  id: string;
  check: [string, string, string];
  mod?: 'SPI' | 'TOU';
  skt: number;
  trad: number[];
  subtrad: number[];
  merk: number;
  gr: number;
  req: AllRawRequirementObjects[];
  src: string[];
}

export interface RawSpellLocale {
  id: string;
  name: string;
  effect: string;
  castingtime: string;
  castingtimeShort: string;
  aecost: string;
  aecostShort: string;
  range: string;
  rangeShort: string;
  duration: string;
  durationShort: string;
  target: string;
  src: number[];
}

export interface RawCantrip {
  id: string;
  merk: number;
  trad: number[];
  src: string[];
}

export interface RawCantripLocale {
  id: string;
  name: string;
  effect: string;
  range: string;
  duration: string;
  target: string;
  note?: string;
  src: number[];
}

export interface RawSkill {
  id: string;
  check: [string, string, string];
  skt: number;
  be: 'true' | 'false' | 'maybe';
  gr: number;
  applications?: {
    id: number;
    prerequisites: AllRawRequirementObjects[];
  }[];
}

export interface RawSkillLocale {
  id: string;
  name: string;
  spec: {
    id: number;
    name: string;
  }[];
  spec_input?: string;
  tools?: string;
  quality: string;
  failed: string;
  critical: string;
  botch: string;
  src: string;
}

export interface RawBaseItem {
  id: string;
  price?: number;
  weight: number;
  template?: string;
  imp?: number;
  gr: number;
  combatTechnique?: string;
  damageDiceNumber?: number;
  damageDiceSides?: number;
  damageFlat?: number;
  primaryThreshold?: RawPrimaryAttributeDamageThreshold;
  at?: number;
  pa?: number;
  reach?: number;
  length?: number;
  stp?: number;
  range?: number[];
  reloadTime?: number;
  ammunition?: string;
  pro?: number;
  enc?: number;
  addPenalties?: boolean;
  isParryingWeapon?: boolean;
  isTwoHandedWeapon?: boolean;
  armorType?: number;
  iniMod?: number;
  movMod?: number;
  stabilityMod?: number;
}

export interface RawPrimaryAttributeDamageThreshold {
  primary?: string;
  threshold: number | ReadonlyArray<number>;
}

export interface RawItemTemplate extends RawBaseItem {
  src: string[];
}

export interface RawCustomItem extends RawBaseItem {
  id: string;
  name: string;
  amount: number;
  isTemplateLocked: boolean;
  loss?: number;
  forArmorZoneOnly?: boolean;
  where?: string;
}

export interface RawItemLocale {
  name: string;
  note?: string;
  rules?: string;
  advantage?: string;
  disadvantage?: string;
  src: number[];
}

export interface RawArmorZone {
  id: string;
  name: string;
  head?: string;
  headLoss?: number;
  leftArm?: string;
  leftArmLoss?: number;
  rightArm?: string;
  rightArmLoss?: number;
  torso?: string;
  torsoLoss?: number;
  leftLeg?: string;
  leftLegLoss?: number;
  rightLeg?: string;
  rightLegLoss?: number;
}

export interface RawPet {
  id: string;
  name: string;
  avatar?: string;
  size?: string;
  type?: string;
  attack?: string;
  dp?: string;
  reach?: string;
  actions?: string;
  talents?: string;
  skills?: string;
  notes?: string;
  spentAp?: string;
  totalAp?: string;
  cou?: string;
  sgc?: string;
  int?: string;
  cha?: string;
  dex?: string;
  agi?: string;
  con?: string;
  str?: string;
  lp?: string;
  ae?: string;
  spi?: string;
  tou?: string;
  pro?: string;
  ini?: string;
  mov?: string;
  at?: string;
  pa?: string;
}

export interface RawExperienceLevelLocale {
  id: string;
  name: string;
}

export interface RawExperienceLevel {
  id: string;
  ap: number;
  maxAttributeValue: number;
  maxSkillRating: number;
  maxCombatTechniqueRating: number;
  maxTotalAttributeValues: number;
  maxSpellsLiturgies: number;
  maxUnfamiliarSpells: number;
}

export interface RawTables {
  advantages: StringKeyObject<RawAdvantage>;
  attributes: StringKeyObject<RawAttribute>;
  blessings: StringKeyObject<RawBlessing>;
  cantrips: StringKeyObject<RawCantrip>;
  combattech: StringKeyObject<RawCombatTechnique>;
  cultures: StringKeyObject<RawCulture>;
  disadvantages: StringKeyObject<RawDisadvantage>;
  el: StringKeyObject<RawExperienceLevel>;
  items: StringKeyObject<RawItemTemplate>;
  liturgies: StringKeyObject<RawLiturgy>;
  professions: StringKeyObject<RawProfession>;
  professionvariants: StringKeyObject<RawProfessionVariant>;
  races: StringKeyObject<RawRace>;
  racevariants: StringKeyObject<RawRaceVariant>;
  specialabilities: StringKeyObject<RawSpecialAbility>;
  spells: StringKeyObject<RawSpell>;
  talents: StringKeyObject<RawSkill>;
}

export interface RawBook {
  readonly id: string;
  readonly short: string;
  readonly name: string;
}

export interface RawLocale {
  ui: UI.RawUIMessages;
  books: StringKeyObject<RawBook>;
  el: StringKeyObject<RawExperienceLevelLocale>;
  attributes: StringKeyObject<RawAttributeLocale>;
  races: StringKeyObject<RawRaceLocale>;
  racevariants: StringKeyObject<RawRaceVariantLocale>;
  cultures: StringKeyObject<RawCultureLocale>;
  professions: StringKeyObject<RawProfessionLocale>;
  professionvariants: StringKeyObject<RawProfessionVariantLocale>;
  advantages: StringKeyObject<RawAdvantageLocale>;
  disadvantages: StringKeyObject<RawDisadvantageLocale>;
  talents: StringKeyObject<RawSkillLocale>;
  combattech: StringKeyObject<RawCombatTechniqueLocale>;
  spells: StringKeyObject<RawSpellLocale>;
  cantrips: StringKeyObject<RawCantripLocale>;
  liturgies: StringKeyObject<RawLiturgyLocale>;
  blessings: StringKeyObject<RawBlessingLocale>;
  specialabilities: StringKeyObject<RawSpecialAbilityLocale>;
  items: StringKeyObject<RawItemLocale>;
}

export type RawLocaleList = StringKeyObject<RawLocale>;

export interface RawConfig {
  herolistSortOrder: string;
  herolistVisibilityFilter: string;
  racesSortOrder: string;
  racesValueVisibility: boolean;
  culturesSortOrder: string;
  culturesVisibilityFilter: string;
  culturesValueVisibility: boolean;
  professionsSortOrder: string;
  professionsVisibilityFilter: string;
  professionsGroupVisibilityFilter: number;
  professionsFromExpansionsVisibility: boolean;
  advantagesDisadvantagesCultureRatingVisibility: boolean;
  talentsSortOrder: string;
  talentsCultureRatingVisibility: boolean;
  combatTechniquesSortOrder: string;
  specialAbilitiesSortOrder: string;
  spellsSortOrder: string;
  spellsUnfamiliarVisibility: boolean;
  liturgiesSortOrder: string;
  equipmentSortOrder: string;
  equipmentGroupVisibilityFilter: number;
  sheetCheckAttributeValueVisibility?: boolean;
  enableActiveItemHints: boolean;
  locale?: string;
  theme?: string;
  enableEditingHeroAfterCreationPhase?: boolean;
  meleeItemTemplatesCombatTechniqueFilter?: string;
  rangedItemTemplatesCombatTechniqueFilter?: string;
  enableAnimations?: boolean;
}

export interface Raw {
  config?: RawConfig;
  heroes?: RawHerolist;
  tables: RawTables;
  locales: StringKeyObject<RawLocale>;
}

export type SID = string | number | number[];

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

export interface RawRequiresActivatableObject {
  id: string | string[];
  active: boolean;
  sid?: SID;
  sid2?: string | number;
  tier?: number;
}

export interface RawProfessionRequiresActivatableObject extends RawRequiresActivatableObject {
  id: string;
  sid?: string | number;
}

export interface RawRequiresIncreasableObject {
  id: string | string[];
  value: number;
}

export interface RawProfessionRequiresIncreasableObject extends RawRequiresIncreasableObject {
  id: string;
}

export interface RawRequiresPrimaryAttribute {
  id: 'ATTR_PRIMARY';
  value: number;
  type: 1 | 2;
}

export interface RawSexRequirement {
  id: 'SEX';
  value: 'm' | 'f';
}

export interface RawRaceRequirement {
  id: 'RACE';
  value: number | number[];
}

export interface RawCultureRequirement {
  id: 'CULTURE';
  value: number | number[];
}

export interface RawPactRequirement {
  id: 'PACT';
  category: number;
  domain?: number | number[];
  level?: number;
}

export type RawProfessionDependency =
  RawSexRequirement |
  RawRaceRequirement |
  RawCultureRequirement;

export type RawProfessionPrerequisite =
  RawProfessionRequiresActivatableObject |
  RawProfessionRequiresIncreasableObject;

export type AllRawRequirementObjects =
  RawProfessionDependency |
  RawRequiresActivatableObject |
  RawRequiresIncreasableObject |
  RawRequiresPrimaryAttribute |
  RawPactRequirement;

export type AllRawRequirements = 'RCP' | AllRawRequirementObjects;
