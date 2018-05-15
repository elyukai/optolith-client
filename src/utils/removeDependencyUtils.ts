import { isEqual } from 'lodash';
import R from 'ramda';
import * as Data from "../types/data.d";
import { isActivatableSkillDependent } from './checkEntryUtils';
import { ArrayElement, removeFromArray } from './collectionUtils';
import { getHeroStateListItem, removeHeroListStateItem, setHeroListStateItem } from './heroStateUtils';
import * as UnusedEntryUtils from './unusedEntryUtils';

const removeDependency = <T extends Data.Dependent>(
  remove: ArrayElement<T["dependencies"]>,
) => (obj: T): T => {
  let index;

  type Deps = ArrayElement<T["dependencies"]>[];

  if (typeof remove === 'object') {
    index = (obj.dependencies as Deps).findIndex(e => isEqual(remove, e));
  }
  else {
    index = (obj.dependencies as Deps).findIndex(e => e === remove);
  }

  if (index > -1) {
    return {
      ...(obj as any),
      dependencies: removeFromArray<any>(obj.dependencies)(index),
    } as T;
  }

  return obj;
};

const adjustOrRemove = <T extends Data.Dependent>(
  isUnused: (entry: T) => boolean,
) => (
  id: string,
) => (
  entry: T,
) => {
  if (isUnused(entry)) {
    return removeHeroListStateItem(id);
  }

  return setHeroListStateItem(id)(entry);
};

const getIncreasableCreator: <T extends Data.ExtendedSkillDependent>(
  id: string,
) => (entry: T) => (state: Data.HeroDependent) => Data.HeroDependent = R.ifElse(
  isActivatableSkillDependent,
  adjustOrRemove(
    UnusedEntryUtils.isActivatableDependentSkillUnused,
  ),
  adjustOrRemove(
    UnusedEntryUtils.isDependentSkillUnused,
  )
);

const removeDependencyCreator = <T extends Data.Dependent>(
  adjustOrRemove: (id: string) =>
    (entry: T) => (state: Data.HeroDependent) => Data.HeroDependent,
) => (
  id: string,
  value: ArrayElement<T["dependencies"]>,
) => (state: Data.HeroDependent): Data.HeroDependent => {
  return R.defaultTo(
    state,
    getHeroStateListItem<T>(id)(state)
      .fmap(R.pipe(
        removeDependency(value),
        adjustOrRemove(id),
      ))
      .fmap(fn => (fn as any)(state))
      .value
  );
};;

export const removeAttributeDependency = removeDependencyCreator(
  adjustOrRemove(UnusedEntryUtils.isAttributeDependentUnused)
);

export const removeIncreasableDependency = removeDependencyCreator(
  getIncreasableCreator
);

export const removeActivatableDependency = removeDependencyCreator(
  adjustOrRemove(UnusedEntryUtils.isActivatableDependentUnused)
);
