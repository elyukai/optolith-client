import R from 'ramda';
import { ActivatableSkillCategories } from '../constants/Categories';
import * as Data from "../types/data.d";
import { ValueOptionalDependency } from '../types/reusable.d';
import { getCategoryById } from './IDUtils';
import { callTwice } from './callTwice';
import * as CreateEntryUtils from './createEntryUtils';
import { getHeroStateListItemOr, setHeroListStateItem } from './heroStateUtils';

type IncreasableCreator = (id: string) => Data.ExtendedSkillDependent;

const addDependency = <T extends Data.Dependent>(add: any) => (obj: Data.Dependent): T => ({
  ...obj,
  dependencies: R.append(add, obj.dependencies),
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
) => callTwice(R.pipe(
  getHeroStateListItemOr(id, CreateEntryUtils.createAttributeDependent),
  addDependency(value),
  setHeroListStateItem(id),
));

export const addIncreasableDependency = (
  id: string,
  value: number | ValueOptionalDependency,
) => callTwice(R.pipe(
  getHeroStateListItemOr(id, getIncreasableCreator(id)),
  addDependency(value),
  setHeroListStateItem(id),
));

export const addActivatableDependency = (
  id: string,
  value: Data.ActivatableInstanceDependency,
) => callTwice(R.pipe(
  getHeroStateListItemOr(id, CreateEntryUtils.createActivatableDependent),
  addDependency(value),
  setHeroListStateItem(id),
));
