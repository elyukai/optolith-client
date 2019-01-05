import { pipe } from "ramda";
import { ActivatableDependent } from "../../App/Models/ActiveEntries/ActivatableDependent";
import { Advantage } from "../../App/Models/Wiki/Advantage";
import { RequireActivatable } from "../../App/Models/Wiki/prerequisites/ActivatableRequirement";
import { RequireIncreasable } from "../../App/Models/Wiki/prerequisites/IncreasableRequirement";
import { Application } from "../../App/Models/Wiki/sub/Application";
import { SelectOption } from "../../App/Models/Wiki/sub/SelectOption";
import * as Wiki from "../../App/Models/Wiki/wikiTypeHelpers";
import { equals } from "../../Data/Eq";
import { append, consF, filter, find, fromElements, length, List } from "../../Data/List";
import { altF, ap, bindF, elem_, fmap, fromMaybe, Just, liftM2, Maybe, Nothing } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { findSelectOption } from "../activatable/selectionUtils";
import { ActiveObject } from "../activeEntries/ActiveObject";

const { id } = Advantage.A
const { sid, sid2 } = ActiveObject.A
const { active } = ActivatableDependent.A
const { applications, target, tier, prerequisites } = SelectOption.A

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
  (wikiEntry: Wiki.Activatable) =>
  (instance: Maybe<Record<ActivatableDependent>>) =>
  (current: Record<ActiveObject>) =>
  (add: boolean): Maybe<List<Wiki.AllRequirementObjects>> => {
    switch (id (wikiEntry)) {
      case "SA_3":
        return bindF (SelectOption.A.prerequisites)
                     (findSelectOption (wikiEntry) (sid (current)))

      case "SA_9": {
        const sameSkill = pipe (
                                 fmap (pipe (
                                   active,
                                   filter (pipe (sid, equals (sid (current)))),
                                   length
                                 )),
                                 fromMaybe (0)
                               )
                               (instance)

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
                                                               Application.A.id,
                                                               elem_ (sid2 (current))
                                                             ))
                      ),
                      bindF (Application.A.prerequisites),
                      ap (
                        fmap<
                          Wiki.AllRequirementObjects,
                          (xs: List<Wiki.AllRequirementObjects>) => List<Wiki.AllRequirementObjects>
                        > (consF)
                          (sameSkillDependency)
                      ),
                      altF (
                        fmap<Wiki.AllRequirementObjects, List<Wiki.AllRequirementObjects>>
                          (fromElements)
                          (sameSkillDependency)
                      )
                    )
                    (findSelectOption (wikiEntry) (sid (current)))
      }

      case "SA_81":
        return Just (fromElements (
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
                                fromElements (
                                  RequireIncreasable ({
                                    id: optionTarget,
                                    value: optionTier * 4 + 4,
                                  }))
                                )
                              (target (option))
                              (tier (option)))
                     (findSelectOption (wikiEntry) (sid (current)))

      case "SA_639":
        return bindF (prerequisites) (findSelectOption (wikiEntry) (sid (current)))

      case "SA_699": {
        return Just (fromElements (
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
  (wikiEntry: Wiki.Activatable) =>
  (instance: Maybe<Record<ActivatableDependent>>) =>
  (current: Record<ActiveObject>) =>
  (add: boolean) =>
  (staticPrerequisites: List<Wiki.AllRequirements>): List<Wiki.AllRequirements> =>
    fromMaybe (staticPrerequisites)
              (fmap (append (staticPrerequisites))
                    (getGeneratedPrerequisites (wikiEntry) (instance) (current) (add)))
