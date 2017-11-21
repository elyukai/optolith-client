import { AddArcaneEnergyPointAction, AddAttributePointAction, AddBoughtBackAEPointAction, AddBoughtBackKPPointAction, AddKarmaPointAction, AddLifePointAction, AddLostAEPointAction, AddLostAEPointsAction, AddLostKPPointAction, AddLostKPPointsAction, RemoveArcaneEnergyPointAction, RemoveAttributePointAction, RemoveBoughtBackAEPointAction, RemoveBoughtBackKPPointAction, RemoveKarmaPointAction, RemoveLifePointAction, RemoveLostAEPointAction, RemoveLostKPPointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { SelectCultureAction } from '../actions/CultureActions';
import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { LoadHeroAction } from '../actions/HerolistActions';
import { ActivateBlessingAction, ActivateLiturgyAction, AddLiturgyPointAction, DeactivateBlessingAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { SelectProfessionAction, SetSelectionsAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { AddAdventurePointsAction } from '../actions/ProfileActions';
import { SelectRaceAction } from '../actions/RaceActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import { ActivateCantripAction, ActivateSpellAction, AddSpellPointAction, DeactivateCantripAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = LoadHeroAction | ActivateSpellAction | ActivateLiturgyAction | DeactivateSpellAction | DeactivateLiturgyAction | AddAttributePointAction | AddTalentPointAction | AddCombatTechniquePointAction | AddSpellPointAction | AddLiturgyPointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | RemoveAttributePointAction | RemoveTalentPointAction | RemoveCombatTechniquePointAction | RemoveSpellPointAction | RemoveLiturgyPointAction | ActivateDisAdvAction | SetDisAdvTierAction | DeactivateDisAdvAction | ActivateSpecialAbilityAction | SetSpecialAbilityTierAction | DeactivateSpecialAbilityAction | AddAdventurePointsAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | SetSelectionsAction | AddBoughtBackAEPointAction | AddBoughtBackKPPointAction | AddLostAEPointsAction | AddLostKPPointsAction | RemoveBoughtBackAEPointAction | RemoveBoughtBackKPPointAction | AddLostAEPointAction | AddLostKPPointAction | RemoveLostAEPointAction | RemoveLostKPPointAction | ActivateCantripAction | DeactivateCantripAction | ActivateBlessingAction | DeactivateBlessingAction | RemoveArcaneEnergyPointAction | RemoveLifePointAction | RemoveKarmaPointAction;

export interface DisAdvAdventurePoints extends Array<number> {
	/**
	 * Spent AP for Advantages/Disadvantages in total.
	 */
	0: number;
	/**
	 * Spent AP for magical Advantages/Disadvantages.
	 */
	1: number;
	/**
	 * Spent AP for blessed Advantages/Disadvantages.
	 */
	2: number;
}

export interface AdventurePointsState {
	total: number;
	spent: number;
	adv: DisAdvAdventurePoints;
	disadv: DisAdvAdventurePoints;
}

const initialState: AdventurePointsState = {
	total: 0,
	spent: 0,
	adv: [0, 0, 0],
	disadv: [0, 0, 0]
};

export function adventurePoints(state: AdventurePointsState = initialState, action: Action): AdventurePointsState {
	switch (action.type) {
		case ActionTypes.LOAD_HERO:
			return { ...action.payload.data.ap };

		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.ACTIVATE_LITURGY:
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT:
		case ActionTypes.ADD_ARCANE_ENERGY_POINT:
		case ActionTypes.ADD_KARMA_POINT:
		case ActionTypes.ADD_LIFE_POINT:
		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
		case ActionTypes.REMOVE_ARCANE_ENERGY_POINT:
		case ActionTypes.REMOVE_KARMA_POINT:
		case ActionTypes.REMOVE_LIFE_POINT:
		case ActionTypes.REMOVE_LOST_AE_POINT:
		case ActionTypes.REMOVE_LOST_KP_POINT:
		case ActionTypes.ACTIVATE_SPECIALABILITY:
		case ActionTypes.SET_SPECIALABILITY_TIER:
		case ActionTypes.DEACTIVATE_SPECIALABILITY:
		case ActionTypes.SELECT_RACE:
		case ActionTypes.SELECT_CULTURE:
		case ActionTypes.SELECT_PROFESSION:
		case ActionTypes.SELECT_PROFESSION_VARIANT:
			return { ...state, spent: state.spent + action.payload.cost };

		case ActionTypes.ACTIVATE_CANTRIP:
		case ActionTypes.ACTIVATE_BLESSING:
			return { ...state, spent: state.spent + 1};

		case ActionTypes.DEACTIVATE_CANTRIP:
		case ActionTypes.DEACTIVATE_BLESSING:
			return { ...state, spent: state.spent - 1};

		case ActionTypes.ADD_BOUGHT_BACK_AE_POINT:
		case ActionTypes.ADD_BOUGHT_BACK_KP_POINT:
			return { ...state, spent: state.spent + 2 };

		case ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT:
		case ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT:
			return { ...state, spent: state.spent - 2 };

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.SET_DISADV_TIER:
		case ActionTypes.DEACTIVATE_DISADV: {
			const { cost, id, isBlessed, isDisadvantage, isMagical } = action.payload;

			let finalCost = cost;

			if (['DISADV_17', 'DISADV_18'].includes(id)) {
				finalCost += action.type === ActionTypes.DEACTIVATE_DISADV ? -10 : 10;
			}

			const addState = isDisadvantage ? [...state.disadv] as DisAdvAdventurePoints : [...state.adv] as DisAdvAdventurePoints;

			if (isBlessed) {
				addState[2] += isDisadvantage ? -cost : cost;
			}
			else if (isMagical) {
				addState[1] += isDisadvantage ? -cost : cost;
			}
			addState[0] += isDisadvantage ? -cost : cost;

			return {
				...state,
				spent: state.spent + finalCost,
				adv: !isDisadvantage ? addState : state.adv,
				disadv: isDisadvantage ? addState : state.disadv
			};
		}

		case ActionTypes.ADD_ADVENTURE_POINTS:
			return { ...state, total: state.total + action.payload.amount };

		default:
			return state;
	}
}
