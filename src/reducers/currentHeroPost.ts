import { flatten, isEqual } from 'lodash';
import { CreateHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { get, getLatest } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import * as Data from '../types/data.d';
import * as Reusable from '../types/reusable.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import * as DependentUtils from '../utils/DependentUtils';
import { mergeIntoState, setNewStateItem, setStateItem } from '../utils/ListUtils';
import * as RequirementUtils from '../utils/RequirementUtils';
import { addExtendedSpecialAbilityDependency, addStyleExtendedSpecialAbilityDependencies } from './activatable';
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

      if (action.payload.map.has('TERRAIN_KNOWLEDGE')) {
        const { terrainKnowledge } = action.payload;
        activatable.add({
          id: 'SA_12',
          active: true,
          sid: terrainKnowledge,
        });
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
        return {
          ...instance,
          value: instance.value + value
        };
      }

      for (const [id, value] of skillRatingList) {
        newlist = setNewStateItem(newlist, id, addValue(getLatest(dependent, newlist, id) as Data.SkillishInstance, value));
      }

      function activate(instance: Data.ActivatableSkillishInstance): Data.ActivatableSkillishInstance {
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

      let permanentArcaneEnergyLoss = 0;

      if (race && culture && profession) {
        if (profession && profession.id !== 'P_0') {
          const requires = [ ...profession.requires ];

          if (professionVariant) {
            for (const req of professionVariant.requires) {
              if (RequirementUtils.isRequiringIncreasable(req) || req.active !== false) {
                requires.push(req);
              }
              else {
                const index = requires.findIndex(e => isEqual(req, e));
                if (index > -1) {
                  requires.splice(index, 1);
                }
              }
            }
          }

          // Assign profession requirements

          for (const req of requires) {
            if (RequirementUtils.isRequiringIncreasable(req)) {
              const { id, value } = req;
              if (typeof id === 'string') {
                const obj = get(fulllist, id) as Data.AttributeInstance | Data.TalentInstance;
                switch (obj.category) {
                  case Categories.ATTRIBUTES:
                  case Categories.TALENTS: {
                    if (typeof value === 'number') {
                      fulllist = setStateItem(fulllist, id, { ...obj, value });
                    }
                  }
                }
              }
            }
            else {
              const { id, sid, sid2, tier } = req;
              const obj = get(fulllist, id) as Data.ActivatableInstance & { tiers?: number };
              const activeObject = { sid, sid2, tier };

              const checkIfActive = (e: Data.ActiveObject) => isEqual(activeObject, e);

              if (!obj.active.some(checkIfActive)) {
                fulllist = setStateItem(fulllist, id, {
                  ...obj,
                  active: [
                    ...obj.active,
                    activeObject
                  ]
                });
                const adds = ActivatableUtils.getGeneratedPrerequisites(obj, activeObject, true);
                const prerequisites = Array.isArray(obj.reqs) ? obj.reqs : flatten(tier && [...obj.reqs].filter(e => e[0] <= tier).map(e => e[1]) || []);
                if (obj.category === Categories.SPECIAL_ABILITIES) {
                  fulllist = addExtendedSpecialAbilityDependency(
                    addStyleExtendedSpecialAbilityDependencies(fulllist, obj),
                    obj
                  );
                }
                fulllist = mergeIntoState(fulllist, DependentUtils.addDependencies(fulllist, [...prerequisites, ...adds], obj.id));
              }
            }
          }

          // Lower Combat Techniques with too high CTR

          const maxCombatTechniqueRating = getStart(el).maxCombatTechniqueRating;
          const valueTooHigh = [...fulllist.combatTechniques.values()].filter(e => e.value > maxCombatTechniqueRating);

          for (const combatTechnique of valueTooHigh) {
            fulllist = setStateItem(fulllist, combatTechnique.id, { ...combatTechnique, value: maxCombatTechniqueRating });
          }

          if (ActivatableUtils.isActive(fulllist.specialAbilities.get('SA_76'))) {
            permanentArcaneEnergyLoss += 2;
          }
        }
      }

      return {
        ...state,
        dependent: fulllist,
        energies: {
          ...state.energies,
          permanentArcaneEnergy: {
            ...state.energies.permanentArcaneEnergy,
            lost: state.energies.permanentArcaneEnergy.lost + permanentArcaneEnergyLoss
          }
        }
      };
    }

    default:
      return state;
  }
}
