import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { SetAgeAction, SetCharacteristicsAction, SetCultureAreaKnowledge, SetCustomProfessionNameAction, SetDateOfBirthAction, SetEyeColorAction, SetFamilyAction, SetHairColorAction, SetHeroAvatarAction, SetHeroNameAction, SetOtherInfoAction, SetPlaceOfBirthAction, SetSizeAction, SetSocialStatusAction, SetTitleAction, SetWeightAction } from '../actions/ProfileActions';
import * as ActionTypes from '../constants/ActionTypes';

import { ProfessionStore } from './ProfessionStore';
import { RaceStore } from './RaceStore';
import { Store } from './Store';

type Action = SetHeroNameAction | SetHeroAvatarAction | SetFamilyAction | SetPlaceOfBirthAction | SetDateOfBirthAction | SetAgeAction | SetHairColorAction | SetEyeColorAction | SetSizeAction | SetWeightAction | SetTitleAction | SetSocialStatusAction | SetCharacteristicsAction | SetOtherInfoAction | SetCultureAreaKnowledge | CreateHeroAction | LoadHeroAction | SetSelectionsAction | SetCustomProfessionNameAction;

const HAIRCOLORS = RaceStore.hairColors;
const EYECOLORS = RaceStore.eyeColors;

class ProfileStoreStatic extends Store {
	private name: string;
	private dateCreated: Date;
	private dateModified: Date;
	private professionName: string | undefined;
	private sex: 'm' | 'f';
	private avatar: string | undefined;
	private family: string | undefined;
	private placeofbirth: string | undefined;
	private dateofbirth: string | undefined;
	private age: string | undefined;
	private haircolor: number | undefined;
	private eyecolor: number | undefined;
	private size: string | undefined;
	private weight: string | undefined;
	private title: string | undefined;
	private socialstatus: number | undefined;
	private characteristics: string | undefined;
	private otherinfo: string | undefined;
	private cultureAreaKnowledge: string | undefined;
	readonly dispatchToken: string;

	getAll() {
		return {
			age: this.age,
			avatar: this.avatar,
			characteristics: this.characteristics,
			cultureAreaKnowledge: this.cultureAreaKnowledge,
			dateofbirth: this.dateofbirth,
			eyecolor: this.eyecolor,
			family: this.family,
			haircolor: this.haircolor,
			name: this.name,
			professionName: this.professionName,
			otherinfo: this.otherinfo,
			placeofbirth: this.placeofbirth,
			sex: this.sex,
			size: this.size,
			socialstatus: this.socialstatus,
			title: this.title,
			weight: this.weight,
		};
	}

	getAllPersonalData() {
		return {
			age: this.age,
			avatar: this.avatar,
			characteristics: this.characteristics,
			cultureAreaKnowledge: this.cultureAreaKnowledge,
			dateofbirth: this.dateofbirth,
			eyecolor: this.eyecolor,
			family: this.family,
			haircolor: this.haircolor,
			otherinfo: this.otherinfo,
			placeofbirth: this.placeofbirth,
			sex: this.sex,
			size: this.size,
			socialstatus: this.socialstatus,
			title: this.title,
			weight: this.weight,
		};
	}

	getForSave() {
		return {
			age: this.age,
			characteristics: this.characteristics,
			cultureAreaKnowledge: this.cultureAreaKnowledge,
			dateofbirth: this.dateofbirth,
			eyecolor: this.eyecolor,
			family: this.family,
			haircolor: this.haircolor,
			otherinfo: this.otherinfo,
			placeofbirth: this.placeofbirth,
			size: this.size,
			socialstatus: this.socialstatus,
			title: this.title,
			weight: this.weight,
		};
	}

	getName() {
		return this.name;
	}

	getCustomProfessionName() {
		return this.professionName;
	}

	getSex() {
		return this.sex;
	}

	getAvatar() {
		return this.avatar;
	}

	getAppearance() {
		return {
			eyecolor: this.eyecolor,
			haircolor: this.haircolor,
			size: this.size,
			weight: this.weight,
		};
	}

	getCultureAreaKnowledge() {
		return this.cultureAreaKnowledge;
	}

	getHaircolor() {
		return this.haircolor;
	}

	getHaircolorTags() {
		return HAIRCOLORS;
	}

	getEyecolor() {
		return this.eyecolor;
	}

	getEyecolorTags() {
		return EYECOLORS;
	}

	getSize() {
		return this.size;
	}

	getWeight() {
		return this.weight;
	}

	getDateCreated() {
		return this.dateCreated;
	}

	getDateModified() {
		return this.dateModified;
	}

	private updateName(text: string) {
		this.name = text;
	}

	private updateProfessionName(text?: string) {
		this.professionName = text;
	}

	private updateSex(id: 'm' | 'f') {
		this.sex = id;
	}

	private updateAvatar(url?: string) {
		this.avatar = url;
	}

	private updateFamily(text?: string) {
		this.family = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private updatePlaceOfBirth(text?: string) {
		this.placeofbirth = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private updateDateOfBirth(text?: string) {
		this.dateofbirth = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private updateAge(text?: string) {
		this.age = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private updateHaircolor(id?: number) {
		this.haircolor = id;
	}

	private updateEyecolor(id?: number) {
		this.eyecolor = id;
	}

	private updateSize(text?: string) {
		this.size = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private updateWeight(text?: string) {
		this.weight = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private updateTitle(text?: string) {
		this.title = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private updateSocialStatus(id?: number) {
		this.socialstatus = id;
	}

	private updateCharacteristics(text?: string) {
		this.characteristics = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private updateOtherInfo(text?: string) {
		this.otherinfo = typeof text === 'string' && text.length === 0 ? undefined : text;
	}

	private clear() {
		this.avatar = undefined;
		this.family = undefined;
		this.placeofbirth = undefined;
		this.dateofbirth = undefined;
		this.age = undefined;
		this.haircolor = undefined;
		this.eyecolor = undefined;
		this.size = undefined;
		this.weight = undefined;
		this.title = undefined;
		this.socialstatus = undefined;
		this.characteristics = undefined;
		this.otherinfo = undefined;
		this.cultureAreaKnowledge = undefined;
	}

}

export const ProfileStore = new ProfileStoreStatic();
