import { AddAttributePointAction, RemoveAttributePointAction, SetAdjustmentIdAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { ActivateBlessingAction, ActivateLiturgyAction, AddLiturgyPointAction, DeactivateBlessingAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import { ActivateCantripAction, ActivateSpellAction, AddSpellPointAction, DeactivateCantripAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import { ActionTypes } from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import * as Data from '../types/data.d';
import { activateByObject } from '../utils/ActivatableUtils';
import { addDependencies } from '../utils/DependentUtils';
import * as ExtendedStyleUtils from '../utils/ExtendedStyleUtils';
import * as ListUtils from '../utils/ListUtils';
import { activatable } from './activatable';
import { dependentInstancesClear } from './dependentInstancesClear';
import { increasable } from './increasable';
import { Categories } from '../constants/Categories';

type Action =
  AddAttributePointAction |
  RemoveAttributePointAction |
  AddCombatTechniquePointAction |
  RemoveCombatTechniquePointAction |
  CreateHeroAction |
  LoadHeroAction |
  ActivateLiturgyAction |
  AddLiturgyPointAction |
  DeactivateLiturgyAction |
  RemoveLiturgyPointAction |
  ActivateSpellAction |
  AddSpellPointAction |
  DeactivateSpellAction |
  RemoveSpellPointAction |
  AddTalentPointAction |
  RemoveTalentPointAction |
  ActivateDisAdvAction |
  DeactivateDisAdvAction |
  SetDisAdvTierAction |
  ActivateSpecialAbilityAction |
  DeactivateSpecialAbilityAction |
  SetSpecialAbilityTierAction |
  ActivateCantripAction |
  DeactivateCantripAction |
  ActivateBlessingAction |
  DeactivateBlessingAction |
  SetAdjustmentIdAction;

export interface DependentInstancesState {
  advantages: Map<string, Data.AdvantageInstance>;
  attributes: Map<string, Data.AttributeInstance>;
  blessings: Map<string, Data.BlessingInstance>;
  cantrips: Map<string, Data.CantripInstance>;
  combatTechniques: Map<string, Data.CombatTechniqueInstance>;
  cultures: Map<string, Data.CultureInstance>;
  disadvantages: Map<string, Data.DisadvantageInstance>;
  liturgies: Map<string, Data.LiturgyInstance>;
  professions: Map<string, Data.ProfessionInstance>;
  professionVariants: Map<string, Data.ProfessionVariantInstance>;
  races: Map<string, Data.RaceInstance>;
  raceVariants: Map<string, Data.RaceVariantInstance>;
  specialAbilities: Map<string, Data.SpecialAbilityInstance>;
  spells: Map<string, Data.SpellInstance>;
  talents: Map<string, Data.TalentInstance>;
  combatStyleDependencies: Data.StyleDependency[];
  magicalStyleDependencies: Data.StyleDependency[];
  blessedStyleDependencies: Data.StyleDependency[];
}

export type DependentInstancesStateKeysForMaps =
  'advantages' |
  'attributes' |
  'blessings' |
  'cantrips' |
  'combatTechniques' |
  'cultures' |
  'disadvantages' |
  'liturgies' |
  'professions' |
  'professionVariants' |
  'races' |
  'raceVariants' |
  'specialAbilities' |
  'spells' |
  'talents';

const initialState: DependentInstancesState = {
  advantages: new Map(),
  attributes: new Map(),
  blessings: new Map(),
  cantrips: new Map(),
  combatTechniques: new Map(),
  cultures: new Map(),
  disadvantages: new Map(),
  liturgies: new Map(),
  professions: new Map(),
  professionVariants: new Map(),
  races: new Map(),
  raceVariants: new Map(),
  specialAbilities: new Map(),
  spells: new Map(),
  talents: new Map(),
  combatStyleDependencies: [],
  magicalStyleDependencies: [],
  blessedStyleDependencies: []
};

export function dependentInstances(state = initialState, action: Action) {
  switch (action.type) {
    case ActionTypes.ACTIVATE_SPELL:
    case ActionTypes.ACTIVATE_LITURGY:
    case ActionTypes.ACTIVATE_CANTRIP:
    case ActionTypes.ACTIVATE_BLESSING:
    case ActionTypes.DEACTIVATE_SPELL:
    case ActionTypes.DEACTIVATE_LITURGY:
    case ActionTypes.DEACTIVATE_CANTRIP:
    case ActionTypes.DEACTIVATE_BLESSING:
    case ActionTypes.ADD_ATTRIBUTE_POINT:
    case ActionTypes.ADD_TALENT_POINT:
    case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
    case ActionTypes.ADD_SPELL_POINT:
    case ActionTypes.ADD_LITURGY_POINT:
    case ActionTypes.REMOVE_ATTRIBUTE_POINT:
    case ActionTypes.REMOVE_TALENT_POINT:
    case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
    case ActionTypes.REMOVE_SPELL_POINT:
    case ActionTypes.REMOVE_LITURGY_POINT:
      return increasable(state, action);

    case ActionTypes.ACTIVATE_DISADV:
    case ActionTypes.ACTIVATE_SPECIALABILITY:
    case ActionTypes.DEACTIVATE_DISADV:
    case ActionTypes.DEACTIVATE_SPECIALABILITY:
    case ActionTypes.SET_DISADV_TIER:
    case ActionTypes.SET_SPECIALABILITY_TIER:
      return activatable(state, action);

    case ActionTypes.CREATE_HERO:
      return dependentInstancesClear(state);

    case ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID: {
      const { current, next, value } = action.payload;
      const currentAttribute = state.attributes.get(current)!;
      const nextAttribute = state.attributes.get(next)!;

      const setItem = (attribute: Data.AttributeInstance) => {
        return (state: DependentInstancesState) => {
          return ListUtils.setStateItem(
            state,
            attribute.id,
            {
              ...attribute,
              mod: attribute.mod - value
            }
          );
        }
      };

      return ListUtils.mergeReducedOptionalState(
        state,
        setItem(currentAttribute),
        setItem(nextAttribute),
      );
    }

    case ActionTypes.LOAD_HERO: {
      const { attr, talents, ct, spells, blessings, cantrips, liturgies, activatable } = action.payload.data;
      let newstate = dependentInstancesClear(state);

      for (const [id, value, mod] of attr.values) {
        newstate.attributes.set(id, { ...newstate.attributes.get(id)!, value, mod });
      }

      for (const [id, value] of Object.entries(talents)) {
        newstate.talents.set(id, { ...newstate.talents.get(id)!, value });
      }

      for (const [id, value] of Object.entries(ct)) {
        newstate.combatTechniques.set(id, { ...newstate.combatTechniques.get(id)!, value });
      }

      for (const [id, value] of Object.entries(spells)) {
        const newObject = { ...newstate.spells.get(id)!, active: true, value };
        const firstState = ListUtils.setStateItem(newstate, newObject.id, newObject);
        newstate = ListUtils.mergeIntoState(firstState, addDependencies(firstState, newObject.reqs, newObject.id));
      }

      for (const [id, value] of Object.entries(liturgies)) {
        newstate.liturgies.set(id, { ...newstate.liturgies.get(id)!, active: true, value });
      }

      for (const id of blessings) {
        const newObject = { ...newstate.blessings.get(id)!, active: true };
        const firstState = ListUtils.setStateItem(newstate, newObject.id, newObject);
        newstate = ListUtils.mergeIntoState(firstState, addDependencies(firstState, newObject.reqs, newObject.id));
      }

      for (const id of cantrips) {
        const newObject = { ...newstate.cantrips.get(id)!, active: true };
        const firstState = ListUtils.setStateItem(newstate, newObject.id, newObject);
        newstate = ListUtils.mergeIntoState(firstState, addDependencies(firstState, newObject.reqs, newObject.id));
      }

      for (const [id, active] of Object.entries(activatable)) {
        for (const activeObject of active) {
          const entry = get(newstate, id) as Data.ActivatableInstance;

          if (entry.category === Categories.SPECIAL_ABILITIES) {
            newstate = ListUtils.mergeReducedOptionalState<Data.SpecialAbilityInstance>(
              newstate,
              entry,
              ExtendedStyleUtils.addStyleExtendedSpecialAbilityDependencies,
              ExtendedStyleUtils.addExtendedSpecialAbilityDependency,
              activateByObject(activeObject)
            );
          }
          else {
            newstate = ListUtils.mergeReducedOptionalState(
              newstate,
              entry,
              activateByObject(activeObject)
            );
          }
        }
      }

      return newstate;
    }

    default:
      return state;
  }
}
