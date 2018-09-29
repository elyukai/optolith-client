import * as R from 'ramda';
import * as Data from '../types/data';
import { isActivatableSkillDependent } from './checkEntryUtils';
import { List, ListElement, Maybe, Record, RecordInterface } from './dataUtils';
import { getHeroStateListItem, removeHeroListStateItem, setHeroListStateItem } from './heroStateUtils';
import * as UnusedEntryUtils from './unusedEntryUtils';

type Deps<T extends Data.Dependent> = RecordInterface<T>['dependencies'];
type Dep<T extends Data.Dependent> = ListElement<Deps<T>>;

const getDependencies = <T extends Data.Dependent>(obj: T) =>
  obj.get ('dependencies') as Deps<T>;

const getDependencyIndex = <T extends Data.Dependent>(e: Dep<T>) =>
  (list: Deps<T>) => (list as List<any>).findIndex (R.equals (e));

const removeDependency = <T extends Data.Dependent>(e: Dep<T>) =>
  (obj: T): T => {
    const list = getDependencies (obj);

    const index = Maybe.fromMaybe (-1) (getDependencyIndex (e) (list));

    return (obj as any).modify ((dependencies: List<any>) => dependencies.deleteAt (index))
                               ('dependencies');
  };

const adjustOrRemove =
  <T extends Data.Dependent>(isUnused: (entry: T) => boolean) =>
    (id: string) =>
      (entry: T): (state: Record<Data.HeroDependent>) => Maybe<Record<Data.HeroDependent>> => {
        console.log (isUnused, id, entry);

        return isUnused (entry)
          ? removeHeroListStateItem (id)
          : setHeroListStateItem (id) (entry);
      };

const getIncreasableCreator: <T extends Data.ExtendedSkillDependent>(id: string) =>
  (entry: T) =>
    (state: Record<Data.HeroDependent>) => Maybe<Record<Data.HeroDependent>> =
      R.ifElse (
        isActivatableSkillDependent,
        adjustOrRemove (UnusedEntryUtils.isActivatableDependentSkillUnused),
        adjustOrRemove (UnusedEntryUtils.isDependentSkillUnused)
      );

const removeDependencyCreator = <T extends Data.Dependent>(
  adjustOrRemoveFn: (id: string) =>
    (entry: T) =>
      (state: Record<Data.HeroDependent>) => Maybe<Record<Data.HeroDependent>>
) =>
  (id: string, value: Dep<T>) =>
    (state: Record<Data.HeroDependent>): Record<Data.HeroDependent> =>
      Maybe.fromMaybe (state) (
        getHeroStateListItem<T> (id) (state)
          .fmap (R.pipe (
            removeDependency (value),
            adjustOrRemoveFn (id)
          ))
          .bind (fn => fn (state))
      );

export const removeAttributeDependency = removeDependencyCreator (
  adjustOrRemove (UnusedEntryUtils.isAttributeDependentUnused)
);

export const removeIncreasableDependency = removeDependencyCreator (getIncreasableCreator);

export const removeActivatableDependency = removeDependencyCreator (
  adjustOrRemove (UnusedEntryUtils.isActivatableDependentUnused)
);
