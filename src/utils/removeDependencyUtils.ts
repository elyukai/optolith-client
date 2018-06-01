import R from 'ramda';
import * as Data from "../types/data.d";
import { isActivatableSkillDependent } from './checkEntryUtils';
import { ArrayElement } from './collectionUtils';
import { getHeroStateListItem, removeHeroListStateItem, setHeroListStateItem } from './heroStateUtils';
import * as UnusedEntryUtils from './unusedEntryUtils';

type Dep<T extends Data.Dependent> = ArrayElement<T["dependencies"]>;
type Deps<T extends Data.Dependent> = T["dependencies"];

const getDependencies = <T extends Data.Dependent>(obj: T) =>
  obj.dependencies as Deps<T>;

const getDependencyIndex = <T extends Data.Dependent>(e: Dep<T>) =>
  R.findIndex(R.equals(e)) as (list: Deps<T>) => number;

const removeDependency = <T extends Data.Dependent>(e: Dep<T>) =>
  (obj: T): T => {
    const list = getDependencies(obj);

    const index = getDependencyIndex(e)(list);

    return {
      ...(obj as any),
      dependencies: R.remove(index, 1, list),
    };
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
      .map(R.pipe(
        removeDependency(value),
        adjustOrRemove(id),
      ))
      .map(fn => (fn as any)(state))
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
