import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as ProfileActions from '../actions/ProfileActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/app';
import { getAdvantagesForSheet, getDisadvantagesForSheet, isAlbino } from '../selectors/activatableSelectors';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getProfile } from '../selectors/profileSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace, getCurrentRaceVariant } from '../selectors/rcpSelectors';
import { getPhase, getTotalAdventurePoints, isAddAdventurePointsOpen, isEditCharacterAvatarOpen } from '../selectors/stateSelectors';
import { isEditingHeroAfterCreationPhaseEnabled } from '../selectors/uisettingsSelectors';
import { InputTextEvent } from '../types/data.d';
import { PersonalData, PersonalDataDispatchProps, PersonalDataOwnProps, PersonalDataStateProps } from '../views/profile/Overview';

function mapStateToProps(state: AppState) {
	return {
		advantages: getAdvantagesForSheet(state),
		apLeft: getAvailableAdventurePoints(state),
		apTotal: getTotalAdventurePoints(state),
		culture: getCurrentCulture(state),
		currentEl: getStartEl(state),
		disadvantages: getDisadvantagesForSheet(state),
		isRemovingEnabled: isRemovingEnabled(state),
		isEditingHeroAfterCreationPhaseEnabled: isEditingHeroAfterCreationPhaseEnabled(state),
		phase: getPhase(state),
		profession: getCurrentProfession(state),
		professionVariant: getCurrentProfessionVariant(state),
		profile: getProfile(state),
		race: getCurrentRace(state),
		raceVariant: getCurrentRaceVariant(state),
		isAddAdventurePointsOpen: isAddAdventurePointsOpen(state),
		isEditCharacterAvatarOpen: isEditCharacterAvatarOpen(state),
		isAlbino: isAlbino(state)!,
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		loadHero(id?: string) {
			if (id) {
				dispatch<any>(HerolistActions.loadHeroValidate(id));
			}
		},
		setAvatar(path: string) {
			dispatch<any>(ProfileActions._setHeroAvatar(path));
		},
		setHeroName(name: string) {
			dispatch<any>(ProfileActions._setHeroName(name));
		},
		setCustomProfessionName(name: string) {
			dispatch<any>(ProfileActions._setCustomProfessionName(name));
		},
		endCharacterCreation() {
			dispatch<any>(ProfileActions._endHeroCreation());
		},
		addAdventurePoints(ap: number) {
			dispatch<any>(ProfileActions._addAdventurePoints(ap));
		},
		openAddAdventurePoints() {
			dispatch<any>(SubwindowsActions.openAddAdventurePoints());
		},
		closeAddAdventurePoints() {
			dispatch<any>(SubwindowsActions.closeAddAdventurePoints());
		},
		openEditCharacterAvatar() {
			dispatch<any>(SubwindowsActions.openEditCharacterAvatar());
		},
		closeEditCharacterAvatar() {
			dispatch<any>(SubwindowsActions.closeEditCharacterAvatar());
		},
		changeFamily(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setFamily(e.target.value as string));
		},
		changePlaceOfBirth(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setPlaceOfBirth(e.target.value as string));
		},
		changeDateOfBirth(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setDateOfBirth(e.target.value as string));
		},
		changeAge(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setAge(e.target.value as string));
		},
		changeHaircolor(result: number) {
			dispatch<any>(ProfileActions._setHairColor(result));
		},
		changeEyecolor(result: number) {
			dispatch<any>(ProfileActions._setEyeColor(result));
		},
		changeSize(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setSize(e.target.value as string));
		},
		changeWeight(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setWeight(e.target.value as string));
		},
		changeTitle(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setTitle(e.target.value as string));
		},
		changeSocialStatus(result: number) {
			dispatch<any>(ProfileActions._setSocialStatus(result));
		},
		changeCharacteristics(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setCharacteristics(e.target.value as string));
		},
		changeOtherInfo(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setOtherInfo(e.target.value as string));
		},
		changeCultureAreaKnowledge(e: InputTextEvent) {
			dispatch<any>(ProfileActions._setCultureAreaKnowledge(e.target.value as string));
		},
		rerollHair() {
			const action = ProfileActions._rerollHairColor();
			if (action) {
				dispatch<any>(action);
			}
		},
		rerollEyes() {
			const action = ProfileActions._rerollEyeColor();
			if (action) {
				dispatch<any>(action);
			}
		},
		rerollSize() {
			const action = ProfileActions._rerollSize();
			if (action) {
				dispatch<any>(action);
			}
		},
		rerollWeight() {
			const action = ProfileActions._rerollWeight();
			if (action) {
				dispatch<any>(action);
			}
		}
	};
}

export const PersonalDataContainer = connect<PersonalDataStateProps, PersonalDataDispatchProps, PersonalDataOwnProps>(mapStateToProps, mapDispatchToProps)(PersonalData);
