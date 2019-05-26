import { connect } from "react-redux";
import { fmapF } from "../../Data/Functor";
import { join, Maybe, Nothing } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import * as ProfileActions from "../Actions/ProfileActions";
import { setGuildMageUnfamiliarSpellId } from "../Actions/SpecialAbilitiesActions";
import * as SubwindowsActions from "../Actions/SubwindowsActions";
import { HeroModel } from "../Models/Hero/HeroModel";
import { InputTextEvent } from "../Models/Hero/heroTypeHelpers";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAdvantagesForSheet, getDisadvantagesForSheet, getGuildMageUnfamiliarSpellId, isAlbino } from "../Selectors/activatableSelectors";
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors";
import { getStartEl } from "../Selectors/elSelectors";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getCurrentCulture, getCurrentFullProfessionName, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace, getCurrentRaceVariant } from "../Selectors/rcpSelectors";
import { getAllSpellsForManualGuildMageSelect } from "../Selectors/spellsSelectors";
import { getAvatar, getCurrentHeroName, getCustomProfessionName, getHeroLocale, getIsAddAdventurePointsOpen, getIsEditCharacterAvatarOpen, getPhase, getProfile, getSex, getTotalAdventurePoints } from "../Selectors/stateSelectors";
import { getIsEditingHeroAfterCreationPhaseEnabled } from "../Selectors/uisettingsSelectors";
import { PersonalDataDispatchProps, PersonalDataOwnProps, PersonalDataStateProps, PersonalDataView } from "../Views/Profile/PersonalData";

const mapStateToProps =
  (state: AppStateRecord, ownProps: PersonalDataOwnProps): PersonalDataStateProps => ({
    advantages: getAdvantagesForSheet (state, ownProps),
    apLeft: join (getAvailableAPMap (HeroModel.A.id (ownProps.hero)) (state, ownProps)),
    apTotal: getTotalAdventurePoints (state),
    avatar: getAvatar (state),
    culture: getCurrentCulture (state),
    currentEl: getStartEl (state),
    disadvantages: getDisadvantagesForSheet (state, ownProps),
    isRemovingEnabled: getIsRemovingEnabled (state),
    isEditingHeroAfterCreationPhaseEnabled: getIsEditingHeroAfterCreationPhaseEnabled (state),
    name: getCurrentHeroName (state),
    phase: getPhase (state),
    profession: getCurrentProfession (state),
    professionName: getCustomProfessionName (state),
    fullProfessionName: getCurrentFullProfessionName (state, ownProps),
    professionVariant: getCurrentProfessionVariant (state),
    profile: getProfile (state),
    race: getCurrentRace (state),
    raceVariant: getCurrentRaceVariant (state),
    sex: getSex (state),
    isAddAdventurePointsOpen: getIsAddAdventurePointsOpen (state),
    isEditCharacterAvatarOpen: getIsEditCharacterAvatarOpen (state),
    isAlbino: isAlbino (state),
    hero_locale: getHeroLocale (state, ownProps),
    mcurrent_guild_mage_spell: getGuildMageUnfamiliarSpellId (state),
    all_spells_select_options: getAllSpellsForManualGuildMageSelect (state, ownProps),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch): PersonalDataDispatchProps => ({
  setAvatar (path: string) {
    dispatch (ProfileActions.setHeroAvatar (path))
  },
  setHeroName (name: string) {
    dispatch (ProfileActions.setHeroName (name))
  },
  setCustomProfessionName (name: string) {
    dispatch (ProfileActions.setCustomProfessionName (name))
  },
  endCharacterCreation () {
    dispatch (ProfileActions.endHeroCreation ())
  },
  addAdventurePoints (ap: number) {
    dispatch (ProfileActions.addAdventurePoints (ap))
  },
  openAddAdventurePoints () {
    dispatch (SubwindowsActions.openAddAdventurePoints ())
  },
  closeAddAdventurePoints () {
    dispatch (SubwindowsActions.closeAddAdventurePoints ())
  },
  openEditCharacterAvatar () {
    dispatch (SubwindowsActions.openEditCharacterAvatar ())
  },
  closeEditCharacterAvatar () {
    dispatch (SubwindowsActions.closeEditCharacterAvatar ())
  },
  changeFamily (e: InputTextEvent) {
    dispatch (ProfileActions.setFamily (e.target.value as string))
  },
  changePlaceOfBirth (e: InputTextEvent) {
    dispatch (ProfileActions.setPlaceOfBirth (e.target.value as string))
  },
  changeDateOfBirth (e: InputTextEvent) {
    dispatch (ProfileActions.setDateOfBirth (e.target.value as string))
  },
  changeAge (e: InputTextEvent) {
    dispatch (ProfileActions.setAge (e.target.value as string))
  },
  changeHaircolor (mresult: Maybe<number>) {
    fmapF (mresult) (res => dispatch (ProfileActions.setHairColor (res)))
  },
  changeEyecolor (mresult: Maybe<number>) {
    fmapF (mresult) (res => dispatch (ProfileActions.setEyeColor (res)))
  },
  changeSize (e: InputTextEvent) {
    dispatch (ProfileActions.setSize (e.target.value as string) (Nothing))
  },
  changeWeight (e: InputTextEvent) {
    dispatch (ProfileActions.setWeight (e.target.value as string) (Nothing))
  },
  changeTitle (e: InputTextEvent) {
    dispatch (ProfileActions.setTitle (e.target.value as string))
  },
  changeSocialStatus (mresult: Maybe<number>) {
    fmapF (mresult) (res => dispatch (ProfileActions.setSocialStatus (res)))
  },
  changeCharacteristics (e: InputTextEvent) {
    dispatch (ProfileActions.setCharacteristics (e.target.value as string))
  },
  changeOtherInfo (e: InputTextEvent) {
    dispatch (ProfileActions.setOtherInfo (e.target.value as string))
  },
  changeCultureAreaKnowledge (e: InputTextEvent) {
    dispatch (ProfileActions.setCultureAreaKnowledge (e.target.value as string))
  },
  rerollHair () {
    dispatch (ProfileActions.rerollHairColor)
  },
  rerollEyes () {
    dispatch (ProfileActions.rerollEyeColor)
  },
  rerollSize () {
    dispatch (ProfileActions.rerollSize)
  },
  rerollWeight () {
    dispatch (ProfileActions.rerollWeight)
  },
  setGuildMageSpell (spellId: string) {
    dispatch (setGuildMageUnfamiliarSpellId (spellId))
  },
  setHeroLocale (locale: string) {
    dispatch (ProfileActions.setHeroLocale (locale))
  },
})

export const connectPersonalData =
  connect<PersonalDataStateProps, PersonalDataDispatchProps, PersonalDataOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const PersonalDataContainer = connectPersonalData (PersonalDataView)
