import { last } from 'lodash';
import { Pact } from '../actions/PactActions';
import { WikiState } from '../reducers/wikiReducer';
import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { getBlessedTraditionResultFunc } from '../selectors/liturgicalChantsSelectors';
import { getMagicalTraditionsResultFunc } from '../selectors/spellsSelectors';
import * as Data from '../types/data.d';
import { AllRequirementTypes } from '../types/reusable.d';
import * as Wiki from '../types/wiki.d';
import { sortObjects, sortStrings } from './FilterSortUtils';
import { getTraditionOfAspect } from './LiturgyUtils';
import { getWikiEntry } from './WikiUtils';
import { convertActivatableToArray } from './activatableConvertUtils';
import { getCost } from './activatableCostUtils';
import { getName } from './activatableNameUtils';
import { isRequiringActivatable } from './checkPrerequisiteUtils';
import { isExtendedSpecialAbility } from './checkStyleUtils';
import { setMapItem } from './collectionUtils';
import { getFirstTierPrerequisites } from './flattenPrerequisites';
import { getAllEntriesByGroup } from './heroStateUtils';
import { isActive } from './isActive';
import { MaybeFunctor } from './maybe';
import { findSelectOption, getActiveSecondarySelections, getActiveSelections, getRequiredSelections } from './selectionUtils';
import { isActivatable } from './validateActivatableChangeUtils';
import { validatePrerequisites, validateTier } from './validatePrerequisitesUtils';

export function getFullName(obj: string | Data.ActiveViewObject): string {
  if (typeof obj === 'string') {
    return obj;
  }
  const { tierName } = obj;
  let { name } = obj;
  if (tierName) {
    name += tierName;
  }
  return name;
}

export function isMagicalOrBlessed(obj: Data.ActivatableInstance) {
  const isBlessed = getFirstTierPrerequisites(obj.reqs).some(e => e !== 'RCP' && e.id === 'ADV_12' && isRequiringActivatable(e) && !!e.active);
  const isMagical = getFirstTierPrerequisites(obj.reqs).some(e => e !== 'RCP' && e.id === 'ADV_50' && isRequiringActivatable(e) && !!e.active);
  return {
    isBlessed,
    isMagical
  };
}

/**
 * Get all active items in an array.
 * @param state A state slice.
 */
export function getActiveFromState(state: Map<string, Data.ActivatableInstance>): Data.ActiveObjectWithId[] {
  return [...state.values()].reduce<Data.ActiveObjectWithId[]>((arr, e) => [...arr, ...convertActivatableToArray(e)], []);
}

interface ActiveObjectAny extends Data.ActiveObject {
	[key: string]: any;
}

export function getActiveObjectCore({ sid, sid2, tier }: ActiveObjectAny): Data.ActiveObject {
  return { sid, sid2, tier };
}

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param state The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 * @param locale The locale-dependent messages.
 */
export function getNameCost(
  obj: Data.ActiveObjectWithId,
  wiki: WikiState,
  state: Data.HeroDependent,
  costToAdd: boolean,
  locale?: Data.UIMessages,
): MaybeFunctor<Data.ActivatableNameCost | undefined> {
  return getCost(obj, wiki, state, costToAdd)
    .fmap(currentCost => {
      return getName(obj, wiki, locale)
        .fmap(names => {
          return {
            ...obj,
            ...names,
            currentCost
          };
        })
        .value;
    })
}

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param locale The locale-dependent messages.
 */
export function getNameCostForWiki(
  obj: Data.ActiveObjectWithId,
  wiki: WikiState,
  locale?: Data.UIMessages,
): MaybeFunctor<Data.ActivatableNameCost | undefined> {
  return getCost(obj, wiki)
    .fmap(currentCost => {
      return getName(obj, wiki, locale)
        .fmap(names => {
          return {
            ...obj,
            ...names,
            currentCost
          };
        })
        .value;
    });
}

export interface CombinedName {
  combinedName: string;
  baseName: string;
  addName: string | undefined;
}

export function getDeactiveView(
  wiki: WikiState,
  instance: Data.ActivatableDependent,
  state: Data.HeroDependent,
  validExtendedSpecialAbilities: string[],
  locale: Data.UIMessages,
  adventurePoints: AdventurePointsObject,
  pact: Pact | undefined,
): Data.DeactiveViewObject | undefined {
  const { id, active, dependencies } = instance;
  const entry = getWikiEntry<Wiki.Activatable>(wiki, id)!;
  const { cost, max, name, input, tiers, prerequisites} = entry;

  if (isActivatable(wiki, state, pact, instance) && !dependencies.includes(false) && (max === undefined || active.length < max) && (!isExtendedSpecialAbility(entry) || validExtendedSpecialAbilities.includes(id))) {
    let maxTier: number | undefined;
    if (!Array.isArray(prerequisites)) {
      maxTier = validateTier(wiki, state, prerequisites, dependencies, id, pact);
    }
    switch (id) {
      case 'ADV_4':
      case 'ADV_17':
      case 'ADV_47': {
        const activeIds = getActiveSelections(instance);
        const sel = entry.select!.filter(e => !activeIds.includes(e.id) && !getRequiredSelections(instance).includes(e.id));
        return { id, name, sel, cost, instance, wiki: entry };
      }
      case 'ADV_16': {
        const activeIds = getActiveSelections(instance);
        const sel = entry.select!.filter(e => activeIds.filter(d => d === e.id).length < 2 && !getRequiredSelections(instance).includes(e.id));
        return { id, name, sel, cost, instance, wiki: entry };
      }
      case 'ADV_28':
      case 'ADV_29': {
        const sel = entry.select!.filter(e => !getRequiredSelections(instance).includes(e.id));
        return { id, name, sel, instance, wiki: entry };
      }
      case 'ADV_32': {
        const sel = entry.select!.filter(e => !getActiveSelections(state.disadvantages.get('DISADV_24')).includes(e.id) && !getRequiredSelections(instance).includes(e.id));
        return { id, name, sel, input, cost, instance, wiki: entry };
      }
      case 'DISADV_59': {
        const activeSpells = [...state.spells.values()].reduce((n, e) => e.active ? n + 1 : n, 0);
        if (activeSpells < 3) {
          return { id, name, cost, tiers, maxTier: 3 - activeSpells, instance, wiki: entry };
        }
        break;
      }
      case 'DISADV_1':
      case 'DISADV_34':
      case 'DISADV_50': {
        const sel = entry.select!.filter(e => !getRequiredSelections(instance).includes(e.id));
        return { id, name, tiers, sel, input, cost, instance, wiki: entry };
      }
      case 'DISADV_24': {
        const sel = entry.select!.filter(e => !getActiveSelections(state.advantages.get('ADV_32')).includes(e.id) && !getRequiredSelections(instance).includes(e.id));
        return { id, name, sel, input, cost, instance, wiki: entry };
      }
      case 'DISADV_33':
      case 'DISADV_37':
      case 'DISADV_51': {
        let sel;
        const activeIds = getActiveSelections(instance);
        if (instance.id === 'DISADV_33') {
          sel = entry.select!.filter(e => ([7, 8].includes(e.id as number) || !activeIds.includes(e.id)) && !getRequiredSelections(instance).includes(e.id));
        }
        else {
          sel = entry.select!.filter(e => !activeIds.includes(e.id) && !getRequiredSelections(instance).includes(e.id));
        }
        return { id, name, sel, cost, instance, wiki: entry };
      }
      case 'DISADV_36': {
        const activeIds = getActiveSelections(instance);
        const sel = entry.select!.filter(e => !activeIds.includes(e.id) && !getRequiredSelections(instance).includes(e.id));
        return { id, name, sel, input, cost, instance, wiki: entry };
      }
      case 'DISADV_48': {
        const activeIds = getActiveSelections(instance);
        const ADV_40 = state.advantages.get('ADV_40');
        const ADV_46 = state.advantages.get('ADV_46');
        const advantageActive = ADV_40 && ADV_40.active.length > 0 || ADV_46 && ADV_46.active.length > 0;

        const sel = entry.select!.filter(e => {
          if (advantageActive && wiki.skills.get(e.id as string)!.ic === 2) {
            return false;
          }
          return !activeIds.includes(e.id) && !getRequiredSelections(instance).includes(e.id);
        });

        return { id, name, sel, cost, instance, wiki: entry };
      }
      case 'DISADV_59': {
        const activeSpells = state.spells.size;
        if (activeSpells < 3) {
          return { id, name, cost, tiers, maxTier: 3 - activeSpells, instance, wiki: entry };
        }
        break;
      }
      case 'SA_17': {
        const TAL_51 = state.skills.get('TAL_51');
        const TAL_55 = state.skills.get('TAL_55');
        const sum = (TAL_51 ? TAL_51.value : 0) + (TAL_55 ? TAL_55.value : 0);

        if (sum >= 12) {
          return { id, name, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_18':
        if (getAllEntriesByGroup(wiki.combatTechniques, state.combatTechniques, 2).filter(e => e.value >= 10).length > 0) {
          return { id, name, cost, instance, wiki: entry };
        }
        break;
      case 'SA_3': {
        const activeIds = getActiveSelections(instance);
        const sel = (entry.select as Array<Wiki.SelectionObject & { req: AllRequirementTypes[] }>).filter(e => !activeIds.includes(e.id) && validatePrerequisites(wiki, state, e.req, id, pact) && !getRequiredSelections(instance).includes(e.id));
        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_9': {
        const counter = getActiveSecondarySelections(instance);
        type Sel = Array<Wiki.SelectionObject & { applications?: Wiki.Application[]; applicationsInput?: string }>;
        const filtered = (entry.select as Sel).filter(e => {
          const id = e.id as string;
          if (getRequiredSelections(instance).includes(id)) {
            return false;
          }
          else if (counter.has(id)) {
            const arr = counter.get(id);
            const skill = state.skills.get(id);
            return arr && arr.length < 3 && skill && skill.value >= 6 * (arr.length + 1);
          }
          const skill = state.skills.get(id);
          return skill && skill.value >= 6;
        });
        const mapped = filtered.map(e => {
          const id = e.id as string;
          const arr = counter.get(id);
          return {
            ...e,
            cost: arr ? e.cost! * (arr.length + 1) : e.cost,
            applications: e.applications && e.applications.filter(n => {
              const isInactive = !arr || !arr.includes(n.id);
              const arePrerequisitesMet =
                typeof n.prerequisites !== 'object' ||
                validatePrerequisites(wiki, state, n.prerequisites, id, pact);

              return isInactive && arePrerequisitesMet;
            })
          };
        });
        const sel = sortObjects(mapped, locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_28': {
        type Sel = Array<Wiki.SelectionObject & { talent: [string, number]; }>;
        const activeIds = getActiveSelections(instance);
        const sel = (entry.select as Sel).filter(e => {
          if (getRequiredSelections(instance).includes(e.id)) {
            return false;
          }
          else {
            const skill = state.skills.get(e.talent[0]);
            return !activeIds.includes(e.id) && skill && skill.value >= e.talent[1];
          }
        });
        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_29': {
        const sel = sortObjects(entry.select!.filter(e => active.every(n => n.sid !== e.id) && !getRequiredSelections(instance).includes(e.id)), locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, tiers: 3, instance, wiki: entry };
        }
        break;
      }
      case 'SA_70':
      case 'SA_255':
      case 'SA_345':
      case 'SA_346':
      case 'SA_676':
      case 'SA_681': {
        const magicalTraditions = getMagicalTraditionsResultFunc(state.specialAbilities);
        if (magicalTraditions.length === 0) {
          return { id, name, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_86':
      case 'SA_682':
      case 'SA_683':
      case 'SA_684':
      case 'SA_685':
      case 'SA_686':
      case 'SA_687':
      case 'SA_688':
      case 'SA_689':
      case 'SA_690':
      case 'SA_691':
      case 'SA_692':
      case 'SA_693':
      case 'SA_694':
      case 'SA_695':
      case 'SA_696':
      case 'SA_697':
      case 'SA_698': {
        const blessedTradition = getBlessedTraditionResultFunc(state.specialAbilities);
        if (!blessedTradition) {
          return { id, name, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_72': {
        const spellsAbove10 = [...state.spells.values()].filter(e => e.value >= 10);
        const counter = spellsAbove10.reduce((map, obj) => {
          const wikiEntry = wiki.spells.get(obj.id);

          if (wikiEntry) {
            const property = wikiEntry.property;
            const mapValue = map.get(property);
            return setMapItem(
              map,
              property,
              typeof mapValue === 'number' ? mapValue + 1 : 1,
            );
          }

          return map;
        }, new Map<number, number>());
        const activeIds = getActiveSelections(instance);
        const sel = entry.select!.filter(e => {
          const spellsAbove10WithProperty = counter.get(e.id as number);
          return spellsAbove10WithProperty && spellsAbove10WithProperty >= 3 && !activeIds.includes(e.id) && !getRequiredSelections(instance).includes(e.id);
        }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
        if (sel.length > 0) {
          const apArr = [10, 20, 40];
          const cost = apArr[active.length];
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_81': {
        const activeIds = getActiveSelections(instance);
        const sel = sortObjects(entry.select!.filter(e => getActiveSelections(state.specialAbilities.get('SA_72')).includes(e.id) && !activeIds.includes(e.id)), locale.id);
        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_87': {
        const liturgiesAbove10 = [...state.liturgicalChants.values()].filter(e => e.value >= 10);
        const counter = liturgiesAbove10.reduce((map, obj) => {
          const wikiEntry = wiki.liturgicalChants.get(obj.id);

          if (wikiEntry) {
            return wikiEntry.aspects.reduce((map, aspect) => {
              const mapValue = map.get(aspect);
              return setMapItem(
                map,
                aspect,
                typeof mapValue === 'number' ? mapValue + 1 : 1,
              );
            }, map);
          }

          return map;
        }, new Map<number, number>());
        const activeIds = getActiveSelections(instance);
        const activeTradition = last(getActiveSelections(state.specialAbilities.get('SA_86')));
        const sel = sortObjects(entry.select!.filter(e => getTraditionOfAspect(e.id as number) === activeTradition && counter.get(e.id as number)! >= 3 && !activeIds.includes(e.id) && !getRequiredSelections(instance).includes(e.id)), locale.id);
        if (sel.length > 0) {
          const apArr = [15, 25, 45];
          const cost = apArr[active.length];
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_231': {
        const activeIds = getActiveSelections(instance);
        const sel = entry.select!.filter(e => {
          const a = !activeIds.includes(e.id) && !getRequiredSelections(instance).includes(e.id);
          const spell = state.spells.get(e.id as string);
          return a && spell && spell.value >= 10;
        });
        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_338': {
        type EnhancedSelectionObject = Wiki.SelectionObject & { gr: number; tier: number; };
        let sel = entry.select as EnhancedSelectionObject[];
        if (isActive(instance)) {
          const selectedPath = (findSelectOption(entry, instance.active[0].sid) as EnhancedSelectionObject).gr;
          const lastTier = (findSelectOption(entry, instance.active[instance.active.length - 1].sid) as EnhancedSelectionObject).tier;
          sel = sel.filter(e => e.gr === selectedPath && e.tier === lastTier + 1);
        }
        else {
          sel = sel.filter(e => e.tier === 1);
        }
        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_414':
      case 'SA_663': {
        const activeIds = getActiveSelections(instance);
        const sel = entry.select!.reduce<Wiki.SelectionObject[]>((arr, e) => {
          const targetInstance = id === 'SA_414' ? state.spells.get(e.target!) : state.liturgicalChants.get(e.target!);
          const targetWikiEntry = id === 'SA_414' ? wiki.spells.get(e.target!) : wiki.liturgicalChants.get(e.target!);
          if (!activeIds.includes(e.id) && validatePrerequisites(wiki, state, e.req!, id, pact) && !getRequiredSelections(instance).includes(e.id) && targetWikiEntry && targetInstance && targetInstance.value >= e.tier! * 4 + 4) {
            return [...arr, { ...e, name: `${targetWikiEntry.name}: ${e.name}` }];
          }
          return arr;
        }, []);
        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_533': {
        const sel = Array.isArray(entry.select) ? sortObjects(entry.select, locale.id) : undefined;
        if (tiers && maxTier === 0) {
          break;
        }
        const increaseValue = wiki.skills.get(state.specialAbilities.get('SA_531')!.active[0].sid as string)!.ic;
        const increasedCost = (cost as number[]).map(e => e + increaseValue);
        return { id, name, cost: increasedCost, sel, instance, wiki: entry };
      }
      case 'SA_544':
      case 'SA_545':
      case 'SA_546':
      case 'SA_547':
      case 'SA_548': {
        if (isActive(state.advantages.get('ADV_77'))) {
          let max = 3;
          if (isActive(state.advantages.get('ADV_79'))) {
            max += state.advantages.get('ADV_79')!.active[0].tier!;
          }
          else if (isActive(state.advantages.get('DISADV_72'))) {
            max -= state.advantages.get('DISADV_72')!.active[0].tier!;
          }
          const active = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 24).filter(isActive);
          if (active.length < max) {
            return { id, name, cost, instance, wiki: entry };
          }
        }
        else if (isActive(state.advantages.get('ADV_12'))) {
          return { id, name, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_549':
      case 'SA_550':
      case 'SA_551':
      case 'SA_552':
      case 'SA_553': {
        if (isActive(state.advantages.get('ADV_78'))) {
          let max = 3;
          if (isActive(state.advantages.get('ADV_80'))) {
            max += state.advantages.get('ADV_80')!.active[0].tier!;
          }
          else if (isActive(state.advantages.get('DISADV_73'))) {
            max -= state.advantages.get('DISADV_73')!.active[0].tier!;
          }
          const active = getAllEntriesByGroup(wiki.specialAbilities, state.specialAbilities, 27).filter(isActive);
          if (active.length < max) {
            return { id, name, cost, instance, wiki: entry };
          }
        }
        else if (isActive(state.advantages.get('ADV_12'))) {
          return { id, name, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_639': {
        const activeIds = getActiveSelections(instance);
        const sel = entry.select!.filter(e => !activeIds.includes(e.id) && validatePrerequisites(wiki, state, e.prerequisites!, id, pact) && !getRequiredSelections(instance).includes(e.id));
        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_667': {
        return { id, name, cost, tiers, maxTier: pact!.level, instance, wiki: entry };
      }
      case 'SA_677':
      case 'SA_678':
      case 'SA_679':
      case 'SA_680': {
        const {
          spentOnMagicalAdvantages,
          spentOnMagicalDisadvantages,
        } = adventurePoints;

        const magicalTraditions = getMagicalTraditionsResultFunc(state.specialAbilities);

        if (
          spentOnMagicalAdvantages <= 25 &&
          spentOnMagicalDisadvantages <= 25 &&
          magicalTraditions.length === 0
        ) {
          return { id, name, cost, instance, wiki: entry };
        }
        break;
      }
      case 'SA_699': {
        const languages = state.specialAbilities.get('SA_29')!;
        const languagesWikiEntry = wiki.specialAbilities.get('SA_29')!;

        interface AvailableLanguage {
          id: number;
          tier: number;
        }

        const availableLanguages = languages.active.reduce<AvailableLanguage[]>((arr, obj) => {
          if (obj.tier === 3 || obj.tier === 4) {
            return [
              ...arr,
              {
                id: obj.sid as number,
                tier: obj.tier
              }
            ];
          }
          return arr;
        }, []);

        const sel = languagesWikiEntry.select!.filter(e => {
          const languageAvailable = availableLanguages.find(l => l.id === e.id);
          const firstForLanguage = !instance.active.some(a => a.sid === e.id);
          return languageAvailable && firstForLanguage;
        }).map(e => {
          const languageAvailable = availableLanguages.find(l => l.id === e.id);
          const isMotherTongue = languageAvailable && languageAvailable.tier === 4;
          if (isMotherTongue) {
            return {
              ...e,
              cost: 0
            };
          }
          return e;
        });

        if (sel.length > 0) {
          return { id, name, sel, cost, instance, wiki: entry };
        }
        break;
      }

      default: {
        let sel = Array.isArray(entry.select) ? sortObjects(entry.select, locale.id) : undefined;
        if (cost === 'sel' && sel) {
          const activeIds = getActiveSelections(instance);
          sel = sel.filter(e => !activeIds.includes(e.id) && !getRequiredSelections(instance).includes(e.id));
        }
        if (tiers && maxTier === 0) {
          break;
        }
        return { id, name, cost, tiers, maxTier, input, sel, instance, wiki: entry };
      }
    }
  }

  return;
}

interface SplittedActiveObjectsByCustomCost {
  defaultCostList: Data.ActiveObject[];
  customCostList: Data.ActiveObject[];
}

export function getSplittedActiveObjectsByCustomCost(entries: Data.ActiveObject[]) {
  return entries.reduce<SplittedActiveObjectsByCustomCost>((res, obj) => {
    if (typeof obj.cost === 'number') {
      return {
        ...res,
        customCostList: [
          ...res.customCostList,
          obj,
        ],
      };
    }

    return {
      ...res,
      defaultCostList: [
        ...res.defaultCostList,
        obj,
      ],
    };
  }, {
    defaultCostList: [],
    customCostList: [],
  });
}

export function getActiveWithDefaultCost(entries: Data.ActiveObject[]) {
  return getSplittedActiveObjectsByCustomCost(entries).defaultCostList;
}

export function calculateAdventurePointsSpentDifference(entries: Data.ActiveViewObject[], state: Map<string, Data.ActivatableInstance>, wiki: WikiState): number {
  let diff = 0;

  // impure
  const calculatePrinciplesObligationsDiff = (sourceId: string) => {
    if (entries.some(e => e.id === sourceId)) {
      const { active } = state.get(sourceId)!;

      const maxCurrentTier = active.reduce((a, b) => {
        const isNotCustom = b.cost === undefined;
        if (typeof b.tier === 'number' && b.tier > a && isNotCustom) {
          return b.tier;
        }
        return a;
      }, 0);

      // next lower tier
      const subMaxCurrentTier = active.reduce((a, b) => {
        const isNotCustom = b.cost === undefined;
        if (
          typeof b.tier === 'number' &&
          b.tier > a &&
          b.tier < maxCurrentTier &&
          isNotCustom
        ) {
          return b.tier;
        }
        return a;
      }, 0);

      const amountMaxTiers = active.reduce((a, b) => {
        if (maxCurrentTier === b.tier) {
          return a + 1;
        }
        return a;
      }, 0);

      const baseCost = wiki.disadvantages.get(sourceId)!.cost as number;
      const amountDiff = amountMaxTiers > 1 ? maxCurrentTier * -baseCost : 0;
      const levelDiff = subMaxCurrentTier * -baseCost;

      diff += amountDiff + levelDiff;
    }
  }

  calculatePrinciplesObligationsDiff('DISADV_34');
  calculatePrinciplesObligationsDiff('DISADV_50');

  if (entries.some(e => e.id === 'DISADV_33')) {
    const { active } = state.get('DISADV_33')!;
    if (active.filter(e => e.sid === 7 && e.cost === undefined).length > 1) {
      diff -= wiki.disadvantages.get('DISADV_33')!.select!.find(e => e.id === 7)!.cost!;
    }
  }

  if (entries.some(e => e.id === 'DISADV_36')) {
    const { active } = state.get('DISADV_36')!;
    if (getActiveWithDefaultCost(active).length > 3) {
      diff -= (wiki.disadvantages.get('DISADV_36')!.cost as number) * 3;
    }
  }

  if (entries.some(e => e.id === 'SA_9')) {
    const { active } = state.get('SA_9')!;
    const sameSkill = new Map<string, number>();
    const skillDone = new Map<string, number>();

    for (const { sid } of active) {
      const id = sid as string;
      if (sameSkill.has(id)) {
        sameSkill.set(id, sameSkill.get(id)! + 1);
      }
      else {
        sameSkill.set(id, 1);
      }
    }

    for (const { sid } of active) {
      const id = sid as string;
      const counter = sameSkill.get(id)!;
      if (!skillDone.has(id) || skillDone.get(id)! < counter) {
        const current = skillDone.get(id) || 0;
        const skill = wiki.skills.get(id)!;
        diff += skill.ic * (current + 1 - counter);
        skillDone.set(id, current + 1);
      }
    }
  }

  if (entries.some(e => e.id === 'SA_72')) {
    const apArr = [10, 20, 40];
    const { active } = state.get('SA_72')!;
    diff += apArr.reduce((a, b, i) => i + 1 < active.length ? a + b : a, 0) - apArr[active.length - 1] * (active.length - 1);
  }

  if (entries.some(e => e.id === 'SA_87')) {
    const apArr = [15, 25, 45];
    const { active } = state.get('SA_87')!;
    diff += apArr.reduce((a, b, i) => i + 1 < active.length ? a + b : a, 0) - apArr[active.length - 1] * (active.length - 1);
  }

  return diff;
}

export function isActiveViewObject(obj: Data.ActiveViewObject | Data.DeactiveViewObject): obj is Data.ActiveViewObject {
  return obj.hasOwnProperty('index');
}

interface EnhancedReduce {
	final: string[];
	previousLowerTier: boolean;
}

export function compressList(list: (Data.ActiveViewObject | string)[], locale: Data.UIMessages): string {
	const listToString = sortStrings(list.filter(obj => typeof obj === 'string' || !['SA_27', 'SA_29'].includes(obj.id)).map(obj => {
		if (typeof obj === 'string') {
			return obj;
		}
		return obj.name;
	}), locale.id);

	const finalList = listToString.reduce<EnhancedReduce>((previous, current) => {
		const prevElement = last(previous.final);
		if (prevElement && prevElement.split(' (')[0] === current.split(' (')[0] && /\(.+\)(?: [IVX]+)?$/.test(prevElement)) {
			const prevElementSplitted = prevElement.split(/\)/);
			const optionalTier = prevElementSplitted.pop() || '';
			const beginning = `${prevElementSplitted.join(')')}${optionalTier}`;
			const currentSplitted = current.split(/\(/);
			const continuing = currentSplitted.slice(1).join('(').replace(/\)((?: [IVX]+)?)$/, '$1)');

			const other = previous.final.slice(0, -1);

			return {
				...previous,
				final: [ ...other, `${beginning}, ${continuing}` ]
			};
		}
		return {
			final: [ ...previous.final, current ],
			previousLowerTier: false
		};
	}, {
		final: [],
		previousLowerTier: false
	}).final.join(', ');

	return finalList;
}
