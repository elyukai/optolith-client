import R from 'ramda';
import { Pact } from '../actions/PactActions';
import { Categories } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki';
import { isStyleValidToRemove } from './ExtendedStyleUtils';
import { isOwnTradition } from './LiturgyUtils';
import { getWikiEntry } from './WikiUtils';
import { convertMapToValueArray, filterExisting } from './collectionUtils';
import { countActiveGroupEntries } from './entryGroupUtils';
import { flattenPrerequisites } from './flattenPrerequisites';
import { getAllEntriesByGroup, getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { Maybe, MaybeFunctor } from './maybe';
import { getActiveSelections } from './selectionUtils';
import { getBlessedTraditionFromWiki, getMagicalTraditions } from './traditionUtils';
import { getMinTier, validateObject, validateTier } from './validatePrerequisitesUtils';

/**
 * Checks if you can somehow remove an ActiveObject from the given entry.
 * @param state The present state of the current hero.
 * @param obj The entry.
 * @param sid The sid of the ActiveObject
 */
export const isDeactivatable = (
  wiki: WikiState,
  state: Data.HeroDependent,
  pact: Pact | undefined,
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
): boolean => {
  return R.defaultTo(false, getWikiEntry<Wiki.Activatable>(wiki, instance.id)
    .fmap(entry => {
      if (entry.id === 'SA_164') {
        const armedStyleActive = countActiveGroupEntries(wiki, 9)(state);
        const unarmedStyleActive = countActiveGroupEntries(wiki, 10)(state);
        const totalActive = armedStyleActive + unarmedStyleActive;

        if (
          totalActive >= 3
          || armedStyleActive >= 2
          || unarmedStyleActive >= 2
        ) {
          return false;
        }
      }
      else if (entry.id === 'SA_266') {
        if (countActiveGroupEntries(wiki, 13)(state) >= 2) {
          return false;
        }
      }
      else if (['SA_623', 'SA_625', 'SA_632'].includes(entry.id)) {
        const hasUnfamiliarEntry = Maybe(getBlessedTraditionFromWiki(
          wiki.specialAbilities,
          state.specialAbilities,
        ))
          .fmap(blessedTradition => {
            return R.pipe(
              (list: Data.ActivatableSkillDependent[]) =>
                list.filter(e => e.active),
              list => list.map(e => wiki.liturgicalChants.get(e.id)),
              list => filterExisting(list),
              list => list.some(e => {
                return !isOwnTradition(blessedTradition, e);
              }),
            )(
              convertMapToValueArray(state.liturgicalChants)
            );
          })
          .value;

        if (hasUnfamiliarEntry) {
          return false;
        }
      }

      if (entry.category === Categories.SPECIAL_ABILITIES) {
        const validStyle = isStyleValidToRemove(state, entry);

        if (validStyle === false) {
          return false;
        }
      }

      const dependencies = instance.dependencies.filter(e => {
        if (typeof e === 'object' && e.origin) {
          return R.defaultTo(
            true,
            getWikiEntry<Wiki.WikiActivatable>(wiki, e.origin)
              .fmap(origin => {
                Maybe(
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
                  .fmap(req => {
                    const resultOfAll = (req.id as string[]).map(e =>
                      validateObject(
                        wiki,
                        state,
                        { ...req, id: e } as Wiki.AllRequirementObjects,
                        entry.id,
                        pact,
                      )
                    );
                    return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1;
                  })
                  .value
              })
              .value
          );
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
      });

      return dependencies.length === 0;
    })
    .value
  );
};

interface ValidationObject extends Data.ActiveObjectWithId {
  readonly disabled: boolean;
  readonly maxTier: number | undefined;
  readonly minTier: number | undefined;
  readonly tiers: number | undefined;
}

interface ValidationParams {
  readonly disabled?: boolean;
  readonly maxTier?: number;
  readonly minTier?: number;
  readonly tiers?: number;
}

const getEntrySpecificValidation = (
  wiki: WikiState,
  state: Data.HeroDependent,
  pact: Pact | undefined,
  instance: Data.ActivatableDependent,
  obj: Data.ActiveObjectWithId,
): ValidationParams => {
  const { id, sid } = obj;

  switch (id) {
    case 'ADV_16': {
      const { value } = state.skills.get(sid as string)!;
      const counter = instance.active.reduce((e, obj) => obj.sid === sid ? e + 1 : e, 0);
      return {
        disabled: wiki.experienceLevels.get(state.experienceLevel)!.maxSkillRating + counter === value
      };
    }
    case 'ADV_17': {
      const { value } = state.combatTechniques.get(sid as string)!;
      return {
        disabled: wiki.experienceLevels.get(state.experienceLevel)!.maxCombatTechniqueRating + 1 === value
      };
    }
    case 'ADV_58': {
      const activeSpells = state.spells.size;
      if (activeSpells > 3) {
        return {
          minTier: activeSpells - 3
        };
      }
      break;
    }
    case 'ADV_79': {
      const active = getAllEntriesByGroup<Data.ActivatableDependent>(
        wiki.specialAbilities, 24
      )(state.specialAbilities).filter(isActive).length;

      if (active > 3) {
        return {
          minTier: active - 3
        };
      }
      break;
    }
    case 'ADV_80': {
      const active = getAllEntriesByGroup<Data.ActivatableDependent>(
        wiki.specialAbilities, 27
      )(state.specialAbilities).filter(isActive).length;

      if (active > 3) {
        return {
          minTier: active - 3
        };
      }
      break;
    }
    case 'DISADV_72': {
      const active = getAllEntriesByGroup<Data.ActivatableDependent>(
        wiki.specialAbilities, 24
      )(state.specialAbilities).filter(isActive).length;

      if (active < 3) {
        return {
          minTier: 3 - active
        };
      }
      break;
    }
    case 'DISADV_73': {
      const active = getAllEntriesByGroup<Data.ActivatableDependent>(
        wiki.specialAbilities, 27
      )(state.specialAbilities).filter(isActive).length;

      if (active < 3) {
        return {
          minTier: 3 - active
        };
      }
      break;
    }
    case 'SA_29':
      return {
        tiers: 3
      };
    case 'SA_70':
    case 'SA_255':
    case 'SA_345':
    case 'SA_346':
    case 'SA_676':
    case 'SA_677':
    case 'SA_678':
    case 'SA_679':
    case 'SA_680':
    case 'SA_681': {
      const multipleTraditions = getMagicalTraditions(state.specialAbilities).length > 1;
      if (!multipleTraditions && (state.spells.size > 0 || state.cantrips.size > 0)) {
        return {
          disabled: true
        };
      }
      break;
    }
    case 'SA_86':
    case 'SA_682':
    case 'SA_683':
    case 'SA_684':
    case 'SA_685':
    case 'SA_686':
    case 'SA_687':
    case 'SA_688':
    case 'SA_689':
    case 'SA_690':
    case 'SA_691':
    case 'SA_692':
    case 'SA_693':
    case 'SA_694':
    case 'SA_695':
    case 'SA_696':
    case 'SA_697':
    case 'SA_698': {
      if (state.liturgicalChants.size > 0 || state.blessings.size > 0) {
        return {
          disabled: true
        };
      }
      break;
    }
    case 'SA_667': {
      return {
        maxTier: pact!.level
      };
    }
  }

  return {};
};

/**
 * Checks if the given ActiveObject can be removed or changed in tier.
 * @param obj The ActiveObject with origin id.
 * @param state The current hero's state.
 */
export const getValidation = (
  obj: Data.ActiveObjectWithId,
  wiki: WikiState,
  state: Data.HeroDependent,
  pact: Pact | undefined,
): MaybeFunctor<ValidationObject | undefined> => {
  const { id, sid } = obj;

  return getWikiEntry<Wiki.WikiActivatable>(wiki, id)
    .fmap(wikiEntry => {
      return getHeroStateListItem<Data.ActivatableDependent>(id)(state)
        .fmap(instance => {
          const { dependencies, active } = instance;
          const { prerequisites } = wikiEntry;

          const entrySpecificValidation = getEntrySpecificValidation(
            wiki,
            state,
            pact,
            instance,
            obj,
          );

          const getMaxTier = () => {
            return !Array.isArray(prerequisites) ? validateTier(
              wiki,
              state,
              prerequisites,
              dependencies,
              id,
              pact,
            ) : undefined;
          };

          let {
            disabled = !isDeactivatable(wiki, state, pact, instance, obj),
          } = entrySpecificValidation;

          const {
            maxTier = getMaxTier(),
            minTier = getMinTier(dependencies, sid),
            tiers = wikiEntry.tiers,
          } = entrySpecificValidation;

          if (typeof tiers === 'number' && minTier) {
            disabled = true;
          }

          if (!disabled && dependencies.some(e => typeof e === 'boolean' ? e && active.length === 1 : (Object.keys(e) as ('sid' | 'sid2' | 'tier')[]).every(key => obj[key] === e[key]) && Object.keys(obj).length === Object.keys(e).length)) {
            disabled = true;
          }

          return {
            ...obj,
            disabled,
            maxTier,
            minTier,
            tiers
          };
        })
        .value
    });
};
