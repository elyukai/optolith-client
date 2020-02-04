import { equals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { append, consF, filter, find, flength, List } from "../../../Data/List"
import { altF, ap, bindF, elemF, fromMaybe, joinMaybeList, Just, liftM2, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { Advantage } from "../../Models/Wiki/Advantage"
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement"
import { RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement"
import { Application } from "../../Models/Wiki/sub/Application"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { Activatable, AllRequirementObjects, AllRequirements } from "../../Models/Wiki/wikiTypeHelpers"
import { findSelectOption } from "../Activatable/selectionUtils"
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
      case AdvantageId.Aptitude:
        return Just (List (
          RequireActivatable ({
            id: DisadvantageId.Incompetent,
            active: false,
            sid,
          })
        ))

      case AdvantageId.ExceptionalSkill:
        return Just (List (
          RequireActivatable ({
            id: DisadvantageId.Incompetent,
            active: false,
            sid,
          })
        ))

      case AdvantageId.MagicalAttunement:
        return Just (List (
          RequireActivatable ({
            id: DisadvantageId.MagicalRestriction,
            active: false,
            sid,
          })
        ))

      case DisadvantageId.MagicalRestriction:
        return Just (List (
          RequireActivatable ({
            id: AdvantageId.MagicalAttunement,
            active: false,
            sid,
          })
        ))

      case DisadvantageId.Incompetent:
        return Just (List (
          RequireActivatable ({
            id: AdvantageId.Aptitude,
            active: false,
            sid,
          }),
          RequireActivatable ({
            id: AdvantageId.ExceptionalSkill,
            active: false,
            sid,
          })
        ))

      case SpecialAbilityId.SkillSpecialization: {
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
                      bindF (
                        find<Record<Application>> (pipe (
                                                               Application.AL.id,
                                                               elemF (sid2)
                                                             ))
                      ),
                      bindF (Application.AL.prerequisites),
                      ap (
                        fmap<
                          AllRequirementObjects,
                          (xs: List<AllRequirementObjects>) => List<AllRequirementObjects>
                        > (consF)
                          (sameSkillDependency)
                      ),
                      altF (
                        fmap<AllRequirementObjects, List<AllRequirementObjects>>
                          (List)
                          (sameSkillDependency)
                      )
                    )
                    (findSelectOption (wiki_entry) (sid))
      }

      case SpecialAbilityId.PropertyFocus:
        return addToSelectOptionReqs (Just (List (
          RequireActivatable ({
            id: SpecialAbilityId.PropertyKnowledge,
            active: true,
            sid,
          })
        )))

      case SpecialAbilityId.AdaptionZauber:
        return pipe_ (
          sid,
          misStringM,
          fmap (id => List (RequireIncreasable ({
                              id,
                              value: 10,
                            })))
        )

      case SpecialAbilityId.FavoriteSpellwork:
        return pipe_ (
          sid,
          misStringM,
          fmap (id => List (RequireActivatable ({
                              id,
                              active: true,
                            })))
        )

      case SpecialAbilityId.SpellEnhancement:
      case SpecialAbilityId.ChantEnhancement:
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

      case SpecialAbilityId.LanguageSpecializations: {
        return addToSelectOptionReqs (Just (List (
          RequireActivatable ({
            id: SpecialAbilityId.Language,
            active: true,
            sid,
            tier: Just (3),
          })
        )))
      }

      default:
        return addToSelectOptionReqs (Nothing)
    }
  }

export const addDynamicPrerequisites =
  (add: boolean) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>
  (static_prerequisites: List<AllRequirements>) =>
  (current: Record<ActiveObject>): List<AllRequirements> =>
    fromMaybe (static_prerequisites)
              (fmap (append (static_prerequisites))
                    (getGeneratedPrerequisites (add) (wiki_entry) (hero_entry) (current)))
