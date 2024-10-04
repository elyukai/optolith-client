import { FocusRule } from "optolith-database-schema/types/rule/FocusRule"
import { romanize } from "../../utils/roman.ts"
import { GetById } from "../getTypes.ts"
import { createLibraryEntryCreator } from "../libraryEntry.ts"
import { RuleDependency } from "./ruleDependency.ts"

/**
 * A character’s focus rule instance.
 */
export type FocusRuleInstance = {
  /**
   * The focus rule identifier.
   */
  id: number

  active: boolean

  /**
   * Dependencies on the focus rule being active.
   */
  dependencies: RuleDependency[]
}

/**
 * Creates an instance of a focus rule.
 */
export const createFocusRule = (id: number): FocusRuleInstance => ({
  id,
  active: false,
  dependencies: [],
})

/**
 * Checks if a focus rule is active.
 */
export const isFocusRuleActive = (
  getDynamicFocusRuleById: GetById.Dynamic.FocusRule,
  focusRuleId: number,
): boolean => getDynamicFocusRuleById(focusRuleId)?.active ?? false

/**
 * Get a JSON representation of the rules text for a focus rule.
 */
export const getFocusRuleLibraryEntry = createLibraryEntryCreator<
  FocusRule,
  { getSubjectById: GetById.Static.Subject }
>((entry, { getSubjectById }) => ({ translateMap }) => {
  const translation = translateMap(entry.translations)

  if (translation === undefined) {
    return undefined
  }

  return {
    title: `${translation.name} (${romanize(entry.level)})`,
    subtitle: translateMap(getSubjectById(entry.subject.id.subject)?.translations)?.name,
    className: "focus-rule",
    content: [{ value: translation.description }],
    src: entry.src,
  }
})
