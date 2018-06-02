import R from 'ramda';
import { Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki';
import { isStyleValidToRemove } from './ExtendedStyleUtils';
import { isOwnTradition } from './LiturgyUtils';
import { getWikiEntry } from './WikiUtils';
import { countActiveSkillEntries } from './activatableSkillUtils';
import { convertMapToValues, filterExisting } from './collectionUtils';
import { countActiveGroupEntries } from './entryGroupUtils';
import { exists } from './exists';
import { flattenPrerequisites } from './flattenPrerequisites';
import { getAllEntriesByGroup, getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { match } from './match';
import { Maybe } from './maybe';
import { getActiveSelections } from './selectionUtils';
import { getBlessedTraditionFromWiki, getMagicalTraditions } from './traditionUtils';
import { validateObject, validateTier } from './validatePrerequisitesUtils';

/**
 * Checks if you can somehow remove an ActiveObject from the given entry.
 * @param state The present state of the current hero.
 * @param obj The entry.
 * @param sid The sid of the ActiveObject
 */
const isRemovalDisabledEntrySpecific = (
  wiki: WikiState,
  state: Data.HeroDependent,
  entry: Wiki.Activatable,
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
  tiers: number | undefined,
  minTier: number | undefined,
): boolean => {
  return R.pipe<boolean, boolean>(
    R.either(
      R.identity,
      R.either(
        // Disable if a minimum level is required
        R.both(
          R.always(exists(tiers)),
          R.always(exists(minTier)),
        ),

        // Disable if other entries depend on this entry
        R.always(R.any(R.ifElse(
          isBoolean,
          e => R.both(
            R.always(e),
            R.always(R.equals(instance.active.length, 1)),
          ),
          e => R.either(
            R.always(R.equals(active, e)),
            R.both(
              R.both(
                R.has('tier'),
                R.always(R.has('tier', active)),
              ),
              R.always(R.equals(R.gte(active.tier!, e.tier), e.active))
            ),
          ),
        ), instance.dependencies)),
      ),
    )
  )(
    R.defaultTo(
      true,
      match<string, boolean>(entry.id)
        .on(R.both(
          R.equals('ADV_16'),
          () => Maybe.from(state.skills.get(active.sid as string))
            .bind(skill =>
              Maybe.from(wiki.experienceLevels.get(state.experienceLevel))
                .map(R.pipe(
                  el => el.maxSkillRating,
                  R.add(R.reduce(
                    (e, obj) => obj.sid === active.sid ? e + 1 : e,
                    0,
                    instance.active,
                  )),
                  R.equals(skill.value),
                ))
            )
            .valueOr(false)
        ), R.T)
        .on(R.both(
          R.equals('ADV_17'),
          () => Maybe.from(state.combatTechniques.get(active.sid as string))
            .bind(skill =>
              Maybe.from(wiki.experienceLevels.get(state.experienceLevel))
                .map(R.pipe(
                  el => el.maxCombatTechniqueRating,
                  R.inc,
                  R.equals(skill.value),
                ))
            )
            .valueOr(false)
        ), R.T)
        .on(R.both(
          [
            'SA_70',
            'SA_255',
            'SA_345',
            'SA_346',
            'SA_676',
            'SA_677',
            'SA_678',
            'SA_679',
            'SA_680',
            'SA_681',
          ].includes,
          R.both(
            R.always(R.lte(
              getMagicalTraditions(state.specialAbilities).length,
              1,
            )),
            R.either(
              R.always(R.gt(countActiveSkillEntries(state, "spells"), 0)),
              R.always(R.gt(state.cantrips.size, 0)),
            )
          )
        ), R.T)
        .on(R.both(
          [
            'SA_86',
            'SA_682',
            'SA_683',
            'SA_684',
            'SA_685',
            'SA_686',
            'SA_687',
            'SA_688',
            'SA_689',
            'SA_690',
            'SA_691',
            'SA_692',
            'SA_693',
            'SA_694',
            'SA_695',
            'SA_696',
            'SA_697',
            'SA_698',
          ].includes,
          R.either(
            R.always(R.gt(countActiveSkillEntries(state, "spells"), 0)),
            R.always(R.gt(state.cantrips.size, 0)),
          )
        ), R.T)
        .on(R.both(
          R.equals('SA_164'),
          () => {
            const armedStyleActive = countActiveGroupEntries(wiki, state, 9);
            const unarmedStyleActive = countActiveGroupEntries(wiki, state, 10);
            const totalActive = armedStyleActive + unarmedStyleActive;

            return totalActive >= 3
              || armedStyleActive >= 2
              || unarmedStyleActive >= 2;
          }
        ), R.T)
        .on(R.both(
          R.equals('SA_266'),
          () => R.gte(countActiveGroupEntries(wiki, state, 13), 2),
        ), R.T)
        .on(R.both(
          ['SA_623', 'SA_625', 'SA_632'].includes,
          () => getBlessedTraditionFromWiki(
            wiki.specialAbilities,
            state.specialAbilities,
          )
            .map(blessedTradition => {
              return R.pipe(
                (list: Data.ActivatableSkillDependent[]) =>
                  list.filter(e => e.active),
                list => list.map(e => wiki.liturgicalChants.get(e.id)),
                list => filterExisting(list),
                list => list.some(e => {
                  return !isOwnTradition(blessedTradition, e);
                }),
              )(
                convertMapToValues(state.liturgicalChants)
              );
            })
            .valueOr(false),
        ), R.T)
        .on(R.both(
          () => R.equals(entry.category, Categories.SPECIAL_ABILITIES),
          () => R.equals(
            isStyleValidToRemove(state, entry as Wiki.SpecialAbility),
            false,
          )
        ), R.T)
        .otherwise(() => R.all(e => {
          if (typeof e === 'object' && e.origin) {
            return getWikiEntry<Wiki.WikiActivatable>(wiki, e.origin)
              .bind(origin => {
                return Maybe.from(
                  flattenPrerequisites(
                    origin.prerequisites,
                    R.defaultTo(1, origin.tiers),
                  )
                    .find((r): r is Wiki.AllRequirementObjects =>
                      typeof r !== 'string' &&
                      Array.isArray(r.id) &&
                      !!e.origin &&
                      r.id.includes(e.origin)
                    )
                )
                  .map(req => {
                    return R.gt((req.id as string[]).reduce(
                      (acc, e) => validateObject(
                        wiki,
                        state,
                        { ...req, id: e } as Wiki.AllRequirementObjects,
                        entry.id,
                      ) ? acc + 1 : acc,
                      0,
                    ), 1);
                  })
              })
              .valueOr(true);
          }
          else if (typeof e === 'object' && Array.isArray(e.sid)) {
            const list = e.sid;
            const sid = active.sid as number;
            if (list.includes(sid)) {
              return !getActiveSelections(instance).some(n => {
                return n !== sid && list.includes(n as number);
              });
            }
          }

          return true;
        }, instance.dependencies))
    )
  );
};

const getSermonsAndVisionsMinTier = (
  wiki: WikiState,
  state: Data.HeroDependent,
  more: boolean,
  gr: number,
): (() => number | undefined) => R.always(R.ifElse(
  more ? R.lt(3) : R.gt(3),
  more ? R.add(-3) : R.subtract(3),
  R.always(undefined),
)(
  getAllEntriesByGroup<Data.ActivatableDependent>(
    wiki.specialAbilities,
    state.specialAbilities,
    gr
  )
    .filter(isActive)
    .length
));

/**
 * Get minimum valid tier.
 * @param dependencies The current instance dependencies.
 */
export function getMinTier(
  wiki: WikiState,
  state: Data.HeroDependent,
  obj: Data.ActiveObjectWithId,
  dependencies: ReadonlyArray<Data.ActivatableInstanceDependency>,
  sid?: string | number,
): number | undefined {
  return R.pipe(
    (minTier: number | undefined) => {
      return dependencies.reduce<number | undefined>((min, dependency) => {
        if (
          typeof dependency === 'object' &&
          typeof dependency.tier === 'number' &&
          dependency.tier > (min || 0) &&
          (dependency.sid === undefined || dependency.sid === sid)
        ) {
            return dependency.tier;
        }
        return min;
      }, minTier);
    }
  )(
    match<string, number | undefined>(obj.id)
      .on('ADV_58', () => R.ifElse(
        R.lt(3),
          R.add(-3),
        R.always(undefined),
      )(countActiveSkillEntries(state, "spells")))
      .on('ADV_79', getSermonsAndVisionsMinTier(
        wiki,
        state,
        true,
        24,
      ))
      .on('ADV_80', getSermonsAndVisionsMinTier(
        wiki,
        state,
        true,
        27,
      ))
      .on('DISADV_72', getSermonsAndVisionsMinTier(
        wiki,
        state,
        false,
        24,
      ))
      .on('DISADV_73', getSermonsAndVisionsMinTier(
        wiki,
        state,
        false,
        27,
      ))
      .otherwise(R.always(undefined))
  );
}

/**
 * Get maximum valid tier.
 */
export const getMaxTier = (
  wiki: WikiState,
  state: Data.HeroDependent,
  prerequisites: Wiki.LevelAwarePrerequisites,
  dependencies: ReadonlyArray<Data.ActivatableInstanceDependency>,
  id: string,
) => {
  return match<string, number | undefined>(id)
    .on(R.both(
      R.equals('SA_667'),
      R.always(exists(state.pact))
    ), R.always(state.pact!.level))
    .otherwise(R.always(!Array.isArray(prerequisites) ? validateTier(
      wiki,
      state,
      prerequisites,
      dependencies,
      id,
    ) : undefined));
};

interface ValidationObject extends Data.ActiveObjectWithId {
  readonly disabled: boolean;
  readonly maxTier: number | undefined;
  readonly minTier: number | undefined;
  readonly tiers: number | undefined;
}

/**
 * Checks if the given ActiveObject can be removed or changed in tier.
 * @param obj The ActiveObject with origin id.
 * @param state The current hero's state.
 */
export const isRemovalOrChangeDisabled = (
  obj: Data.ActiveObjectWithId,
  wiki: WikiState,
  state: Data.HeroDependent,
): Maybe<ValidationObject> => {
  return getWikiEntry<Wiki.WikiActivatable>(wiki, obj.id)
    .bind(wikiEntry =>
      getHeroStateListItem<Data.ActivatableDependent>(obj.id)(state)
        .map(instance => {
          const tiers = wikiEntry.id === 'SA_29' ? 3 : wikiEntry.tiers;
          const minTier = getMinTier(
            wiki,
            state,
            obj,
            instance.dependencies,
            obj.sid,
          );

          return ({
            ...obj,
            tiers,
            minTier,
            maxTier: getMaxTier(
              wiki,
              state,
              wikiEntry.prerequisites,
              instance.dependencies,
              obj.id,
            ),
            disabled: isRemovalDisabledEntrySpecific(
              wiki,
              state,
              wikiEntry,
              instance,
              obj,
              tiers,
              minTier,
            ),
          });
        })
    );
};
