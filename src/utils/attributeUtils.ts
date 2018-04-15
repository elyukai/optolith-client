import { Categories } from '../constants/Categories';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { get, getAllByCategory } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import { AttributeInstance, RequirementObject, SpecialAbilityInstance, TalentInstance, ActivatableDependent } from '../types/data.d';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';
import { getNumericBlessedTraditionIdByInstanceId } from './LiturgyUtils';
import { getFlatPrerequisites } from './RequirementUtils';
import { getNumericMagicalTraditionIdByInstanceId } from './SpellUtils';
import { getMagicalTraditionsResultFunc } from '../selectors/rework_spellsSelectors';
import { getBlessedTraditionResultFunc } from '../selectors/rework_liturgicalChantsSelectors';

export function getSum(list: AttributeInstance[]): number {
  return list.reduce((n, e) => n + e.value, 0);
}

export function isIncreasable(state: CurrentHeroInstanceState, obj: AttributeInstance): boolean {
  if (state.phase < 3) {
    const attributes = getAllByCategory(state.dependent, Categories.ATTRIBUTES) as AttributeInstance[];
    const el = getStart(state.el);
    const max = getSum(attributes) >= el.maxTotalAttributeValues ? 0 : el.maxAttributeValue + obj.mod;
    return obj.value < max;
  }
  else if (state.rules.attributeValueLimit === true) {
    const currentElId = getExperienceLevelIdByAp(state.el.all, state.ap);
    const currentEl = state.el.all.get(currentElId);
    return typeof currentEl === 'object' && obj.value < currentEl.maxAttributeValue + 2;
  }
  return true;
}

export function isDecreasable(state: CurrentHeroInstanceState, obj: AttributeInstance): boolean {
  const dependencies = obj.dependencies.map(e => {
    if (typeof e !== 'number') {
      const target = get(state.dependent, e.origin) as SpecialAbilityInstance;
      const req = getFlatPrerequisites(target.reqs).find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin)) as RequirementObject | undefined;
      if (req) {
        const resultOfAll = (req.id as string[]).map(id => (get(state.dependent, id) as TalentInstance).value >= e.value);
        return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
      }
      return 0;
    }
    return e;
  });

  return obj.value > Math.max(8, ...dependencies);
}

export function reset(obj: AttributeInstance): AttributeInstance {
  return {
    ...obj,
    dependencies: [],
    mod: 0,
    value: 8,
  };
}

export function convertId<T extends string | undefined>(id: T): T {
  switch (id) {
    case 'COU':
      return 'ATTR_1' as T;
    case 'SGC':
      return 'ATTR_2' as T;
    case 'INT':
      return 'ATTR_3' as T;
    case 'CHA':
      return 'ATTR_4' as T;
    case 'DEX':
      return 'ATTR_5' as T;
    case 'AGI':
      return 'ATTR_6' as T;
    case 'CON':
      return 'ATTR_7' as T;
    case 'STR':
      return 'ATTR_8' as T;

    default:
      return id;
  }
}

export function getPrimaryAttributeId(state: Map<string, ActivatableDependent>, type: 1 | 2) {
  if (type === 1) {
    const traditions = getMagicalTraditionsResultFunc(state);
    if (traditions.length > 0) {
      switch (getNumericMagicalTraditionIdByInstanceId(traditions[0].id)) {
        case 1:
        case 4:
        case 10:
          return 'ATTR_2';
        case 3:
          return 'ATTR_3';
        case 2:
        case 5:
        case 6:
        case 7:
          return 'ATTR_4';
      }
    }
  }
  else if (type === 2) {
    const tradition = getBlessedTraditionResultFunc(state);
    if (tradition) {
      switch (getNumericBlessedTraditionIdByInstanceId(tradition.id)) {
        case 2:
        case 3:
        case 9:
        case 13:
        case 16:
        case 18:
          return 'ATTR_1';
        case 1:
        case 4:
        case 8:
        case 17:
          return 'ATTR_2';
        case 5:
        case 6:
        case 11:
        case 14:
          return 'ATTR_3';
        case 7:
        case 10:
        case 12:
        case 15:
          return 'ATTR_4';
      }
    }
  }
  return;
}
