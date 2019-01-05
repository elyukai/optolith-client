import * as R from 'ramda';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as IOActions from '../actions/IOActions';
import * as SheetActions from '../actions/SheetActions';
import { mapGetToMaybeSlice } from '../App/Utils/SelectorsUtils';
import { AppState } from '../reducers/appReducer';
import { getAdvantagesForSheet, getAspectKnowledgesForSheet, getBlessedSpecialAbilitiesForSheet, getBlessedTraditionForSheet, getCombatSpecialAbilitiesForSheet, getDisadvantagesForSheet, getFatePointsModifier, getGeneralSpecialAbilitiesForSheet, getMagicalSpecialAbilitiesForSheet, getMagicalTraditionForSheet, getPropertyKnowledgesForSheet } from '../selectors/activatableSelectors';
import { getAdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { getAttributesForSheet, getPrimaryBlessedAttributeForSheet, getPrimaryMagicalAttributeForSheet } from '../selectors/attributeSelectors';
import { getCombatTechniquesForSheet } from '../selectors/combatTechniquesSelectors';
import { getDerivedCharacteristics } from '../selectors/derivedCharacteristicsSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { getAllItems, getArmors, getArmorZones, getMeleeWeapons, getRangedWeapons, getShieldsAndParryingWeapons, getTotalPrice, getTotalWeight } from '../selectors/equipmentSelectors';
import { getBlessingsForSheet, getLiturgicalChantsForSheet } from '../selectors/liturgicalChantsSelectors';
import { getPet } from '../selectors/petsSelectors';
import { getCurrentCulture, getCurrentFullProfessionName, getCurrentRace } from '../selectors/rcpSelectors';
import { getAllSkills } from '../selectors/skillsSelectors';
import { getCantripsForSheet, getSpellsForSheet } from '../selectors/spellsSelectors';
import { getAvatar, getCurrentHeroName, getProfile, getPurse, getSex, getSpecialAbilities, getWikiSpecialAbilities } from '../selectors/stateSelectors';
import { getSheetCheckAttributeValueVisibility } from '../selectors/uisettingsSelectors';
import { Just } from '../utils/dataUtils';
import { Sheets, SheetsDispatchProps, SheetsOwnProps, SheetsStateProps } from '../views/sheets/Sheets';

const mapStateToProps = (state: AppState, ownProps: SheetsOwnProps): SheetsStateProps => ({
  advantagesActive: getAdvantagesForSheet (state, ownProps),
  ap: getAdventurePointsObject (state, ownProps),
  armors: getArmors (state),
  armorZones: getArmorZones (state),
  attributes: getAttributesForSheet (state),
  avatar: getAvatar (state),
  checkAttributeValueVisibility: getSheetCheckAttributeValueVisibility (state),
  combatSpecialAbilities: getCombatSpecialAbilitiesForSheet (state, ownProps),
  combatTechniques: getCombatTechniquesForSheet (state),
  culture: getCurrentCulture (state),
  derivedCharacteristics: getDerivedCharacteristics (state, ownProps),
  disadvantagesActive: getDisadvantagesForSheet (state, ownProps),
  el: getStartEl (state),
  fatePointsModifier: getFatePointsModifier (state),
  generalsaActive: getGeneralSpecialAbilitiesForSheet (state, ownProps),
  meleeWeapons: getMeleeWeapons (state),
  name: getCurrentHeroName (state),
  professionName: getCurrentFullProfessionName (state, ownProps),
  // profession: getCurrentProfession (state),
  // professionVariant: getCurrentProfessionVariant (state),
  profile: getProfile (state),
  race: getCurrentRace (state),
  rangedWeapons: getRangedWeapons (state),
  sex: getSex (state),
  shieldsAndParryingWeapons: getShieldsAndParryingWeapons (state),
  skills: getAllSkills (state),
  items: getAllItems (state, ownProps),
  pet: getPet (state),
  purse: getPurse (state),
  totalPrice: getTotalPrice (state, ownProps),
  totalWeight: getTotalWeight (state, ownProps),
  languagesWikiEntry: mapGetToMaybeSlice (R.pipe (getWikiSpecialAbilities, Just), 'SA_29') (state),
  languagesStateEntry: mapGetToMaybeSlice (getSpecialAbilities, 'SA_29') (state),
  scriptsWikiEntry: mapGetToMaybeSlice (R.pipe (getWikiSpecialAbilities, Just), 'SA_27') (state),
  scriptsStateEntry: mapGetToMaybeSlice (getSpecialAbilities, 'SA_27') (state),
  cantrips: getCantripsForSheet (state),
  magicalPrimary: getPrimaryMagicalAttributeForSheet (state),
  magicalSpecialAbilities: getMagicalSpecialAbilitiesForSheet (state, ownProps),
  magicalTradition: getMagicalTraditionForSheet (state),
  properties: getPropertyKnowledgesForSheet (state),
  spells: getSpellsForSheet (state, ownProps),
  aspects: getAspectKnowledgesForSheet (state),
  blessedPrimary: getPrimaryBlessedAttributeForSheet (state),
  blessedSpecialAbilities: getBlessedSpecialAbilitiesForSheet (state, ownProps),
  blessedTradition: getBlessedTraditionForSheet (state),
  blessings: getBlessingsForSheet (state),
  liturgicalChants: getLiturgicalChantsForSheet (state, ownProps),
});

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>, { locale }: SheetsOwnProps) => ({
  switchAttributeValueVisibility () {
    dispatch (SheetActions.switchAttributeValueVisibility ());
  },
  printToPDF () {
    dispatch (IOActions.requestPrintHeroToPDF (locale));
  },
});

export const connectSheets =
  connect<SheetsStateProps, SheetsDispatchProps, SheetsOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const SheetsContainer = connectSheets (Sheets);
