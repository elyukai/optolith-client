/// <reference path="../constants/ActionTypes.d.ts" />

type Action = AddAttributePointAction | RemoveAttributePointAction | AddLifePointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | RemovePermanentAEPointAction | RemovePermanentKPPointAction | RemoveRedeemedAEPointAction | RemoveRedeemedKPPointAction | RedeemAEPointAction | RedeemKPPointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | SetCombatTechniquesSortOrderAction | SelectCultureAction | SetCulturesSortOrderAction | SetCulturesVisibilityFilterAction | SwitchCultureValueVisibilityAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | SwitchDisAdvRatingVisibilityAction | SetHerolistSortOrderAction | SetHerolistVisibilityFilterAction | CreateHeroAction | AddItemAction | RemoveItemAction | SetItemAction | SetItemsSortOrderAction | ActivateLiturgyAction | DeactivateLiturgyAction | AddLiturgyPointAction | RemoveLiturgyPointAction | SetLiturgiesSortOrderAction | SetSectionAction | SetTabAction | SelectProfessionAction | SetSelectionsAction | SetProfessionsSortOrderAction | SetProfessionsVisibilityFilterAction | SelectProfessionVariantAction | SetHeroNameAction | SetHeroAvatarAction | SetFamilyAction | SetPlaceOfBirthAction | SetDateOfBirthAction | SetAgeAction | SetHairColorAction | SetEyeColorAction | SetSizeAction | SetWeightAction | SetTitleAction | SetSocialStatusAction | SetCharacteristicsAction | SetOtherInfoAction | EndHeroCreationAction | AddAdventurePointsAction | SelectRaceAction | SetRacesSortOrderAction | SwitchRaceValueVisibilityAction | ReceiveDataTablesAction | RequestHeroAvatarAction | ReceiveHeroAvatarAction | RequestHeroDataAction | ReceiveHeroDataAction | RequestHerolistAction | ReceiveHerolistAction | RequestLoginAction | ReceiveLoginAction | RequestLogoutAction | ReceiveLogoutAction | RequestNewUsernameAction | ReceiveNewUsernameAction | RequestUserDeletionAction | ReceiveUserDeletionAction | RequestRegistrationAction | ReceiveRegistrationAction | RequestNewPasswordAction | ReceiveNewPasswordAction | RequestNewDisplayNameAction | ReceiveNewDisplayNameAction | RequestPasswordResetAction | ReceivePasswordResetAction | RequestUsernameAction | ReceiveUsernameAction | RequestAccountActivationEmailAction | ReceiveAccountActivationEmailAction | RequestHeroSaveAction | ReceiveHeroSaveAction | RequestFailedAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | SetSpecialAbilitiesSortOrderAction | ActivateSpellAction | DeactivateSpellAction | AddSpellPointAction | RemoveSpellPointAction | SetSpellsSortOrderAction | AddTalentPointAction | RemoveTalentPointAction | SetTalentsSortOrderAction | SwitchTalentRatingVisibilityAction;

type UndoTriggerActions = ActivateDisAdvAction | DeactivateDisAdvAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction;

interface DefaultAction {
	type: string;
	undo?: boolean;
	cost?: number;
}

// AttributesActions

interface AddAttributePointAction extends DefaultAction {
	type: ADD_ATTRIBUTE_POINT;
	payload: {
		id: string;
	};
}

interface RemoveAttributePointAction extends DefaultAction {
	type: REMOVE_ATTRIBUTE_POINT;
	payload: {
		id: string;
	};
}

interface AddLifePointAction extends DefaultAction {
	type: ADD_LIFE_POINT;
}

interface AddArcaneEnergyPointAction extends DefaultAction {
	type: ADD_ARCANE_ENERGY_POINT;
}

interface AddKarmaPointAction extends DefaultAction {
	type: ADD_KARMA_POINT;
}

interface RedeemAEPointAction extends DefaultAction {
	type: REDEEM_AE_POINT;
}

interface RedeemAEPointAction extends DefaultAction {
	type: REDEEM_AE_POINT;
}

interface RemoveRedeemedAEPointAction extends DefaultAction {
	type: REMOVE_REDEEMED_AE_POINT;
}

interface RemovePermanentAEPointAction extends DefaultAction {
	type: REMOVE_PERMANENT_AE_POINTS;
	payload: {
		value: number;
	};
}

interface RedeemKPPointAction extends DefaultAction {
	type: REDEEM_KP_POINT;
}

interface RemoveRedeemedKPPointAction extends DefaultAction {
	type: REMOVE_REDEEMED_KP_POINT;
}

interface RemovePermanentKPPointAction extends DefaultAction {
	type: REMOVE_PERMANENT_KP_POINTS;
	payload: {
		value: number;
	};
}

// CombatTechniquesActions

interface AddCombatTechniquePointAction extends DefaultAction {
	type: ADD_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
	};
}

interface RemoveCombatTechniquePointAction extends DefaultAction {
	type: REMOVE_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
	};
}

interface SetCombatTechniquesSortOrderAction extends DefaultAction {
	type: SET_COMBATTECHNIQUES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

// CultureActions

interface SelectCultureAction extends DefaultAction {
	type: SELECT_CULTURE;
	payload: {
		id: string;
	};
}

interface SetCulturesSortOrderAction extends DefaultAction {
	type: SET_CULTURES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SetCulturesVisibilityFilterAction extends DefaultAction {
	type: SET_CULTURES_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

interface SwitchCultureValueVisibilityAction extends DefaultAction {
	type: SWITCH_CULTURE_VALUE_VISIBILITY;
}

// DisAdvActions

interface ActivateArgs {
    id: string;
    sel?: string | number;
    sel2?: string | number;
    input?: string;
    tier?: number
	cost: number;
}

interface UndoExtendedActivateArgs extends ActivateArgs {
	index?: number;
	activeObject?: ActiveObject;
}

interface ActivateDisAdvAction extends DefaultAction {
    type: ACTIVATE_DISADV;
    payload: UndoExtendedActivateArgs;
}

interface DeactivateArgs {
    id: string;
	index: number;
    cost: number;
}

interface UndoExtendedDeactivateArgs extends DeactivateArgs {
	activeObject?: ActiveObject;
}

interface DeactivateDisAdvAction extends DefaultAction {
    type: DEACTIVATE_DISADV;
    payload: UndoExtendedDeactivateArgs;
}

interface SetDisAdvTierAction extends DefaultAction {
    type: SET_DISADV_TIER;
    payload: {
        id: string;
        index: number;
        tier: number;
        cost: number;
    };
}

interface SwitchDisAdvRatingVisibilityAction extends DefaultAction {
    type: SWITCH_DISADV_RATING_VISIBILITY;
}

// HerolistActions

interface SetHerolistSortOrderAction extends DefaultAction {
	type: SET_HEROLIST_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SetHerolistVisibilityFilterAction extends DefaultAction {
	type: SET_HEROLIST_VISIBILITY_FILTER;
	payload: {
		filterOption: string;
	};
}

interface CreateHeroAction extends DefaultAction {
	type: CREATE_HERO;
	payload: {
		name: string;
		sex: 'm' | 'f';
		el: string;
	};
}

// HistoryActions

// EquipmentActions

interface AddItemAction extends DefaultAction {
	type: ADD_ITEM;
	payload: {
		data: ItemInstance;
	};
}

interface SetItemAction extends DefaultAction {
	type: SET_ITEM;
	payload: {
		id: string;
		data: ItemInstance;
	};
}

interface RemoveItemAction extends DefaultAction {
	type: REMOVE_ITEM;
	payload: {
		id: string;
	};
}

interface SetItemsSortOrderAction extends DefaultAction {
	type: SET_ITEMS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SetDucatesAction extends DefaultAction {
	type: SET_DUCATES;
	payload: {
		value: string;
	};
}

interface SetSilverthalersAction extends DefaultAction {
	type: SET_SILVERTHALERS;
	payload: {
		value: string;
	};
}

interface SetHellersAction extends DefaultAction {
	type: SET_HELLERS;
	payload: {
		value: string;
	};
}

interface SetKreutzersAction extends DefaultAction {
	type: SET_KREUTZERS;
	payload: {
		value: string;
	};
}

// LiturgiesActions

interface ActivateLiturgyAction extends DefaultAction {
	type: ACTIVATE_LITURGY;
	payload: {
		id: string;
	};
}

interface DeactivateLiturgyAction extends DefaultAction {
	type: DEACTIVATE_LITURGY;
	payload: {
		id: string;
	};
}

interface AddLiturgyPointAction extends DefaultAction {
	type: ADD_LITURGY_POINT;
	payload: {
		id: string;
	};
}

interface RemoveLiturgyPointAction extends DefaultAction {
	type: REMOVE_LITURGY_POINT;
	payload: {
		id: string;
	};
}

interface SetLiturgiesSortOrderAction extends DefaultAction {
	type: SET_LITURGIES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

// LocationActions

interface SetSectionAction extends DefaultAction {
	type: SET_SECTION;
	payload: {
		section: 'main' | 'hero' | 'group';
		tab?: string;
	};
}

interface SetTabAction extends DefaultAction {
	type: SET_TAB;
	payload: {
		tab: string;
	};
}

// ProfessionActions

interface SelectProfessionAction extends DefaultAction {
	type: SELECT_PROFESSION;
	payload: {
		id: string;
	};
}

interface SetSelectionsAction extends DefaultAction {
	type: ASSIGN_RCP_OPTIONS;
	payload: Selections;
}

interface SetProfessionsSortOrderAction extends DefaultAction {
	type: SET_PROFESSIONS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SetProfessionsVisibilityFilterAction extends DefaultAction {
	type: SET_PROFESSIONS_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

// ProfessionVariantActions

interface SelectProfessionVariantAction extends DefaultAction {
	type: SELECT_PROFESSION_VARIANT;
	payload: {
		id: string | null;
	};
}

// ProfileActions

interface SetHeroNameAction extends DefaultAction {
	type: SET_HERO_NAME;
	payload: {
		name: string;
	};
}

interface SetHeroAvatarAction extends DefaultAction {
	type: SET_HERO_AVATAR;
	payload: {
		url: string;
	};
}

interface SetFamilyAction extends DefaultAction {
	type: SET_FAMILY;
	payload: {
		family: string;
	};
}

interface SetPlaceOfBirthAction extends DefaultAction {
	type: SET_PLACEOFBIRTH;
	payload: {
		placeofbirth: string;
	};
}

interface SetDateOfBirthAction extends DefaultAction {
	type: SET_DATEOFBIRTH;
	payload: {
		dateofbirth: string;
	};
}

interface SetAgeAction extends DefaultAction {
	type: SET_AGE;
	payload: {
		age: string;
	};
}

interface SetHairColorAction extends DefaultAction {
	type: SET_HAIRCOLOR;
	payload: {
		haircolor: number;
	};
}

interface SetEyeColorAction extends DefaultAction {
	type: SET_EYECOLOR;
	payload: {
		eyecolor: number;
	};
}

interface SetSizeAction extends DefaultAction {
	type: SET_SIZE;
	payload: {
		size: string;
	};
}

interface SetWeightAction extends DefaultAction {
	type: SET_WEIGHT;
	payload: {
		size?: string;
		weight: string;
	};
}

interface SetTitleAction extends DefaultAction {
	type: SET_TITLE;
	payload: {
		title: string;
	};
}

interface SetSocialStatusAction extends DefaultAction {
	type: SET_SOCIALSTATUS;
	payload: {
		socialstatus: number;
	};
}

interface SetCharacteristicsAction extends DefaultAction {
	type: SET_CHARACTERISTICS;
	payload: {
		characteristics: string;
	};
}

interface SetOtherInfoAction extends DefaultAction {
	type: SET_OTHERINFO;
	payload: {
		otherinfo: string;
	};
}

interface EndHeroCreationAction extends DefaultAction {
	type: END_HERO_CREATION;
}

interface AddAdventurePointsAction extends DefaultAction {
	type: ADD_ADVENTURE_POINTS;
	payload: {
		amount: number;
	};
}

// RaceActions

interface SelectRaceAction extends DefaultAction {
	type: SELECT_RACE;
	payload: {
		id: string;
	};
}

interface SetRacesSortOrderAction extends DefaultAction {
	type: SET_RACES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SwitchRaceValueVisibilityAction extends DefaultAction {
	type: SWITCH_RACE_VALUE_VISIBILITY;
}

// RulesActions

interface SetHigherParadeValuesAction extends DefaultAction {
	type: SET_HIGHER_PARADE_VALUES;
	payload: {
		value: number;
	};
}

// ServerActions

interface ReceiveDataTablesAction extends DefaultAction {
	type: RECEIVE_DATA_TABLES;
	payload: {
		data: RawData;
	};
}

interface RequestHeroAvatarAction extends DefaultAction {
	type: REQUEST_HERO_AVATAR;
}

interface ReceiveHeroAvatarAction extends DefaultAction {
	type: RECEIVE_HERO_AVATAR;
	payload: {
		url: string;
	};
}

interface RequestHeroDataAction extends DefaultAction {
	type: REQUEST_HERO_DATA;
}

interface ReceiveHeroDataAction extends DefaultAction {
	type: RECEIVE_HERO_DATA;
	payload: {
		data: Hero & HeroRest;
	};
}

interface RequestHerolistAction extends DefaultAction {
	type: REQUEST_HEROLIST;
}

interface ReceiveHerolistAction extends DefaultAction {
	type: RECEIVE_HEROLIST;
	payload: {
		heroes: RawHerolist;
	};
}

interface RequestLoginAction extends DefaultAction {
	type: REQUEST_LOGIN;
}

interface ReceiveLoginAction extends DefaultAction {
	type: RECEIVE_LOGIN;
	payload: {
		name: string;
		displayName: string;
		email: string;
		sessionToken: string;
		heroes: RawHerolist
	};
}

interface RequestLogoutAction extends DefaultAction {
	type: REQUEST_LOGOUT;
}

interface ReceiveLogoutAction extends DefaultAction {
	type: RECEIVE_LOGOUT;
}

interface RequestNewUsernameAction extends DefaultAction {
	type: REQUEST_NEW_USERNAME;
}

interface ReceiveNewUsernameAction extends DefaultAction {
	type: RECEIVE_NEW_USERNAME;
	payload: {
		name: string;
	}
}

interface RequestRegistrationAction extends DefaultAction {
	type: REQUEST_REGISTRATION;
}

interface ReceiveRegistrationAction extends DefaultAction {
	type: RECEIVE_REGISTRATION;
}

interface RequestUserDeletionAction extends DefaultAction {
	type: REQUEST_USER_DELETION;
}

interface ReceiveUserDeletionAction extends DefaultAction {
	type: RECEIVE_USER_DELETION;
}

interface RequestNewPasswordAction extends DefaultAction {
	type: REQUEST_NEW_PASSWORD;
}

interface ReceiveNewPasswordAction extends DefaultAction {
	type: RECEIVE_NEW_PASSWORD;
}

interface RequestNewDisplayNameAction extends DefaultAction {
	type: REQUEST_NEW_DISPLAY_NAME;
}

interface ReceiveNewDisplayNameAction extends DefaultAction {
	type: RECEIVE_NEW_DISPLAY_NAME;
	payload: {
		name: string;
	}
}

interface RequestPasswordResetAction extends DefaultAction {
	type: REQUEST_PASSWORD_RESET;
}

interface ReceivePasswordResetAction extends DefaultAction {
	type: RECEIVE_PASSWORD_RESET;
}

interface RequestUsernameAction extends DefaultAction {
	type: REQUEST_USERNAME;
}

interface ReceiveUsernameAction extends DefaultAction {
	type: RECEIVE_USERNAME;
}

interface RequestAccountActivationEmailAction extends DefaultAction {
	type: REQUEST_ACCOUNT_ACTIVATION_EMAIL;
}

interface ReceiveAccountActivationEmailAction extends DefaultAction {
	type: RECEIVE_ACCOUNT_ACTIVATION_EMAIL;
}

interface RequestHeroSaveAction extends DefaultAction {
	type: REQUEST_HERO_SAVE;
}

interface ReceiveHeroSaveAction extends DefaultAction {
	type: RECEIVE_HERO_SAVE;
}

interface RequestFailedAction extends DefaultAction {
	type: REQUEST_FAILED;
}

// SpecialAbilitiesActions

interface ActivateSpecialAbilityAction extends DefaultAction {
    type: ACTIVATE_SPECIALABILITY;
    payload: UndoExtendedActivateArgs;
}

interface DeactivateSpecialAbilityAction extends DefaultAction {
    type: DEACTIVATE_SPECIALABILITY;
    payload: UndoExtendedDeactivateArgs;
}

interface SetSpecialAbilityTierAction extends DefaultAction {
    type: SET_SPECIALABILITY_TIER;
    payload: {
        id: string;
        index: number;
        tier: number;
        cost: number;
    };
}

interface SetSpecialAbilitiesSortOrderAction extends DefaultAction {
    type: SET_SPECIALABILITIES_SORT_ORDER;
    payload: {
        sortOrder: string;
    };
}

// SpellsActions

interface ActivateSpellAction extends DefaultAction {
	type: ACTIVATE_SPELL;
	payload: {
		id: string;
	};
}

interface DeactivateSpellAction extends DefaultAction {
	type: DEACTIVATE_SPELL;
	payload: {
		id: string;
	};
}

interface AddSpellPointAction extends DefaultAction {
	type: ADD_SPELL_POINT;
	payload: {
		id: string;
	};
}

interface RemoveSpellPointAction extends DefaultAction {
	type: REMOVE_SPELL_POINT;
	payload: {
		id: string;
	};
}

interface SetSpellsSortOrderAction extends DefaultAction {
	type: SET_SPELLS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

// TalentsActions

interface AddTalentPointAction extends DefaultAction {
	type: ADD_TALENT_POINT;
	payload: {
		id: string;
	};
}

interface RemoveTalentPointAction extends DefaultAction {
	type: REMOVE_TALENT_POINT;
	payload: {
		id: string;
	};
}

interface SetTalentsSortOrderAction extends DefaultAction {
	type: SET_TALENTS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SwitchTalentRatingVisibilityAction extends DefaultAction {
	type: SWITCH_TALENT_RATING_VISIBILITY;
}
