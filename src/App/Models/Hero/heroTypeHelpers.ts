import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { Pair } from "../../../Data/Pair";
import { Omit, Record, RecordI } from "../../../Data/Record";
import { AllAction } from "../../../types/actions";
import { DCIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { TabId } from "../../Utilities/LocationUtils";
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../ActiveEntries/ActiveObject";
import { ActiveObjectWithId } from "../ActiveEntries/ActiveObjectWithId";
import { AttributeDependent } from "../ActiveEntries/AttributeDependent";
import { DependencyObject } from "../ActiveEntries/DependencyObject";
import { SkillDependent } from "../ActiveEntries/SkillDependent";
import { ActivatableCombinedName } from "../View/ActivatableCombinedName";
import * as Wiki from "../Wiki/wikiTypeHelpers";
import { EditPrimaryAttributeDamageThreshold } from "./EditPrimaryAttributeDamageThreshold";
import { HitZoneArmorBase } from "./HitZoneArmor";
import { SkillOptionalDependency } from "./SkillOptionalDependency";

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

export interface ActivatableActivationMeta<
  T extends RecordI<Wiki.Activatable> = RecordI<Wiki.Activatable>
> {
  stateEntry: Record<ActivatableDependent>
  wikiEntry: Record<T>
  customCost: Maybe<boolean>
}

export type SetTierObject = ActiveObject

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
