import { pipe } from 'ramda';
import { Hero, SkillOptionalDependency, ValueBasedDependent } from '../../types/data';
import { AbilityRequirement, Activatable, WikiAll } from '../../types/wiki';
import { SkillOptionalDependencyG } from '../heroData/SkillOptionalDependencyCreator';
import { getHeroStateItem } from '../heroStateUtils';
import { gt, gte, inc } from '../mathUtils';
import { flattenPrerequisites } from '../prerequisites/flattenPrerequisites';
import { thrush } from '../structures/Function';
import { elem, find, foldl, isList, List, map } from '../structures/List';
import { bind_, fmap, Maybe, Nothing, or, sum } from '../structures/Maybe';
import { isRecord, Record } from '../structures/Record';
import { AdvantageG } from '../wikiData/AdvantageCreator';
import { RequireActivatableG } from '../wikiData/prerequisites/ActivatableRequirementCreator';
import { getWikiEntry } from '../WikiUtils';

const { prerequisites } = AdvantageG
const { origin, value } = SkillOptionalDependencyG
const { id } = RequireActivatableG

/**
 * `flattenDependencies` flattens the list of dependencies to usable values.
 * That means, optional dependencies (objects) will be evaluated and will be
 * included in the resulting list, depending on whether it has to follow the
 * optional dependency or not. The result is a plain `List` of all non-optional
 * dependencies.
 * @param wiki The full wiki.
 * @param state The current hero.
 * @param dependencies The list of dependencies to flatten.
 */
export const flattenDependencies =
  <T extends number | boolean> (wiki: Record<WikiAll>) => (state: Hero) =>
    map<T | Record<SkillOptionalDependency>, T>
      (e => isRecord (e)
        ? pipe (
                 getWikiEntry (wiki) as (id: string) => Maybe<Activatable>,
                 bind_ (pipe (
                   prerequisites,
                   flattenPrerequisites,
                   thrush (Nothing),
                   thrush (Nothing),
                   find ((r): r is AbilityRequirement =>
                     r !== 'RCP'
                     && isList (id (r))
                     && elem (origin (e)) (id (r) as List<string>))
                 )),
                 fmap (pipe (
                   id as (r: AbilityRequirement) => List<string>,
                   foldl<string, number>
                     (acc => pipe (
                       getHeroStateItem as (id: string) =>
                         (state: Hero) => Maybe<ValueBasedDependent>,
                       thrush (state),
                       fmap (pipe (value, gte (value (e)))),
                       or,
                       x => x ? inc (acc) : acc
                     ))
                     (0),
                   gt (1),
                   x => x ? 0 : value (e)
                 )),
                 sum
               )
               (origin (e)) as T
        : e)
