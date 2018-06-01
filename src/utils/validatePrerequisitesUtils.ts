import R from 'ramda';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Reusable from '../types/reusable.d';
import { Skill } from '../types/wiki';
import { getAllWikiEntriesByGroup } from './WikiUtils';
import { isActivatableDependent, isActivatableSkillDependent, isDependentSkillExtended } from './checkEntryUtils';
import * as CheckPrerequisiteUtils from './checkPrerequisiteUtils';
import { convertMapToArray, filterExisting, spreadOptionalInArray } from './collectionUtils';
import { matchExists } from './exists';
import { getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { match } from './match';
import { Maybe } from './maybe';
import { getPrimaryAttributeId } from './primaryAttributeUtils';
import { getActiveSelections } from './selectionUtils';

interface Validator {
  (
    wiki: WikiState,
    state: Data.HeroDependent,
    req: Data.AllRequirements,
    sourceId: string,
  ): boolean;
}

const isRCPValid = (
  wiki: WikiState,
  state: Data.HeroDependent,
  sourceId: string,
): boolean => {
  return R.pipe(
    spreadOptionalInArray(
      Maybe.from(state.race)
        .map(wiki.races.get)
        .map(race => [
          ...race.stronglyRecommendedAdvantages,
          ...race.stronglyRecommendedDisadvantages,
          ...race.commonAdvantages,
          ...race.commonDisadvantages,
        ]),
    ),
    spreadOptionalInArray(
      Maybe.from(state.culture)
        .map(wiki.cultures.get)
        .map(race => [
          ...race.commonAdvantages,
          ...race.commonDisadvantages,
        ]),
    ),
    spreadOptionalInArray(
      Maybe.from(state.profession)
        .map(wiki.professions.get)
        .map(race => [
          ...race.suggestedAdvantages,
          ...race.unsuitableAdvantages,
        ]),
    ),
    arr => arr.includes(sourceId)
  )([]);
};

const isSexValid = (
  sex: 'm' | 'f',
  req: Reusable.SexRequirement,
): boolean => {
  return sex === req.value;
};

const isRaceValid = (
  race: string | undefined,
  req: Reusable.RaceRequirement,
): boolean => {
  return match<number | number[], boolean>(req.value)
    .on(Array.isArray, value => {
      return typeof race === 'string' &&
        value.map(e => `R_${e}`).includes(race);
    })
    .otherwise(value => {
      return race === `R_${value}`;
    });
};

const isCultureValid = (
  culture: string | undefined,
  req: Reusable.CultureRequirement,
): boolean => {
  return match<number | number[], boolean>(req.value)
    .on(Array.isArray, value => {
      return typeof culture === 'string' &&
        value.map(e => `R_${e}`).includes(culture);
    })
    .otherwise(value => {
      return culture === `R_${value}`;
    });
};

const isPactValid = (
  pact: Data.Pact | undefined,
  req: Reusable.PactRequirement,
): boolean => typeof pact === 'object' && [
  () => req.category === pact.category,
  () => {
    return match<number, boolean>(req.category)
      .on(1, () => pact.type === 3)
      .otherwise(() => true);
  },
  () => {
    if (req.domain === undefined) {
      return true;
    }

    if (typeof pact.domain !== 'number') {
      return false;
    }

    if (typeof req.domain === 'object') {
      return req.domain.includes(pact.domain);
    }

    return req.domain === pact.domain;
  },
  () => req.level === undefined || req.level <= pact.level,
].every(e => e());

const isPrimaryAttributeValid = (
  state: Data.HeroDependent,
  req: Reusable.RequiresPrimaryAttribute,
): boolean => {
  return match<string | undefined, boolean>(
    getPrimaryAttributeId(state.specialAbilities, req.type)
  )
    .on(matchExists(), id => {
      const entry = state.attributes.get(id);
      return typeof entry === 'object' && entry.value >= req.value;
    })
    .otherwise(() => false);
};

const isIncreasableValid = (
  wiki: WikiState,
  state: Data.HeroDependent,
  sourceId: string,
  req: Reusable.RequiresIncreasableObject,
  validateObject: Validator,
): boolean => {
  return match<string | string[], boolean>(req.id)
    .on(Array.isArray, id => {
      return id.some(e => {
        return validateObject(wiki, state, { ...req, id: e }, sourceId);
      });
    })
    .otherwise(R.pipe(
      id => getHeroStateListItem(id)(state),
      instance => {
        return match<Data.Dependent | undefined, boolean>(instance.value)
          .on(isDependentSkillExtended, entry => entry.value >= req.value)
          .otherwise(() => false);
        },
    ));
};

const isActivatableValid = (
  wiki: WikiState,
  state: Data.HeroDependent,
  sourceId: string,
  req: Reusable.RequiresActivatableObject,
  validateObject: Validator,
): boolean => {
  return match<string | string[], boolean>(req.id)
    .on(Array.isArray, id => {
      return id.some(e => {
        return validateObject(wiki, state, { ...req, id: e }, sourceId);
      });
    })
    .otherwise(id => {
      return match<string | number | number[] | undefined, boolean>(req.sid)
        .on('sel', () => true)
        .on('GR', () => {
          return R.pipe(
            getHeroStateListItem<Data.ActivatableDependent>(id),
            obj => obj.map(target => {
              return R.pipe<Skill[], string[], boolean>(
                arr => arr.map(e => e.id),
                arr => getActiveSelections(target).every(e => {
                  return !arr.includes(e as string);
                })
              )(
                getAllWikiEntriesByGroup(wiki.skills, req.sid2 as number)
              );
            })
            .valueOr(true),
          )(state);
        })
        .otherwise(() => {
          return match<Data.ExtendedActivatableDependent | undefined, boolean>(
            getHeroStateListItem<Data.ExtendedActivatableDependent>(id)(state).value
          )
            .on(isActivatableDependent, instance => {
              const activeSelections = getActiveSelections(instance);

              if (req.sid && req.tier) {
                if (Array.isArray(req.sid)) {
                  return req.active === req.sid.some(e => {
                    return activeSelections.includes(e);
                  }) && instance.active.some(e => {
                    return typeof e.tier === 'number' &&
                      typeof req.tier === 'number' &&
                      e.tier >= req.tier;
                  });
                }

                return req.active === activeSelections.includes(req.sid) &&
                  instance.active.some(e => {
                    return typeof e.tier === 'number' &&
                      typeof req.tier === 'number' &&
                      e.tier >= req.tier;
                  });
              }
              else if (req.sid) {
                if (Array.isArray(req.sid)) {
                  return req.active === req.sid.some(e => {
                    return activeSelections.includes(e);
                  });
                }

                return req.active === activeSelections.includes(req.sid);
              }
              else if (req.tier) {
                return instance.active.some(e => {
                  return typeof e.tier === 'number' &&
                    typeof req.tier === 'number' &&
                    e.tier >= req.tier;
                });
              }

              return isActive(instance) === req.active;
            })
            .on(isActivatableSkillDependent, instance => {
              return instance.active === req.active;
            })
            .otherwise(() => false);
        });
    });
};

/**
 * Checks if the requirement is fulfilled.
 * @param state The current hero data.
 * @param req A requirement object.
 * @param sourceId The id of the entry the requirement object belongs to.
 * @param pact A valid `Pact` object or `undefined`.
 */
export const validateObject = (
  wiki: WikiState,
  state: Data.HeroDependent,
  req: Data.AllRequirements,
  sourceId: string,
): boolean => {
  return match<Data.AllRequirements, boolean>(req)
    .on('RCP', () => isRCPValid(wiki, state, sourceId))
    .on(CheckPrerequisiteUtils.isSexRequirement, req => {
      return isSexValid(state.sex, req);
    })
    .on(CheckPrerequisiteUtils.isRaceRequirement, req => {
      return isRaceValid(state.race, req);
    })
    .on(CheckPrerequisiteUtils.isCultureRequirement, req => {
      return isCultureValid(state.culture, req);
    })
    .on(CheckPrerequisiteUtils.isPactRequirement, req => {
      return isPactValid(state.pact, req);
    })
    .on(CheckPrerequisiteUtils.isRequiringPrimaryAttribute, req => {
      return isPrimaryAttributeValid(state, req);
    })
    .on(CheckPrerequisiteUtils.isRequiringIncreasable, req => {
      return isIncreasableValid(wiki, state, sourceId, req, validateObject);
    })
    .otherwise(req => {
      return isActivatableValid(wiki, state, sourceId, req, validateObject);
    });
};

/**
 * Checks if all requirements are fulfilled.
 * @param state The current hero data.
 * @param requirements An array of requirement objects.
 * @param sourceId The id of the entry the requirement objects belong to.
 * @param pact A valid `Pact` object or `undefined`.
 */
export const validatePrerequisites = (
  wiki: WikiState,
  state: Data.HeroDependent,
  requirements: Data.AllRequirements[],
  sourceId: string,
): boolean => {
  return requirements.every(e => {
    return validateObject(wiki, state, e, sourceId);
  });
}

type ReqMap = ReadonlyMap<number, Data.AllRequirements[]>;
type ReqEntries = ReadonlyArray<[number, Data.AllRequirements[]]>;

const isSkipping = (arr: ReqEntries, index: number, max?: number) => {
  return typeof max === 'number' && index > 1 && arr[index - 2][0] < max
};

const areAllPrerequisitesValid = (
  wiki: WikiState,
  state: Data.HeroDependent,
  prerequisites: Data.AllRequirements[],
  sourceId: string,
) => prerequisites.every(e => {
  return validateObject(wiki, state, e, sourceId);
});

const isProhibitingHigherLevel = (
  dep: Data.ActivatableInstanceDependency
): dep is { active: false; tier: number; } => {
  return typeof dep === 'object' &&
    dep.active === false &&
    typeof dep.tier === 'number';
};

/**
 * Get maximum valid tier.
 * @param state The current hero data.
 * @param requirements A Map of tier prereqisite arrays.
 * @param sourceId The id of the entry the requirement objects belong to.
 */
export const validateTier = (
  wiki: WikiState,
  state: Data.HeroDependent,
  requirements: ReadonlyMap<number, Data.AllRequirements[]>,
  dependencies: ReadonlyArray<Data.ActivatableInstanceDependency>,
  sourceId: string,
): number | undefined => {
  return R.pipe<ReqMap, ReqEntries, ReqEntries, number | undefined, number | undefined>(
    convertMapToArray,
    arr => [...arr].sort((a, b) => a[0] - b[0]),
    arr => arr.reduce<number | undefined>((max, entry, index) => {
      const [tier, prerequisites] = entry;
      return !isSkipping(arr, index, max) ||
        areAllPrerequisitesValid(wiki, state, prerequisites, sourceId)
        ? tier : max;
    }, undefined),
    max => dependencies.reduce((max, dep) => {
      if (isProhibitingHigherLevel(dep)) {
        return Math.min(...filterExisting([max, dep.tier - 1]));
      }
      return max;
    }, max),
  )(requirements);
};

/**
 * Checks if all profession prerequisites are fulfilled.
 * @param prerequisites An array of prerequisite objects.
 */
export function validateProfession(
  prerequisites: Reusable.ProfessionDependency[],
  sex: 'm' | 'f',
  race?: string,
  culture?: string,
): boolean {
  return prerequisites.every(req => {
    return match<Reusable.ProfessionDependency, boolean>(req)
      .on(CheckPrerequisiteUtils.isSexRequirement, req => {
        return isSexValid(sex, req);
      })
      .on(CheckPrerequisiteUtils.isRaceRequirement, req => {
        return isRaceValid(race, req);
      })
      .on(CheckPrerequisiteUtils.isCultureRequirement, req => {
        return isCultureValid(culture, req);
      })
      .otherwise(() => false);
  });
}
