import { Action } from 'redux';
import { Purse } from '../reducers/equipment';
import { Just, List, Maybe, ReadMap, ReadSet } from '../utils/dataUtils';
import { TabId } from '../utils/LocationUtils';
import * as Reusable from './reusable.d';
import * as Wiki from './wiki';

export interface ActivatableDependent {
  readonly id: string;
  readonly active: List<ActiveObject>;
  readonly dependencies: List<ActivatableDependency>;
}

export interface AttributeDependent {
  readonly id: string;
  readonly value: number;
  readonly mod: number;
  readonly dependencies: List<SkillDependency>;
}

export interface SkillDependent {
  readonly id: string;
  readonly value: number;
  readonly dependencies: List<SkillDependency>;
}

export interface ActivatableSkillDependent {
  readonly id: string;
  readonly value: number;
  readonly active: boolean;
  readonly dependencies: List<ExtendedSkillDependency>;
}

export type ExtendedSkillDependent =
  SkillDependent |
  ActivatableSkillDependent;

export type ExtendedActivatableDependent =
  ActivatableDependent |
  ActivatableSkillDependent;

export type ValueBasedDependent =
  AttributeDependent |
  SkillDependent |
  ActivatableSkillDependent;

export type Dependent =
  ActivatableDependent |
  AttributeDependent |
  SkillDependent |
  ActivatableSkillDependent;

export type ActivatableDependency = boolean | DependencyObject;
export type SkillDependency = number | SkillOptionalDependency;
export type ExtendedSkillDependency = boolean | SkillDependency;

export interface SkillOptionalDependency {
  value: number;
  origin: string;
}

export interface HeroDependent {
  readonly id: string;
  readonly clientVersion: string;
  readonly player: Maybe<string>;
  readonly dateCreated: Date;
  readonly dateModified: Date;
  readonly phase: number;
  readonly name: string;
  readonly avatar: Maybe<string>;
  readonly adventurePoints: AdventurePoints;
  readonly race: Maybe<string>;
  readonly raceVariant: Maybe<string>;
  readonly culture: Maybe<string>;
  readonly profession: Maybe<string>;
  readonly professionName: Maybe<string>;
  readonly professionVariant: Maybe<string>;
  readonly sex: 'm' | 'f';
  readonly experienceLevel: string;
  readonly personalData: PersonalData;
  readonly advantages: ReadMap<string, ActivatableDependent>;
  readonly disadvantages: ReadMap<string, ActivatableDependent>;
  readonly specialAbilities: ReadMap<string, ActivatableDependent>;
  readonly attributes: ReadMap<string, AttributeDependent>;
  readonly energies: Energies;
  readonly skills: ReadMap<string, SkillDependent>;
  readonly combatTechniques: ReadMap<string, SkillDependent>;
  readonly spells: ReadMap<string, ActivatableSkillDependent>;
  readonly cantrips: ReadSet<string>;
  readonly liturgicalChants: ReadMap<string, ActivatableSkillDependent>;
  readonly blessings: ReadonlySet<string>;
  readonly belongings: Belongings;
  readonly rules: Rules;
  readonly pets: ReadMap<string, PetInstance>;
  readonly pact: Maybe<Pact>;
  readonly combatStyleDependencies: StyleDependency[];
  readonly magicalStyleDependencies: StyleDependency[];
  readonly blessedStyleDependencies: StyleDependency[];
}

export interface AdventurePoints {
  readonly total: number;
  readonly spent: number;
}

export interface PersonalData {
  readonly family: Maybe<string>;
  readonly placeOfBirth: Maybe<string>;
  readonly dateOfBirth: Maybe<string>;
  readonly age: Maybe<string>;
  readonly hairColor: Maybe<number>;
  readonly eyeColor: Maybe<number>;
  readonly size: Maybe<string>;
  readonly weight: Maybe<string>;
  readonly title: Maybe<string>;
  readonly socialStatus: Maybe<number>;
  readonly characteristics: Maybe<string>;
  readonly otherInfo: Maybe<string>;
  readonly cultureAreaKnowledge: Maybe<string>;
}

export interface Energies {
  readonly addedLifePoints: number;
  readonly addedArcaneEnergyPoints: number;
  readonly addedKarmaPoints: number;
  readonly permanentLifePoints: PermanentEnergyLoss;
  readonly permanentArcaneEnergyPoints: PermanentEnergyLossAndBoughtBack;
  readonly permanentKarmaPoints: PermanentEnergyLossAndBoughtBack;
}

export interface PermanentEnergyLoss {
  readonly lost: number;
}

export interface PermanentEnergyLossAndBoughtBack extends PermanentEnergyLoss {
  readonly redeemed: number;
}

export interface Belongings {
  readonly items: ReadMap<string, ItemInstance>;
  readonly armorZones: ReadMap<string, ArmorZonesInstance>;
  readonly purse: Purse;
}

export interface Pact {
	readonly category: number;
	readonly level: number;
	readonly type: number;
	readonly domain: number | string;
	readonly name: string;
}

export interface User {
  id: string;
  displayName: string;
}

export interface CommonProfessionObject {
  list: (string | number)[];
  reverse: boolean;
}

export type CommonProfession = boolean | CommonProfessionObject;

export interface Selections {
  attrSel: string;
  useCulturePackage: boolean;
  lang: number;
  buyLiteracy: boolean;
  litc: number;
  cantrips: Set<string>;
  combattech: Set<string>;
  combatTechniquesSecond: Set<string>;
  curses: Map<string, number>;
  langLitc: Map<string, number>;
  spec: string | number;
  specTalentId: Maybe<string>;
  skills: Map<string, number>;
  map: Map<Wiki.ProfessionSelectionIds, Wiki.ProfessionSelection>;
  terrainKnowledge: Maybe<number>;
}

export interface ActiveObject {
  sid: Maybe<string | number>;
  sid2: Maybe<string | number>;
  tier: Maybe<number>;
  cost: Maybe<number>;
}

export interface ActiveObjectName extends ActiveObject {
  name: string;
}

export interface ActiveObjectWithId extends ActiveObject {
  id: string;
  index: number;
}

export interface ActivatableNameCost extends ActiveObjectWithId {
  combinedName: string;
  baseName: string;
  addName: Maybe<string>;
  currentCost: number | number[];
}

export interface ActivatableNameCostActive extends ActivatableNameCost {
  active: boolean;
}

export interface ActivatableNameCostEvalTier extends ActivatableNameCost {
  currentCost: number;
  tierName: Maybe<string>;
}

export interface ActiveViewObject<T extends Wiki.Activatable = Wiki.Activatable> {
  id: string;
  index: number;
  name: string;
  cost: number;
  tier: Maybe<number>;
  tierName: Maybe<string>;
  minTier: Maybe<number>;
  maxTier: Maybe<number>;
  disabled: boolean;
  instance: ActivatableDependent;
  wiki: T;
  customCost: Maybe<boolean>;
}

export interface DeactiveViewObject<T extends Wiki.Activatable = Wiki.Activatable> {
  id: string;
  name: string;
  cost: Maybe<string | number | number[]>;
  tiers: Maybe<number>;
  minTier: Maybe<number>;
  maxTier: Maybe<number>;
  sel: Maybe<Wiki.SelectionObject[]>;
  input: Maybe<string>;
  instance: ActivatableDependent;
  wiki: T;
  customCostDisabled: Maybe<boolean>;
}

export type SetTierObject = ActiveObject;

export interface ActivateArgs {
  id: string;
  sel: Maybe<string | number>;
  sel2: Maybe<string | number>;
  input: Maybe<string>;
  tier: Maybe<number>;
  cost: number;
  customCost: Maybe<number>;
}

export interface DeactivateArgs {
  id: string;
  index: number;
  cost: number;
}

export interface UndoExtendedDeactivateArgs extends DeactivateArgs {
  activeObject: Maybe<ActiveObject>;
}

export interface ActivateObject {
  sel: Maybe<string | number>;
  sel2: Maybe<string | number>;
  input: Maybe<string>;
  tier: Maybe<number>;
  cost: Maybe<number>;
}

export interface DependencyObject {
  origin: Maybe<string>;
  active: Maybe<boolean>;
  sid: Maybe<string | number | number[]>;
  sid2: Maybe<string | number>;
  tier: Maybe<number>;
}

export interface ValidationObject extends ActiveObject {
  id: string;
  active: boolean | number;
}

export interface ProfessionDependencyCost {
  total: number;
  adv: [number, number, number];
  disadv: [number, number, number];
}

export type ActivatableBasePrerequisites = ('RCP' | Reusable.AllRequirementTypes)[];

export type UnionPlainAndMap<T> = T | Map<number, T>;

export interface StyleDependency {
  /**
   * The extended special ability or list of available special abilities.
   */
  id: string | string[];
  /**
   * If a ability meets a given id, the id, otherwise `undefined`.
   */
  active: Maybe<string>;
  /**
   * The style's id.
   */
  origin: string;
}

export interface ItemInstanceOld {
  id: string;
  name: string;
  ammunition?: string | null;
  combatTechnique: string;
  damageDiceSides: number;
  gr: number;
  isParryingWeapon: boolean;
  isTemplateLocked: boolean;
  reach: number;
  template: string;
  where: string;
  isTwoHandedWeapon: boolean;
  improvisedWeaponGroup?: number;
  at: number;
  addINIPenalty?: number;
  addMOVPenalty?: number;
  damageBonus: number;
  damageDiceNumber: number;
  damageFlat: number;
  enc: number;
  length: number;
  amount: number;
  pa: number;
  price: number;
  pro: number;
  range: [number, number, number];
  reloadTime: number;
  stp: number;
  weight: number;
  stabilityMod?: number;
}

export interface ItemBaseInstance {
  id: string;
  name: string;
  ammunition: Maybe<string>;
  combatTechnique: Maybe<string>;
  damageDiceSides: Maybe<number>;
  gr: number;
  isParryingWeapon: Maybe<boolean>;
  isTemplateLocked: boolean;
  reach: Maybe<number>;
  template: Maybe<string>;
  where: Maybe<string>;
  isTwoHandedWeapon: Maybe<boolean>;
  improvisedWeaponGroup: Maybe<number>;
  loss: Maybe<number>;
  forArmorZoneOnly: Maybe<boolean>;
  addPenalties: Maybe<boolean>;
  armorType: Maybe<number>;
}

export interface ItemInstance extends ItemBaseInstance {
  at: Maybe<number>;
  iniMod: Maybe<number>;
  movMod: Maybe<number>;
  damageBonus?: {
    primary: Maybe<string>;
    threshold: number | number[];
  };
  damageDiceNumber: Maybe<number>;
  damageFlat: Maybe<number>;
  enc: Maybe<number>;
  length: Maybe<number>;
  amount: number;
  pa: Maybe<number>;
  price: number;
  pro: Maybe<number>;
  range: Maybe<[number, number, number]>;
  reloadTime: Maybe<number>;
  stp: Maybe<number>;
  weight: Maybe<number>;
  stabilityMod: Maybe<number>;
  note: Maybe<string>;
  rules: Maybe<string>;
  advantage: Maybe<string>;
  disadvantage: Maybe<string>;
  src: Maybe<Wiki.SourceLink[]>;
}

export interface ItemEditorInstance extends ItemBaseInstance {
  at: string;
  iniMod: string;
  movMod: string;
  damageBonus: {
    primary: Maybe<string>;
    threshold: string | string[];
  };
  damageDiceNumber: string;
  damageFlat: string;
  enc: string;
  length: string;
  amount: string;
  pa: string;
  price: string;
  pro: string;
  range: [string, string, string];
  reloadTime: string;
  stp: string;
  weight: string;
  stabilityMod: string;
}

export interface ArmorZonesBaseInstance {
  name: string;
  head: Maybe<string>;
  headLoss: Maybe<number>;
  leftArm: Maybe<string>;
  leftArmLoss: Maybe<number>;
  rightArm: Maybe<string>;
  rightArmLoss: Maybe<number>;
  torso: Maybe<string>;
  torsoLoss: Maybe<number>;
  leftLeg: Maybe<string>;
  leftLegLoss: Maybe<number>;
  rightLeg: Maybe<string>;
  rightLegLoss: Maybe<number>;
}

export interface ArmorZonesInstance extends ArmorZonesBaseInstance {
  id: string;
}

export interface ArmorZonesEditorInstance extends ArmorZonesBaseInstance {
  id: Maybe<string>;
}

export interface SecondaryAttribute<I = string> {
  id: I;
  short: string;
  name: string;
  calc: string;
  base: number;
  add: Maybe<number>;
  mod: Maybe<number>;
  value: number | undefined;
  maxAdd: Maybe<number>;
  currentAdd: Maybe<number>;
  permanentLost: Maybe<number>;
  permanentRedeemed: Maybe<number>;
}

export interface Energy<I = string> extends SecondaryAttribute<I> {
  base: number;
  add: Just<number>;
  mod: Just<number>;
  maxAdd: Just<number>;
  currentAdd: Just<number>;
  permanentLost: Just<number>;
}

export interface EnergyWithLoss<I = string> extends Energy<I> {
  permanentRedeemed: Just<number>;
}

export interface Rules {
  higherParadeValues: number;
  attributeValueLimit: boolean;
  enableAllRuleBooks: boolean;
  enabledRuleBooks: Set<string>;
  enableLanguageSpecializations: boolean;
}

export interface HistoryPayload {
  id: Maybe<string | number>;
  activeObject: Maybe<ActiveObject>;
  index: Maybe<number>;
  list: Maybe<(string | [string, number])[]>;
  buy: Maybe<boolean>;
}

export interface HistoryObject {
  type: string;
  cost: number;
  payload: HistoryPayload;
  prevState: HistoryPrevState;
}

export interface HistoryPrevState {

}

export interface HistoryObject {
  type: string;
  cost: number;
  payload: HistoryPayload;
  prevState: HistoryPrevState;
}

export interface LanguagesSelectionListItem {
  id: string;
  name: string;
  native: Maybe<boolean>;
}

export interface ScriptsSelectionListItem {
  id: string;
  name: string;
  cost: number;
  native: Maybe<boolean>;
}

export type InputTextEvent =  React.FormEvent<HTMLInputElement>;
export type InputKeyEvent =  React.KeyboardEvent<HTMLInputElement>;

export interface SubTab {
  id: TabId;
  label: string;
  disabled: Maybe<boolean>;
  // element: JSX.Element;
}

interface PetBaseInstance {
  id: Maybe<string>;
  name: string;
  avatar: Maybe<string>;
}

export interface PetInstance extends PetBaseInstance {
  size: Maybe<string>;
  type: Maybe<string>;
  attack: Maybe<string>;
  dp: Maybe<string>;
  reach: Maybe<string>;
  actions: Maybe<string>;
  talents: Maybe<string>;
  skills: Maybe<string>;
  notes: Maybe<string>;
  spentAp: Maybe<string>;
  totalAp: Maybe<string>;
  cou: Maybe<string>;
  sgc: Maybe<string>;
  int: Maybe<string>;
  cha: Maybe<string>;
  dex: Maybe<string>;
  agi: Maybe<string>;
  con: Maybe<string>;
  str: Maybe<string>;
  lp: Maybe<string>;
  ae: Maybe<string>;
  spi: Maybe<string>;
  tou: Maybe<string>;
  pro: Maybe<string>;
  ini: Maybe<string>;
  mov: Maybe<string>;
  at: Maybe<string>;
  pa: Maybe<string>;
}

export interface PetEditorInstance extends PetBaseInstance {
  size: string;
  type: string;
  attack: string;
  dp: string;
  reach: string;
  actions: string;
  talents: string;
  skills: string;
  notes: string;
  spentAp: string;
  totalAp: string;
  cou: string;
  sgc: string;
  int: string;
  cha: string;
  dex: string;
  agi: string;
  con: string;
  str: string;
  lp: string;
  ae: string;
  spi: string;
  tou: string;
  pro: string;
  ini: string;
  mov: string;
  at: string;
  pa: string;
}

export interface AlertButtonCore {
  autoWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  flat?: boolean;
  fullWidth?: boolean;
  label: string | undefined;
  primary?: boolean;
}

export interface AlertButton extends AlertButtonCore {
  dispatchOnClick?: Action;
}

export interface ViewAlertButton extends AlertButtonCore {
  onClick?(): void;
}

export interface Alert {
  message: string;
  title?: string;
  buttons?: AlertButton[];
  confirm?: {
    resolve: Maybe<Action>;
    reject: Maybe<Action>;
  };
  confirmYesNo?: boolean;
  onClose?(): void;
}

export { UIMessages } from './ui.d';

