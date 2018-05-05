import { isEqual } from 'lodash';
import * as Data from "../types/data.d";
import { ValueOptionalDependency } from '../types/reusable.d';
import { removeFromArray } from './collectionUtils';
import { getHeroStateListItem, removeHeroListStateItem, setHeroListStateItem } from './heroStateUtils';
import * as UnusedEntryUtils from './unusedEntryUtils';

const removeDependency = <T extends Data.Dependent, D>(obj: T, remove: D): T => {
  let index;

  if (typeof remove === 'object') {
    index = (obj.dependencies as D[]).findIndex(e => isEqual(remove, e));
  }
  else {
    index = (obj.dependencies as D[]).findIndex(e => e === remove);
  }

  if (index > -1) {
    return {
      ...(obj as any),
      dependencies: removeFromArray(obj.dependencies as D[], index),
    } as T;
  }

  return obj;
};

export function removeAttributeDependency(
  state: Data.HeroDependent,
  id: string,
  value: number,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.AttributeDependent>(state, id);

  if (entry) {
    const newEntry = removeDependency(entry, value);

    if (UnusedEntryUtils.isAttributeDependentUnused(newEntry)) {
      return removeHeroListStateItem(state, id);
    }

    return setHeroListStateItem(state, id, newEntry);
  }

  return state;
}

export function removeIncreasableDependency(
  state: Data.HeroDependent,
  id: string,
  value: number | ValueOptionalDependency,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.ExtendedSkillDependent>(state, id);

  if (entry) {
    const newEntry = removeDependency(entry, value);

    if (UnusedEntryUtils.isActivatableDependentSkill(newEntry)) {
      if (UnusedEntryUtils.isActivatableDependentSkillUnused(newEntry)) {
        return removeHeroListStateItem(state, id);
      }

      return setHeroListStateItem(state, id, newEntry);
    }

    if (UnusedEntryUtils.isDependentSkillUnused(newEntry)) {
      return removeHeroListStateItem(state, id);
    }

    return setHeroListStateItem(state, id, newEntry);
  }

  return state;
}

export function removeActivatableDependency(
  state: Data.HeroDependent,
  id: string,
  value: Data.ActivatableInstanceDependency,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.ActivatableDependent>(state, id);

  if (entry) {
    const newEntry = removeDependency(entry, value);

    if (UnusedEntryUtils.isActivatableDependentUnused(newEntry)) {
      return removeHeroListStateItem(state, id);
    }

    return setHeroListStateItem(state, id, newEntry);
  }

  return state;
}
