import { flatten, last } from 'lodash';
import * as Categories from '../constants/Categories';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { get, getAllByCategory, getAllByCategoryGroup } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import { ActivatableInstance, ActivatableNameCost, ActivatableNameCostEvalTier, ActivateArgs, ActiveObject, ActiveObjectWithId, ActiveViewObject, AdvantageInstance, AllRequirementObjects, Application, CombatTechniqueInstance, DeactiveViewObject, DisadvantageInstance, RequirementObject, SelectionObject, SkillInstance, SkillishInstance, SpecialAbilityInstance, SpellInstance, TalentInstance, ToOptionalKeys, UIMessages } from '../types/data.d';
import { AllRequirementTypes } from '../types/reusable.d';
import * as DependentUtils from './DependentUtils';
import { sortObjects } from './FilterSortUtils';
import { _translate } from './I18n';
import { mergeIntoState, setStateItem } from './ListUtils';
import { getTraditionOfAspect } from './LiturgyUtils';
import { getRoman } from './NumberUtils';
import { getFlatFirstTierPrerequisites, getFlatPrerequisites, getMinTier, isRequiringActivatable, validate, validateObject, validateRemovingStyle, validateTier } from './RequirementUtils';

/**
 * Checks if you can buy the entry multiple times.
 * @param obj The entry.
 */
export function isMultiselect(obj: ActivatableInstance): boolean {
  return obj.max !== 1;
}

/**
 * Checks if the entry is active. This will be the case if there is at least one `ActiveObject` in the `obj.active` array.
 * @param obj The entry.
 */
export function isActive(obj?: ActivatableInstance): boolean {
  if (obj === undefined) {
    return false;
  }
  return obj.active.length > 0;
}

/**
 * Checks if you can somehow add an ActiveObject to the given entry.
 * @param state The present state of the current hero.
 * @param obj The entry.
 */
export function isActivatable(state: CurrentHeroInstanceState, obj: ActivatableInstance): boolean {
  const { dependent } = state;
  if (obj.category === Categories.SPECIAL_ABILITIES && [9, 10].includes(obj.gr)) {
    const combinationSA = get(dependent, 'SA_164') as SpecialAbilityInstance;
    if (!combinationSA) {
      const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 9, 10);
      const totalActive = allStyles.filter(e => isActive(e)).length;
      if (totalActive >= 1) {
        return false;
      }
    }
    else {
      const combinationAvailable = isActive(combinationSA);
      if (combinationAvailable) {
        const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 9, 10);
        const allEqualTypeStyles = allStyles.filter(e => e.gr === obj.gr);
        const totalActive = allStyles.filter(e => isActive(e)).length;
        const equalTypeStyleActive = allEqualTypeStyles.filter(e => isActive(e)).length;
        if (totalActive >= 3 || equalTypeStyleActive >= 2) {
          return false;
        }
      }
      else {
        const allEqualTypeStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, obj.gr);
        if (allEqualTypeStyles.find(e => isActive(e))) {
          return false;
        }
      }
    }
  }
  else if (obj.category === Categories.SPECIAL_ABILITIES && obj.gr === 25) {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 25);
    const totalActive = allStyles.filter(e => isActive(e)).length;
    if (totalActive >= 1) {
      return false;
    }
  }
  else if (obj.id === 'SA_164') {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 9, 10);
    const isOneActive = allStyles.find(e => isActive(e));
    if (!isOneActive) {
      return false;
    }
  }
  else if (obj.id === 'SA_266') {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 13);
    const isOneActive = allStyles.find(e => isActive(e));
    if (!isOneActive) {
      return false;
    }
  }
  return validate(state, getFlatFirstTierPrerequisites(obj.reqs), obj.id);
}

/**
 * Checks if you can somehow remove an ActiveObject from the given entry.
 * @param state The present state of the current hero.
 * @param obj The entry.
 * @param sid The sid of the Act
 */
export function isDeactivatable(state: CurrentHeroInstanceState, obj: ActivatableInstance, sid?: string | number): boolean {
  const { dependent } = state;
  if (obj.id === 'SA_164') {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 9, 10);
    const allArmedStyles = allStyles.filter(e => e.gr === 9);
    const allUnarmedStyles = allStyles.filter(e => e.gr === 10);
    const totalActive = allStyles.filter(e => isActive(e)).length;
    const armedStyleActive = allArmedStyles.filter(e => isActive(e)).length;
    const unarmedStyleActive = allUnarmedStyles.filter(e => isActive(e)).length;
    if (totalActive >= 3 || armedStyleActive >= 2 || unarmedStyleActive >= 2) {
      return false;
    }
  }
  else if (obj.id === 'SA_266') {
    const allStyles = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 13);
    const totalActive = allStyles.filter(e => isActive(e)).length;
    if (totalActive >= 2) {
      return false;
    }
  }
  if (obj.category === Categories.SPECIAL_ABILITIES) {
    const validStyle = validateRemovingStyle(dependent, obj);
    if (validStyle === false) {
      return false;
    }
  }
  const dependencies = obj.dependencies.filter(e => {
    if (typeof e === 'object' && e.origin) {
      const origin = get(dependent, e.origin) as SpecialAbilityInstance;
      const req = getFlatPrerequisites(origin.reqs).find(r => typeof r !== 'string' && Array.isArray(r.id) && !!e.origin && r.id.includes(e.origin)) as AllRequirementObjects | undefined;
      if (req) {
        const resultOfAll = (req.id as string[]).map(e => validateObject(state, { ...req, id: e } as AllRequirementObjects, obj.id));
        return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? true : false;
      }
      return true;
    }
    else if (typeof e === 'object' && Array.isArray(e.sid)) {
      const list = e.sid;
      if (list.includes(sid as number)) {
        return !getSids(obj).some(n => n !== sid && list.includes(n as number));
      }
    }
    return true;
  });
  return dependencies.length === 0;
}

/**
 * Get all `ActiveObject.sid` values from the given instance.
 * @param obj The entry.
 */
export function getSids(obj: ActivatableInstance): Array<string | number> {
  return obj.active.map(e => e.sid as string | number);
}

/**
 * Get all `DependencyObject.sid` values from the given instance.
 * @param obj The entry.
 */
export function getDSids(obj: ActivatableInstance): Array<(string | number)[] | string | number | boolean | undefined> {
  return obj.dependencies.map(e => typeof e !== 'number' && typeof e !== 'boolean' && e.sid);
}

/**
 * Get a selection option with the given id from given entry. Returns `undefined` if not found.
 * @param obj The entry.
 */
export function getSelectionItem(obj: ActivatableInstance, id?: string | number): SelectionObject | undefined {
  if (obj.sel) {
    return obj.sel.find(e => e.id === id);
  }
  return undefined;
}

/**
 * Get a selection option's name with the given id from given entry. Returns `undefined` if not found.
 * @param obj The entry.
 */
export function getSelectionName(obj: ActivatableInstance, id?: string | number): string | undefined {
  const selectionItem = getSelectionItem(obj, id);
  if (selectionItem) {
    return selectionItem.name;
  }
  return undefined;
}

/**
 * Get a selection option's `name` and `cost` with the given id from given entry. Returns `undefined` if not found.
 * @param obj The entry.
 */
export function getSelectionNameAndCost(obj: ActivatableInstance, id?: string | number): { name: string; cost: number; } | undefined {
  const selectionItem = getSelectionItem(obj, id);
  if (selectionItem && selectionItem.cost) {
    const { name, cost } = selectionItem;
    return { name, cost };
  }
  return undefined;
}

/**
 * Activates the entry with the given parameters and adds all needed dependencies.
 * @param state The object containing all dependent instances.
 * @param obj The entry.
 * @param activate The object given by the view.
 */
export function activate(state: DependentInstancesState, obj: ActivatableInstance, activate: ActivateArgs): DependentInstancesState {
  const active = convertToActiveObject(obj, activate);
  if (active) {
    const adds = getGeneratedPrerequisites(obj, active, true);
    const firstState = setStateItem(state, obj.id, {...obj, active: [...obj.active, active]});
    const prerequisites = Array.isArray(obj.reqs) ? obj.reqs : flatten(active.tier && [...obj.reqs].filter(e => e[0] <= active!.tier!).map(e => e[1]) || []);
    return mergeIntoState(firstState, DependentUtils.addDependencies(firstState, [...prerequisites, ...adds], obj.id));
  }
  return state;
}

/**
 * Deactivates the entry with the given parameters and removes all previously needed dependencies.
 * @param state The object containing all dependent instances.
 * @param obj The entry.
 * @param index The index of the `ActiveObject` in `obj.active`.
 */
export function deactivate(state: DependentInstancesState, obj: ActivatableInstance, index: number): DependentInstancesState {
  const adds = getGeneratedPrerequisites(obj, obj.active[index], false);
  const { tier } = obj.active[index];
  const firstState = setStateItem(state, obj.id, {...obj, active: [...obj.active.slice(0, index), ...obj.active.slice(index + 1)]});
  const prerequisites = Array.isArray(obj.reqs) ? obj.reqs : flatten(tier && [...obj.reqs].filter(e => e[0] <= tier).map(e => e[1]) || []);
  return mergeIntoState(firstState, DependentUtils.removeDependencies(firstState, [...prerequisites, ...adds], obj.id));
}

/**
 * Changes the tier of a specific active entry and adds or removes dependencies if needed.
 * @param state The object containing all dependent instances.
 * @param obj The entry.
 * @param index The index of the `ActiveObject` in `obj.active`.
 * @param tier The final tier.
 */
export function setTier(state: DependentInstancesState, obj: ActivatableInstance, index: number, tier: number): ToOptionalKeys<DependentInstancesState> {
  const previousTier = obj.active[index].tier;
  const active = obj.active;
  active.splice(index, 1, { ...active[index], tier });
  const firstState = setStateItem(state, obj.id, {...obj, active });

  if (!Array.isArray(obj.reqs) && previousTier && previousTier !== tier) {
    const lower = Math.min(previousTier, tier);
    const higher = Math.max(previousTier, tier);
    const prerequisites = flatten(tier ? [...obj.reqs].filter(e => e[0] <= higher && e[0] > lower).map(e => e[1]) : []);
    if (previousTier > tier) {
      return mergeIntoState(firstState, DependentUtils.removeDependencies(firstState, prerequisites, obj.id));
    }
    return mergeIntoState(firstState, DependentUtils.addDependencies(firstState, prerequisites, obj.id));
  }

  return firstState;
}

export function getFullName(obj: string | ActiveViewObject): string {
  if (typeof obj === 'string') {
    return obj;
  }
  const { tiers, id, tier } = obj;
  let { name } = obj;
  if (tiers && !['DISADV_34', 'DISADV_50'].includes(id)) {
    if (id === 'SA_29' && tier === 4) {
      name += ` MS`;
    }
    else {
      name += tier && ` ${getRoman(tier)}`;
    }
  }
  return name;
}

export function isMagicalOrBlessed(obj: ActivatableInstance) {
  const isBlessed = getFlatFirstTierPrerequisites(obj.reqs).some(e => e !== 'RCP' && e.id === 'ADV_12' && isRequiringActivatable(e) && !!e.active);
  const isMagical = getFlatFirstTierPrerequisites(obj.reqs).some(e => e !== 'RCP' && e.id === 'ADV_50' && isRequiringActivatable(e) && !!e.active);
  return {
    isBlessed,
    isMagical
  };
}

export function getSecondSidMap(entry: ActivatableInstance): Map<string, (string | number)[]> {
  return entry.active.reduce((map, obj) => {
    const { sid, sid2 } = obj as { sid: string; sid2: string | number };
    const current = map.get(sid);
    if (current) {
      return map.set(sid, [...current, sid2]);
    }
    return map.set(sid, [sid2]);
  }, new Map<string, (number | string)[]>());
}

/**
 * Converts the object generated by the list item to an object that can be inserted into an array of ActiveObjects.
 * @param obj The entry for which you want to convert the object.
 * @param activate The object generated by the list item.
 */
export function convertToActiveObject(obj: ActivatableInstance, activate: ActivateArgs): ActiveObject | undefined {
  const { sel, sel2, input, tier, customCost } = activate;
  let active: ActiveObject | undefined;
  switch (obj.id) {
    case 'ADV_68':
      active = { sid: sel, sid2: input };
      break;
    case 'DISADV_1':
    case 'DISADV_34':
    case 'DISADV_50':
      if (!input) {
        active = { sid: sel, tier };
      }
      else {
        active = { sid: input, tier };
      }
      break;
    case 'DISADV_33':
      if ([7, 8].includes(sel as number) && input) {
        active = { sid: sel, sid2: input };
      }
      else {
        active = { sid: sel };
      }
      break;
    case 'DISADV_36':
      if (!input) {
        active = { sid: sel };
      }
      else {
        active = { sid: input };
      }
      break;
    case 'SA_9':
      if (!input) {
        active = { sid: sel, sid2: sel2 };
      }
      else {
        active = { sid: sel, sid2: input };
      }
      break;

    default:
      if (sel && tier) {
        active = { sid: (obj.input && input) || sel, sid2: sel2, tier };
      }
      else if (sel) {
        active = { sid: (obj.input && input) || sel, sid2: sel2 };
      }
      else if (input && tier) {
        active = { sid: input, tier };
      }
      else if (input) {
        active = { sid: input };
      }
      else if (tier) {
        active = { tier };
      }
      else if (obj.max === 1) {
        active = {};
      }
      break;
  }
  return { ...active, cost: customCost };
}

/**
 * Some advantages, disadvantages and special abilities need more prerequisites than given in their respective main array.
 * @param obj The entry for which you want to add the dependencies.
 * @param active The actual active object.
 * @param add States if the prerequisites should be added or removed (some prerequisites must be calculated based on that).
 */
export function getGeneratedPrerequisites(obj: ActivatableInstance, { sid }: ActiveObject, add: boolean): AllRequirementTypes[] {
  const adds: AllRequirementTypes[] = [];
  switch (obj.id) {
    case 'SA_3': {
      const selectionItem = getSelectionItem(obj, sid) as SelectionObject & { req: AllRequirementTypes[] };
      adds.push(...selectionItem.req);
      break;
    }
    case 'SA_9':
      adds.push({ id: sid as string, value: (obj.active.filter(e => e.sid === sid).length + (add ? 1 : 0)) * 6 });
      break;
    case 'SA_81':
      adds.push({ id: 'SA_72', active: true, sid });
      break;
    case 'SA_414':
    case 'SA_663': {
      const selectionItem = getSelectionItem(obj, sid) as SelectionObject & { req: RequirementObject[], target: string; tier: number; };
      adds.push({ id: selectionItem.target, value: selectionItem.tier * 4 + 4 });
      break;
    }
    case 'SA_639': {
      const selectionItem = getSelectionItem(obj, sid) as SelectionObject & { prerequisites: AllRequirementTypes[] };
      adds.push(...selectionItem.prerequisites);
      break;
    }
  }
  return adds;
}

/**
 * Generates a list of ActiveObjects based on the given instance.
 */
export function convertActivatableToArray({ active, id }: ActivatableInstance): ActiveObjectWithId[] {
  return active.map((e, index) => ({ ...e, id, index }));
}

/**
 * Get all active items in an array.
 * @param state A state slice.
 */
export function getActiveFromState(state: Map<string, ActivatableInstance>): ActiveObjectWithId[] {
  return [...state.values()].reduce((arr, e) => [...arr, ...convertActivatableToArray(e)], []);
}

interface ActiveObjectAny extends ActiveObject {
	[key: string]: any;
}

export function getActiveObjectCore({ sid, sid2, tier }: ActiveObjectAny): ActiveObject {
  return { sid, sid2, tier };
}

/**
 * Checks if the given ActiveObject can be removed or changed in tier.
 * @param obj The ActiveObject with origin id.
 * @param state The current hero's state.
 */
export function getValidation(obj: ActiveObjectWithId, state: CurrentHeroInstanceState) {
  const { dependent, el } = state;
  const { id, sid } = obj;
  const instance = get(dependent, id) as ActivatableInstance;
  const { dependencies, active, reqs } = instance;
  let { tiers } = instance;

  let disabled = !isDeactivatable(state, instance, sid);
  let maxTier: number | undefined;
  let minTier: number | undefined;

  if (!Array.isArray(reqs)) {
    maxTier = validateTier(state, reqs, dependencies, id);
  }

  if (!Array.isArray(reqs)) {
    minTier = getMinTier(dependencies);
  }

  switch (id) {
    case 'ADV_16': {
      const { value } = (get(dependent, sid as string)) as SkillInstance;
      const counter = instance.active.reduce((e, obj) => obj.sid === sid ? e + 1 : e, 0);
      disabled = disabled || getStart(el).maxSkillRating + counter === value;
      break;
    }
    case 'ADV_17': {
      const { value } = (get(dependent, sid as string)) as CombatTechniqueInstance;
      disabled = disabled || getStart(el).maxCombatTechniqueRating + 1 === value;
      break;
    }
    case 'ADV_58': {
      const activeSpells = getAllByCategory(dependent, Categories.SPELLS).reduce((n, e) => e.active ? n + 1 : n, 0);
      if (activeSpells > 3) {
        minTier = activeSpells - 3;
      }
      break;
    }
    case 'ADV_79': {
      const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 24).filter(isActive).length;
      if (active > 3) {
        minTier = active - 3;
      }
      break;
    }
    case 'ADV_80': {
      const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 27).filter(isActive).length;
      if (active > 3) {
        minTier = active - 3;
      }
      break;
    }
    case 'DISADV_59': {
      const activeSpells = getAllByCategory(dependent, Categories.SPELLS).reduce((n, e) => e.active ? n + 1 : n, 0);
      if (activeSpells < 3) {
        maxTier = 3 - activeSpells;
      }
      break;
    }
    case 'DISADV_72': {
      const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 24).filter(isActive).length;
      if (active < 3) {
        minTier = 3 - active;
      }
      break;
    }
    case 'DISADV_73': {
      const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 27).filter(isActive).length;
      if (active < 3) {
        minTier = 3 - active;
      }
      break;
    }
    case 'SA_29':
      tiers = 3;
      break;
    case 'SA_70': {
      if (getAllByCategory(dependent, Categories.SPELLS).some(e => e.active)) {
        disabled = true;
      }
      break;
    }
    case 'SA_86': {
      if (getAllByCategory(dependent, Categories.LITURGIES).some(e => e.active)) {
        disabled = true;
      }
      break;
    }
  }

  if (typeof tiers === 'number' && minTier) {
    disabled = true;
  }

  if (!disabled && dependencies.some(e => typeof e === 'boolean' ? e && active.length === 1 : Object.keys(e).every((key: keyof {
    sid?: string | number;
    sid2?: string | number;
    tier?: number;
  }) => obj[key] === e[key]) && Object.keys(obj).length === Object.keys(e).length)) {
    disabled = true;
  }

  return {
    ...obj,
    disabled,
    maxTier,
    minTier,
    tiers
  };
}

/**
 * Returns name, splitted and combined, as well as the AP you get when removing the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param state The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 * @param locale The locale-dependent messages.
 */
export function getNameCost(obj: ActiveObjectWithId, dependent: DependentInstancesState, costToAdd: boolean, locale?: UIMessages): ActivatableNameCost {
  const { id, sid, sid2, tier, cost: customCost } = obj;
  const instance = get(dependent, id) as ActivatableInstance;
  const { cost, category, sel, input, name, active } = instance;

  let combinedName = name;
  let addName: string | undefined;
  let currentCost: number | number[] | undefined;

  switch (id) {
    case 'ADV_4':
    case 'ADV_47':
    case 'ADV_16':
    case 'ADV_17':
    case 'DISADV_48':
    case 'SA_231':
    case 'SA_250':
    case 'SA_472':
    case 'SA_473':
    case 'SA_531':
    case 'SA_569': {
      const { name, ic } = get(dependent, sid as string) as SkillishInstance;
      addName = name;
      currentCost = (cost as number[])[ic - 1];
      break;
    }
    case 'ADV_28':
    case 'ADV_29':
    case 'DISADV_37':
    case 'DISADV_51':
    case 'SA_86': {
      const selectionItem = getSelectionItem(instance, sid);
      addName = selectionItem && selectionItem.name;
      currentCost = selectionItem && selectionItem.cost;
      break;
    }
    case 'ADV_32':
    case 'DISADV_1':
    case 'DISADV_24':
    case 'DISADV_45':
      addName = typeof sid === 'number' ? getSelectionName(instance, sid) : sid;
      break;
    case 'ADV_68': {
      const selectionItem = getSelectionItem(instance, sid);
      addName = selectionItem && `${sid2} (${selectionItem.name})`;
      currentCost = selectionItem && selectionItem.cost;
      break;
    }
    case 'DISADV_34':
    case 'DISADV_50': {
      const maxCurrentTier = active.reduce((a, b) => (b.tier as number) > a && b.cost === undefined ? b.tier as number : a, 0);
      const subMaxCurrentTier = active.reduce((a, b) => (b.tier as number) > a && (b.tier as number) < maxCurrentTier && b.cost === undefined ? b.tier as number : a, 0);
      addName = typeof sid === 'number' ? getSelectionName(instance, sid) : sid;
      currentCost = maxCurrentTier > (tier as number) || active.filter(e => e.tier === tier).length > (costToAdd ? 0 : 1) ? 0 : (cost as number) * ((tier as number) - subMaxCurrentTier);
      break;
    }
    case 'DISADV_33': {
      const selectionItem = getSelectionItem(instance, sid);
      if (sid === 7 && active.filter(e => e.sid === 7 && e.cost === undefined).length > (costToAdd ? 0 : 1)) {
        currentCost = 0;
      }
      else {
        currentCost = selectionItem && selectionItem.cost as number;
      }
      if ([7, 8].includes(sid as number)) {
        addName = `${selectionItem && selectionItem.name}: ${sid2}`;
      }
      else {
        addName = selectionItem && selectionItem.name;
      }
      break;
    }
    case 'DISADV_36':
      addName = typeof sid === 'number' ? getSelectionName(instance, sid) : sid as string;
      currentCost = active.filter(e => e.cost === undefined).length > (costToAdd ? 2 : 3) ? 0 : cost as number;
      break;
    case 'SA_9': {
      const counter = dependent.specialAbilities.get(id)!.active.reduce((c, obj) => obj.sid === sid && obj.cost === undefined ? c + 1 : c, 0);
      const skill = dependent.talents.get(sid as string)!;
      let name;
      if (typeof sid2 === 'string') {
        name = sid2;
      }
      else {
        const selectedApplication = skill.applications && skill.applications.find(e => e.id === sid2);
        if (typeof selectedApplication === 'undefined') {
          name = 'undefined';
        }
        else {
          name = selectedApplication.name;
        }
      }
      currentCost = skill.ic * (counter + (costToAdd ? 1 : 0));
      addName = `${skill.name}: ${name}`;
      break;
    }
    case 'SA_29':
      addName = getSelectionName(instance, sid);
      break;
    case 'SA_70': {
      const selectionItem = getSelectionItem(instance, sid);
      addName = selectionItem && selectionItem.name;
      currentCost = selectionItem && selectionItem.cost as number;
      if (typeof addName === 'string' && sid === 9 && typeof sid2 === 'string') {
        const entry = dependent.talents.get(sid2)!;
        if (entry) {
          addName += `: ${entry.name}`;
        }
      }
      else if (typeof addName === 'string' && (sid === 6 || sid === 7)) {
        const musictraditionLabels = _translate(locale, 'musictraditions');
        if (musictraditionLabels) {
          addName += `: ${musictraditionLabels[(sid2 as number) - 1]}`;
        }
      }
      break;
    }
    case 'SA_72': {
      const apArr = [10, 20, 40];
      currentCost = apArr[active.filter(e => e.cost === undefined).length - (costToAdd ? 0 : 1)];
      addName = getSelectionName(instance, sid);
      break;
    }
    case 'SA_87': {
      const apArr = [15, 25, 45];
      currentCost = apArr[active.filter(e => e.cost === undefined).length - (costToAdd ? 0 : 1)];
      addName = getSelectionName(instance, sid);
      break;
    }
    case 'SA_533': {
      const { name, ic } = dependent.talents.get(sid as string)!;
      addName = name;
      currentCost = (cost as number[])[ic - 1] + dependent.talents.get(dependent.specialAbilities.get('SA_531')!.active[0].sid as string)!.ic;
      break;
    }
    case 'SA_414':
    case 'SA_663': {
      const selectionItem = getSelectionItem(instance, sid) as (SelectionObject & { target: string; }) | undefined;
      const targetInstance = selectionItem && (id === 'SA_414' ? dependent.spells.get(selectionItem.target) : dependent.liturgies.get(selectionItem.target));
      addName = targetInstance && `${targetInstance.name}: ${selectionItem!.name}`;
      currentCost = selectionItem && selectionItem.cost;
      break;
    }

    default:
      if (typeof input === 'string') {
        addName = sid as string;
      }
      else if (Array.isArray(sel) && cost === 'sel') {
        const selectionItem = getSelectionItem(instance, sid);
        addName = selectionItem && selectionItem.name;
        currentCost = selectionItem && selectionItem.cost;
      }
      else if (Array.isArray(sel) && typeof cost === 'number') {
        addName = getSelectionName(instance, sid);
      }
      break;
  }

  switch (id) {
    case 'ADV_28':
    case 'ADV_29':
      combinedName = `${_translate(locale, 'activatable.view.immunityto')} ${addName}`;
      break;
    case 'ADV_68':
      combinedName = `${_translate(locale, 'activatable.view.hatredof')} ${addName}`;
      break;
    case 'DISADV_1':
      combinedName = `${_translate(locale, 'activatable.view.afraidof')} ${addName}`;
      break;
    case 'DISADV_34':
    case 'DISADV_50':
      combinedName  += ` ${getRoman(tier as number)} (${addName})`;
      break;
    default:
      if (addName) {
        combinedName += ` (${addName})`;
      }
  }

  if (customCost !== undefined) {
    currentCost = customCost;
  }
  else if (currentCost === undefined) {
    currentCost = cost as number | number[];
  }
  if (category === Categories.DISADVANTAGES) {
    currentCost = Array.isArray(currentCost) ? currentCost.map(e => -e) : -currentCost;
  }

  return {
    ...obj,
    combinedName,
    baseName: name,
    addName,
    currentCost
  };
}

export function convertPerTierCostToFinalCost(obj: ActivatableNameCost): ActivatableNameCostEvalTier {
  const { id, tier, cost } = obj;
  let { currentCost, combinedName } = obj;
  if (Array.isArray(currentCost)) {
    currentCost = currentCost[tier! - 1];
    combinedName += ` ${getRoman(tier!)}`;
  }
  else if (typeof tier === 'number' && id !== 'DISADV_34' && id !== 'DISADV_50' && typeof cost !== 'number') {
    currentCost *= tier;
    combinedName += ` ${getRoman(tier)}`;
  }
  return {
    ...obj,
    combinedName,
    currentCost
  };
}

export function getDeactiveView(entry: ActivatableInstance, state: CurrentHeroInstanceState, validExtendedSpecialAbilities: string[], locale: UIMessages): DeactiveViewObject | undefined {
  const { ap, dependent } = state;
  const { id, cost, max, active, name, input, tiers, dependencies, gr, reqs } = entry;
  if (isActivatable(state, entry) && !dependencies.includes(false) && (max === undefined || active.length < max) && (!isExtendedSpecialAbility(entry) || validExtendedSpecialAbilities.includes(id))) {
    let maxTier: number | undefined;
    if (!Array.isArray(reqs)) {
      maxTier = validateTier(state, reqs, dependencies, id);
    }
    switch (id) {
      case 'ADV_4':
      case 'ADV_17':
      case 'ADV_47': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id));
        if (entry.category === Categories.SPECIAL_ABILITIES) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        else {
          return { id, name, sel, cost, instance: entry };
        }
      }
      case 'ADV_16': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => activeIds.filter(d => d === e.id).length < 2 && !getDSids(entry).includes(e.id));
        return { id, name, sel, cost, instance: entry };
      }
      case 'ADV_28':
      case 'ADV_29': {
        const sel = entry.sel!.filter(e => !getDSids(entry).includes(e.id));
        return { id, name, sel, instance: entry };
      }
      case 'ADV_32': {
        const sel = entry.sel!.filter(e => !getSids(get(dependent, 'DISADV_24') as DisadvantageInstance).includes(e.id) && !getDSids(entry).includes(e.id));
        return { id, name, sel, input, cost, instance: entry };
      }
      case 'ADV_58': {
        const activeSpells = (getAllByCategory(dependent, Categories.SPELLS) as SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
        if (activeSpells > 3) {
          return { id, name, cost, tiers, minTier: activeSpells - 3, instance: entry };
        }
        break;
      }
      case 'DISADV_1':
      case 'DISADV_34':
      case 'DISADV_50': {
        const sel = entry.sel!.filter(e => !getDSids(entry).includes(e.id));
        return { id, name, tiers, sel, input, cost, instance: entry };
      }
      case 'DISADV_24': {
        const sel = entry.sel!.filter(e => !getSids(get(dependent, 'ADV_32') as AdvantageInstance).includes(e.id) && !getDSids(entry).includes(e.id));
        return { id, name, sel, input, cost, instance: entry };
      }
      case 'DISADV_33':
      case 'DISADV_37':
      case 'DISADV_51': {
        let sel;
        const activeIds = getSids(entry);
        if (entry.id === 'DISADV_33') {
          sel = entry.sel!.filter(e => ([7, 8].includes(e.id as number) || !activeIds.includes(e.id)) && !getDSids(entry).includes(e.id));
        }
        else {
          sel = entry.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id));
        }
        return { id, name, sel, cost, instance: entry };
      }
      case 'DISADV_36': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id));
        return { id, name, sel, input, cost, instance: entry };
      }
      case 'DISADV_48': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => {
          if ((get(dependent, 'ADV_40') as AdvantageInstance).active.length > 0 || (get(dependent, 'ADV_46') as AdvantageInstance).active.length > 0) {
            if ((get(dependent, e.id as string) as SkillInstance).gr === 2) {
              return false;
            }
          }
          return !activeIds.includes(e.id) && !getDSids(entry).includes(e.id);
        });
        return { id, name, sel, cost, instance: entry };
      }
      case 'DISADV_59': {
        const activeSpells = (getAllByCategory(dependent, Categories.SPELLS) as SpellInstance[]).reduce((n, e) => e.active ? n + 1 : n, 0);
        if (activeSpells < 3) {
          return { id, name, cost, tiers, maxTier: 3 - activeSpells, instance: entry };
        }
        break;
      }
      case 'SA_17': {
        const sum = (get(dependent, 'TAL_51') as TalentInstance).value + (get(dependent, 'TAL_55') as TalentInstance).value;
        if (sum >= 12) {
          return { id, name, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_18':
        if ((getAllByCategoryGroup(dependent, Categories.COMBAT_TECHNIQUES, 2) as CombatTechniqueInstance[]).filter(e => e.value >= 10).length > 0) {
          return { id, name, cost, gr, instance: entry };
        }
        break;
      case 'SA_3': {
        const activeIds = getSids(entry);
        const sel = (entry.sel as Array<SelectionObject & { req: AllRequirementTypes[] }>).filter(e => !activeIds.includes(e.id) && validate(state, e.req, id) && !getDSids(entry).includes(e.id));
        if (sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_9': {
        const counter = getSecondSidMap(entry);
        type Sel = Array<SelectionObject & { applications?: Application[]; applicationsInput?: string }>;
        const filtered = (entry.sel as Sel).filter(e => {
          const id = e.id as string;
          if (getDSids(entry).includes(id)) {
            return false;
          }
          else if (counter.has(id)) {
            const arr = counter.get(id);
            return arr && arr.length < 3 && (get(dependent, id) as TalentInstance).value >= 6 * (arr.length + 1);
          }
          return (get(dependent, id) as TalentInstance).value >= 6;
        });
        const mapped = filtered.map(e => {
          const id = e.id as string;
          const arr = counter.get(id);
          if (arr) {
            e.cost = e.cost! * (arr.length + 1);
          }
          e.applications = e.applications && e.applications.filter(n => {
            return !arr || !arr.includes(n.id);
          });
          return e;
        });
        const sel = sortObjects(mapped, locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_28': {
        type Sel = Array<SelectionObject & { talent: [string, number]; }>;
        const activeIds = getSids(entry);
        const sel = (entry.sel as Sel).filter(e => {
          if (getDSids(entry).includes(e.id)) {
            return false;
          }
          else {
            return !activeIds.includes(e.id) && (get(dependent, e.talent[0]) as TalentInstance).value >= e.talent[1];
          }
        });
        if (sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_29': {
        const sel = sortObjects(entry.sel!.filter(e => active.every(n => n.sid !== e.id) && !getDSids(entry).includes(e.id)), locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, tiers: 3, gr, instance: entry };
        }
        break;
      }
      case 'SA_70': {
        const { adv, disadv } = ap;
        const sel = entry.sel && sortObjects(entry.sel.filter(e => e.id < 6 || e.id > 9 || adv[1] <= 25 && disadv[1] <= 25), locale.id);
        if (Array.isArray(sel) && sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_72': {
        const spellsAbove10 = [...dependent.spells.values()].filter(e => e.value >= 10);
        const counter = spellsAbove10.reduce((map, obj) => {
          const property = obj.property;
          if (map.has(property)) {
            map.set(property, map.get(property)! + 1);
          }
          else {
            map.set(property, 1);
          }
          return map;
        }, new Map<number, number>());
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => {
          const spellsAbove10WithProperty = counter.get(e.id as number);
          return spellsAbove10WithProperty && spellsAbove10WithProperty >= 3 && !activeIds.includes(e.id) && !getDSids(entry).includes(e.id);
        }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        if (sel.length > 0) {
          const apArr = [10, 20, 40];
          const cost = apArr[active.length];
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_81': {
        const activeIds = getSids(entry);
        const sel = sortObjects(entry.sel!.filter(e => getSids(get(dependent, 'SA_72') as SpecialAbilityInstance).includes(e.id) && !activeIds.includes(e.id)), locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_87': {
        const liturgiesAbove10 = [...dependent.liturgies.values()].filter(e => e.value >= 10);
        const counter = liturgiesAbove10.reduce((map, obj) => {
          obj.aspects.forEach(e => {
            if (map.has(e)) {
              map.set(e, map.get(e)! + 1);
            }
            else {
              map.set(e, 1);
            }
          });
          return map;
        }, new Map<number, number>());
        const activeIds = getSids(entry);
        const activeTradition = last(getSids(get(dependent, 'SA_86') as SpecialAbilityInstance));
        const sel = sortObjects(entry.sel!.filter(e => getTraditionOfAspect(e.id as number) === activeTradition && counter.get(e.id as number)! >= 3 && !activeIds.includes(e.id) && !getDSids(entry).includes(e.id)), locale.id);
        if (sel.length > 0) {
          const apArr = [15, 25, 45];
          const cost = apArr[active.length];
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_231': {
        const activeIds = getSids(entry);
        const sel = entry.sel!.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id) && (get(dependent, id) as SpellInstance).value >= 10);
        if (sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_338': {
        type EnhancedSelectionObject = SelectionObject & { gr: number; tier: number; };
        let sel = entry.sel as EnhancedSelectionObject[];
        if (isActive(entry)) {
          const selectedPath = (getSelectionItem(entry, entry.active[0].sid) as EnhancedSelectionObject).gr;
          const lastTier = (getSelectionItem(entry, entry.active[entry.active.length - 1].sid) as EnhancedSelectionObject).tier;
          sel = sel.filter(e => e.gr === selectedPath && e.tier === lastTier + 1);
        }
        else {
          sel = sel.filter(e => e.tier === 1);
        }
        if (sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_414':
      case 'SA_663': {
        const activeIds = getSids(entry);
        const sel = (entry.sel as Array<SelectionObject & { req: AllRequirementTypes[], target: string; tier: number; }>).reduce((arr, e) => {
          const targetInstance = id === 'SA_414' ? dependent.spells.get(e.target) : dependent.liturgies.get(e.target);
          if (!activeIds.includes(e.id) && validate(state, e.req, id) && !getDSids(entry).includes(e.id) && typeof targetInstance === 'object' && targetInstance.value >= e.tier * 4 + 4) {
            return [...arr, { ...e, name: `${targetInstance.name}: ${e.name}` }];
          }
          return arr;
        }, []);
        if (sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }
      case 'SA_533': {
        const sel = Array.isArray(entry.sel) ? sortObjects(entry.sel, locale.id) : undefined;
        if (tiers && maxTier === 0) {
          break;
        }
        const increaseValue = dependent.talents.get(dependent.specialAbilities.get('SA_531')!.active[0].sid as string)!.ic;
        const increasedCost = (cost as number[]).map(e => e + increaseValue);
        return { id, name, cost: increasedCost, sel, gr, instance: entry };
      }
      case 'SA_544':
      case 'SA_545':
      case 'SA_546':
      case 'SA_547':
      case 'SA_548': {
        if (isActive(dependent.advantages.get('ADV_77'))) {
          let max = 3;
          if (isActive(dependent.advantages.get('ADV_79'))) {
            max += dependent.advantages.get('ADV_79')!.active[0].tier!;
          }
          else if (isActive(dependent.advantages.get('DISADV_72'))) {
            max -= dependent.advantages.get('DISADV_72')!.active[0].tier!;
          }
          const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 24).filter(isActive);
          if (active.length < max) {
            return { id, name, cost, gr, instance: entry };
          }
        }
        break;
      }
      case 'SA_549':
      case 'SA_550':
      case 'SA_551':
      case 'SA_552':
      case 'SA_553': {
        if (isActive(dependent.advantages.get('ADV_78'))) {
          let max = 3;
          if (isActive(dependent.advantages.get('ADV_80'))) {
            max += dependent.advantages.get('ADV_80')!.active[0].tier!;
          }
          else if (isActive(dependent.advantages.get('DISADV_73'))) {
            max -= dependent.advantages.get('DISADV_73')!.active[0].tier!;
          }
          const active = getAllByCategoryGroup(dependent, Categories.SPECIAL_ABILITIES, 27).filter(isActive);
          if (active.length < max) {
            return { id, name, cost, gr, instance: entry };
          }
        }
        break;
      }
      case 'SA_639': {
        const activeIds = getSids(entry);
        const sel = (entry.sel as Array<SelectionObject & { prerequisites: AllRequirementTypes[] }>).filter(e => !activeIds.includes(e.id) && validate(state, e.prerequisites, id) && !getDSids(entry).includes(e.id));
        if (sel.length > 0) {
          return { id, name, sel, cost, gr, instance: entry };
        }
        break;
      }

      default: {
        let sel = Array.isArray(entry.sel) ? sortObjects(entry.sel, locale.id) : undefined;
        if (cost === 'sel' && sel) {
          const activeIds = getSids(entry);
          sel = sel.filter(e => !activeIds.includes(e.id) && !getDSids(entry).includes(e.id));
        }
        if (tiers && maxTier === 0) {
          break;
        }
        return { id, name, cost, tiers, maxTier, input, sel, gr, instance: entry };
      }
    }
  }

  return;
}

/**
 * Returns if the given entry is an extended (combat/magical/blessed) special ability.
 * @param entry The entry.
 */
export function isExtendedSpecialAbility(entry: ActivatableInstance) {
  return entry.category === 'SPECIAL_ABILITIES' && [11, 14, 26].includes(entry.gr);
}
