/// <reference path="../constants/ActionTypes.d.ts" />

type Action = AddAttributePointAction | RemoveAttributePointAction | AddLifePointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | SetCombatTechniquesSortOrderAction | SelectCultureAction | SetCulturesSortOrderAction | SetCulturesVisibilityFilterAction | SwitchCultureValueVisibilityAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | SwitchDisAdvRatingVisibilityAction | SetHerolistSortOrderAction | SetHerolistVisibilityFilterAction | CreateHeroAction | AddItemAction | RemoveItemAction | SetItemAction | SetItemsSortOrderAction | ActivateLiturgyAction | DeactivateLiturgyAction | AddLiturgyPointAction | RemoveLiturgyPointAction | SetLiturgiesSortOrderAction | SetSectionAction | SetTabAction | SelectProfessionAction | SetSelectionsAction | SetProfessionsSortOrderAction | SetProfessionsVisibilityFilterAction | SelectProfessionVariantAction | SetHeroAvatarAction | SetFamilyAction | SetPlaceOfBirthAction | SetDateOfBirthAction | SetAgeAction | SetHairColorAction | SetEyeColorAction | SetSizeAction | SetWeightAction | SetTitleAction | SetSocialStatusAction | SetCharacteristicsAction | SetOtherInfoAction | EndHeroCreationAction | AddAdventurePointsAction | SelectRaceAction | SetRacesSortOrderAction | SwitchRaceValueVisibilityAction | ReceiveDataTablesAction | RequestHeroAvatarAction | ReceiveHeroAvatarAction | RequestHeroDataAction | ReceiveHeroDataAction | RequestHerolistAction | ReceiveHerolistAction | RequestLoginAction | ReceiveLoginAction | RequestLogoutAction | ReceiveLogoutAction | RequestNewUsernameAction | ReceiveNewUsernameAction | RequestUserDeletionAction | ReceiveUserDeletionAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | SetSpecialAbilitiesSortOrderAction | ActivateSpellAction | DeactivateSpellAction | AddSpellPointAction | RemoveSpellPointAction | SetSpellsSortOrderAction | AddTalentPointAction | RemoveTalentPointAction | SetTalentsSortOrderAction | SwitchTalentRatingVisibilityAction;

// AttributesActions

interface AddAttributePointAction {
	type: ADD_ATTRIBUTE_POINT;
	payload: {
		id: string;
	};
}

interface RemoveAttributePointAction {
	type: REMOVE_ATTRIBUTE_POINT;
	payload: {
		id: string;
	};
}

interface AddLifePointAction {
	type: ADD_LIFE_POINT;
}

interface AddArcaneEnergyPointAction {
	type: ADD_ARCANE_ENERGY_POINT;
}

interface AddKarmaPointAction {
	type: ADD_KARMA_POINT;
}

// CombatTechniquesActions

interface AddCombatTechniquePointAction {
	type: ADD_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
	};
}

interface RemoveCombatTechniquePointAction {
	type: REMOVE_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
	};
}

interface SetCombatTechniquesSortOrderAction {
	type: SET_COMBATTECHNIQUES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

// CultureActions

interface SelectCultureAction {
	type: SELECT_CULTURE;
	payload: {
		id: string;
	};
}

interface SetCulturesSortOrderAction {
	type: SET_CULTURES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SetCulturesVisibilityFilterAction {
	type: SET_CULTURES_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

interface SwitchCultureValueVisibilityAction {
	type: SWITCH_CULTURE_VALUE_VISIBILITY;
}

// DisAdvActions

interface ActivateArgs {
    id: string;
    sel?: string | number;
    sel2?: string | number;
    input?: string;
    tier?: number
}

interface ActivateDisAdvAction {
    type: ACTIVATE_DISADV;
    payload: ActivateArgs;
}

interface DeactivateArgs {
    id: string;
    tier?: number;
    cost: number;
    sid?: number | string;
}

interface DeactivateDisAdvAction {
    type: DEACTIVATE_DISADV;
    payload: DeactivateArgs;
}

interface SetDisAdvTierAction {
    type: SET_DISADV_TIER;
    payload: {
        id: string;
        tier: number;
        cost: number;
        sid: number | string;
    };
}

interface SwitchDisAdvRatingVisibilityAction {
    type: SWITCH_DISADV_RATING_VISIBILITY;
    payload: {
        id: string;
    };
}

// HerolistActions

interface RawHerolist {
	[id: string]: RawHero;
}

interface SetHerolistSortOrderAction {
	type: SET_HEROLIST_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SetHerolistVisibilityFilterAction {
	type: SET_HEROLIST_VISIBILITY_FILTER;
	payload: {
		filterOption: string;
	};
}

interface CreateHeroAction {
	type: CREATE_HERO;
	payload: {
		name: string;
		sex: 'm' | 'f';
		el: string;
	};
}

// HistoryActions

// InventoryActions

interface AddItemAction {
	type: ADD_ITEM;
	payload: {
		data: Item;
	};
}

interface SetItemAction {
	type: SET_ITEM;
	payload: {
		id: string;
		data: Item;
	};
}

interface RemoveItemAction {
	type: REMOVE_ITEM;
	payload: {
		id: string;
	};
}

interface SetItemsSortOrderAction {
	type: SET_ITEMS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

// LiturgiesActions

interface ActivateLiturgyAction {
	type: ACTIVATE_LITURGY;
	payload: {
		id: string;
	};
}

interface DeactivateLiturgyAction {
	type: DEACTIVATE_LITURGY;
	payload: {
		id: string;
	};
}

interface AddLiturgyPointAction {
	type: ADD_LITURGY_POINT;
	payload: {
		id: string;
	};
}

interface RemoveLiturgyPointAction {
	type: REMOVE_LITURGY_POINT;
	payload: {
		id: string;
	};
}

interface SetLiturgiesSortOrderAction {
	type: SET_LITURGIES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

// LocationActions

interface SetSectionAction {
	type: SET_SECTION;
	payload: {
		section: 'main' | 'hero' | 'group';
		tab?: string;
	};
}

interface SetTabAction {
	type: SET_TAB;
	payload: {
		tab: string;
	};
}

// ProfessionActions

interface SelectProfessionAction {
	type: SELECT_PROFESSION;
	payload: {
		id: string;
	};
}

interface Selections {
	attrSel: string;
	useCulturePackage: boolean;
	lang: number;
	buyLiteracy: boolean;
	litc: number;
	cantrips: Set<string>;
	combattech: Set<string>;
	curses: Map<string, number>;
	langLitc: Map<string, number>;
	spec: [number | null, string];
}

interface SetSelectionsAction {
	type: ASSIGN_RCP_OPTIONS;
	payload: Selections;
}

interface SetProfessionsSortOrderAction {
	type: SET_PROFESSIONS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SetProfessionsVisibilityFilterAction {
	type: SET_PROFESSIONS_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

// ProfessionVariantActions

interface SelectProfessionVariantAction {
	type: SELECT_PROFESSION_VARIANT;
	payload: {
		id: string;
	};
}

// ProfileActions

interface SetHeroAvatarAction {
	type: SET_HERO_AVATAR;
	payload: {
		url: string;
	};
}

interface SetFamilyAction {
	type: SET_FAMILY;
	payload: {
		family: string;
	};
}

interface SetPlaceOfBirthAction {
	type: SET_PLACEOFBIRTH;
	payload: {
		placeofbirth: string;
	};
}

interface SetDateOfBirthAction {
	type: SET_DATEOFBIRTH;
	payload: {
		dateofbirth: string;
	};
}

interface SetAgeAction {
	type: SET_AGE;
	payload: {
		age: string;
	};
}

interface SetHairColorAction {
	type: SET_HAIRCOLOR;
	payload: {
		haircolor: number;
	};
}

interface SetEyeColorAction {
	type: SET_EYECOLOR;
	payload: {
		eyecolor: number;
	};
}

interface SetSizeAction {
	type: SET_SIZE;
	payload: {
		size: string;
	};
}

interface SetWeightAction {
	type: SET_WEIGHT;
	payload: {
		weight: string;
	};
}

interface SetTitleAction {
	type: SET_TITLE;
	payload: {
		title: string;
	};
}

interface SetSocialStatusAction {
	type: SET_SOCIALSTATUS;
	payload: {
		socialstatus: number;
	};
}

interface SetCharacteristicsAction {
	type: SET_CHARACTERISTICS;
	payload: {
		characteristics: string;
	};
}

interface SetOtherInfoAction {
	type: SET_OTHERINFO;
	payload: {
		otherinfo: string;
	};
}

interface EndHeroCreationAction {
	type: END_HERO_CREATION;
}

interface AddAdventurePointsAction {
	type: ADD_ADVENTURE_POINTS;
	payload: {
		amount: number;
	};
}

// RaceActions

interface SelectRaceAction {
	type: SELECT_RACE;
	payload: {
		id: string;
	};
}

interface SetRacesSortOrderAction {
	type: SET_RACES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SwitchRaceValueVisibilityAction {
	type: SWITCH_RACE_VALUE_VISIBILITY;
}

// ServerActions

interface ReceiveDataTablesAction {
	type: RECEIVE_DATA_TABLES;
	payload: {
		data: RawData;
	};
}

interface RequestHeroAvatarAction {
	type: REQUEST_HERO_AVATAR;
}

interface ReceiveHeroAvatarAction {
	type: RECEIVE_HERO_AVATAR;
	payload: {
		url: string;
	};
}

interface RequestHeroDataAction {
	type: REQUEST_HERO_DATA;
}

interface ReceiveHeroDataAction {
	type: RECEIVE_HERO_DATA;
	payload: {
		data: Hero & HeroRest;
	};
}

interface RequestHerolistAction {
	type: REQUEST_HEROLIST;
}

interface ReceiveHerolistAction {
	type: RECEIVE_HEROLIST;
	payload: {
		heroes: RawHerolist;
	};
}

interface RequestLoginAction {
	type: REQUEST_LOGIN;
}

interface ReceiveLoginAction {
	type: RECEIVE_LOGIN;
	payload: {
		name: string;
		displayName: string;
		email: string;
		sessionToken: string;
		heroes: RawHerolist
	};
}

interface RequestLogoutAction {
	type: REQUEST_LOGOUT;
}

interface ReceiveLogoutAction {
	type: RECEIVE_LOGOUT;
}

interface RequestNewUsernameAction {
	type: REQUEST_LOGOUT;
}

interface ReceiveNewUsernameAction {
	type: RECEIVE_NEW_USERNAME;
	payload: {
		name: string;
	}
}

interface RequestUserDeletionAction {
	type: REQUEST_USER_DELETION;
}

interface ReceiveUserDeletionAction {
	type: RECEIVE_USER_DELETION;
}

// SpecialAbilitiesActions

interface ActivateSpecialAbilityAction {
    type: ACTIVATE_SPECIALABILITY;
    payload: ActivateArgs;
}

interface DeactivateSpecialAbilityAction {
    type: DEACTIVATE_SPECIALABILITY;
    payload: DeactivateArgs;
}

interface SetSpecialAbilityTierAction {
    type: SET_SPECIALABILITY_TIER;
    payload: {
        id: string;
        tier: number;
        cost: number;
        sid: number | string;
    };
}

interface SetSpecialAbilitiesSortOrderAction {
    type: SET_SPECIALABILITIES_SORT_ORDER;
    payload: {
        sortOrder: string;
    };
}

// SpellsActions

interface ActivateSpellAction {
	type: ACTIVATE_SPELL;
	payload: {
		id: string;
	};
}

interface DeactivateSpellAction {
	type: DEACTIVATE_SPELL;
	payload: {
		id: string;
	};
}

interface AddSpellPointAction {
	type: ADD_SPELL_POINT;
	payload: {
		id: string;
	};
}

interface RemoveSpellPointAction {
	type: REMOVE_SPELL_POINT;
	payload: {
		id: string;
	};
}

interface SetSpellsSortOrderAction {
	type: SET_SPELLS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

// TalentsActions

interface AddTalentPointAction {
	type: ADD_TALENT_POINT;
	payload: {
		id: string;
	};
}

interface RemoveTalentPointAction {
	type: REMOVE_TALENT_POINT;
	payload: {
		id: string;
	};
}

interface SetTalentsSortOrderAction {
	type: SET_TALENTS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

interface SwitchTalentRatingVisibilityAction {
	type: SWITCH_TALENT_RATING_VISIBILITY;
}
