/**
 * Generates the complete name of an active `Activatable`. Also provides helper
 * functions for compressing `Activatable` name lists and combining or
 * extracting parts of the name.
 *
 * @file src/Utilities/activatableNameUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { appendStr, flength, intercalate, List, map } from "../../../Data/List"
import { fromMaybe, listToMaybe, maybe } from "../../../Data/Maybe"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { StaticData } from "../../Models/Wiki/WikiModel"
import { ifElse } from "../ifElse"
import { toRoman } from "../NumberUtils"
import { pipe } from "../pipe"
import { sortStrings } from "../sortBy"

/**
 * Returns the name of the given object. If the object is a string, it returns
 * the string.
 */
export const getFullName =
  (obj: string | ActiveActivatable): string => {
    if (typeof obj === "string") {
      return obj
    }

    return obj.nameAndCost.naming.name
  }

/**
 * Accepts the full special ability name and returns only the text between
 * parentheses. If no parentheses were found, returns an empty string.
 */
export const getBracketedNameFromFullName =
  (full_name: string): string => {
    const result = /\((?<subname>.+)\)/u .exec (full_name)

    if (result === null || result .groups === undefined) {
      return ""
    }

    return result .groups .subname
  }

/**
 * `compressList :: L10n -> [ActiveActivatable] -> String`
 *
 * Takes a list of active Activatables and merges them together. Used to display
 * lists of Activatables on character sheet.
 */
export const compressList =
  (staticData: StaticData) =>
  (xs: List<ActiveActivatable>): string => {
    const grouped_xs =
      elems (groupByKey<ActiveActivatable, string> (x => x.nameAndCost.naming.name) (xs))

    return pipe (
                  map (
                    ifElse<List<ActiveActivatable>>
                      (xs_group => flength (xs_group) === 1)
                      (pipe (listToMaybe, maybe ("") (AAA_.name)))
                      (xs_group => pipe (
                                          map ((x: ActiveActivatable) => {
                                            const levelPart =
                                              pipe (
                                                     AAA_.level,
                                                     fmap (pipe (toRoman, appendStr (" "))),
                                                     fromMaybe ("")
                                                   )
                                                   (x)

                                            const selectOptionPart =
                                              fromMaybe ("") (AAA_.addName (x))

                                            return selectOptionPart + levelPart
                                          }),
                                          sortStrings (staticData),
                                          intercalate (", "),
                                          x => ` (${x})`,
                                          x => maybe ("")
                                                     ((r: ActiveActivatable) =>
                                                       AAA_.baseName (r) + x)
                                                     (listToMaybe (xs_group))
                                        )
                                        (xs_group))
                  ),
                  sortStrings (staticData),
                  intercalate (", ")
                )
                (grouped_xs)
  }
