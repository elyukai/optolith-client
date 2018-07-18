import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as IOActions from '../actions/IOActions';
import * as SheetActions from '../actions/SheetActions';
import { AppState } from '../reducers/app';
import { getAdvantagesForSheet, getAspectKnowledgesForSheet, getBlessedSpecialAbilitiesForSheet, getBlessedTraditionForSheet, getCombatSpecialAbilitiesForSheet, getDisadvantagesForSheet, getFatePointsModifier, getGeneralSpecialAbilitiesForSheet, getMagicalSpecialAbilitiesForSheet, getMagicalTraditionForSheet, getPropertyKnowledgesForSheet } from '../selectors/activatableSelectors';
import { getAdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { getForSheet as getAttributesForSheet, getPrimaryBlessedAttributeForSheet, getPrimaryMagicalAttributeForSheet } from '../selectors/attributeSelectors';
import { getForSheet as getCombatTechniquesForSheet } from '../selectors/combatTechniquesSelectors';
import { getDerivedCharacteristics } from '../selectors/derivedCharacteristicsSelectors';
import { getStart } from '../selectors/elSelectors';
import { getAllItems, getArmors, getArmorZones, getMeleeWeapons, getPurse, getRangedWeapons, getShieldsAndParryingWeapons, getTotalPrice, getTotalWeight } from '../selectors/equipmentSelectors';
import { getBlessingsForSheet, getLiturgiesForSheet } from '../selectors/liturgiesSelectors';
import { getPet } from '../selectors/petsSelectors';
import { getProfile } from '../selectors/profileSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from '../selectors/rcpSelectors';
import { getCantripsForSheet, getSpellsForSheet } from '../selectors/spellsSelectors';
import { getElState, getSpecialAbilities } from '../selectors/stateSelectors';
import { getAllSkills } from '../selectors/talentsSelectors';
import { getSheetCheckAttributeValueVisibility } from '../selectors/uisettingsSelectors';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { Sheets, SheetsDispatchProps, SheetsOwnProps, SheetsStateProps } from '../views/profile/Sheets';

function mapStateToProps(state: AppState) {
	return {
		advantagesActive: getAdvantagesForSheet(state),
		ap: getAdventurePointsObject(state),
		armors: getArmors(state),
		armorZones: getArmorZones(state),
		attributes: getAttributesForSheet(state),
		checkAttributeValueVisibility: getSheetCheckAttributeValueVisibility(state),
		combatSpecialAbilities: getCombatSpecialAbilitiesForSheet(state),
		combatTechniques: getCombatTechniquesForSheet(state),
		culture: getCurrentCulture(state),
		derivedCharacteristics: getDerivedCharacteristics(state),
		disadvantagesActive: getDisadvantagesForSheet(state),
		el: getStart(getElState(state)),
		fatePointsModifier: getFatePointsModifier(state),
		generalsaActive: getGeneralSpecialAbilitiesForSheet(state),
		meleeWeapons: getMeleeWeapons(state),
		profession: getCurrentProfession(state),
		professionVariant: getCurrentProfessionVariant(state),
		profile: getProfile(state),
		race: getCurrentRace(state),
		rangedWeapons: getRangedWeapons(state),
		shieldsAndParryingWeapons: getShieldsAndParryingWeapons(state),
		talents: getAllSkills(state),
		items: getAllItems(state),
		pet: getPet(state),
		purse: getPurse(state),
		totalPrice: getTotalPrice(state),
		totalWeight: getTotalWeight(state),
		languagesInstance: mapGetToSlice(getSpecialAbilities, 'SA_29')(state)!,
		scriptsInstance: mapGetToSlice(getSpecialAbilities, 'SA_27')(state)!,
		cantrips: getCantripsForSheet(state),
		magicalPrimary: getPrimaryMagicalAttributeForSheet(state),
		magicalSpecialAbilities: getMagicalSpecialAbilitiesForSheet(state),
		magicalTradition: getMagicalTraditionForSheet(state),
		properties: getPropertyKnowledgesForSheet(state),
		spells: getSpellsForSheet(state),
		aspects: getAspectKnowledgesForSheet(state),
		blessedPrimary: getPrimaryBlessedAttributeForSheet(state),
		blessedSpecialAbilities: getBlessedSpecialAbilitiesForSheet(state),
		blessedTradition: getBlessedTraditionForSheet(state),
		blessings: getBlessingsForSheet(state),
		liturgies: getLiturgiesForSheet(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		switchAttributeValueVisibility() {
			dispatch<any>(SheetActions._switchAttributeValueVisibility());
		},
		printToPDF() {
			dispatch<any>(IOActions.requestPrintHeroToPDF());
		}
	};
}

export const SheetsContainer = connect<SheetsStateProps, SheetsDispatchProps, SheetsOwnProps>(mapStateToProps, mapDispatchToProps)(Sheets);
