import { Categories } from '../constants/Categories';
import * as Data from "../types/data.d";
import { ValueOptionalDependency } from '../types/reusable.d';
import { getCategoryById } from './IDUtils';
import { addToArray } from './collectionUtils';
import * as CreateEntryUtils from './createEntryUtils';
import { getHeroStateListItem, setHeroListStateItem } from './heroStateUtils';

const addDependency = (obj: Data.Dependent) => (add: any): Data.Dependent => ({
  ...obj,
  dependencies: addToArray(obj.dependencies, add),
});

export function addAttributeDependency(
  state: Data.HeroDependent,
  id: string,
  value: number | ValueOptionalDependency,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.AttributeDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry)(value),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    CreateEntryUtils.createAttributeDependent(id, {
      dependencies: [value],
    }),
  );
}

export function addIncreasableDependency(
  state: Data.HeroDependent,
  id: string,
  value: number | ValueOptionalDependency,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.ExtendedSkillDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry)(value),
    );
  }

  const category = getCategoryById(id);

  if (category === Categories.LITURGIES || category === Categories.SPELLS) {
    return setHeroListStateItem(
      state,
      id,
      CreateEntryUtils.createActivatableDependentSkill(id, {
        dependencies: [value],
      }),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    CreateEntryUtils.createDependentSkill(id, {
      dependencies: [value],
    }),
  );
}

export function addActivatableDependency(
  state: Data.HeroDependent,
  id: string,
  value: Data.ActivatableInstanceDependency,
): Data.HeroDependent {
  const entry = getHeroStateListItem<Data.ActivatableDependent>(state, id);

  if (entry) {
    return setHeroListStateItem(
      state,
      id,
      addDependency(entry)(value),
    );
  }

  return setHeroListStateItem(
    state,
    id,
    CreateEntryUtils.createActivatableDependent(id, {
      dependencies: [value],
    }),
  );
}
