import { flatten, isEqual } from 'lodash';
import { CreateHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { DisAdvAdventurePoints } from '../reducers/adventurePoints';
import { get, getLatest } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import * as Data from '../types/data.d';
import * as Reusable from '../types/reusable.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import * as DependentUtils from '../utils/DependentUtils';
import { getDecreaseRangeAP, getIncreaseAP, getIncreaseRangeAP } from '../utils/ICUtils';
import { mergeIntoState, setNewStateItem, setStateItem } from '../utils/ListUtils';
import * as RCPUtils from '../utils/RCPUtils';
import * as RequirementUtils from '../utils/RequirementUtils';
import { addStyleExtendedSpecialAbilityDependencies } from './activatable';
import { CurrentHeroInstanceState } from './currentHero';
import { DependentInstancesState } from './dependentInstances';

type Action = CreateHeroAction | SetSelectionsAction;

export function currentHeroPost(state: CurrentHeroInstanceState, action: Action): CurrentHeroInstanceState {
  switch (action.type) {
    case ActionTypes.CREATE_HERO:
      return {
        ...state,
        ap: {
          total: getStart(state.el).ap,
          spent: 0,
          adv: [0, 0, 0],
          disadv: [0, 0, 0]
        }
      };

    case ActionTypes.ASSIGN_RCP_OPTIONS: {
      const { dependent, el, rcp } = state;

      const race = rcp.race && get(dependent, rcp.race) as Data.RaceInstance;
      const culture = rcp.culture && get(dependent, rcp.culture) as Data.CultureInstance;
      const profession = rcp.profession && get(dependent, rcp.profession) as Data.ProfessionInstance;
      const professionVariant = rcp.professionVariant && get(dependent, rcp.professionVariant) as Data.ProfessionVariantInstance;

      const skillRatingList = new Map<string, number>();
      const addToSkillRatingList = (id: string, value: number) => {
        const currentValue = skillRatingList.get(id);
        if (currentValue) {
          skillRatingList.set(id, currentValue + value);
          if (skillRatingList.get(id) === 0) {
            skillRatingList.delete(id);
          }
        }
        else {
          skillRatingList.set(id, value);
        }
      };
      const skillActivateList = new Set<string>();
      const activatable = new Set<Reusable.ProfessionRequiresActivatableObject>();
      const languages = new Map<number, number>();
      const scripts = new Set<number>();

      let newlist: Data.ToOptionalKeys<DependentInstancesState> = {};
      let calculatedIncreasableCost = 0;
      let calculatedActivatableCost = 0;

      // Race selections:

      if (typeof race === 'object') {
        for (const [mod, id] of race.attributeAdjustments) {
          const entry = getLatest(dependent, newlist, id) as Data.AttributeInstance;
          newlist = setNewStateItem(newlist, id, { ...entry, mod: entry.mod + mod });
        }
        for (const id of race.automaticAdvantages) {
          activatable.add({ id, active: true });
        }
        const entry = getLatest(dependent, newlist, action.payload.attrSel) as Data.AttributeInstance;
        newlist = setNewStateItem(newlist, action.payload.attrSel, { ...entry, mod: race.attributeAdjustmentsSelection[0] });
      }

      // Culture selections:

      if (typeof culture === 'object') {
        if (action.payload.useCulturePackage) {
          for (const [key, value] of culture.talents) {
            skillRatingList.set(key, value);
          }
        }

        const motherTongueId = culture.languages.length > 1 ? action.payload.lang : culture.languages[0];
        languages.set(motherTongueId, 4);

        if (action.payload.buyLiteracy) {
          const motherTongueScriptId = culture.scripts.length > 1 ? action.payload.litc : culture.scripts[0];
          scripts.add(motherTongueScriptId);
        }
      }

      // Profession selections:

      if (typeof profession === 'object') {
        for (const [id, value] of [ ...profession.talents, ...profession.combatTechniques ]) {
          addToSkillRatingList(id, value);
        }
        for (const [id, value] of [ ...profession.spells, ...profession.liturgies ]) {
          skillActivateList.add(id);
          addToSkillRatingList(id, value);
        }
        for (const id of profession.blessings) {
          skillActivateList.add(id);
        }
        for (const activeObject of profession.specialAbilities) {
          activatable.add(activeObject);
        }
      }

      if (typeof professionVariant === 'object') {
        for (const [id, value] of [ ...professionVariant.talents, ...professionVariant.combatTechniques ]) {
          addToSkillRatingList(id, value);
        }
        for (const [id, value] of [ ...professionVariant.spells, ...professionVariant.liturgies ]) {
          skillActivateList.add(id);
          addToSkillRatingList(id, value);
          if (skillRatingList.get(id) === 0) {
            skillRatingList.delete(id);
            skillActivateList.delete(id);
          }
        }
        for (const activeObject of professionVariant.specialAbilities) {
          if (activeObject.active === false) {
            for (const item of activatable) {
              if (item.id === activeObject.id) {
                activatable.delete(item);
              }
            }
          }
          else {
            activatable.add(activeObject);
          }
        }
      }

      if (action.payload.map.has('SPECIALISATION')) {
        const { map, spec, specTalentId } = action.payload;
        const talentId = (map.get('SPECIALISATION') as Data.SpecialisationSelection).sid;
        if (Array.isArray(talentId) && specTalentId) {
          activatable.add({
            id: 'SA_9',
            active: true,
            sid: specTalentId,
            sid2: spec,
          });
        }
        else if (typeof talentId === 'string') {
          activatable.add({
            id: 'SA_9',
            active: true,
            sid: talentId,
            sid2: spec,
          });
        }
      }

      for (const [key, value] of action.payload.langLitc) {
        const [ category, id ] = key.split('_');
        if (category === 'LANG') {
          languages.set(Number.parseInt(id), value / 2);
        }
        else {
          scripts.add(Number.parseInt(id));
        }
      }

      for (const e of action.payload.combattech.values()) {
        addToSkillRatingList(e, (action.payload.map.get('COMBAT_TECHNIQUES') as Data.CombatTechniquesSelection).value);
      }

      for (const e of action.payload.combatTechniquesSecond.values()) {
        addToSkillRatingList(e, (action.payload.map.get('COMBAT_TECHNIQUES_SECOND') as Data.CombatTechniquesSecondSelection).value);
      }

      for (const e of action.payload.cantrips.values()) {
        skillActivateList.add(e);
      }

      for (const [key, value] of action.payload.curses) {
        addToSkillRatingList(key, value);
        skillActivateList.add(key);
      }

      for (const [key, value] of action.payload.skills) {
        const skill = state.dependent.talents.get(key);
        if (skill !== undefined) {
          addToSkillRatingList(key, value / skill.ic);
        }
      }

      // Apply:

      function addValue(instance: Data.SkillishInstance, value: number): Data.SkillishInstance {
        calculatedIncreasableCost += getIncreaseRangeAP(instance.ic, instance.value, instance.value + value);
        return {
          ...instance,
          value: instance.value + value
        };
      }

      for (const [id, value] of skillRatingList) {
        newlist = setNewStateItem(newlist, id, addValue(getLatest(dependent, newlist, id) as Data.SkillishInstance, value));
      }

      function activate(instance: Data.ActivatableSkillishInstance): Data.ActivatableSkillishInstance {
        if (instance.category === Categories.BLESSINGS || instance.category === Categories.CANTRIPS) {
          calculatedIncreasableCost += 1;
        }
        else {
          calculatedIncreasableCost += getIncreaseAP(instance.ic);
        }
        return {
          ...instance,
          active: true
        };
      }

      for (const id of skillActivateList) {
        newlist = setNewStateItem(newlist, id, activate(getLatest(dependent, newlist, id) as Data.ActivatableSkillishInstance));
      }

      let fulllist = mergeIntoState(dependent, newlist);

      for (const req of activatable) {
        const { id, sid, sid2, tier } = req;
        const entry = get(fulllist, id as string) as Data.ActivatableInstance;
        const { currentCost } = ActivatableUtils.convertPerTierCostToFinalCost(ActivatableUtils.getNameCost({ id, sid, sid2, tier, index: 0 }, dependent, true));
        calculatedActivatableCost += currentCost;
        const adds = ActivatableUtils.getGeneratedPrerequisites(entry, { sid, sid2, tier }, true);
        const obj: Data.ActivatableInstance = {...entry, active: [...entry.active, { sid, sid2, tier }]};
        if (obj.category === Categories.SPECIAL_ABILITIES) {
          fulllist = addStyleExtendedSpecialAbilityDependencies(fulllist, obj);
        }
        const firstState = setStateItem(fulllist, obj.id, obj);
        const prerequisites = Array.isArray(obj.reqs) ? obj.reqs : flatten(tier && [...obj.reqs].filter(e => e[0] <= tier).map(e => e[1]) || []);
        fulllist = mergeIntoState(firstState, DependentUtils.addDependencies(firstState, [...prerequisites, ...adds], obj.id));
      }

      const SA_27 = get(fulllist, 'SA_27') as Data.SpecialAbilityInstance;
      const SA_29 = get(fulllist, 'SA_29') as Data.SpecialAbilityInstance;

      fulllist = setStateItem(fulllist, 'SA_27', {
        ...SA_27,
        active: [ ...SA_27.active, ...Array.from(scripts.values(), sid => ({ sid }))]
      });
      fulllist = setStateItem(fulllist, 'SA_29', {
        ...SA_29,
        active: [ ...SA_29.active, ...Array.from(languages.entries(), ([sid, tier]) => ({ sid, tier }))]
      });

      // AP

      let ap;
      let professionName;
      let permanentArcaneEnergyLoss = 0;

      if (race && culture && profession) {
        ap = {
          spent: state.ap.spent + calculatedIncreasableCost - profession.ap,
          adv: race.automaticAdvantagesCost,
          disadv: [0, 0, 0] as [number, number, number]
        };

        if (action.payload.buyLiteracy) {
          const id = culture.scripts.length > 1 ? action.payload.litc : culture.scripts[0];
          const selectionItem = ActivatableUtils.getSelectionItem(get(fulllist, 'SA_27') as Data.SpecialAbilityInstance, id);
          ap.spent += selectionItem && selectionItem.cost || 0;
        }

        if (profession && profession.id !== 'P_0') {
          const requires = [ ...profession.requires ];

          for (const [key, options] of action.payload.map) {
            if (RCPUtils.isLanguagesScriptsSelection(key, options)) {
              ap.spent += options.value;
            }
          }

          if (professionVariant) {
            ap.spent -= professionVariant.ap;
            requires.push(...professionVariant.requires);
          }

          // Test case
          if (profession.apOfActivatables + (professionVariant ? professionVariant.apOfActivatables : 0) !== calculatedActivatableCost) {
            alert(`Calculated different AP value. Do not continue character creation with this profession! ${profession && profession.id} ${professionVariant && professionVariant.id} ${profession.apOfActivatables + (professionVariant ? professionVariant.apOfActivatables : 0)} ${calculatedActivatableCost}`);
          }

          ap.spent += calculatedActivatableCost;

          // Assign profession requirements

          ap = requires.reduce((final, req) => {
            if (RequirementUtils.isRequiringIncreasable(req)) {
              const { id, value } = req;
              if (typeof id === 'string') {
                const obj = get(fulllist, id) as Data.AttributeInstance | Data.TalentInstance;
                switch (obj.category) {
                  case Categories.ATTRIBUTES: {
                    if (typeof value === 'number') {
                      fulllist = setStateItem(fulllist, id, { ...obj, value });
                      return { ...final, spent: final.spent + getIncreaseRangeAP(5, 8, value)};
                    }
                    return final;
                  }
                  case Categories.TALENTS: {
                    if (typeof value === 'number') {
                      fulllist = setStateItem(fulllist, id, { ...obj, value });
                      return { ...final, spent: final.spent + getIncreaseRangeAP(obj.ic, obj.value, value)};
                    }
                    return final;
                  }
                }
              }
            }
            else {
              const { id, sid, sid2, tier } = req;
              if (typeof id === 'string') {
                const obj = get(fulllist, id) as Data.ActivatableInstance & { tiers?: number };
                const activeObject = { sid: sid as string | number | undefined, sid2, tier };
                let costObj: {
                  spent: number;
                  adv: DisAdvAdventurePoints;
                  disadv: DisAdvAdventurePoints;
                } | number | undefined;

                const checkIfActive = (e: Data.ActiveObject) => isEqual(activeObject, e);

                if (!obj.active.find(checkIfActive)) {
                  fulllist = setStateItem(fulllist, id, { ...obj, active: [...obj.active, activeObject]});
                  const adds = ActivatableUtils.getGeneratedPrerequisites(obj, activeObject, true);
                  const prerequisites = Array.isArray(obj.reqs) ? obj.reqs : flatten(tier && [...obj.reqs].filter(e => e[0] <= tier).map(e => e[1]) || []);
                  if (obj.category === Categories.SPECIAL_ABILITIES) {
                    fulllist = addStyleExtendedSpecialAbilityDependencies(fulllist, obj);
                  }
                  fulllist = mergeIntoState(fulllist, DependentUtils.addDependencies(fulllist, [...prerequisites, ...adds], obj.id));
                  const { currentCost } = ActivatableUtils.convertPerTierCostToFinalCost(ActivatableUtils.getNameCost({ id, sid, sid2, tier, index: 0 }, dependent, true));
                  if (currentCost && (obj.category === Categories.ADVANTAGES || obj.category === Categories.DISADVANTAGES)) {
                    const isKar = RequirementUtils.getFlatFirstTierPrerequisites(obj.reqs).some(e => e !== 'RCP' && e.id === 'ADV_12' && RequirementUtils.isRequiringActivatable(e) && e.active);
                    const isMag = RequirementUtils.getFlatFirstTierPrerequisites(obj.reqs).some(e => e !== 'RCP' && e.id === 'ADV_50' && RequirementUtils.isRequiringActivatable(e) && e.active);
                    const index = isKar ? 2 : isMag ? 1 : 0;

                    costObj = {
                      adv: [0, 0, 0],
                      disadv: [0, 0, 0],
                      spent: currentCost,
                    };

                    if (obj.category === Categories.ADVANTAGES) {
                      costObj.adv[0] = costObj.spent;
                      if (index > 0) {
                        costObj.adv[index] = costObj.spent;
                      }
                    }
                    else {
                      costObj.disadv[0] = -costObj.spent;
                      if (index > 0) {
                        costObj.disadv[index] = -costObj.spent;
                      }
                    }
                  }
                  else {
                    costObj = currentCost;
                  }
                  if (typeof costObj === 'object') {
                    return {
                      adv: costObj.adv.map((e, i) => e + final.adv[i]) as [number, number, number],
                      disadv: costObj.disadv.map((e, i) => e + final.disadv[i]) as [number, number, number],
                      spent: final.spent + costObj.spent
                    };
                  }
                  else if (typeof costObj === 'number') {
                    return { ...final, spent: final.spent + currentCost};
                  }
                }
                return final;
              }
            }
            return final;
          }, ap);

          // Lower Combat Techniques with too high CTR

          const maxCombatTechniqueRating = getStart(el).maxCombatTechniqueRating;
          const valueTooHigh = [...fulllist.combatTechniques.values()].filter(e => e.value > maxCombatTechniqueRating);

          ap.spent += valueTooHigh.reduce<number>((ap, instance) => {
            return ap + getDecreaseRangeAP(instance.ic, instance.value, maxCombatTechniqueRating);
          }, 0);

          for (const combatTechnique of valueTooHigh) {
            fulllist = setStateItem(fulllist, combatTechnique.id, { ...combatTechnique, value: maxCombatTechniqueRating });
          }

          if (rcp.profession === 'P_0') {
            professionName = 'Eigene Profession';
          }

          if (ActivatableUtils.isActive(get(fulllist, 'SA_76') as Data.SpecialAbilityInstance)) {
            permanentArcaneEnergyLoss += 2;
          }
        }
      }

      return {
        ...state,
        dependent: fulllist,
        ap: {
          ...state.ap,
          ...ap
        },
        energies: {
          ...state.energies,
          permanentArcaneEnergy: {
            ...state.energies.permanentArcaneEnergy,
            lost: state.energies.permanentArcaneEnergy.lost + permanentArcaneEnergyLoss
          }
        },
        profile: {
          ...state.profile,
          professionName
        }
      };
    }

    default:
      return state;
  }
}
