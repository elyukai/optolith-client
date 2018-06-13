import { HeroDependent, StyleDependency } from '../types/data.d';
import { SpecialAbility } from '../types/wiki.d';
import { Record } from './dataUtils';

export type StyleDependencyStateKeys =
  'combatStyleDependencies' |
  'magicalStyleDependencies' |
  'blessedStyleDependencies';

/**
 * Checks if the given entry is a Style Special Ability and which state key it
 * belongs to.
 * @param entry
 * @returns A state key or `undefined` if not a Style Special Ability.
 */
const getStyleStateKey = (
  entry: SpecialAbility,
): StyleDependencyStateKeys | undefined => {
  if (entry.gr === 9 || entry.gr === 10) {
    return 'combatStyleDependencies';
  }
  else if (entry.gr === 13) {
    return 'magicalStyleDependencies';
  }
  else if (entry.gr === 25) {
    return 'blessedStyleDependencies';
  }
  return;
};

/**
 * Adds extended special ability dependencies if the passed entry is a style
 * special ability.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to add extended entry
 * dependencies for.
 * @returns Changed state slice.
 */
export const addStyleExtendedSpecialAbilityDependencies = (
  state: HeroDependent,
  instance: SpecialAbility,
): HeroDependent => {
  const key = getStyleStateKey(instance);

  if (typeof key === 'string' && instance.extended) {
    const newItems = instance.extended.map(id => ({
      id,
      origin: instance!.id
    }));

    const oldItems = state[key].map(e => {
      const { id, active } = e;
      if (Array.isArray(id) && typeof active === 'string') {
        const index = newItems.findIndex(e => e.id === active);
        if (index > -1) {
          return {
            ...e,
            active: undefined
          };
        }
      }
      return e;
    });

    return {
      ...state,
      [key]: [
        ...oldItems,
        ...newItems
      ],
    };
  }

  return state;
};

/**
 * Checks if the given entry is an Extended Special Ability and which state key it
 * belongs to.
 * @param entry
 * @returns A state key or `undefined` if not an Extended Special Ability.
 */
const getExtendedStateKey = (
  entry: SpecialAbility,
): StyleDependencyStateKeys | undefined => {
  if (entry.gr === 11) {
    return 'combatStyleDependencies';
  }
  else if (entry.gr === 14) {
    return 'magicalStyleDependencies';
  }
  else if (entry.gr === 26) {
    return 'blessedStyleDependencies';
  }
  return;
};

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been added.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export const addExtendedSpecialAbilityDependency = (
  state: HeroDependent,
  instance: SpecialAbility,
): HeroDependent => {
  const key = getExtendedStateKey(instance);

  if (typeof key === 'string') {
    const entries = state[key];
    let index = entries.findIndex(e => e.id === instance.id);

    if (index === -1) {
      // Checks if the requested entry is part of a list of options.
      index = entries.findIndex(e => {
        return Array.isArray(e.id) && e.id.includes(instance.id);
      });
    }

    if (index > -1) {
      const prev = entries.slice(0, index);
      const next = entries.slice(index + 1);
      return {
        ...state,
        [key]: [
          ...prev,
          {
            ...entries[index],
            active: instance.id
          },
          ...next
        ]
      };
    }
  }

  return state;
};

/**
 * Split the objects from the ability to remove and remaining objects.
 * @param items The respective list of style dependencies.
 * @param styleId The id of the style to remove.
 */
const getSplittedRemainingAndToRemove = (
  items: StyleDependency[],
  styleId: string,
): SplittedRemainingAndToRemove => {
  const initialObj = {
    itemsToRemove: [],
    leftItems: []
  };

  return items.reduce<SplittedRemainingAndToRemove>((obj, dependency) => {
    if (dependency.origin === styleId) {
      return {
        ...obj,
        itemsToRemove: [...obj.itemsToRemove, dependency]
      };
    }
    return {
      ...obj,
      leftItems: [...obj.leftItems, dependency]
    };
  }, initialObj);
};

/**
 * Removes extended special ability dependencies if the passed entry is a style
 * special ability.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to remove extended entry
 * dependencies for.
 * @returns Changed state slice.
 */
export const removeStyleExtendedSpecialAbilityDependencies = (
  state: HeroDependent,
  instance: SpecialAbility,
): HeroDependent => {
  const key = getStyleStateKey(instance);

  if (typeof key === 'string' && instance.extended) {
    const {
      itemsToRemove,
      leftItems
    } = getSplittedRemainingAndToRemove(state[key], instance.id);

    const usedObjectsToRemove = itemsToRemove.filter(e => {
      return typeof e.active === 'string';
    });

    for (const dependency of usedObjectsToRemove) {
      // Checks if there is a second object to move the active dependency
      const index = leftItems.findIndex(e => {
        if (typeof e.id !== 'object') {
          return dependency.active === e.id;
        }
        return e.id.includes(dependency.active!) && e.active === undefined;
      });

      leftItems[index] = {
        ...leftItems[index],
        active: dependency.active
      };
    }

    return {
      ...state,
      [key]: leftItems
    };
  }

  return state;
};

/**
 * Modifies a `StyleDependency` object to show a extended special ability has
 * been removed.
 * @param state Dependent instances state slice.
 * @param instance The special ability you want to modify a dependency for.
 * @returns Changed state slice.
 */
export const removeExtendedSpecialAbilityDependency = (
  state: HeroDependent,
  instance: SpecialAbility,
): HeroDependent => {
  const key = getExtendedStateKey(instance);

  if (typeof key === 'string') {
    const entries = state[key];
    let index = entries.findIndex(e => (
      Array.isArray(e.id) && e.id.includes(instance.id) && e.active === instance.id
    ));

    if (index === -1) {
      index = entries.findIndex(e => (
        e.id === instance.id && e.active === instance.id
      ));
    }

    if (index > -1) {
      const prev = entries.slice(0, index);
      const next = entries.slice(index + 1);

      return {
        ...state,
        [key]: [
          ...prev,
          {
            ...entries[index],
            active: undefined
          },
          ...next
        ]
      };
    }
  }

  return state;
};

/**
 * Return flat array of available extended special abilities' IDs.
 * @param list List of set extended special ability objects.
 */
const getAvailableExtendedSpecialAbilities = (
  list: StyleDependency[],
): string[] => {
  return list.reduce<string[]>((arr, e) => {
    if (typeof e.active !== 'string') {
      if (typeof e.id === 'object') {
        return [...arr, ...e.id];
      }
      return [...arr, e.id];
    }
    return arr;
  }, []);
};

/**
 * Calculates a list of available Extended Special Abilties. The availability is
 * only based on bought Style Special Abilities, so (other) prerequisites have
 * to be checked separately.
 * @param styleDependencies
 */
export const getAllAvailableExtendedSpecialAbilities = (
  ...styleDependencies: StyleDependency[][]
): string[] => {
  return styleDependencies.reduce<string[]>((idList, dependencyArr) => {
    return [
      ...idList,
      ...getAvailableExtendedSpecialAbilities(dependencyArr),
    ];
  }, []);
};

/**
 * Checks if the passed special ability is a style and if it is valid to remove
 * based on registered extended special abilities.
 * @param state Dependent instances state slice.
 * @param entry The special ability to check.
 */
export const isStyleValidToRemove = (
  state: Record<HeroDependent>,
  entry?: Record<SpecialAbility>,
): boolean => {
  if (entry) {
    const key = getStyleStateKey(entry);

    if (typeof key === 'string') {
      const {
        itemsToRemove,
        leftItems
      } = getSplittedRemainingAndToRemove(state[key], entry.id);

      const usedObjectsToRemove = itemsToRemove.filter(e => {
        return typeof e.active === 'string';
      });

      for (const dependency of usedObjectsToRemove) {
        // Checks if there is a second object to move the active dependency
        const index = leftItems.findIndex(e => {
          if (typeof e.id !== 'object') {
            return dependency.active === e.id;
          }
          return e.id.includes(dependency.active!) && e.active === undefined;
        });

        // if no other object available style entry must not be removed
        if (index === -1) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
};

interface SplittedRemainingAndToRemove {
  itemsToRemove: StyleDependency[];
  leftItems: StyleDependency[];
}
