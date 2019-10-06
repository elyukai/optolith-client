import { fmap } from "../../../Data/Functor";
import { elem, filter, find, foldl, isList, List, map, maximumNonNegative } from "../../../Data/List";
import { bindF, Maybe, Nothing, or, sum } from "../../../Data/Maybe";
import { gt, gte, inc } from "../../../Data/Num";
import { isRecord, Record } from "../../../Data/Record";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ValueBasedDependent } from "../../Models/Hero/heroTypeHelpers";
import { SkillOptionalDependency } from "../../Models/Hero/SkillOptionalDependency";
import { Advantage } from "../../Models/Wiki/Advantage";
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { SocialPrerequisite } from "../../Models/Wiki/prerequisites/SocialPrerequisite";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { AbilityRequirement, Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { getHeroStateItem } from "../heroStateUtils";
import { pipe } from "../pipe";
import { flattenPrerequisites } from "../Prerequisites/flattenPrerequisites";
import { isNumber } from "../typeCheckUtils";
import { getWikiEntry } from "../WikiUtils";

const { prerequisites } = Advantage.AL
const { origin, value } = SkillOptionalDependency.AL
const { id } = RequireActivatable.AL

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
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  <T extends number | boolean>
  (dependencies: List<T | Record<SkillOptionalDependency>>) =>
    map<T | Record<SkillOptionalDependency>, T>
      (e => isRecord (e)
        ? pipe (
                 getWikiEntry (wiki) as (id: string) => Maybe<Activatable>,
                 bindF (pipe (
                   prerequisites,
                   flattenPrerequisites (Nothing) (Nothing),
                   find ((r): r is AbilityRequirement =>
                     r !== "RCP"
                     && !SocialPrerequisite.is (r)
                     && isList (id (r))
                     && elem (origin (e)) (id (r) as List<string>))
                 )),
                 fmap (pipe (
                   id as (r: AbilityRequirement) => List<string>,
                   foldl<string, number>
                     (acc => pipe (
                       getHeroStateItem (state) as (id: string) => Maybe<ValueBasedDependent>,
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
        (dependencies)

/**
 * Filters the list of dependencies of `ActivatableSkillDependent`s and returns
 * the maximum. Minimum: `0`.
 */
export const filterAndMaximumNonNegative =
  pipe (filter<number | boolean, number> (isNumber), maximumNonNegative)
