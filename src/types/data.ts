import { ActivatableDependent } from "../App/Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../App/Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeDependent } from "../App/Models/ActiveEntries/AttributeDependent";
import { DependencyObject } from "../App/Models/ActiveEntries/DependencyObject";
import { SkillDependent } from "../App/Models/ActiveEntries/SkillDependent";
import { EditPrimaryAttributeDamageThreshold } from "../App/Models/Hero/EditPrimaryAttributeDamageThreshold";
import { HitZoneArmorBase } from "../App/Models/Hero/HitZoneArmor";
import { SkillOptionalDependency } from "../App/Models/Hero/SkillOptionalDependency";
import * as Wiki from "../App/Models/Wiki/wikiTypeHelpers";
import { TabId } from "../App/Utils/LocationUtils";
import { List } from "../Data/List";
import { Maybe } from "../Data/Maybe";
import { OrderedMap } from "../Data/OrderedMap";
import { OrderedSet } from "../Data/OrderedSet";
import { Pair } from "../Data/Pair";
import { Omit, Record, RecordI } from "../Data/Record";
import { DCIds } from "../selectors/derivedCharacteristicsSelectors";
import { ActiveObject } from "../utils/activeEntries/ActiveObject";
import { SelectOption } from "../utils/wikiData/sub/SelectOption";
import { AllAction } from "./actions";

export type ExtendedSkillDependent =
  Record<SkillDependent> |
  Record<ActivatableSkillDependent>

export type ExtendedActivatableDependent =
  Record<ActivatableDependent> |
  Record<ActivatableSkillDependent>

export type ValueBasedDependent =
  Record<AttributeDependent> |
  Record<SkillDependent> |
  Record<ActivatableSkillDependent>

export type Dependent =
  Record<ActivatableDependent> |
  Record<AttributeDependent> |
  Record<SkillDependent> |
  Record<ActivatableSkillDependent>

export type ActivatableDependency = boolean | Record<DependencyObject>
export type SkillDependency = number | Record<SkillOptionalDependency>
export type ExtendedSkillDependency = boolean | SkillDependency

export type Sex = "m" | "f"

export interface User {
  id: string
  displayName: string
}

export interface Selections {
  attributeAdjustment: string
  useCulturePackage: boolean
  motherTongue: number
  isBuyingMainScriptEnabled: boolean
  mainScript: number
  cantrips: OrderedSet<string>
  combatTechniques: OrderedSet<string>
  combatTechniquesSecond: OrderedSet<string>
  curses: OrderedMap<string, number>
  languages: OrderedMap<number, number>
  scripts: OrderedMap<number, number>
  skills: OrderedMap<string, number>
  specialization: Maybe<number | string>
  specializationSkillId: Maybe<string>
  terrainKnowledge: Maybe<number>
  map: OrderedMap<Wiki.ProfessionSelectionIds, Wiki.AnyProfessionSelection>
}

export interface ActiveObjectName extends ActiveObject {
  name: string
}

export interface ActiveObjectWithId extends ActiveObject {
  id: string
  index: number
}

export interface ActivatableCombinedName {
  name: string
  baseName: string
  addName: Maybe<string>
}

export interface ActivatableNameCost
  extends Omit<ActiveObjectWithId, "cost">, ActivatableCombinedName {
  finalCost: number | List<number>
}

export interface ActivatableNameCostActive extends ActivatableNameCost {
  active: boolean
}

export interface ActivatableNameCostEvalTier extends ActivatableNameCost {
  tierName: Maybe<string>
}

export interface ActivatableNameAdjustedCostEvalTier extends ActivatableNameCostEvalTier {
  finalCost: number
}

export interface ActivatableActivationValidationObject extends ActiveObjectWithId {
  disabled: boolean
  maxLevel: Maybe<number>
  minLevel: Maybe<number>
}

export interface ActivatableActivationMeta<
  T extends RecordI<Wiki.Activatable> = RecordI<Wiki.Activatable>
> {
  stateEntry: Record<ActivatableDependent>
  wikiEntry: Record<T>
  customCost: Maybe<boolean>
}

export interface DeactiveViewObject<
  T extends RecordI<Wiki.Activatable> = RecordI<Wiki.Activatable>
> {
  id: string
  name: string
  cost: Maybe<string | number | List<number>>
  minTier: Maybe<number>
  maxTier: Maybe<number>
  sel: Maybe<List<Record<SelectOption>>>
  stateEntry: Maybe<Record<ActivatableDependent>>
  wikiEntry: Record<T>
  customCostDisabled: Maybe<boolean>
}

export type SetTierObject = ActiveObject

export interface ActivateArgs {
  id: string
  sel: Maybe<string | number>
  sel2: Maybe<string | number>
  input: Maybe<string>
  tier: Maybe<number>
  cost: number
  customCost: Maybe<number>
}

export interface DeactivateArgs {
  id: string
  index: number
  cost: number
}

export interface UndoExtendedDeactivateArgs extends DeactivateArgs {
  activeObject: Maybe<Record<ActiveObject>>
}

export interface ActivateObject {
  sel: Maybe<string | number>
  sel2: Maybe<string | number>
  input: Maybe<string>
  tier: Maybe<number>
  cost: Maybe<number>
}

export interface ValidationObject extends ActiveObject {
  id: string
  active: boolean | number
}

export interface ProfessionDependencyCost {
  total: number
  adv: [number, number, number]
  disadv: [number, number, number]
}

export type UnionPlainAndMap<T> = T | OrderedMap<number, T>

export interface StyleDependency {
  /**
   * The extended special ability or list of available special abilities.
   */
  id: string | List<string>
  /**
   * If a ability meets a given id, the id, otherwise `undefined`.
   */
  active: Maybe<string>
  /**
   * The style's id.
   */
  origin: string
}

export enum EntryRating {
  Common = "Common",
  Uncommon = "Uncommon",
  Essential = "Essential",
}

export interface ItemEditorSpecific {
  id: Maybe<string>
  at: string
  iniMod: string
  movMod: string
  damageBonus: Record<EditPrimaryAttributeDamageThreshold>
  damageDiceNumber: string
  damageFlat: string
  enc: string
  length: string
  amount: string
  pa: string
  price: string
  pro: string
  range: List<string>
  reloadTime: string
  stp: string
  weight: string
  stabilityMod: string
}

export interface ArmorZonesEditorInstance extends HitZoneArmorBase {
  id: Maybe<string>
}

interface DerivedCharacteristicBase<I extends DCIds = DCIds> {
  id: I
  short: string
  name: string
  calc: string
  base: Maybe<number>
  value: Maybe<number>
}

export interface DerivedCharacteristic<I extends DCIds = DCIds>
  extends DerivedCharacteristicBase<I> {
    add: Maybe<number>
    mod: Maybe<number>
    maxAdd: Maybe<number>
    currentAdd: Maybe<number>
    permanentLost: Maybe<number>
    permanentRedeemed: Maybe<number>
  }

export interface Energy<I extends DCIds = DCIds> extends DerivedCharacteristicBase<I> {
  add: number
  mod: number
  maxAdd: number
  currentAdd: number
  permanentLost: number
  permanentRedeemed: Maybe<number>
}

export interface EnergyWithLoss<I extends DCIds = DCIds> extends DerivedCharacteristicBase<I> {
  add: number
  mod: number
  maxAdd: number
  currentAdd: number
  permanentLost: number
  permanentRedeemed: number
}

export interface HistoryPayload {
  id: Maybe<string | number>
  activeObject: Maybe<Record<ActiveObject>>
  index: Maybe<number>
  list: Maybe<List<string | Pair<string, number>>>
  buy: Maybe<boolean>
}

export interface HistoryObject {
  type: string
  cost: number
  payload: Record<HistoryPayload>
  prevState: Record<HistoryPrevState>
}

export interface HistoryPrevState {

}

export type InputTextEvent = React.FormEvent<HTMLInputElement>
export type InputKeyEvent = React.KeyboardEvent<HTMLInputElement>

export interface SubTab {
  id: TabId
  label: string
  disabled: Maybe<boolean>
  // element: JSX.Element
}

export interface AlertButtonCore {
  autoWidth?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  flat?: boolean
  fullWidth?: boolean
  label: string | undefined
  primary?: boolean
}

export interface AlertButton extends AlertButtonCore {
  dispatchOnClick?: AllAction
}

export interface ViewAlertButton extends AlertButtonCore {
  onClick? (): void
}

interface AlertConfirm {
  resolve?: AllAction
  reject?: AllAction
}

export interface Alert {
  message: string
  title?: string
  buttons?: AlertButton[]
  confirm?: AlertConfirm
  confirmYesNo?: boolean
  onClose? (): void
}
