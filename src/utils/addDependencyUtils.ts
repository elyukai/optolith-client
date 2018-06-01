import R from 'ramda';
import { ActivatableSkillCategories } from '../constants/Categories';
import * as Data from "../types/data.d";
import { ValueOptionalDependency } from '../types/reusable.d';
import { getCategoryById } from './IDUtils';
import { ArrayElement } from './collectionUtils';
import * as CreateEntryUtils from './createEntryUtils';
import { adjustHeroListStateItemOr } from './heroStateUtils';

type IncreasableCreator = (id: string) => Data.ExtendedSkillDependent;

const addDependency = <T extends Data.Dependent>(
  add: ArrayElement<T["dependencies"]>,
// @ts-ignore
) => (obj: T): T => ({
  ...(obj as Data.Dependent),
  dependencies: R.append(add, obj.dependencies as ArrayElement<T["dependencies"]>[]),
} as T);

/**
 * Returns needed entry creator for given increasable category.
 * @param category
 */
const getIncreasableCreator: (id: string) => IncreasableCreator = R.pipe(
  getCategoryById,
  category => {
    if (category && ActivatableSkillCategories.includes(category)) {
      return CreateEntryUtils.createActivatableDependentSkill;
    }

    return CreateEntryUtils.createDependentSkill;
  }
);

export const addAttributeDependency = (
  id: string,
  value: number | ValueOptionalDependency,
) => adjustHeroListStateItemOr(
  CreateEntryUtils.createAttributeDependent,
  addDependency<Data.AttributeDependent>(value),
  id
);

export const addIncreasableDependency = (
  id: string,
  value: number | ValueOptionalDependency,
) => adjustHeroListStateItemOr(
  getIncreasableCreator(id),
  addDependency<Data.ExtendedSkillDependent>(value),
  id
);

export const addActivatableDependency = (
  id: string,
  value: Data.ActivatableInstanceDependency,
) => adjustHeroListStateItemOr(
  CreateEntryUtils.createActivatableDependent,
  addDependency<Data.ActivatableDependent>(value),
  id
);
