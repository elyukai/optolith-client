import { connect } from "react-redux";
import { join, Just } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import * as IOActions from "../Actions/IOActions";
import * as SheetActions from "../Actions/SheetActions";
import { HeroModel } from "../Models/Hero/HeroModel";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAdvantagesForSheet, getAspectKnowledgesForSheet, getBlessedSpecialAbilitiesForSheet, getBlessedTraditionForSheet, getCombatSpecialAbilitiesForSheet, getDisadvantagesForSheet, getFatePointsModifier, getGeneralSpecialAbilitiesForSheet, getMagicalSpecialAbilitiesForSheet, getMagicalTraditionForSheet, getPropertyKnowledgesForSheet } from "../Selectors/activatableSelectors";
import { getAPObjectMap } from "../Selectors/adventurePointsSelectors";
import { getAttributesForSheet, getPrimaryBlessedAttributeForSheet, getPrimaryMagicalAttributeForSheet } from "../Selectors/attributeSelectors";
import { getCombatTechniquesForSheet } from "../Selectors/combatTechniquesSelectors";
import { getDerivedCharacteristics } from "../Selectors/derivedCharacteristicsSelectors";
import { getStartEl } from "../Selectors/elSelectors";
import { getAllItems, getArmors, getArmorZones, getMeleeWeapons, getRangedWeapons, getShieldsAndParryingWeapons, getTotalPrice, getTotalWeight } from "../Selectors/equipmentSelectors";
import { getBlessingsForSheet, getLiturgicalChantsForSheet } from "../Selectors/liturgicalChantsSelectors";
import { getPet } from "../Selectors/petsSelectors";
import { getCurrentCulture, getCurrentFullProfessionName, getCurrentRace } from "../Selectors/rcpSelectors";
import { getConditions, getSkillPages, getSkillsByGroup, getStates } from "../Selectors/sheetSelectors";
import { getAllSkills } from "../Selectors/skillsSelectors";
import { getCantripsForSheet, getSpellsForSheet } from "../Selectors/spellsSelectors";
import { getAvatar, getCurrentHeroName, getProfile, getPurse, getSex, getSpecialAbilities, getWikiBooks, getWikiSpecialAbilities } from "../Selectors/stateSelectors";
import { getSheetCheckAttributeValueVisibility } from "../Selectors/uisettingsSelectors";
import { prefixSA } from "../Utilities/IDUtils";
import { pipe } from "../Utilities/pipe";
import { mapGetToMaybeSlice } from "../Utilities/SelectorsUtils";
import { Sheets, SheetsDispatchProps, SheetsOwnProps, SheetsStateProps } from "../Views/Sheets/Sheets";

const mapStateToProps = (state: AppStateRecord, ownProps: SheetsOwnProps): SheetsStateProps => ({
  advantagesActive: getAdvantagesForSheet (state, ownProps),
  ap: join (getAPObjectMap (HeroModel.A.id (ownProps.hero)) (state, ownProps)),
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
  languagesWikiEntry: mapGetToMaybeSlice (pipe (getWikiSpecialAbilities, Just))
                                         (prefixSA (29))
                                         (state),
  languagesStateEntry: mapGetToMaybeSlice (getSpecialAbilities)
                                          (prefixSA (29))
                                          (state),
  scriptsWikiEntry: mapGetToMaybeSlice (pipe (getWikiSpecialAbilities, Just))
                                       (prefixSA (27))
                                       (state),
  scriptsStateEntry: mapGetToMaybeSlice (getSpecialAbilities)
                                        (prefixSA (27))
                                        (state),
  cantrips: getCantripsForSheet (state, ownProps),
  magicalPrimary: getPrimaryMagicalAttributeForSheet (state),
  magicalSpecialAbilities: getMagicalSpecialAbilitiesForSheet (state, ownProps),
  magicalTradition: getMagicalTraditionForSheet (state),
  properties: getPropertyKnowledgesForSheet (state),
  spells: getSpellsForSheet (state, ownProps),
  aspects: getAspectKnowledgesForSheet (state),
  blessedPrimary: getPrimaryBlessedAttributeForSheet (state),
  blessedSpecialAbilities: getBlessedSpecialAbilitiesForSheet (state, ownProps),
  blessedTradition: getBlessedTraditionForSheet (state),
  blessings: getBlessingsForSheet (state, ownProps),
  liturgicalChants: getLiturgicalChantsForSheet (state, ownProps),
  conditions: getConditions (state, ownProps),
  states: getStates (state, ownProps),
  books: getWikiBooks (state),
  skillGroupPages: getSkillPages (state),
  skillsByGroup: getSkillsByGroup (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch, { l10n }: SheetsOwnProps) => ({
  switchAttributeValueVisibility () {
    dispatch (SheetActions.switchAttributeValueVisibility ())
  },
  printToPDF () {
    dispatch (IOActions.requestPrintHeroToPDF (l10n))
  },
})

export const connectSheets =
  connect<SheetsStateProps, SheetsDispatchProps, SheetsOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const SheetsContainer = connectSheets (Sheets)
