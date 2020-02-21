/**
 * Generates the complete name of an active `Activatable`. Also provides helper
 * functions for compressing `Activatable` name lists and combining or
 * extracting parts of the name.
 *
 * @file src/Utilities/activatableNameUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { equals } from "../../../Data/Eq"
import { flip, thrush } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { appendStr, elem, find, flength, groupByKey, intercalate, List, map, replaceStr, subscriptF } from "../../../Data/List"
import { altF_, any, bind, bindF, elemF, ensure, fromJust, fromMaybe, isJust, Just, liftM2, listToMaybe, maybe, Maybe, Nothing, thenF } from "../../../Data/Maybe"
import { elems, lookup, lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids"
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { NumIdName } from "../../Models/NumIdName"
import { ActivatableCombinedName } from "../../Models/View/ActivatableCombinedName"
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Skill } from "../../Models/Wiki/Skill"
import { Application } from "../../Models/Wiki/sub/Application"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Activatable, ActivatableSkillEntry, EntryWithCategory, SID, SkillishEntry } from "../../Models/Wiki/wikiTypeHelpers"
import { translate } from "../I18n"
import { ifElse } from "../ifElse"
import { toRoman } from "../NumberUtils"
import { pipe, pipe_ } from "../pipe"
import { sortStrings } from "../sortBy"
import { isNumber, isString, misNumberM, misStringM } from "../typeCheckUtils"
import { getWikiEntry, isActivatableWikiEntry, isSkillishWikiEntry } from "../WikiUtils"
import { findSelectOption, getSelectOptionName } from "./selectionUtils"

const SDA = StaticData.A
const AOWIA = ActiveObjectWithId.A
const AAA_ = ActiveActivatableA_
const AAL = Advantage.AL
const SA = Skill.A
const SAL = Skill.AL
const SOA = SelectOption.A
const AA = Application.A

/**
 * Returns the name of the given object. If the object is a string, it returns
 * the string.
 */
export const getFullName =
  (obj: string | Record<ActiveActivatable>): string => {
    if (typeof obj === "string") {
      return obj
    }

    return AAA_.name (obj)
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
 * A lot of entries have customization options: Text input, select option or
 * both. This function creates a string that can be appended to the `name`
 * property of the respective record to create the full active name.
 */
const getEntrySpecificNameAddition =
  (staticData: StaticDataRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActiveObjectWithId>): Maybe<string> => {
    switch (AOWIA.id (hero_entry)) {
      // Entry with Skill selection (string id)
      case AdvantageId.Aptitude:
      case AdvantageId.ExceptionalSkill:
      case AdvantageId.ExceptionalCombatTechnique:
      case AdvantageId.WeaponAptitude:
      case DisadvantageId.Incompetent:
      case SpecialAbilityId.AdaptionZauber:
      case SpecialAbilityId.FavoriteSpellwork:
      case SpecialAbilityId.Forschungsgebiet:
      case SpecialAbilityId.Expertenwissen:
      case SpecialAbilityId.Wissensdurst:
      case SpecialAbilityId.Recherchegespuer:
      case SpecialAbilityId.Lieblingsliturgie:
        return pipe (
                      AOWIA.sid,
                      misStringM,
                      bindF (getWikiEntry (staticData)),
                      bindF<EntryWithCategory, SkillishEntry> (ensure (isSkillishWikiEntry)),
                      fmap (SAL.name)
                    )
                    (hero_entry)

      case AdvantageId.HatredOf:
        return pipe (
                      AOWIA.sid,
                      findSelectOption (wiki_entry),
                      liftM2 ((type: string | number) => (frequency: Record<SelectOption>) =>
                               `${type} (${SOA.name (frequency)})`)
                             (AOWIA.sid2 (hero_entry))
                    )
                    (hero_entry)

      case DisadvantageId.PersonalityFlaw:
        return pipe (
                      AOWIA.sid,
                      getSelectOptionName (wiki_entry),
                      fmap (option_name => maybe (option_name)

                                                 // if there is additional input, add to name
                                                 ((specialInput: string | number) =>
                                                   `${option_name}: ${specialInput}`)
                                                 (pipe (
                                                         AOWIA.sid,

                                                         // Check if the select option allows
                                                         // additional input
                                                         bindF<SID, number> (
                                                           ensure (
                                                             (x): x is number => isNumber (x)
                                                               && elem (x) (List (7, 8))
                                                           )
                                                         ),
                                                         bindF (() => AOWIA.sid2 (hero_entry))
                                                       )
                                                       (hero_entry)))
                    )
                    (hero_entry)

      case SpecialAbilityId.SkillSpecialization:
        return pipe (
                      AOWIA.sid,
                      misStringM,
                      bindF (lookupF (SDA.skills (staticData))),
                      bindF (skill => pipe (
                                        AOWIA.sid2,

                                        // If input string use input
                                        misStringM,

                                        // Otherwise lookup application name
                                        altF_ (() => pipe (
                                                            SA.applications,
                                                            find<Record<Application>> (pipe (
                                                              Application.AL.id,
                                                              elemF (AOWIA.sid2 (hero_entry))
                                                            )),
                                                            fmap (AA.name)
                                                          )
                                                          (skill)),

                                        // Merge skill name and application name
                                        fmap (appl => `${SA.name (skill)}: ${appl}`)
                                      )
                                      (hero_entry))
                    )
                    (hero_entry)

      case SpecialAbilityId.Exorzist:
        return pipe_ (
          hero_entry,
          AOWIA.tier,
          Maybe.product,
          ensure (equals (1)),
          thenF (AOWIA.sid (hero_entry)),
          findSelectOption (wiki_entry),
          fmap (SOA.name)
        )

      case SpecialAbilityId.SpellEnhancement:
      case SpecialAbilityId.ChantEnhancement:
        return pipe (
                      AOWIA.sid,
                      findSelectOption (wiki_entry),
                      bindF (ext => pipe (
                                           bindF ((target_id: string) => {
                                             const acc =
                                               AOWIA.id (hero_entry)
                                               === SpecialAbilityId.SpellEnhancement
                                                 ? SDA.spells
                                                 : SDA.liturgicalChants

                                             return lookupF<string, ActivatableSkillEntry>
                                               (acc (staticData))
                                               (target_id)
                                           }),
                                           fmap (
                                             target_entry =>
                                               `${SAL.name (target_entry)}: ${SOA.name (ext)}`
                                           )
                                         )
                                         (SOA.target (ext)))
                    )
                    (hero_entry)

      case SpecialAbilityId.TraditionArcaneBard: {
        return pipe (
                      AOWIA.sid2,
                      misNumberM,
                      bindF (lookupF (SDA.arcaneBardTraditions (staticData))),
                      fmap (NumIdName.A.name)
                    )
                    (hero_entry)
      }

      case SpecialAbilityId.TraditionArcaneDancer: {
        return pipe (
                      AOWIA.sid2,
                      misNumberM,
                      bindF (lookupF (SDA.arcaneDancerTraditions (staticData))),
                      fmap (NumIdName.A.name)
                    )
                    (hero_entry)
      }

      case SpecialAbilityId.TraditionSavant:
        return pipe (
                      AOWIA.sid,
                      misStringM,
                      bindF (lookupF (SDA.skills (staticData))),
                      fmap (SA.name)
                    )
                    (hero_entry)

      case SpecialAbilityId.LanguageSpecializations:
        return pipe (
                      SDA.specialAbilities,
                      lookup<string> (SpecialAbilityId.Language),
                      bindF (pipe (
                        findSelectOption,
                        thrush (AOWIA.sid (hero_entry))
                      )),
                      bindF (lang => pipe (
                                            AOWIA.sid2,
                                            bindF (
                                              ifElse<string | number, string>
                                                (isString)
                                                <Maybe<string>>
                                                (Just)
                                                (spec_id => bind (SOA.specializations (lang))
                                                                 (subscriptF (spec_id - 1)))
                                            ),
                                            fmap (spec => `${SOA.name (lang)}: ${spec}`)
                                          )
                                          (hero_entry))
                    )
                    (staticData)

      default: {
        const current_sid = AOWIA.sid (hero_entry)
        const current_sid2 = AOWIA.sid2 (hero_entry)

        // Text input
        if (isJust (AAL.input (wiki_entry)) && any (isString) (current_sid)) {
          return current_sid
        }

        // Select option and text input
        if (isJust (AAL.select (wiki_entry))
            && isJust (AAL.input (wiki_entry))
            && isJust (current_sid)
            && any (isString) (current_sid2)) {
          const name1 = fromMaybe ("") (getSelectOptionName (wiki_entry) (current_sid))
          const name2 = fromJust (current_sid2)

          return Just (`${name1}: ${name2}`)
        }

        // Plain select option
        if (isJust (AAL.select (wiki_entry))) {
          return getSelectOptionName (wiki_entry) (current_sid)
        }

        return Nothing
      }
    }
  }

const addSndinParenthesis = (snd: string) => replaceStr (")") (`: ${snd})`)

/**
 * Some entries cannot use the default `name` property from wiki entries. The
 * value returned by may not use the default `name` property. For all entries
 * that do not need to handle a specific display format, the default `name`
 * property is used.
 */
const getEntrySpecificNameReplacements =
  (staticData: StaticDataRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActiveObjectWithId>) =>
  (mname_add: Maybe<string>): string => {
    const def = fromMaybe (AAL.name (wiki_entry))

    const maybeMap = (f: (x: string) => string) => maybe (AAL.name (wiki_entry))
                                                         (f)
                                                         (mname_add)

    switch (AAL.id (wiki_entry)) {
      case AdvantageId.ImmunityToPoison:
      case AdvantageId.ImmunityToDisease:
        return maybeMap (
          name_add => `${translate (staticData) ("advantagesdisadvantages.immunityto")} ${name_add}`
        )

      case AdvantageId.HatredOf:
        return maybeMap (
          name_add => `${translate (staticData) ("advantagesdisadvantages.hatredfor")} ${name_add}`
        )

      case DisadvantageId.AfraidOf:
        return maybeMap (
          name_add => `${translate (staticData) ("advantagesdisadvantages.afraidof")} ${name_add}`
        )

      case DisadvantageId.Principles:
      case DisadvantageId.Obligations:
        return def (liftM2 ((level: number) => (name_add: string) =>
                             `${AAL.name (wiki_entry)} ${toRoman (level)} (${name_add})`)
                           (AOWIA.tier (hero_entry))
                           (mname_add))

      case SpecialAbilityId.GebieterDesAspekts:
        return maybeMap (name_add => `${AAL.name (wiki_entry)} ${name_add}`)

      case SpecialAbilityId.TraditionArcaneBard:
      case SpecialAbilityId.TraditionArcaneDancer:
      case SpecialAbilityId.TraditionSavant: {
        return maybeMap (flip (addSndinParenthesis) (AAL.name (wiki_entry)))
      }

      default:
        return maybeMap (name_add => `${AAL.name (wiki_entry)} (${name_add})`)
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
  (staticData: StaticDataRecord) =>
  (hero_entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableCombinedName>> =>
    pipe (
           AOWIA.id,
           getWikiEntry (staticData),
           bindF<EntryWithCategory, Activatable> (ensure (isActivatableWikiEntry)),
           fmap ((wiki_entry: Activatable) => {
             const maddName = getEntrySpecificNameAddition (staticData)
                                                           (wiki_entry)
                                                           (hero_entry)

             const fullName = getEntrySpecificNameReplacements (staticData)
                                                               (wiki_entry)
                                                               (hero_entry)
                                                               (maddName)

             return ActivatableCombinedName ({
               name: fullName,
               baseName: AAL.name (wiki_entry),
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
  (staticData: StaticDataRecord) =>
  (xs: List<Record<ActiveActivatable>>): string => {
    const grouped_xs =
      elems (groupByKey<Record<ActiveActivatable>, string> (AAA_.id) (xs))

    return pipe (
                  map (
                    ifElse<List<Record<ActiveActivatable>>>
                      (xs_group => flength (xs_group) === 1)
                      (pipe (listToMaybe, maybe ("") (AAA_.name)))
                      (xs_group => pipe (
                                          map ((x: Record<ActiveActivatable>) => {
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
                                                     ((r: Record<ActiveActivatable>) =>
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
