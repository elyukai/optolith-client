import { flatten } from 'lodash';
import * as Categories from '../constants/Categories';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { get, getAllByCategory, getAllByCategoryGroup } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import { ActiveObjectName } from '../types/activatables';
import { ActivatableInstance, ActivatableNameCost, ActivatableNameCostEvalTier, ActivateObject, ActiveObject, ActiveObjectWithId, ActiveViewObject, AllRequirementObjects, CombatTechniqueInstance, RequirementObject, SelectionObject, SkillInstance, SkillishInstance, SpecialAbilityInstance, SpellInstance, TalentInstance, ToOptionalKeys, UIMessages } from '../types/data.d';
import { AllRequirementTypes } from '../types/reusable.d';
import * as DependentUtils from './DependentUtils';
import { _translate } from './I18n';
import { mergeIntoState, setStateItem } from './ListUtils';
import { getRoman } from './NumberUtils';
import { getFlatFirstTierPrerequisites, getFlatPrerequisites, getMinTier, isRequiringActivatable, validate, validateObject, validateRemovingStyle, validateTier } from './RequirementUtils';

export function isMultiselect(obj: ActivatableInstance): boolean {
  return obj.max !== 1;
}

export function isActive(obj?: ActivatableInstance): boolean {
  if (obj === undefined) {
    return false;
  }
  return obj.active.length > 0;
}

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

export function getSids(obj: ActivatableInstance): Array<string | number> {
  return obj.active.map(e => e.sid as string | number);
}

export function getDSids(obj: ActivatableInstance): Array<(string | number)[] | string | number | boolean | undefined> {
  return obj.dependencies.map(e => typeof e !== 'number' && typeof e !== 'boolean' && e.sid);
}

export function getSelectionItem(obj: ActivatableInstance, id?: string | number): SelectionObject | undefined {
  if (obj.sel) {
    return obj.sel.find(e => e.id === id);
  }
  return undefined;
}

export function getSelectionName(obj: ActivatableInstance, id?: string | number): string | undefined {
  const selectionItem = getSelectionItem(obj, id);
  if (selectionItem) {
    return selectionItem.name;
  }
  return undefined;
}

export function getSelectionNameAndCost(obj: ActivatableInstance, id?: string | number): { name: string; cost: number; } | undefined {
  const selectionItem = getSelectionItem(obj, id);
  if (selectionItem && selectionItem.cost) {
    const { name, cost } = selectionItem;
    return { name, cost };
  }
  return undefined;
}

export function activate(state: DependentInstancesState, obj: ActivatableInstance, activate: ActivateObject): DependentInstancesState {
  const active = convertToActiveObject(obj, activate);
  if (active) {
    const adds = getGeneratedPrerequisites(obj, active, true);
    const firstState = setStateItem(state, obj.id, {...obj, active: [...obj.active, active]});
    const prerequisites = Array.isArray(obj.reqs) ? obj.reqs : flatten(active.tier && [...obj.reqs].filter(e => e[0] <= active!.tier!).map(e => e[1]) || []);
    return mergeIntoState(firstState, DependentUtils.addDependencies(firstState, [...prerequisites, ...adds], obj.id));
  }
  return state;
}

export function deactivate(state: DependentInstancesState, obj: ActivatableInstance, index: number): DependentInstancesState {
  const adds = getGeneratedPrerequisites(obj, obj.active[index], false);
  const { tier } = obj.active[index];
  const firstState = setStateItem(state, obj.id, {...obj, active: [...obj.active.slice(0, index), ...obj.active.slice(index + 1)]});
  const prerequisites = Array.isArray(obj.reqs) ? obj.reqs : flatten(tier && [...obj.reqs].filter(e => e[0] <= tier).map(e => e[1]) || []);
  return mergeIntoState(firstState, DependentUtils.removeDependencies(firstState, [...prerequisites, ...adds], obj.id));
}

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

export function reset(obj: ActivatableInstance): ActivatableInstance {
  return {
    ...obj,
    active: [],
    dependencies: [],
  };
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

export function getActiveSelection(state: DependentInstancesState, entry: ActivatableInstance, index: number): ActiveObjectName | undefined {
  const { active, id, input, sel } = entry;
  const { sid, sid2, ...other } = active[index];
  let finalName;
  switch (id) {
    case 'ADV_4':
    case 'ADV_16':
    case 'ADV_17':
    case 'ADV_47':
    case 'DISADV_48':
    case 'SA_231':
    case 'SA_250': {
      const { name } = (get(state, sid as string)) as SkillishInstance;
      finalName = name;
      break;
    }
    case 'ADV_32':
    case 'DISADV_1':
    case 'DISADV_24':
    case 'DISADV_34':
    case 'DISADV_36':
    case 'DISADV_45':
    case 'DISADV_50':
      finalName = typeof sid === 'number' ? getSelectionName(entry, sid) : sid;
      break;
    case 'ADV_68': {
      const selectionItem = getSelectionItem(entry, sid);
      finalName = selectionItem && `${sid2} (${selectionItem.name})`;
      break;
    }
    case 'DISADV_33': {
      const selectionItem = getSelectionItem(entry, sid);
      if ([7, 8].includes(sid as number)) {
        finalName = `${selectionItem && selectionItem.name}: ${sid2}`;
      } else {
        finalName = selectionItem && selectionItem.name;
      }
      break;
    }
    case 'SA_9': {
      const skill = get(state, sid as string) as TalentInstance;
      let name;
      if (typeof sid2 === 'string') {
        name = sid2;
      }
      else {
        const selectedApplication = skill.applications && skill.applications.find(e => e.id === sid2);
        if (typeof selectedApplication === 'undefined') {
          return;
        }
        name = selectedApplication.name;
      }
      finalName = `${skill.name}: ${name}`;
      break;
    }
    case 'SA_414': {
      const selectionItem = getSelectionItem(entry, sid) as (SelectionObject & { target: string; }) | undefined;
      finalName = selectionItem && `${(get(state, selectionItem.target) as SpellInstance).name}: ${selectionItem.name}`;
      break;
    }

    default:
      if (typeof input === 'string') {
        finalName = sid as string;
      }
      else if (Array.isArray(sel)) {
        finalName = getSelectionName(entry, sid);
      }
      break;
  }

  if (typeof finalName === 'string') {
    return { name: finalName, ...other };
  }
  return;
}

/**
 * Converts the object generated by the list item to an object that can be inserted into an array of ActiveObjects.
 * @param obj The entry for which you want to convert the object.
 * @param activate The object generated by the list item.
 */
export function convertToActiveObject(obj: ActivatableInstance, activate: ActivateObject) {
  const { sel, sel2, input, tier } = activate;
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
  return active;
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

interface ActivatableObjectForRCPAndPrerequisites {
  id: string;
  index: number;
  name: string;
  cost: number;
  active: boolean;
}

interface ActivatableObjectForActivatableActiveLists {
	id: string;
	name: string;
	tier?: number;
	tiers?: number;
	minTier?: number;
	maxTier?: number;
	cost: number;
	disabled: boolean;
	index: number;
	gr?: number;
	instance: ActivatableInstance;
}

interface ActivatableObjectForActivatableDeactiveLists {
	id: string;
	name: string;
	cost?: string | number | number[];
	input?: string;
	tiers?: number;
	minTier?: number;
	maxTier?: number;
	sel?: SelectionObject[];
	gr?: number;
	instance: ActivatableInstance;
}

interface ActivatableObjectForCommaSeparatedActivatableActiveLists {
  id: string;
  index: number;
  name: string;
  cost: number;
}

interface ActiveObjectAny extends ActiveObject {
	[key: string]: any;
}

export function getActiveObjectCore({ sid, sid2, tier }: ActiveObjectAny): ActiveObject {
  return { sid, sid2, tier };
}

export function getActivatableValidation(obj: ActiveObjectWithId, state: CurrentHeroInstanceState) {
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

  if (!disabled && dependencies.some(e => typeof e === 'boolean' ? e && active.length === 1 : Object.keys(e).every((key: keyof ActiveObject) => obj[key] === e[key]) && Object.keys(obj).length === Object.keys(e).length)) {
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

export function getNameCost(obj: ActiveObjectWithId, dependent: DependentInstancesState, locale: UIMessages): ActivatableNameCost {
  const { id, sid, sid2, tier } = obj;
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
      const maxCurrentTier = active.reduce((a, b) => (b.tier as number) > a ? b.tier as number : a, 0);
      const subMaxCurrentTier = active.reduce((a, b) => (b.tier as number) > a && (b.tier as number) < maxCurrentTier ? b.tier as number : a, 0);
      addName = typeof sid === 'number' ? getSelectionName(instance, sid) : sid;
      currentCost = maxCurrentTier > (tier as number) || active.filter(e => e.tier === tier).length > 1 ? 0 : (cost as number) * ((tier as number) - subMaxCurrentTier);
      break;
    }
    case 'DISADV_33': {
      const selectionItem = getSelectionItem(instance, sid);
      if (sid === 7 && active.filter(e => e.sid === 7).length > 1) {
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
      currentCost = active.length > 3 ? 0 : cost as number;
      break;
    case 'SA_9': {
      const counter = dependent.specialAbilities.get(id)!.active.reduce((c, obj) => obj.sid === sid ? c + 1 : c, 0);
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
      currentCost = skill.ic * counter;
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
      currentCost = apArr[active.length - 1];
      addName = getSelectionName(instance, sid);
      break;
    }
    case 'SA_87': {
      const apArr = [15, 25, 45];
      currentCost = apArr[active.length - 1];
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

  if (!currentCost) {
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
    cost: currentCost
  };
}

export function convertPerTierCostToFinalCost(obj: ActivatableNameCost): ActivatableNameCostEvalTier {
  const { tier } = obj;
  let { cost, combinedName } = obj;
  if (Array.isArray(cost)) {
    cost = cost[tier! - 1];
    combinedName += ` ${getRoman(tier!)}`;
  }
  else if (typeof tier === 'number') {
    cost *= tier;
    combinedName += ` ${getRoman(tier)}`;
  }
  return {
    ...obj,
    combinedName,
    cost
  };
}
