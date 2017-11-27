import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as ProfileActions from '../actions/ProfileActions';
import { AppState } from '../reducers/app';
import { getAdvantagesForSheet, getDisadvantagesForSheet } from '../selectors/activatableSelectors';
import { getAvailable, getTotal } from '../selectors/adventurePointsSelectors';
import { getCurrentEl } from '../selectors/elSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getProfile } from '../selectors/profileSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace, getCurrentRaceVariant } from '../selectors/rcpSelectors';
import { getPhase } from '../selectors/stateSelectors';
import { isEditingHeroAfterCreationPhaseEnabled } from '../selectors/uisettingsSelectors';
import { InputTextEvent } from '../types/data.d';
import { PersonalData, PersonalDataDispatchProps, PersonalDataOwnProps, PersonalDataStateProps } from '../views/profile/Overview';

function mapStateToProps(state: AppState) {
	return {
		advantages: getAdvantagesForSheet(state),
		apLeft: getAvailable(state),
		apTotal: getTotal(state),
		culture: getCurrentCulture(state),
		currentEl: getCurrentEl(state),
		disadvantages: getDisadvantagesForSheet(state),
		isRemovingEnabled: isRemovingEnabled(state),
		isEditingHeroAfterCreationPhaseEnabled: isEditingHeroAfterCreationPhaseEnabled(state),
		phase: getPhase(state),
		profession: getCurrentProfession(state),
		professionVariant: getCurrentProfessionVariant(state),
		profile: getProfile(state),
		race: getCurrentRace(state),
		raceVariant: getCurrentRaceVariant(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		loadHero(id?: string) {
			if (id) {
				dispatch(HerolistActions.loadHeroValidate(id));
			}
		},
		setAvatar(path: string) {
			dispatch(ProfileActions._setHeroAvatar(path));
		},
		setHeroName(name: string) {
			dispatch(ProfileActions._setHeroName(name));
		},
		setCustomProfessionName(name: string) {
			dispatch(ProfileActions._setCustomProfessionName(name));
		},
		endCharacterCreation() {
			dispatch(ProfileActions._endHeroCreation());
		},
		addAdventurePoints(ap: number) {
			dispatch(ProfileActions._addAdventurePoints(ap));
		},
		changeFamily(e: InputTextEvent) {
			dispatch(ProfileActions._setFamily(e.target.value as string));
		},
		changePlaceOfBirth(e: InputTextEvent) {
			dispatch(ProfileActions._setPlaceOfBirth(e.target.value as string));
		},
		changeDateOfBirth(e: InputTextEvent) {
			dispatch(ProfileActions._setDateOfBirth(e.target.value as string));
		},
		changeAge(e: InputTextEvent) {
			dispatch(ProfileActions._setAge(e.target.value as string));
		},
		changeHaircolor(result: number) {
			dispatch(ProfileActions._setHairColor(result));
		},
		changeEyecolor(result: number) {
			dispatch(ProfileActions._setEyeColor(result));
		},
		changeSize(e: InputTextEvent) {
			dispatch(ProfileActions._setSize(e.target.value as string));
		},
		changeWeight(e: InputTextEvent) {
			dispatch(ProfileActions._setWeight(e.target.value as string));
		},
		changeTitle(e: InputTextEvent) {
			dispatch(ProfileActions._setTitle(e.target.value as string));
		},
		changeSocialStatus(result: number) {
			dispatch(ProfileActions._setSocialStatus(result));
		},
		changeCharacteristics(e: InputTextEvent) {
			dispatch(ProfileActions._setCharacteristics(e.target.value as string));
		},
		changeOtherInfo(e: InputTextEvent) {
			dispatch(ProfileActions._setOtherInfo(e.target.value as string));
		},
		changeCultureAreaKnowledge(e: InputTextEvent) {
			dispatch(ProfileActions._setCultureAreaKnowledge(e.target.value as string));
		},
		rerollHair() {
			const action = ProfileActions._rerollHairColor();
			if (action) {
				dispatch(action);
			}
		},
		rerollEyes() {
			const action = ProfileActions._rerollEyeColor();
			if (action) {
				dispatch(action);
			}
		},
		rerollSize() {
			const action = ProfileActions._rerollSize();
			if (action) {
				dispatch(action);
			}
		},
		rerollWeight() {
			const action = ProfileActions._rerollWeight();
			if (action) {
				dispatch(action);
			}
		}
	};
}

export const PersonalDataContainer = connect<PersonalDataStateProps, PersonalDataDispatchProps, PersonalDataOwnProps>(mapStateToProps, mapDispatchToProps)(PersonalData);
