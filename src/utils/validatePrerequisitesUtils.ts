import R from 'ramda';
import { Pact } from '../actions/PactActions';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import * as Reusable from '../types/reusable.d';
import { Culture, Profession, Race, Skill } from '../types/wiki';
import { getAllWikiEntriesByGroup } from './WikiUtils';
import { isActivatableDependent, isActivatableSkillDependent, isDependentSkillExtended } from './checkEntryUtils';
import * as CheckPrerequisiteUtils from './checkPrerequisiteUtils';
import { convertMapToArray, filterExisting, spreadOptionalInArray } from './collectionUtils';
import { matchExists, maybe } from './exists';
import { getHeroStateListItem } from './heroStateUtils';
import { isActive } from './isActive';
import { match } from './match';
import { pipe } from './pipe';
import { getPrimaryAttributeId } from './primaryAttributeUtils';
import { getActiveSelections } from './selectionUtils';

interface Validator {
  (
    wiki: WikiState,
    state: Data.HeroDependent,
    req: Data.AllRequirements,
    sourceId: string,
    pact: Pact | undefined,
  ): boolean;
}

const isRCPValid = (
  wiki: WikiState,
  state: Data.HeroDependent,
  sourceId: string,
): boolean => {
  return pipe(
    spreadOptionalInArray(
      pipe<string | undefined, Race | undefined, string[] | undefined>(
        maybe(race => wiki.races.get(race)),
        maybe(race => [
          ...race.stronglyRecommendedAdvantages,
          ...race.stronglyRecommendedDisadvantages,
          ...race.commonAdvantages,
          ...race.commonDisadvantages,
        ]),
      )(state.race)
    ),
    spreadOptionalInArray(
      pipe<string | undefined, Culture | undefined, string[] | undefined>(
        maybe(race => wiki.cultures.get(race)),
        maybe(race => [
          ...race.commonAdvantages,
          ...race.commonDisadvantages,
        ]),
      )(state.culture)
    ),
    spreadOptionalInArray(
      pipe<string | undefined, Profession | undefined, string[] | undefined>(
        maybe(race => wiki.professions.get(race)),
        maybe(race => [
          ...race.suggestedAdvantages,
          ...race.unsuitableAdvantages,
        ]),
      )(state.profession)
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
  pact: Pact | undefined,
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
  pact: Pact | undefined,
  req: Reusable.RequiresIncreasableObject,
  validateObject: Validator,
): boolean => {
  return match<string | string[], boolean>(req.id)
    .on(Array.isArray, id => {
      return id.some(e => {
        return validateObject(wiki, state, { ...req, id: e }, sourceId, pact);
      });
    })
    .otherwise(pipe(
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
  pact: Pact | undefined,
  req: Reusable.RequiresActivatableObject,
  validateObject: Validator,
): boolean => {
  return match<string | string[], boolean>(req.id)
    .on(Array.isArray, id => {
      return id.some(e => {
        return validateObject(wiki, state, { ...req, id: e }, sourceId, pact);
      });
    })
    .otherwise(id => {
      return match<string | number | number[] | undefined, boolean>(req.sid)
        .on('sel', () => true)
        .on('GR', () => {
          return R.defaultTo(
            true,
            getHeroStateListItem<Data.ActivatableDependent>(id)(state)
              .fmap(target => {
                return pipe<Skill[], string[], boolean>(
                  arr => arr.map(e => e.id),
                  arr => getActiveSelections(target).every(e => {
                    return !arr.includes(e as string);
                  })
                )(
                  getAllWikiEntriesByGroup(wiki.skills, req.sid2 as number)
                );
              })
              .value
          );
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
  pact: Pact | undefined,
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
      return isPactValid(pact, req);
    })
    .on(CheckPrerequisiteUtils.isRequiringPrimaryAttribute, req => {
      return isPrimaryAttributeValid(state, req);
    })
    .on(CheckPrerequisiteUtils.isRequiringIncreasable, req => {
      return isIncreasableValid(wiki, state, sourceId, pact, req, validateObject);
    })
    .otherwise(req => {
      return isActivatableValid(wiki, state, sourceId, pact, req, validateObject);
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
  pact: Pact | undefined
): boolean => {
  return requirements.every(e => {
    return validateObject(wiki, state, e, sourceId, pact);
  });
}

type ReqMap = Map<number, Data.AllRequirements[]>;
type ReqEntries = [number, Data.AllRequirements[]][];

const isSkipping = (arr: ReqEntries, index: number, max?: number) => {
  return typeof max === 'number' && index > 1 && arr[index - 2][0] < max
};

const areAllPrerequisitesValid = (
  wiki: WikiState,
  state: Data.HeroDependent,
  prerequisites: Data.AllRequirements[],
  sourceId: string,
  pact: Pact | undefined,
) => prerequisites.every(e => {
  return validateObject(wiki, state, e, sourceId, pact);
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
  requirements: Map<number, Data.AllRequirements[]>,
  dependencies: Data.ActivatableInstanceDependency[],
  sourceId: string,
  pact: Pact | undefined,
): number | undefined => {
  return pipe<ReqMap, ReqEntries, ReqEntries, number | undefined>(
    convertMapToArray,
    arr => [...arr].sort((a, b) => a[0] - b[0]),
    arr => arr.reduce<number | undefined>((max, entry, index) => {
      const [tier, prerequisites] = entry;
      return !isSkipping(arr, index, max) ||
        areAllPrerequisitesValid(wiki, state, prerequisites, sourceId, pact)
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
 * Get minimum valid tier.
 * @param dependencies The current instance dependencies.
 */
export function getMinTier(
  dependencies: Data.ActivatableInstanceDependency[],
  sid?: string | number,
): number | undefined {
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
  }, undefined);
}

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
