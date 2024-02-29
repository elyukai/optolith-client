import {
  ActivatableIdentifier,
  RequirableSelectOptionIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import { Preconditions } from "optolith-database-schema/types/prerequisites/ConditionalPrerequisites"
import { equalsIdentifier } from "../identifier.ts"
import { ActivatableInstance, PredefinedActivatableOption } from "./activatableEntry.ts"

/**
 * A dependency on an activatable entry.
 */
export type ActivatableDependency = Readonly<{
  /**
   * The identifier of the dependency source.
   */
  sourceId: ActivatableIdentifier

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean

  /**
   * If the required entry should be required to be active or inactive.
   */
  active: boolean

  /**
   * The required minimum level of the entry.
   */
  level?: number

  /**
   * Required select options. Order is important. Typically, you only need the
   * first array index, though.
   */
  options?: RequirableSelectOptionIdentifier[]

  when?: Preconditions
}>

/**
 * Returns whether the given dependency is a general dependency, i.e. it does
 * not require a specific level or options, just the entry in general.
 */
export const isGeneralDependency = (dependency: ActivatableDependency) =>
  dependency.level === undefined && dependency.options === undefined

/**
 * Returns whether the given dependency strictly, i.e. with exactly matching
 * options array, applies to the given activatable instance.
 */
export const appliesToInstanceStrict = (
  dependency: ActivatableDependency,
  instance: ActivatableInstance,
) =>
  dependency.options === undefined ||
  dependency.options.every(
    (depOpt, i) =>
      instance.options?.[i]?.type === "Predefined" &&
      equalsIdentifier(depOpt, (instance.options![i] as PredefinedActivatableOption).id),
  )

/**
 * Returns whether the given dependency applies loosely, i.e. the options from
 * the options array are included in the instance options, to the given
 * activatable instance.
 */
export const appliesToInstanceLoose = (
  dependency: ActivatableDependency,
  instance: ActivatableInstance,
) =>
  dependency.options === undefined ||
  dependency.options.every(
    depOpt =>
      instance.options?.some(
        opt => opt.type === "Predefined" && equalsIdentifier(depOpt, opt.id),
      ) ?? false,
  )
