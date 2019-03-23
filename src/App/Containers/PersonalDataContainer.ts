import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ProfileActions from '../App/Actions/ProfileActions';
import * as SubwindowsActions from '../App/Actions/SubwindowsActions';
import { InputTextEvent } from '../App/Models/Hero/heroTypeHelpers';
import { AppState } from '../reducers/appReducer';
import { getAdvantagesForSheet, getDisadvantagesForSheet, isAlbino } from '../Selectors/activatableSelectors';
import { getAvailableAdventurePoints } from '../Selectors/adventurePointsSelectors';
import { getStartEl } from '../Selectors/elSelectors';
import { getIsRemovingEnabled } from '../Selectors/phaseSelectors';
import { getCurrentCulture, getCurrentFullProfessionName, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace, getCurrentRaceVariant } from '../Selectors/rcpSelectors';
import { getAvatar, getCurrentHeroName, getCustomProfessionName, getIsAddAdventurePointsOpen, getIsEditCharacterAvatarOpen, getPhase, getProfile, getSex, getTotalAdventurePoints } from '../Selectors/stateSelectors';
import { getIsEditingHeroAfterCreationPhaseEnabled } from '../Selectors/uisettingsSelectors';
import { Maybe, Nothing } from '../Utilities/dataUtils';
import { PersonalData, PersonalDataDispatchProps, PersonalDataOwnProps, PersonalDataStateProps } from '../Views/Profile/PersonalData';

const mapStateToProps = (state: AppState, ownProps: PersonalDataOwnProps) => ({
  advantages: getAdvantagesForSheet (state, ownProps),
  apLeft: getAvailableAdventurePoints (state, ownProps),
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
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setAvatar (path: string) {
    dispatch (ProfileActions.setHeroAvatar (path));
  },
  setHeroName (name: string) {
    dispatch (ProfileActions.setHeroName (name));
  },
  setCustomProfessionName (name: string) {
    dispatch (ProfileActions.setCustomProfessionName (name));
  },
  endCharacterCreation () {
    dispatch (ProfileActions.endHeroCreation ());
  },
  addAdventurePoints (ap: number) {
    dispatch (ProfileActions.addAdventurePoints (ap));
  },
  openAddAdventurePoints () {
    dispatch (SubwindowsActions.openAddAdventurePoints ());
  },
  closeAddAdventurePoints () {
    dispatch (SubwindowsActions.closeAddAdventurePoints ());
  },
  openEditCharacterAvatar () {
    dispatch (SubwindowsActions.openEditCharacterAvatar ());
  },
  closeEditCharacterAvatar () {
    dispatch (SubwindowsActions.closeEditCharacterAvatar ());
  },
  changeFamily (e: InputTextEvent) {
    dispatch (ProfileActions.setFamily (e.target.value as string));
  },
  changePlaceOfBirth (e: InputTextEvent) {
    dispatch (ProfileActions.setPlaceOfBirth (e.target.value as string));
  },
  changeDateOfBirth (e: InputTextEvent) {
    dispatch (ProfileActions.setDateOfBirth (e.target.value as string));
  },
  changeAge (e: InputTextEvent) {
    dispatch (ProfileActions.setAge (e.target.value as string));
  },
  changeHaircolor (result: Maybe<number>) {
    if (Maybe.isJust (result)) {
      dispatch (ProfileActions.setHairColor (Maybe.fromJust (result)));
    }
  },
  changeEyecolor (result: Maybe<number>) {
    if (Maybe.isJust (result)) {
      dispatch (ProfileActions.setEyeColor (Maybe.fromJust (result)));
    }
  },
  changeSize (e: InputTextEvent) {
    dispatch (ProfileActions.setSize (e.target.value as string) (Nothing ()));
  },
  changeWeight (e: InputTextEvent) {
    dispatch (ProfileActions.setWeight (e.target.value as string) (Nothing ()));
  },
  changeTitle (e: InputTextEvent) {
    dispatch (ProfileActions.setTitle (e.target.value as string));
  },
  changeSocialStatus (result: Maybe<number>) {
    if (Maybe.isJust (result)) {
      dispatch (ProfileActions.setSocialStatus (Maybe.fromJust (result)));
    }
  },
  changeCharacteristics (e: InputTextEvent) {
    dispatch (ProfileActions.setCharacteristics (e.target.value as string));
  },
  changeOtherInfo (e: InputTextEvent) {
    dispatch (ProfileActions.setOtherInfo (e.target.value as string));
  },
  changeCultureAreaKnowledge (e: InputTextEvent) {
    dispatch (ProfileActions.setCultureAreaKnowledge (e.target.value as string));
  },
  rerollHair () {
    const action = ProfileActions.rerollHairColor ();

    if (action) {
      (dispatch as Dispatch<Action, AppState>) (action);
    }
  },
  rerollEyes () {
    const action = ProfileActions.rerollEyeColor ();

    if (action) {
      (dispatch as Dispatch<Action, AppState>) (action);
    }
  },
  rerollSize () {
    const action = ProfileActions.rerollSize ();

    if (action) {
      (dispatch as Dispatch<Action, AppState>) (action);
    }
  },
  rerollWeight () {
    const action = ProfileActions.rerollWeight ();

    if (action) {
      (dispatch as Dispatch<Action, AppState>) (action);
    }
  },
});

export const connectPersonalData =
  connect<PersonalDataStateProps, PersonalDataDispatchProps, PersonalDataOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const PersonalDataContainer = connectPersonalData (PersonalData);
