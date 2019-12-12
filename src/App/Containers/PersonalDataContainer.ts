import { connect } from "react-redux";
import { fmapF } from "../../Data/Functor";
import { join, Maybe, Nothing } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import * as ProfileActions from "../Actions/ProfileActions";
import * as SubwindowsActions from "../Actions/SubwindowsActions";
import { SocialStatusId } from "../Constants/Ids";
import { HeroModel } from "../Models/Hero/HeroModel";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAdvantagesForSheet, getDisadvantagesForSheet } from "../Selectors/activatableSelectors";
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors";
import { getStartEl } from "../Selectors/elSelectors";
import { getAvailableEyeColorOptions, getAvailableHairColorOptions, getAvailableSocialStatuses } from "../Selectors/personalDataSelectors";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getCurrentCulture, getCurrentFullProfessionName, getCurrentProfession, getCurrentRaceVariant, getRace, getRandomSizeCalcStr, getRandomWeightCalcStr } from "../Selectors/rcpSelectors";
import { getAvatar, getCurrentHeroName, getCurrentPhase, getCustomProfessionName, getIsAddAdventurePointsOpen, getIsEditCharacterAvatarOpen, getProfile, getSex, getTotalAdventurePoints } from "../Selectors/stateSelectors";
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
    name: getCurrentHeroName (state),
    phase: getCurrentPhase (state),
    profession: getCurrentProfession (state),
    professionName: getCustomProfessionName (state),
    fullProfessionName: getCurrentFullProfessionName (state, ownProps),
    profile: getProfile (state),
    race: getRace (state, ownProps),
    raceVariant: getCurrentRaceVariant (state),
    sex: getSex (state),
    socialStatuses: getAvailableSocialStatuses (state, ownProps),
    isAddAdventurePointsOpen: getIsAddAdventurePointsOpen (state),
    isEditCharacterAvatarOpen: getIsEditCharacterAvatarOpen (state),
    sizeCalcStr: getRandomSizeCalcStr (state, ownProps),
    weightCalcStr: getRandomWeightCalcStr (state, ownProps),
    hairColors: getAvailableHairColorOptions (state, ownProps),
    eyeColors: getAvailableEyeColorOptions (state, ownProps),
  })

const mapDispatchToProps =
  (dispatch: ReduxDispatch, ownProps: PersonalDataOwnProps): PersonalDataDispatchProps => ({
    setAvatar (path: string) {
      dispatch (ProfileActions.setHeroAvatar (path))
    },
    deleteAvatar () {
      dispatch (ProfileActions.deleteHeroAvatar ())
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
    changeFamily (newText: string) {
      dispatch (ProfileActions.setFamily (newText))
    },
    changePlaceOfBirth (newText: string) {
      dispatch (ProfileActions.setPlaceOfBirth (newText))
    },
    changeDateOfBirth (newText: string) {
      dispatch (ProfileActions.setDateOfBirth (newText))
    },
    changeAge (newText: string) {
      dispatch (ProfileActions.setAge (newText))
    },
    changeHaircolor (mresult: Maybe<number>) {
      fmapF (mresult) (res => dispatch (ProfileActions.setHairColor (res)))
    },
    changeEyecolor (mresult: Maybe<number>) {
      fmapF (mresult) (res => dispatch (ProfileActions.setEyeColor (res)))
    },
    changeSize (newText: string) {
      dispatch (ProfileActions.setSize (newText) (Nothing))
    },
    changeWeight (newText: string) {
      dispatch (ProfileActions.setWeight (newText) (Nothing))
    },
    changeTitle (newText: string) {
      dispatch (ProfileActions.setTitle (newText))
    },
    changeSocialStatus (mresult: Maybe<SocialStatusId>) {
      fmapF (mresult) (res => dispatch (ProfileActions.setSocialStatus (res)))
    },
    changeCharacteristics (newText: string) {
      dispatch (ProfileActions.setCharacteristics (newText))
    },
    changeOtherInfo (newText: string) {
      dispatch (ProfileActions.setOtherInfo (newText))
    },
    changeCultureAreaKnowledge (newText: string) {
      dispatch (ProfileActions.setCultureAreaKnowledge (newText))
    },
    rerollHair () {
      dispatch (ProfileActions.rerollHairColor (ownProps .hero))
    },
    rerollEyes () {
      dispatch (ProfileActions.rerollEyeColor (ownProps .hero))
    },
    rerollSize () {
      dispatch (ProfileActions.rerollSize)
    },
    rerollWeight () {
      dispatch (ProfileActions.rerollWeight)
    },
  })

export const connectPersonalData =
  connect<PersonalDataStateProps, PersonalDataDispatchProps, PersonalDataOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const PersonalDataContainer = connectPersonalData (PersonalDataView)
