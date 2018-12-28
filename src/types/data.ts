import { DCIds } from '../selectors/derivedCharacteristicsSelectors';
import { ActivatableDependent } from '../utils/activeEntries/ActivatableDependent';
import { ActivatableSkillDependent } from '../utils/activeEntries/ActivatableSkillDependent';
import { AttributeDependent } from '../utils/activeEntries/AttributeDependent';
import { DependencyObject } from '../utils/activeEntries/DependencyObject';
import { SkillDependent } from '../utils/activeEntries/SkillDependent';
import { TabId } from '../utils/LocationUtils';
import { List } from '../utils/structures/List';
import { Maybe } from '../utils/structures/Maybe';
import { OrderedMap } from '../utils/structures/OrderedMap';
import { OrderedSet } from '../utils/structures/OrderedSet';
import { Pair } from '../utils/structures/Pair';
import { Omit, Record, RecordInterface } from '../utils/structures/Record';
import { SelectOption } from '../utils/wikiData/sub/SelectOption';
import { AllAction } from './actions';
import * as Wiki from './wiki';

export type ExtendedSkillDependent =
  Record<SkillDependent> |
  Record<ActivatableSkillDependent>;

export type ExtendedActivatableDependent =
  Record<ActivatableDependent> |
  Record<ActivatableSkillDependent>;

export type ValueBasedDependent =
  Record<AttributeDependent> |
  Record<SkillDependent> |
  Record<ActivatableSkillDependent>;

export type Dependent =
  Record<ActivatableDependent> |
  Record<AttributeDependent> |
  Record<SkillDependent> |
  Record<ActivatableSkillDependent>;

export type ActivatableDependency = boolean | Record<DependencyObject>;
export type SkillDependency = number | Record<SkillOptionalDependency>;
export type ExtendedSkillDependency = boolean | SkillDependency;

export type Sex = 'm' | 'f';

export interface User {
  id: string;
  displayName: string;
}

export interface Selections {
  attributeAdjustment: string;
  useCulturePackage: boolean;
  motherTongue: number;
  isBuyingMainScriptEnabled: boolean;
  mainScript: number;
  cantrips: OrderedSet<string>;
  combatTechniques: OrderedSet<string>;
  combatTechniquesSecond: OrderedSet<string>;
  curses: OrderedMap<string, number>;
  languages: OrderedMap<number, number>;
  scripts: OrderedMap<number, number>;
  skills: OrderedMap<string, number>;
  specialization: Maybe<number | string>;
  specializationSkillId: Maybe<string>;
  terrainKnowledge: Maybe<number>;
  map: OrderedMap<Wiki.ProfessionSelectionIds, Wiki.ProfessionSelection>;
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

export interface ActivatableCombinedName {
  name: string;
  baseName: string;
  addName?: string;
}

export interface ActivatableNameCost
  extends Omit<ActiveObjectWithId, 'cost'>, ActivatableCombinedName {
  finalCost: number | List<number>;
}

export interface ActivatableNameCostActive extends ActivatableNameCost {
  active: boolean;
}

export interface ActivatableNameCostEvalTier extends ActivatableNameCost {
  tierName?: string;
}

export interface ActivatableNameAdjustedCostEvalTier extends ActivatableNameCostEvalTier {
  finalCost: number;
}

export interface ActivatableActivationValidationObject extends ActiveObjectWithId {
  disabled: boolean;
  maxTier?: number;
  minTier?: number;
}

export interface ActivatableActivationMeta<
  T extends RecordInterface<Wiki.Activatable> = RecordInterface<Wiki.Activatable>
> {
  stateEntry: Record<ActivatableDependent>;
  wikiEntry: Record<T>;
  customCost?: boolean;
}

export type ActiveViewObject<
  T extends RecordInterface<Wiki.Activatable> = RecordInterface<Wiki.Activatable>
> =
  ActivatableNameAdjustedCostEvalTier
  & ActivatableActivationValidationObject
  & ActivatableActivationMeta<T>;

export interface DeactiveViewObject<
  T extends RecordInterface<Wiki.Activatable> = RecordInterface<Wiki.Activatable>
> {
  id: string;
  name: string;
  cost?: string | number | List<number>;
  minTier?: number;
  maxTier?: number;
  sel?: List<Record<SelectOption>>;
  stateEntry?: Record<ActivatableDependent>;
  wikiEntry: Record<T>;
  customCostDisabled?: boolean;
}

export type SetTierObject = ActiveObject;

export interface ActivateArgs {
  id: string;
  sel?: string | number;
  sel2?: string | number;
  input?: string;
  tier?: number;
  cost: number;
  customCost?: number;
}

export interface DeactivateArgs {
  id: string;
  index: number;
  cost: number;
}

export interface UndoExtendedDeactivateArgs extends DeactivateArgs {
  activeObject?: Record<ActiveObject>;
}

export interface ActivateObject {
  sel?: string | number;
  sel2?: string | number;
  input?: string;
  tier?: number;
  cost?: number;
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

export type UnionPlainAndMap<T> = T | OrderedMap<number, T>;

export interface StyleDependency {
  /**
   * The extended special ability or list of available special abilities.
   */
  id: string | List<string>;
  /**
   * If a ability meets a given id, the id, otherwise `undefined`.
   */
  active?: string;
  /**
   * The style's id.
   */
  origin: string;
}

export enum EntryRating {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Essential = 'Essential',
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

export interface ItemEditorSpecific {
  id: Maybe<string>;
  at: string;
  iniMod: string;
  movMod: string;
  damageBonus: Record<EditPrimaryAttributeDamageThreshold>;
  damageDiceNumber: string;
  damageFlat: string;
  enc: string;
  length: string;
  amount: string;
  pa: string;
  price: string;
  pro: string;
  range: List<string>;
  reloadTime: string;
  stp: string;
  weight: string;
  stabilityMod: string;
}

export interface ArmorZonesEditorInstance extends ArmorZonesBaseInstance {
  id: Maybe<string>;
}

export interface SecondaryAttribute<I extends DCIds = DCIds> {
  id: I;
  short: string;
  name: string;
  calc: string;
  base?: number;
  add?: number;
  mod?: number;
  value?: number;
  maxAdd?: number;
  currentAdd?: number;
  permanentLost?: number;
  permanentRedeemed?: number;
}

export interface Energy<I extends DCIds = DCIds> extends SecondaryAttribute<I> {
  add: number;
  mod: number;
  maxAdd: number;
  currentAdd: number;
  permanentLost: number;
}

export interface EnergyWithLoss<I extends DCIds = DCIds> extends Energy<I> {
  permanentRedeemed: number;
}

export interface HistoryPayload {
  id?: string | number;
  activeObject?: Record<ActiveObject>;
  index?: number;
  list?: List<string | Pair<string, number>>;
  buy?: boolean;
}

export interface HistoryObject {
  type: string;
  cost: number;
  payload: Record<HistoryPayload>;
  prevState: Record<HistoryPrevState>;
}

export interface HistoryPrevState {

}

export interface LanguagesSelectionListItem {
  id: number;
  name: string;
  native: boolean;
}

export interface ScriptsSelectionListItem {
  id: number;
  name: string;
  cost: number;
  native: boolean;
}

export type InputTextEvent = React.FormEvent<HTMLInputElement>;
export type InputKeyEvent = React.KeyboardEvent<HTMLInputElement>;

export interface SubTab {
  id: TabId;
  label: string;
  disabled?: boolean;
  // element: JSX.Element;
}

interface PetBaseInstance {
  name: string;
  avatar: Maybe<string>;
}

export interface PetInstance extends PetBaseInstance {
  id: string;
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

export interface PetEditorSpecific {
  id: Maybe<string>;
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

export interface PetEditorInstance extends PetBaseInstance, PetEditorSpecific { }

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
  dispatchOnClick?: AllAction;
}

export interface ViewAlertButton extends AlertButtonCore {
  onClick? (): void;
}

export interface Alert {
  message: string;
  title?: string;
  buttons?: AlertButton[];
  confirm?: {
    resolve?: AllAction;
    reject?: AllAction;
  };
  confirmYesNo?: boolean;
  onClose? (): void;
}

export { UIMessages, UIMessagesObject } from './ui';

