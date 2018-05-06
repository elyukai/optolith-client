import { ActivatableSkillCategories, Categories } from '../constants/Categories';
import * as Data from "../types/data.d";
import { ValueOptionalDependency } from '../types/reusable.d';
import { getCategoryById } from './IDUtils';
import { addToArray } from './collectionUtils';
import * as CreateEntryUtils from './createEntryUtils';
import { exists } from './exists';
import { getHeroStateListItem, setHeroListStateItem } from './heroStateUtils';
import { match } from './match';
import { pipe } from './pipe';

type IncreasableCreator =
  (id: string, options: { dependencies: (number | ValueOptionalDependency)[] }) =>
    Data.ExtendedSkillDependent;

type AttributeDependencyFn =
  (value: number | ValueOptionalDependency) =>
    Data.AttributeDependent;

type ExtendedSkillDependencyFn =
  (value: number | ValueOptionalDependency) =>
    Data.ExtendedSkillDependent;

type ActivatableDependencyFn =
  (value: Data.ActivatableInstanceDependency) =>
    Data.ActivatableDependent;

const addDependency = <T extends Data.Dependent>(obj: Data.Dependent) => (add: any): T => ({
  ...obj,
  dependencies: addToArray(obj.dependencies as any[])(add),
} as T);

/**
 * Creates a new attribute entry with initial dependency.
 * @param id
 */
const createNewAttributeWithDependency = (id: string) =>
  (value: number | ValueOptionalDependency) => {
    return CreateEntryUtils.createAttributeDependent(id, {
      dependencies: [value],
    })
  };

/**
 * Returns needed entry creator for given increasable category.
 * @param category
 */
const getIncreasableCreator = (
  category: Categories | undefined,
): IncreasableCreator => {
  if (category && ActivatableSkillCategories.includes(category)) {
    return CreateEntryUtils.createActivatableDependentSkill;
  }

  return CreateEntryUtils.createDependentSkill;
};

/**
 * Creates a new increasable entry with initial dependency.
 * @param id
 */
const createNewIncreasableWithDependency = (id: string) =>
  (value: number | ValueOptionalDependency) => {
    return pipe(
      getCategoryById,
      category => getIncreasableCreator(category)(id, {
        dependencies: [value],
      })
    )(id);
  };

/**
 * Creates a new activatable entry with initial dependency.
 * @param id
 */
const createNewActivatableWithDependency = (id: string) =>
  (value: Data.ActivatableInstanceDependency) => {
    return CreateEntryUtils.createActivatableDependent(id, {
      dependencies: [value],
    })
  };

export function addAttributeDependency(
  state: Data.HeroDependent,
  id: string,
  value: number | ValueOptionalDependency,
): Data.HeroDependent {
  return setHeroListStateItem(
    state,
    id,
    pipe(
      match<Data.AttributeDependent | undefined, AttributeDependencyFn>(
        getHeroStateListItem(state, id)
      )
        .on(exists(), addDependency)
        .otherwise(() => createNewAttributeWithDependency(id))
    )(value)
  );
}

export function addIncreasableDependency(
  state: Data.HeroDependent,
  id: string,
  value: number | ValueOptionalDependency,
): Data.HeroDependent {
  return setHeroListStateItem(
    state,
    id,
    pipe(
      match<Data.ExtendedSkillDependent | undefined, ExtendedSkillDependencyFn>(
        getHeroStateListItem(state, id)
      )
        .on(exists(), addDependency)
        .otherwise(() => createNewIncreasableWithDependency(id))
    )(value)
  );
}

export function addActivatableDependency(
  state: Data.HeroDependent,
  id: string,
  value: Data.ActivatableInstanceDependency,
): Data.HeroDependent {
  return setHeroListStateItem(
    state,
    id,
    pipe(
      match<Data.ActivatableDependent | undefined, ActivatableDependencyFn>(
        getHeroStateListItem(state, id)
      )
        .on(exists(), addDependency)
        .otherwise(() => createNewActivatableWithDependency(id))
    )(value)
  );
}
