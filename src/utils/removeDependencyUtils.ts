import * as Data from "../types/data.d";
import { removeFromArray } from './collectionUtils';
import { getHeroStateListItem, setHeroListStateItem, removeHeroListStateItem } from './heroStateUtils';
import * as InitHeroUtils from './initHeroUtils';
import { ValueOptionalDependency } from '../types/reusable';
import { isEqual } from 'lodash';

function removeDependency<T extends Data.Dependent, D>(obj: T, remove: D): T {
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
}

export function removeAttributeDependency(
  state: Data.HeroDependent,
  id: string,
  value: number,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.AttributeDependent>(state, id);

  if (entry) {
    const newEntry = removeDependency(entry, value);

    if (InitHeroUtils.isAttributeDependentUnused(newEntry)) {
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

    if (InitHeroUtils.isActivatableDependentSkill(newEntry)) {
      if (InitHeroUtils.isActivatableDependentSkillUnused(newEntry)) {
        return removeHeroListStateItem(state, id);
      }

      return setHeroListStateItem(state, id, newEntry);
    }

    if (InitHeroUtils.isDependentSkillUnused(newEntry)) {
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

    if (InitHeroUtils.isActivatableDependentUnused(newEntry)) {
      return removeHeroListStateItem(state, id);
    }

    return setHeroListStateItem(state, id, newEntry);
  }

  return state;
}
