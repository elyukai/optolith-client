import R from 'ramda';
import { Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import { AllRequirementTypes } from '../types/reusable';
import * as Wiki from '../types/wiki';
import { countActiveSkillEntries } from './activatableSkillUtils';
import { Just, List, Maybe } from './dataUtils';
import { countActiveGroupEntries } from './entryGroupUtils';
import { isStyleValidToRemove } from './ExtendedStyleUtils';
import { flattenPrerequisites } from './flattenPrerequisites';
import { getAllEntriesByGroup, getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { isOwnTradition } from './LiturgyUtils';
import { match } from './match';
import { getActiveSelections } from './selectionUtils';
import { getBlessedTraditionFromWiki, getMagicalTraditions } from './traditionUtils';
import { validateObject, validateTier } from './validatePrerequisitesUtils';
import { getWikiEntry } from './WikiUtils';

const hasRequiredMinimumLevel = (
  tiers: Maybe<number>,
  minTier: Maybe<number>,
): boolean =>
  Maybe.isJust(tiers) && Maybe.isJust(minTier);

const isRequiredByOthers = (
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
): boolean =>
  instance.dependencies.any(e => {
    return isBoolean(e)
      ? (e && instance.active.length() === 1)
      : (R.equals(active, e) ||
        Maybe.isJust(e.tier) && Maybe.isJust(active.tier) &&
        e.active.map(ea => ea === active.tier.gte(e.tier)))
  });

/**
 * Even if th
 */
const getSuperIsRemoveDisabled = (
  tiers: Maybe<number>,
  minTier: Maybe<number>,
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
) => (isDisabled: boolean): boolean =>
  isDisabled ||
  // Disable if a minimum level is required
  hasRequiredMinimumLevel(tiers, minTier) ||
  // Disable if other entries depend on this entry
  isRequiredByOthers(instance, active);



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
  tiers: Maybe<number>,
  minTier: Maybe<number>,
): boolean => {
  return R.pipe<boolean, boolean>(
    getSuperIsRemoveDisabled(tiers, minTier, instance, active)
  )(
      match<string, boolean>(entry.id)
        .on(R.both(
          R.equals('ADV_16'),
          () => active.sid
            .bind(sid => state.skills.lookup(sid as string))
            .bind(skill =>
              wiki.experienceLevels.lookup(state.experienceLevel)
                .map(R.pipe(
                  el => el.maxSkillRating,
                  R.add(instance.active.reduce(
                    e => obj => obj.sid === active.sid ? e + 1 : e,
                    0,
                  )),
                  R.equals(skill.value),
                ))
            )
            .valueOr(false)
        ), R.T)
        .on(R.both(
          R.equals('ADV_17'),
          () => active.sid
            .bind(sid => state.combatTechniques.lookup(sid as string))
            .bind(skill =>
              wiki.experienceLevels.lookup(state.experienceLevel)
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
              getMagicalTraditions(state.specialAbilities).length(),
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
                (list: List<Data.ActivatableSkillDependent>) =>
                  list.filter(e => e.active),
                Maybe.mapMaybe(e => wiki.liturgicalChants.lookup(e.id)),
                list => list.any(e => {
                  return !isOwnTradition(blessedTradition, e);
                }),
              )(state.liturgicalChants.elems());
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
        .otherwise(() => instance.dependencies.all(e => {
          if (typeof e === 'object' && Maybe.isJust(e.origin)) {
            return getWikiEntry<Wiki.WikiActivatable>(wiki, e.origin.valueOr())
              .bind(origin => {
                return flattenPrerequisites(
                  origin.prerequisites,
                  origin.tiers.valueOr(1),
                )
                  .find((r): r is AllRequirementTypes =>
                    typeof r !== 'string' &&
                    Array.isArray(r.id) &&
                    !!e.origin &&
                    r.id.includes((e.origin as Just<string>).valueOr())
                  )
                  .map(req => {
                    return R.gt((req.id as string[]).reduce(
                      (acc, e) => validateObject(
                        wiki,
                        state,
                        { ...req, id: e } as AllRequirementTypes,
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
              return !getActiveSelections(Maybe.of(instance)).some(n => {
                return n !== sid && list.includes(n as number);
              });
            }
          }

          return true;
        }))
  );
};

const getSermonsAndVisionsMinTier = (
  wiki: WikiState,
  state: Data.HeroDependent,
  more: boolean,
  gr: number,
): Maybe<number> => Maybe.ofPred(
  more ? R.lt(3) : R.gt(3),
  getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, gr)
    .filter(isActive)
    .length()
)
  .map(more ? R.add(-3) : R.subtract(3));

/**
 * Get minimum valid tier.
 * @param dependencies The current instance dependencies.
 */
export function getMinTier(
  wiki: WikiState,
  state: Data.HeroDependent,
  obj: Data.ActiveObjectWithId,
  dependencies: List<Data.ActivatableDependency>,
  sid?: string | number,
): Maybe<number> {
  return R.pipe(
    (minTier: Maybe<number>) => {
      return dependencies.reduce<Maybe<number>>(min => dependency => {
        if (
          typeof dependency === 'object' &&
          typeof dependency.tier === 'number' &&
          dependency.tier > min.valueOr(0) &&
          Maybe.isJust(dependency.sid) &&
          dependency.sid.valueOr() === sid
        ) {
            return Maybe.Just(dependency.tier);
        }
        return min;
      }, minTier);
    }
  )(
    match<string, Maybe<number>>(obj.id)
      .on('ADV_58', () => Maybe.ofPred(
        R.lt(3),
        countActiveSkillEntries(state, "spells"),
      )
        .map(R.add(-3)))
      .on('ADV_79', () => getSermonsAndVisionsMinTier(
        wiki,
        state,
        true,
        24,
      ))
      .on('ADV_80', () => getSermonsAndVisionsMinTier(
        wiki,
        state,
        true,
        27,
      ))
      .on('DISADV_72', () => getSermonsAndVisionsMinTier(
        wiki,
        state,
        false,
        24,
      ))
      .on('DISADV_73', () => getSermonsAndVisionsMinTier(
        wiki,
        state,
        false,
        27,
      ))
      .otherwise(Maybe.Nothing)
  );
}

/**
 * Get maximum valid tier.
 */
export const getMaxTier = (
  wiki: WikiState,
  state: Data.HeroDependent,
  prerequisites: Wiki.LevelAwarePrerequisites,
  dependencies: List<Data.ActivatableDependency>,
  id: string,
) => {
  return match<string, Maybe<number>>(id)
    .on(R.both(
      R.equals('SA_667'),
      R.always(Maybe.isJust(state.pact))
    ), () => state.pact.map(pact => pact.level))
    .otherwise(() => !Array.isArray(prerequisites) ? Maybe.of(validateTier(
      wiki,
      state,
      prerequisites,
      dependencies,
      id,
    )) : Maybe.Nothing());
};

interface ValidationObject extends Data.ActiveObjectWithId {
  readonly disabled: boolean;
  readonly maxTier: Maybe<number>;
  readonly minTier: Maybe<number>;
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
