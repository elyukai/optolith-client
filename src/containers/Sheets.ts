import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as SheetActions from '../actions/SheetActions';
import { AppState } from '../reducers/app';
import { getAdvantagesForSheet, getAspectKnowledgesForSheet, getBlessedSpecialAbilitiesForSheet, getBlessedTraditionForSheet, getCombatSpecialAbilitiesForSheet, getDisadvantagesForSheet, getFatePointsModifier, getGeneralSpecialAbilitiesForSheet, getMagicalSpecialAbilitiesForSheet, getMagicalTraditionForSheet, getPropertyKnowledgesForSheet } from '../selectors/activatableSelectors';
import { getAp } from '../selectors/adventurePointsSelectors';
import { getForSheet as getAttributesForSheet, getPrimaryBlessedAttributeForSheet, getPrimaryMagicalAttributeForSheet } from '../selectors/attributeSelectors';
import { getForSheet as getCombatTechniquesForSheet } from '../selectors/combatTechniquesSelectors';
import { getElState, getStart } from '../selectors/elSelectors';
import { getAllItems, getArmors, getArmorZones, getMeleeWeapons, getPurse, getRangedWeapons, getShieldsAndParryingWeapons, getTotalPrice, getTotalWeight } from '../selectors/equipmentSelectors';
import { getBlessingsForSheet, getLiturgiesForSheet } from '../selectors/liturgiesSelectors';
import { getPet } from '../selectors/petsSelectors';
import { getProfile } from '../selectors/profileSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from '../selectors/rcpSelectors';
import { getCantripsForSheet, getSpellsForSheet } from '../selectors/spellsSelectors';
import { getSpecialAbilities } from '../selectors/stateSelectors';
import { getTalents } from '../selectors/talentsSelectors';
import { getSheetCheckAttributeValueVisibility } from '../selectors/uisettingsSelectors';
import { getDerivedCharacteristics } from '../utils/derivedCharacteristics';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { Sheets, SheetsDispatchProps, SheetsOwnProps, SheetsStateProps } from '../views/profile/Sheets';

function mapStateToProps(state: AppState) {
	return {
		advantagesActive: getAdvantagesForSheet(state),
		ap: getAp(state),
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
		rangedWeapons: getRangedWeapons(state),
		profession: getCurrentProfession(state),
		professionVariant: getCurrentProfessionVariant(state),
		profile: getProfile(state),
		race: getCurrentRace(state),
		shieldsAndParryingWeapons: getShieldsAndParryingWeapons(state),
		talents: [...getTalents(state).values()],
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
			dispatch(SheetActions._switchAttributeValueVisibility());
		}
	};
}

export const SheetsContainer = connect<SheetsStateProps, SheetsDispatchProps, SheetsOwnProps>(mapStateToProps, mapDispatchToProps)(Sheets);
