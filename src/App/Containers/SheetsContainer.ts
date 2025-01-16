import { connect } from "react-redux"
import { join, Just } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import { requestPrintHeroToPDF } from "../Actions/PrintActions"
import * as SheetActions from "../Actions/SheetActions"
import { SpecialAbilityId } from "../Constants/Ids"
import { AppStateRecord } from "../Models/AppState"
import { HeroModel } from "../Models/Hero/HeroModel"
import { getAdvantagesForSheet, getAspectKnowledgesForSheet, getBlessedSpecialAbilitiesForSheet, getBlessedTraditionForSheet, getCombatSpecialAbilitiesForSheet, getDisadvantagesForSheet, getFatePointsModifier, getGeneralSpecialAbilitiesForSheet, getMagicalSpecialAbilitiesForSheet, getMagicalTraditionForSheet, getPropertyKnowledgesForSheet } from "../Selectors/activatableSelectors"
import { getAPObjectMap } from "../Selectors/adventurePointsSelectors"
import { getAttributesForSheet, getPrimaryBlessedAttributeForSheet, getPrimaryMagicalAttributeForSheet } from "../Selectors/attributeSelectors"
import { getCombatTechniquesForSheet } from "../Selectors/combatTechniquesSelectors"
import { getCulture } from "../Selectors/cultureSelectors"
import { getDerivedCharacteristics } from "../Selectors/derivedCharacteristicsSelectors"
import { getStartEl } from "../Selectors/elSelectors"
import { getAllItems, getArmors, getArmorZones, getMeleeWeapons, getRangedWeapons, getShieldsAndParryingWeapons, getTotalPrice, getTotalWeight } from "../Selectors/equipmentSelectors"
import { getBlessingsForSheet, getLiturgicalChantsForSheet } from "../Selectors/liturgicalChantsSelectors"
import { getPet } from "../Selectors/petsSelectors"
import { getCurrentFullProfessionName } from "../Selectors/professionSelectors"
import { getRace } from "../Selectors/raceSelectors"
import { getConditions, getSkillPages, getSkillsByGroup, getStates } from "../Selectors/sheetSelectors"
import { getAllSkills } from "../Selectors/skillsSelectors"
import { getCantripsForSheet, getSpellsForSheet } from "../Selectors/spellsSelectors"
import { getAvatar, getCurrentHeroName, getCurrentSex, getProfile, getPurse, getSpecialAbilities, getWikiBooks, getWikiSpecialAbilities } from "../Selectors/stateSelectors"
import {
  getSheetCheckAttributeValueVisibility,
  getSheetShowRules,
  getSheetUseParchment,
  getSheetZoomFactor
} from "../Selectors/uisettingsSelectors"
import { requestExportHeroAsRptok } from "../Utilities/MapToolExporter"
import { pipe } from "../Utilities/pipe"
import { mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils"
import { Sheets, SheetsDispatchProps, SheetsOwnProps, SheetsStateProps } from "../Views/Sheets/Sheets"

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
  culture: getCulture (state, ownProps),
  derivedCharacteristics: getDerivedCharacteristics (state, ownProps),
  disadvantagesActive: getDisadvantagesForSheet (state, ownProps),
  el: getStartEl (state),
  fatePointsModifier: getFatePointsModifier (state),
  generalsaActive: getGeneralSpecialAbilitiesForSheet (state, ownProps),
  meleeWeapons: getMeleeWeapons (state, ownProps),
  name: getCurrentHeroName (state),
  professionName: getCurrentFullProfessionName (state),
  profile: getProfile (state, ownProps),
  race: getRace (state, ownProps),
  rangedWeapons: getRangedWeapons (state),
  sex: getCurrentSex (state),
  shieldsAndParryingWeapons: getShieldsAndParryingWeapons (state),
  skills: getAllSkills (state),
  items: getAllItems (state),
  pet: getPet (state),
  useParchment: getSheetUseParchment (state),
  showRules: getSheetShowRules (state),
  zoomFactor: getSheetZoomFactor (state),
  purse: getPurse (state),
  totalPrice: getTotalPrice (state),
  totalWeight: getTotalWeight (state),
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
  blessings: getBlessingsForSheet (state),
  liturgicalChants: getLiturgicalChantsForSheet (state, ownProps),
  conditions: getConditions (state, ownProps),
  states: getStates (state, ownProps),
  books: getWikiBooks (state),
  skillGroupPages: getSkillPages (state),
  skillsByGroup: getSkillsByGroup (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch, ownProps: SheetsOwnProps) => ({
  switchAttributeValueVisibility () {
    dispatch (SheetActions.switchAttributeValueVisibility ())
  },
  switchUseParchment () {
    dispatch (SheetActions.switchUseParchment ())
  },
  switchShowRules () {
    dispatch (SheetActions.switchShowRules ())
  },
  setSheetZoomFactor (zoomFactor: number) {
    dispatch (SheetActions.setSheetZoomFactor (zoomFactor))
  },
  async printToPDF () {
    await dispatch (requestPrintHeroToPDF ())
  },
  async exportAsRptok () {
    await dispatch (requestExportHeroAsRptok (ownProps.hero))
  },
})

export const connectSheets =
  connect<SheetsStateProps, SheetsDispatchProps, SheetsOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const SheetsContainer = connectSheets (Sheets)
