import { equals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { append, filter, find, flength, List, notNull } from "../../../Data/List"
import { bindF, elemF, ensure, fromMaybe, joinMaybeList, Just, liftM2, Maybe, maybe, maybeToList, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids.gen"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { Advantage } from "../../Models/Wiki/Advantage"
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement"
import { RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement"
import { Application } from "../../Models/Wiki/sub/Application"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Activatable, AllRequirementObjects, AllRequirements } from "../../Models/Wiki/wikiTypeHelpers"
import { findSelectOption } from "../Activatable/selectionUtils"
import { prefixSA } from "../IDUtils"
import { getMagicalTraditionsWithRituals } from "../magicalTraditionUtils"
import { pipe, pipe_ } from "../pipe"
import { misStringM } from "../typeCheckUtils"

const AAL = Advantage.AL
const AOA = ActiveObject.A
const ADA = ActivatableDependent.A
const SOA = SelectOption.A

/**
 * Some advantages, disadvantages and special abilities need more prerequisites
 * than given in their respective main array.
 * @param wikiEntry The entry for which you want to add the dependencies.
 * @param instance The state entry *before* adding or removing the active
 * object.
 * @param active The actual active object.
 * @param add States if the prerequisites should be added or removed (some
 * prerequisites must be calculated based on that).
 */
export const getGeneratedPrerequisites =
  (add: boolean) =>
  (static_data: StaticDataRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>
  (current: Record<ActiveObject>): Maybe<List<AllRequirementObjects>> => {
    const sid = AOA.sid (current)
    const sid2 = AOA.sid2 (current)

    const addToSelectOptionReqs =
      (xs: Maybe<List<AllRequirementObjects>>) =>
        pipe_ (
          findSelectOption (wiki_entry) (sid),
          bindF (SelectOption.AL.prerequisites),
          maybe (xs) (pipe (append (joinMaybeList (xs)), Just))
        )

    switch (AAL.id (wiki_entry)) {
      case AdvantageId.aptitude:
        return Just (List (
          RequireActivatable ({
            id: DisadvantageId.incompetent,
            active: false,
            sid,
          })
        ))

      case AdvantageId.exceptionalSkill:
        return Just (List (
          RequireActivatable ({
            id: DisadvantageId.incompetent,
            active: false,
            sid,
          })
        ))

      case AdvantageId.magicalAttunement:
        return Just (List (
          RequireActivatable ({
            id: DisadvantageId.magicalRestriction,
            active: false,
            sid,
          })
        ))

      case DisadvantageId.magicalRestriction:
        return Just (List (
          RequireActivatable ({
            id: AdvantageId.magicalAttunement,
            active: false,
            sid,
          })
        ))

      case DisadvantageId.incompetent:
        return Just (List (
          RequireActivatable ({
            id: AdvantageId.aptitude,
            active: false,
            sid,
          }),
          RequireActivatable ({
            id: AdvantageId.exceptionalSkill,
            active: false,
            sid,
          })
        ))

      case SpecialAbilityId.skillSpecialization: {
        const sameSkill = maybe (0)
                                (pipe (
                                  ADA.active,
                                  filter (pipe (AOA.sid, equals (sid))),
                                  flength
                                ))
                                (hero_entry)

        const sameSkillDependency =
          fmap ((justSid: string | number) => RequireIncreasable ({
                 id: justSid as string,
                 value: (sameSkill + (add ? 1 : 0)) * 6,
               }))
               (sid)

        return pipe (
                      bindF (SOA.applications),
                      bindF (find (pipe (Application.A.id, elemF (sid2)))),
                      bindF (Application.A.prerequisite),
                      maybeToList,
                      append<AllRequirementObjects> (maybeToList (sameSkillDependency)),
                      ensure (notNull)
                    )
                    (findSelectOption (wiki_entry) (sid))
      }

      case SpecialAbilityId.propertyFocus:
        return addToSelectOptionReqs (Just (List (
          RequireActivatable ({
            id: SpecialAbilityId.propertyKnowledge,
            active: true,
            sid,
          })
        )))

      case SpecialAbilityId.adaptionZauber:
        return pipe_ (
          sid,
          misStringM,
          fmap (id => List (RequireIncreasable ({
                              id,
                              value: 10,
                            })))
        )

      case SpecialAbilityId.favoriteSpellwork:
        return pipe_ (
          sid,
          misStringM,
          fmap (id => List (RequireActivatable ({
                              id,
                              active: true,
                            })))
        )

      case prefixSA (SpecialAbilityId.spellEnhancement):
      case prefixSA (SpecialAbilityId.chantEnhancement):
        return addToSelectOptionReqs (bindF ((option: Record<SelectOption>) =>
                                              liftM2 ((target: string) => (level: number) =>
                                                       List (
                                                         RequireIncreasable ({
                                                           id: target,
                                                           value: level * 4 + 4,
                                                         })
                                                       ))
                                                     (SOA.target (option))
                                                     (SOA.level (option)))
                                            (findSelectOption (wiki_entry) (sid)))

      case SpecialAbilityId.languageSpecializations: {
        return addToSelectOptionReqs (Just (List (
          RequireActivatable ({
            id: SpecialAbilityId.language,
            active: true,
            sid,
            tier: Just (3),
          })
        )))
      }

      case SpecialAbilityId.kraftliniennutzung: {
        return pipe_ (
          static_data,
          getMagicalTraditionsWithRituals,
          ensure (notNull),
          fmap (xs => List (
            RequireActivatable ({
              id: xs,
              active: true,
            })
          )),
          addToSelectOptionReqs
        )
      }

      default:
        return addToSelectOptionReqs (Nothing)
    }
  }

export const addDynamicPrerequisites =
  (add: boolean) =>
  (static_data: StaticDataRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>
  (static_prerequisites: List<AllRequirements>) =>
  (current: Record<ActiveObject>): List<AllRequirements> =>
    fromMaybe (static_prerequisites)
              (fmap (append (static_prerequisites))
                    (getGeneratedPrerequisites (add)
                                               (static_data)
                                               (wiki_entry)
                                               (hero_entry)
                                               (current)))
