import { equals } from "../../../Data/Eq";
import { fmap } from "../../../Data/Functor";
import { append, consF, filter, find, flength, List } from "../../../Data/List";
import { altF, ap, bindF, elemF, fromMaybe, Just, liftM2, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { Advantage } from "../../Models/Wiki/Advantage";
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { Application } from "../../Models/Wiki/sub/Application";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { Activatable, AllRequirementObjects, AllRequirements } from "../../Models/Wiki/wikiTypeHelpers";
import { findSelectOption } from "../Activatable/selectionUtils";
import { pipe } from "../pipe";

const { id } = Advantage.AL
const { sid, sid2 } = ActiveObject.AL
const { active } = ActivatableDependent.AL
const { applications, target, level, prerequisites } = SelectOption.AL

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
    switch (id (wiki_entry)) {
      case "SA_3":
        return bindF (SelectOption.AL.prerequisites)
                     (findSelectOption (wiki_entry) (sid (current)))

      case "SA_9": {
        const sameSkill = maybe (0)
                                (pipe (
                                  active,
                                  filter (pipe (sid, equals (sid (current)))),
                                  flength
                                ))
                                (hero_entry)

        const sameSkillDependency =
          fmap ((justSid: string | number) => RequireIncreasable ({
                 id: justSid as string,
                 value: (sameSkill + (add ? 1 : 0)) * 6,
               }))
               (sid (current))

        return pipe (
                      bindF (applications),
                      bindF (
                        find<Record<Application>> (pipe (
                                                               Application.AL.id,
                                                               elemF (sid2 (current))
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
                    (findSelectOption (wiki_entry) (sid (current)))
      }

      case "SA_81":
        return Just (List (
          RequireActivatable ({
            id: "SA_72",
            active: true,
            sid: sid (current),
          })
        ))

      case "SA_414":
      case "SA_663":
        return bindF ((option: Record<SelectOption>) =>
                       liftM2 ((optionTarget: string) => (optionTier: number) =>
                                List (
                                  RequireIncreasable ({
                                    id: optionTarget,
                                    value: optionTier * 4 + 4,
                                  }))
                                )
                              (target (option))
                              (level (option)))
                     (findSelectOption (wiki_entry) (sid (current)))

      case "SA_639":
        return bindF (prerequisites) (findSelectOption (wiki_entry) (sid (current)))

      case "SA_699": {
        return Just (List (
          RequireActivatable ({
            id: "SA_29",
            active: true,
            sid: sid (current),
            tier: Just (3),
          })
        ))
      }
    }

    return Nothing
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
