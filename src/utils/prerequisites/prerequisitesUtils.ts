import * as Data from '../../types/data';
import * as Wiki from '../../types/wiki';
import { findSelectOption } from '../activatable/selectionUtils';
import { ActiveObjectG } from '../activeEntries/activatableDependent';
import { List } from '../structures/List';
import { bind_, Just, Maybe, Nothing } from '../structures/Maybe';
import { Record } from '../structures/Record';
import { AdvantageG } from '../wikiData/AdvantageCreator';
import { SelectOptionG } from '../wikiData/sub/SelectOptionCreator';

const { id } = AdvantageG
const { sid, sid2 } = ActiveObjectG

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
  (wikiEntry: Wiki.WikiActivatable) =>
  (instance: Maybe<Record<Data.ActivatableDependent>>) =>
  (active: Record<Data.ActiveObject>) =>
  (add: boolean): Maybe<List<Wiki.AllRequirementObjects>> => {
    switch (id (wikiEntry)) {
      case 'SA_3':
        return bind_ (SelectOptionG.prerequisites)
                     (findSelectOption (wikiEntry) (sid (active)))

      case 'SA_9': {
        const sameSkill = Maybe.fromMaybe (0) (
          instance.fmap (
            justInstance => justInstance.get ('active')
              .filter (e => e.lookup ('sid').equals (sid))
              .length ()
          )
        )

        const sameSkillDependency = sid.fmap (justSid => ({
          id: justSid as string,
          value: (sameSkill + (add ? 1 : 0)) * 6
        }))

        return findSelectOption<SkillSelectionObject> (wikiEntry, sid)
          .bind (
            skill => skill.get ('applications')
              .find (e => sid2.equals (e.lookup ('id')))
          )
          .bind (app => app.lookup ('prerequisites'))
          .bind (prerequisites =>
            sameSkillDependency.fmap (
              obj => prerequisites.cons (Record.of<Wiki.RequiresIncreasableObject> (obj))
            )
          )
          .alt (sameSkillDependency.fmap (
            obj => List.of (Record.of<Wiki.RequiresIncreasableObject> (obj)))
          )
      }
      case 'SA_81':
        return Just (List.of (
          Record.ofMaybe<Wiki.RequiresActivatableObject> ({
            id: 'SA_72',
            active: true,
            sid
          })
        ))
      case 'SA_414':
      case 'SA_663': {
        interface ExtensionSelectionObject extends Wiki.SelectionObject {
          req: List<Wiki.AllRequirementObjects>
          target: string
          tier: number
        }

        return findSelectOption<ExtensionSelectionObject> (wikiEntry, sid)
          .fmap (
            item => List.of (Record.of<Wiki.RequiresIncreasableObject> ({
              id: item.get ('target'),
              value: item.get ('tier') * 4 + 4,
            }))
          )
      }
      case 'SA_639': {
        return findSelectOption (wikiEntry, sid)
          .bind (item => item.lookup ('prerequisites'))
      }
      case 'SA_699': {
        return Just (List.of (
          Record.ofMaybe<Wiki.RequiresActivatableObject> ({
            id: 'SA_29',
            active: true,
            sid,
            tier: Just (3),
          })
        ))
      }
    }

    return Nothing
  }

export const addDynamicPrerequisites = (
  wikiEntry: Wiki.Activatable,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  active: Record<Data.ActiveObject>,
  add: boolean,
) => (
  prerequisites: List<Wiki.AllRequirements>,
): List<Wiki.AllRequirements> =>
  Maybe.fromMaybe (prerequisites) (
    getGeneratedPrerequisites (wikiEntry, instance, active, add)
      .fmap (prerequisites.mappend)
  )
