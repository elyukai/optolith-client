import React from "react"
import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { OrderedSet } from "../../../Data/OrderedSet"
import { Record, RecordI } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { TabId } from "../../Utilities/LocationUtils"
import { ActivatableDependent } from "../ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent"
import { ActiveObject } from "../ActiveEntries/ActiveObject"
import { AttributeDependent } from "../ActiveEntries/AttributeDependent"
import { DependencyObject } from "../ActiveEntries/DependencyObject"
import { SkillDependent } from "../ActiveEntries/SkillDependent"
import { ProfessionSelections } from "../Wiki/professionSelections/ProfessionAdjustmentSelections"
import * as Wiki from "../Wiki/wikiTypeHelpers"
import { EditPrimaryAttributeDamageThreshold } from "./EditPrimaryAttributeDamageThreshold"
import { SkillOptionalDependency } from "./SkillOptionalDependency"

export type ExtendedSkillDependent = Record<SkillDependent>
                                   | Record<ActivatableSkillDependent>

export type ExtendedActivatableDependent = Record<ActivatableDependent>
                                         | Record<ActivatableSkillDependent>

export type ValueBasedDependent = Record<AttributeDependent>
                                | Record<SkillDependent>
                                | Record<ActivatableSkillDependent>

export type Dependent = Record<ActivatableDependent>
                      | Record<AttributeDependent>
                      | Record<SkillDependent>
                      | Record<ActivatableSkillDependent>

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
  unfamiliarSpell: Maybe<string>
  map: Record<ProfessionSelections>
}

export interface ActiveObjectName extends ActiveObject {
  name: string
}

export interface ActivatableActivationMeta<
  T extends RecordI<Wiki.Activatable> = RecordI<Wiki.Activatable>
> {
  stateEntry: Record<ActivatableDependent>
  wikiEntry: Record<T>
}

export type SetTierObject = ActiveObject

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

export type EditRange = Readonly<{ close: string; medium: string; far: string }>

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
  range: EditRange
  reloadTime: string
  stp: string
  weight: string
  stabilityMod: string
}

export interface HistoryPayload {
  "@@name": "HistoryPayload"
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
  "@@name": "HistoryPrevState"
}

export type InputTextEvent = React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
export type InputKeyEvent = React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>

export interface SubTab {
  id: TabId
  label: string
  disabled: boolean

  // element: JSX.Element
}
