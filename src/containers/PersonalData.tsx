import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as ProfileActions from '../actions/ProfileActions';
import { AvatarChange } from '../components/AvatarChange';
import * as Categories from '../constants/Categories';
import { AppState } from '../reducers/app';
import { getActiveForView } from '../selectors/activatableSelectors';
import { getTotal } from '../selectors/adventurePointsSelectors';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getCurrentEl } from '../selectors/elSelectors';
import { getPhase } from '../selectors/phaseSelectors';
import { getProfile } from '../selectors/profileSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from '../selectors/rcpSelectors';
import { InputTextEvent } from '../types/data.d';
import { createOverlay } from '../utils/createOverlay';
import { PersonalData, PersonalDataDispatchProps, PersonalDataOwnProps, PersonalDataStateProps } from '../views/profile/Overview';
import { OverviewAddAP } from '../views/profile/OverviewAddAP';

function mapStateToProps(state: AppState) {
	return {
		advantages: getActiveForView(getPresent(state), Categories.ADVANTAGES),
		apTotal: getTotal(state),
		culture: getCurrentCulture(state),
		currentEl: getCurrentEl(state),
		disadvantages: getActiveForView(getPresent(state), Categories.DISADVANTAGES),
		phase: getPhase(state),
		profession: getCurrentProfession(state),
		professionVariant: getCurrentProfessionVariant(state),
		profile: getProfile(state),
		race: getCurrentRace(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<any>, props: PersonalDataOwnProps) {
	return {
		loadHero(id?: string) {
			if (id) {
				dispatch(HerolistActions.loadHeroValidate(id));
			}
		},
		showImageUpload() {
			createOverlay(<AvatarChange setPath={(path: string) => dispatch(ProfileActions._setHeroAvatar(path))} />);
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
		showApAdd() {
			createOverlay(<OverviewAddAP addAdventurePoints={(ap: number) => dispatch(ProfileActions._addAdventurePoints(ap))} locale={props.locale} />);
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
