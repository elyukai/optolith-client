import { AddArcaneEnergyPointAction, AddAttributePointAction, AddBoughtBackAEPointAction, AddBoughtBackKPPointAction, AddKarmaPointAction, AddLifePointAction, AddLostAEPointAction, AddLostAEPointsAction, AddLostKPPointAction, AddLostKPPointsAction, RemoveAttributePointAction, RemoveBoughtBackAEPointAction, RemoveBoughtBackKPPointAction, RemoveLostAEPointAction, RemoveLostKPPointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { SelectCultureAction } from '../actions/CultureActions';
import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { SelectProfessionAction, SetSelectionsAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { AddAdventurePointsAction } from '../actions/ProfileActions';
import { SelectRaceAction } from '../actions/RaceActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = LoadHeroAction | ActivateSpellAction | ActivateLiturgyAction | DeactivateSpellAction | DeactivateLiturgyAction | AddAttributePointAction | AddTalentPointAction | AddCombatTechniquePointAction | AddSpellPointAction | AddLiturgyPointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | RemoveAttributePointAction | RemoveTalentPointAction | RemoveCombatTechniquePointAction | RemoveSpellPointAction | RemoveLiturgyPointAction | ActivateDisAdvAction | SetDisAdvTierAction | DeactivateDisAdvAction | ActivateSpecialAbilityAction | SetSpecialAbilityTierAction | DeactivateSpecialAbilityAction | AddAdventurePointsAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | CreateHeroAction | SetSelectionsAction | AddBoughtBackAEPointAction | AddBoughtBackKPPointAction | AddLostAEPointsAction | AddLostKPPointsAction | RemoveBoughtBackAEPointAction | RemoveBoughtBackKPPointAction | AddLostAEPointAction | AddLostKPPointAction | RemoveLostAEPointAction | RemoveLostKPPointAction;

export interface AdventurePointsState {
	total: number;
	spent: number;
	adv: [number, number, number];
	disadv: [number, number, number];
}

export function adventurePoints(state: AdventurePointsState = {
	total: 0,
	spent: 0,
	adv: [0, 0, 0],
	disadv: [0, 0, 0]
}, action: Action): AdventurePointsState {
	switch (action.type) {
		case ActionTypes.CREATE_HERO:
			return {
				total: ELStore.getStart().ap,
				spent: 0,
				adv: [0, 0, 0],
				disadv: [0, 0, 0]
			};

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
		case ActionTypes.REMOVE_LOST_AE_POINT:
		case ActionTypes.REMOVE_LOST_KP_POINT:
		case ActionTypes.ACTIVATE_SPECIALABILITY:
		case ActionTypes.SET_SPECIALABILITY_TIER:
		case ActionTypes.DEACTIVATE_SPECIALABILITY:
		case ActionTypes.SELECT_RACE:
		case ActionTypes.SELECT_CULTURE:
		case ActionTypes.SELECT_PROFESSION:
		case ActionTypes.SELECT_PROFESSION_VARIANT:
		case ActionTypes.ASSIGN_RCP_OPTIONS:
			return { ...state, spent: state.spent + action.payload.cost };

		case ActionTypes.ADD_BOUGHT_BACK_AE_POINT:
		case ActionTypes.ADD_BOUGHT_BACK_KP_POINT:
			return { ...state, spent: state.spent + 2 };

		case ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT:
		case ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT:
			return { ...state, spent: state.spent - 2 };

		case ActionTypes.ACTIVATE_DISADV:
		case ActionTypes.SET_DISADV_TIER:
		case ActionTypes.DEACTIVATE_DISADV:
			this.spendDisadv(action.payload.id, action.payload.cost, RequirementsStore.getDisAdvDetails());
			return state;

		case ActionTypes.ADD_ADVENTURE_POINTS:
			return { ...state, spent: state.total + action.payload.amount };

		default:
			return state;
	}
}

export function getLeft(state: AdventurePointsState) {
	return state.total - state.spent;
}
