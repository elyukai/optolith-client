import { connect } from "react-redux";
import { join, Just } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import * as IOActions from "../Actions/IOActions";
import * as SheetActions from "../Actions/SheetActions";
import { SpecialAbilityId } from "../Constants/Ids";
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
import { getCurrentCulture, getCurrentFullProfessionName, getRace } from "../Selectors/rcpSelectors";
import { getConditions, getSkillPages, getSkillsByGroup, getStates } from "../Selectors/sheetSelectors";
import { getAllSkills } from "../Selectors/skillsSelectors";
import { getCantripsForSheet, getSpellsForSheet } from "../Selectors/spellsSelectors";
import { getAvatar, getCurrentHeroName, getProfile, getPurse, getSex, getSpecialAbilities, getWikiBooks, getWikiSpecialAbilities } from "../Selectors/stateSelectors";
import { getSheetCheckAttributeValueVisibility } from "../Selectors/uisettingsSelectors";
import { pipe } from "../Utilities/pipe";
import { mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils";
import { Sheets, SheetsDispatchProps, SheetsOwnProps, SheetsStateProps } from "../Views/Sheets/Sheets";

const mapStateToProps = (state: AppStateRecord, ownProps: SheetsOwnProps): SheetsStateProps => ({
  advantagesActive: getAdvantagesForSheet (state, ownProps),
  ap: join (getAPObjectMap (HeroModel.A.id (ownProps.hero)) (state, ownProps)),
  armors: getArmors (state),
  armorZones: getArmorZones (state),
  attributes: getAttributesForSheet (state, ownProps),
  avatar: getAvatar (state),
  checkAttributeValueVisibility: getSheetCheckAttributeValueVisibility (state),
  combatSpecialAbilities: getCombatSpecialAbilitiesForSheet (state, ownProps),
  combatTechniques: getCombatTechniquesForSheet (state, ownProps),
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
  race: getRace (state, ownProps),
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
                                         (SpecialAbilityId.Language)
                                         (state),
  languagesStateEntry: mapGetToSlice (getSpecialAbilities)
                                     (SpecialAbilityId.Language)
                                     (state, ownProps),
  scriptsWikiEntry: mapGetToMaybeSlice (pipe (getWikiSpecialAbilities, Just))
                                       (SpecialAbilityId.Literacy)
                                       (state),
  scriptsStateEntry: mapGetToSlice (getSpecialAbilities)
                                   (SpecialAbilityId.Literacy)
                                   (state, ownProps),
  cantrips: getCantripsForSheet (state, ownProps),
  magicalPrimary: getPrimaryMagicalAttributeForSheet (state, ownProps),
  magicalSpecialAbilities: getMagicalSpecialAbilitiesForSheet (state, ownProps),
  magicalTradition: getMagicalTraditionForSheet (state, ownProps),
  properties: getPropertyKnowledgesForSheet (state, ownProps),
  spells: getSpellsForSheet (state, ownProps),
  aspects: getAspectKnowledgesForSheet (state, ownProps),
  blessedPrimary: getPrimaryBlessedAttributeForSheet (state, ownProps),
  blessedSpecialAbilities: getBlessedSpecialAbilitiesForSheet (state, ownProps),
  blessedTradition: getBlessedTraditionForSheet (state, ownProps),
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
