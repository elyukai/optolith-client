import { pipe } from 'ramda';
import * as Data from '../../types/data';
import * as Wiki from '../../types/wiki';
import { findSelectOption } from '../activatable/selectionUtils';
import { ActivatableDependent, ActivatableDependentG, ActiveObjectG } from '../activeEntries/ActivatableDependent';
import { equals } from '../structures/Eq';
import { cons_, filter, find, fromElements, length, List, mappend } from '../structures/List';
import { alt_, ap, bind_, elem_, fmap, fromMaybe, Just, liftM2, Maybe, Nothing } from '../structures/Maybe';
import { Record } from '../structures/Record';
import { AdvantageG } from '../wikiData/Advantage';
import { RequireActivatable } from '../wikiData/prerequisites/ActivatableRequirement';
import { RequireIncreasable } from '../wikiData/prerequisites/IncreasableRequirement';
import { Application, ApplicationG } from '../wikiData/sub/Application';
import { SelectOption, SelectOptionG } from '../wikiData/sub/SelectOption';

const { id } = AdvantageG
const { sid, sid2 } = ActiveObjectG
const { active } = ActivatableDependentG
const { applications, target, tier, prerequisites } = SelectOptionG

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
  (current: Record<Data.ActiveObject>) =>
  (add: boolean): Maybe<List<Wiki.AllRequirementObjects>> => {
    switch (id (wikiEntry)) {
      case 'SA_3':
        return bind_ (SelectOptionG.prerequisites)
                     (findSelectOption (wikiEntry) (sid (current)))

      case 'SA_9': {
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
                      bind_ (applications),
                      bind_ (
                        find<Record<Application>> (pipe (
                                                               ApplicationG.id,
                                                               elem_ (sid2 (current))
                                                             ))
                      ),
                      bind_ (ApplicationG.prerequisites),
                      ap (
                        fmap<
                          Wiki.AllRequirementObjects,
                          (xs: List<Wiki.AllRequirementObjects>) => List<Wiki.AllRequirementObjects>
                        > (cons_)
                          (sameSkillDependency)
                      ),
                      alt_ (
                        fmap<Wiki.AllRequirementObjects, List<Wiki.AllRequirementObjects>>
                          (fromElements)
                          (sameSkillDependency)
                      )
                    )
                    (findSelectOption (wikiEntry) (sid (current)))
      }

      case 'SA_81':
        return Just (fromElements (
          RequireActivatable ({
            id: 'SA_72',
            active: true,
            sid: sid (current),
          })
        ))

      case 'SA_414':
      case 'SA_663':
        return bind_ ((option: Record<SelectOption>) =>
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

      case 'SA_639':
        return bind_ (prerequisites) (findSelectOption (wikiEntry) (sid (current)))

      case 'SA_699': {
        return Just (fromElements (
          RequireActivatable ({
            id: 'SA_29',
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
  (current: Record<Data.ActiveObject>) =>
  (add: boolean) =>
  (staticPrerequisites: List<Wiki.AllRequirements>): List<Wiki.AllRequirements> =>
    fromMaybe (staticPrerequisites)
              (fmap (mappend (staticPrerequisites))
                    (getGeneratedPrerequisites (wikiEntry) (instance) (current) (add)))
