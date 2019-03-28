/**
 * Generates the complete name of an active `Activatable`. Also provides helper
 * functions for compressing `Activatable` name lists and combining or
 * extracting parts of the name.
 *
 * @file src/Utilities/activatableNameUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { appendStr, elem, find, flength, groupByKey, intercalate, List, map, replaceStr, subscript, subscriptF } from "../../../Data/List";
import { altF_, any, bind, bindF, elemF, ensure, fromMaybe, isJust, Just, liftM2, listToMaybe, maybe, Maybe, Nothing } from "../../../Data/Maybe";
import { elems, lookup, lookupF } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { ActivatableCombinedName } from "../../Models/View/ActivatableCombinedName";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { Advantage } from "../../Models/Wiki/Advantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { Application } from "../../Models/Wiki/sub/Application";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable, ActivatableSkillEntry, EntryWithCategory, SID, SkillishEntry } from "../../Models/Wiki/wikiTypeHelpers";
import { translate } from "../I18n";
import { ifElse } from "../ifElse";
import { dec } from "../mathUtils";
import { toRoman } from "../NumberUtils";
import { pipe } from "../pipe";
import { sortStrings } from "../sortBy";
import { isNumber, isString, misNumberM, misStringM } from "../typeCheckUtils";
import { getWikiEntry, isActivatableWikiEntry, isSkillishWikiEntry } from "../WikiUtils";
import { findSelectOption, getSelectOptionName } from "./selectionUtils";

const { skills, spells, liturgicalChants, specialAbilities } = WikiModel.AL
const { id, sid, sid2, tier } = ActiveObjectWithId.AL
const AA = ActiveActivatable.A
const name = ActiveActivatable.AL.name
const { input, select } = Advantage.AL
const { applications } = Skill.AL
const { target, specializations } = SelectOption.AL

/**
 * Returns the name of the given object. If the object is a string, it returns
 * the string.
 */
export const getFullName =
  (obj: string | Record<ActiveActivatable>): string => {
    if (typeof obj === "string") {
      return obj
    }

    return maybe (AA.name (obj))
                 ((level_name: string) => AA.name (obj) + level_name)
                 (AA.levelName (obj))
  }

/**
 * Accepts the full special ability name and returns only the text between
 * parentheses. If no parentheses were found, returns an empty string.
 */
export const getBracketedNameFromFullName =
  (full_name: string): string => {
    const result = /\((.+)\)/ .exec (full_name)

    if (result === null) {
      return ""
    }

    return result [1]
  }

/**
 * A lot of entries have customization options: Text input, select option or
 * both. This function creates a string that can be appended to the `name`
 * property of the respective record to create the full active name.
 */
const getEntrySpecificNameAddition =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActiveObjectWithId>): Maybe<string> => {
    switch (id (hero_entry)) {
      // Entry with Skill selection
      case "ADV_4":
      case "ADV_47":
      case "ADV_16":
      case "ADV_17":
      case "DISADV_48":
      case "SA_231":
      case "SA_250":
      case "SA_472":
      case "SA_473":
      case "SA_531":
      case "SA_533":
      case "SA_569":
        return pipe (
                      sid,
                      misStringM,
                      bindF (getWikiEntry (wiki)),
                      bindF<EntryWithCategory, SkillishEntry> (ensure (isSkillishWikiEntry)),
                      fmap (name)
                    )
                    (hero_entry)

      // Hatred of
      case "ADV_68":
        return pipe (
                      sid,
                      findSelectOption (wiki_entry),
                      liftM2 ((type: string | number) => (frequency: Record<SelectOption>) =>
                               `${type} (${name (frequency)})`)
                             (sid2 (hero_entry))
                    )
                    (hero_entry)

      // Personality Flaw
      case "DISADV_33":
        return pipe (
                      sid,
                      getSelectOptionName (wiki_entry),
                      fmap (option_name => maybe (option_name)

                                                 // if there is additional input, add to name
                                                 ((specialInput: string | number) =>
                                                   `${option_name}: ${specialInput}`)
                                                 (pipe (
                                                         sid,

                                                         // Check if the select option allows
                                                         // additional input
                                                         bindF<SID, number> (
                                                           ensure (
                                                             (x): x is number => isNumber (x)
                                                               && elem (x) (List (7, 8))
                                                           )
                                                         ),
                                                         bindF (() => sid2 (hero_entry))
                                                       )
                                                       (hero_entry)))
                    )
                    (hero_entry)

      // Skill Specialization
      case "SA_9":
        return pipe (
                      sid,
                      misStringM,
                      bindF (lookupF (skills (wiki))),
                      bindF (skill => pipe (
                                        sid2,

                                        // If input string use input
                                        misStringM,

                                        // Otherwise lookup application name
                                        altF_ (() => pipe (
                                                            applications,
                                                            find<Record<Application>> (pipe (
                                                              Application.AL.id,
                                                              elemF (sid2 (hero_entry))
                                                            )),
                                                            fmap (name)
                                                          )
                                                          (skill)),

                                        // Merge skill name and application name
                                        fmap (appl => `${name (skill)}: ${appl}`)
                                      )
                                      (hero_entry))
                    )
                    (hero_entry)

      // Spell/Liturgical Chant Extension
      case "SA_414":
      case "SA_663":
        return pipe (
                      sid,
                      findSelectOption (wiki_entry),
                      bindF (ext => pipe (
                                           bindF ((target_id: string) => {
                                             const acc =
                                               id (hero_entry) === "SA_414"
                                                 ? spells
                                                 : liturgicalChants

                                             return lookupF<string, ActivatableSkillEntry>
                                               (acc (wiki))
                                               (target_id)
                                           }),
                                           fmap (
                                             target_entry =>
                                               `${name (target_entry)}: ${name (ext)}`
                                           )
                                         )
                                         (target (ext))
                      )
                    )
                    (hero_entry)

      // Tradition (Zauberbarde)
      case "SA_677":
      // Tradition (Zaubertänzer)
      case "SA_678": {
        return pipe (
                      sid2,
                      misNumberM,
                      bindF (pipe (dec, subscript (translate (l10n) ("musictraditions"))))
                    )
                    (hero_entry)
      }

      // Tradition (Meistertalentierte)
      case "SA_680":
        return pipe (
                      sid,
                      misStringM,
                      bindF (lookupF (skills (wiki))),
                      fmap (skill => `: ${name (skill)}`)
                    )
                    (hero_entry)

      // Language Specialization
      case "SA_699":
        return pipe (
                      specialAbilities,
                      lookup ("SA_29"),
                      bindF (pipe (
                        findSelectOption,
                        thrush<Maybe<string | number>, Maybe<Record<SelectOption>>>
                          (sid (hero_entry))
                      )),
                      bindF (lang => pipe (
                                            sid2,
                                            bindF (
                                              ifElse<string | number, string, Maybe<string>>
                                                (isString)
                                                (Just)
                                                (spec_id => bind (specializations (lang))
                                                                 (subscriptF (spec_id - 1)))
                                            ),
                                            fmap (spec => `${name (lang)}: ${spec}`)
                                          )
                                          (hero_entry))
                    )
                    (wiki)

      default: {
        const current_sid = sid (hero_entry)

        // Text input
        if (isJust (input (wiki_entry)) && any (isString) (current_sid)) {
          return current_sid
        }

        // Plain select option
        if (isJust (select (wiki_entry))) {
          return getSelectOptionName (wiki_entry) (current_sid)
        }

        return Nothing
      }
    }
  }

/**
 * Some entries cannot use the default `name` property from wiki entries. The
 * value returned by may not use the default `name` property. For all entries
 * that do not need to handle a specific display format, the default `name`
 * property is used.
 */
const getEntrySpecificNameReplacements =
  (l10n: L10nRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActiveObjectWithId>) =>
  (mname_add: Maybe<string>): string => {
    const def = fromMaybe (name (wiki_entry))

    const maybeMap = (f: (x: string) => string) => maybe (name (wiki_entry))
                                                         (f)
                                                         (mname_add)

    switch (id (wiki_entry)) {
      // Immunity to Poison
      case "ADV_28":
      // Immunity to Disease
      case "ADV_29":
        return maybeMap (name_add => `${translate (l10n) ("immunityto")} ${name_add}`)

      // Hatred of
      case "ADV_68":
        return maybeMap (name_add => `${translate (l10n) ("hatredof")} ${name_add}`)

      // Afraid of
      case "DISADV_1":
        return maybeMap (name_add => `${translate (l10n) ("afraidof")} ${name_add}`)

      // Principles
      case "DISADV_34":
      // Obligations
      case "DISADV_50":
        return def (liftM2 ((level: number) => (name_add: string) =>
                             `${name (wiki_entry)} ${toRoman (level)} (${name_add})`)
                           (tier (hero_entry))
                           (mname_add))

      // Gebieter des [Aspekts]
      case "SA_639":
        return maybeMap (name_add => `${name (wiki_entry)} ${name_add}`)

      // Tradition (Zauberbarde)
      case "SA_677":
      // Tradition (Zaubertänzer)
      case "SA_678": {
        const part = getBracketedNameFromFullName (name (wiki_entry))

        return maybeMap (
          name_add => replaceStr (part)
                                 (`${part}: ${name_add}`)
                                 (name (wiki_entry))
        )
      }

      default:
        return maybeMap (name_add => `${name (wiki_entry)} (${name_add})`)
    }
  }

/**
 * Returns name, splitted and combined, of advantage/disadvantage/special
 * ability as a Maybe (in case the wiki entry does not exist).
 * @param instance The ActiveObject with origin id.
 * @param wiki The current hero's state.
 * @param l10n The locale-dependent messages.
 */
export const getName =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero_entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableCombinedName>> =>
    pipe (
           id,
           getWikiEntry (wiki),
           bindF<EntryWithCategory, Activatable> (ensure (isActivatableWikiEntry)),
           fmap ((wiki_entry: Activatable) => {
             const maddName = getEntrySpecificNameAddition (l10n)
                                                           (wiki)
                                                           (wiki_entry)
                                                           (hero_entry)

             const fullName = getEntrySpecificNameReplacements (l10n)
                                                               (wiki_entry)
                                                               (hero_entry)
                                                               (maddName)

             return ActivatableCombinedName ({
               name: fullName,
               baseName: name (wiki_entry),
               addName: maddName,
             })
           })
         )
         (hero_entry)

/**
 * `compressList :: L10n -> [ActiveActivatable] -> String`
 *
 * Takes a list of active Activatables and merges them together. Used to display
 * lists of Activatables on character sheet.
 */
export const compressList =
  (l10n: L10nRecord) =>
  (xs: List<Record<ActiveActivatable>>): string => {
    const grouped_xs =
      elems (groupByKey<Record<ActiveActivatable>, string> (id) (xs))

    return pipe (
                  map (
                    ifElse<List<Record<ActiveActivatable>>, string>
                      (xs_group => flength (xs_group) === 1)
                      (pipe (listToMaybe, maybe ("") (name)))
                      (xs_group => pipe (
                                          map ((x: Record<ActiveActivatable>) => {
                                            const levelPart =
                                              pipe (
                                                     AA.tier,
                                                     fmap (pipe (toRoman, appendStr (" "))),
                                                     fromMaybe ("")
                                                   )
                                                   (x)

                                            const selectOptionPart =
                                              fromMaybe ("") (AA.addName (x))

                                            return selectOptionPart + levelPart
                                          }),
                                          sortStrings (id (l10n)),
                                          intercalate (", "),
                                          x => ` (${x})`,
                                          x => maybe ("")
                                                     ((r: Record<ActiveActivatable>) =>
                                                       AA.baseName (r) + x)
                                                     (listToMaybe (xs_group))
                                        )
                                        (xs_group))
                  ),
                  sortStrings (id (l10n)),
                  intercalate (", ")
                )
                (grouped_xs)
  }
