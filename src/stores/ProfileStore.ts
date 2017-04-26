import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { SetAgeAction, SetCharacteristicsAction, SetCultureAreaKnowledge, SetCustomProfessionNameAction, SetDateOfBirthAction, SetEyeColorAction, SetFamilyAction, SetHairColorAction, SetHeroAvatarAction, SetHeroNameAction, SetOtherInfoAction, SetPlaceOfBirthAction, SetSizeAction, SetSocialStatusAction, SetTitleAction, SetWeightAction } from '../actions/ProfileActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { ProfessionStore } from './ProfessionStore';
import { RaceStore } from './RaceStore';
import { Store } from './Store';

type Action = SetHeroNameAction | SetHeroAvatarAction | SetFamilyAction | SetPlaceOfBirthAction | SetDateOfBirthAction | SetAgeAction | SetHairColorAction | SetEyeColorAction | SetSizeAction | SetWeightAction | SetTitleAction | SetSocialStatusAction | SetCharacteristicsAction | SetOtherInfoAction | SetCultureAreaKnowledge | CreateHeroAction | LoadHeroAction | SetSelectionsAction | SetCustomProfessionNameAction;

const HAIRCOLORS = RaceStore.hairColors;
const EYECOLORS = RaceStore.eyeColors;
const SOCIALSTATUS = [ 'Unfrei', 'Frei', 'Niederadel', 'Adel', 'Hochadel' ];

class ProfileStoreStatic extends Store {
	private name = '';
	private dateCreated: Date;
	private dateModified: Date;
	private professionName = '';
	private sex: 'm' | 'f' = '' as 'm' | 'f';
	private avatar = '';
	private family = '';
	private placeofbirth = '';
	private dateofbirth = '';
	private age = '';
	private haircolor = 0;
	private eyecolor = 0;
	private size = '';
	private weight = '';
	private title = '';
	private socialstatus = 0;
	private characteristics = '';
	private otherinfo = '';
	private cultureAreaKnowledge = '';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.CREATE_HERO:
					this.clear();
					this.updateName(action.payload.name);
					this.updateSex(action.payload.sex);
					break;

				case ActionTypes.LOAD_HERO:
					this.updateName(action.payload.data.name);
					if (action.payload.data.professionName) {
						this.updateProfessionName(action.payload.data.professionName);
					}
					this.dateCreated = action.payload.data.dateCreated;
					this.dateModified = action.payload.data.dateModified;
					this.updateSex(action.payload.data.sex);
					this.updateAvatar(action.payload.data.avatar);
					this.updateFamily(action.payload.data.pers.family);
					this.updatePlaceOfBirth(action.payload.data.pers.placeofbirth);
					this.updateDateOfBirth(action.payload.data.pers.dateofbirth);
					this.updateAge(action.payload.data.pers.age);
					this.updateHaircolor(action.payload.data.pers.haircolor);
					this.updateEyecolor(action.payload.data.pers.eyecolor);
					this.updateSize(action.payload.data.pers.size);
					this.updateWeight(action.payload.data.pers.weight);
					this.updateTitle(action.payload.data.pers.title);
					this.updateSocialStatus(action.payload.data.pers.socialstatus);
					this.updateCharacteristics(action.payload.data.pers.characteristics);
					this.updateOtherInfo(action.payload.data.pers.otherinfo);
					this.cultureAreaKnowledge = action.payload.data.pers.cultureAreaKnowledge;
					break;

				case ActionTypes.SET_HERO_NAME:
					this.updateName(action.payload.name);
					break;

				case ActionTypes.SET_CUSTOM_PROFESSION_NAME:
					this.updateProfessionName(action.payload.name);
					break;

				case ActionTypes.SET_HERO_AVATAR:
					this.updateAvatar(action.payload.url);
					break;

				case ActionTypes.SET_FAMILY:
					this.updateFamily(action.payload.family);
					break;

				case ActionTypes.SET_PLACEOFBIRTH:
					this.updatePlaceOfBirth(action.payload.placeofbirth);
					break;

				case ActionTypes.SET_DATEOFBIRTH:
					this.updateDateOfBirth(action.payload.dateofbirth);
					break;

				case ActionTypes.SET_AGE:
					this.updateAge(action.payload.age);
					break;

				case ActionTypes.SET_HAIRCOLOR:
					this.updateHaircolor(action.payload.haircolor);
					break;

				case ActionTypes.SET_EYECOLOR:
					this.updateEyecolor(action.payload.eyecolor);
					break;

				case ActionTypes.SET_SIZE:
					this.updateSize(action.payload.size);
					break;

				case ActionTypes.SET_WEIGHT:
					this.updateWeight(action.payload.weight);
					if (action.payload.size && action.payload.size !== this.size) {
						this.updateSize(action.payload.size);
					}
					break;

				case ActionTypes.SET_TITLE:
					this.updateTitle(action.payload.title);
					break;

				case ActionTypes.SET_SOCIALSTATUS:
					this.updateSocialStatus(action.payload.socialstatus);
					break;

				case ActionTypes.SET_CHARACTERISTICS:
					this.updateCharacteristics(action.payload.characteristics);
					break;

				case ActionTypes.SET_OTHERINFO:
					this.updateOtherInfo(action.payload.otherinfo);
					break;

				case ActionTypes.SET_CULTURE_AREA_KNOWLEDGE:
					this.cultureAreaKnowledge = action.payload.cultureAreaKnowledge;
					break;

				case ActionTypes.ASSIGN_RCP_OPTIONS:
					AppDispatcher.waitFor([ProfessionStore.dispatchToken]);
					if (ProfessionStore.getCurrentId() === 'P_0') {
						this.updateProfessionName('Eigene Profession');
					}
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

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

	getSocialstatusTags() {
		return SOCIALSTATUS;
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

	private updateProfessionName(text: string) {
		this.professionName = text;
	}

	private updateSex(id: 'm' | 'f') {
		this.sex = id;
	}

	private updateAvatar(url: string) {
		this.avatar = url;
	}

	private updateFamily(text: string) {
		this.family = text;
	}

	private updatePlaceOfBirth(text: string) {
		this.placeofbirth = text;
	}

	private updateDateOfBirth(text: string) {
		this.dateofbirth = text;
	}

	private updateAge(text: string) {
		this.age = text;
	}

	private updateHaircolor(id: number) {
		this.haircolor = id;
	}

	private updateEyecolor(id: number) {
		this.eyecolor = id;
	}

	private updateSize(text: string) {
		this.size = text;
	}

	private updateWeight(text: string) {
		this.weight = text;
	}

	private updateTitle(text: string) {
		this.title = text;
	}

	private updateSocialStatus(id: number) {
		this.socialstatus = id;
	}

	private updateCharacteristics(text: string) {
		this.characteristics = text;
	}

	private updateOtherInfo(text: string) {
		this.otherinfo = text;
	}

	private clear() {
		this.name = '';
		this.sex = '' as 'm' | 'f';
		this.avatar = '';
		this.family = '';
		this.placeofbirth = '';
		this.dateofbirth = '';
		this.age = '';
		this.haircolor = 0;
		this.eyecolor = 0;
		this.size = '';
		this.weight = '';
		this.title = '';
		this.socialstatus = 0;
		this.characteristics = '';
		this.otherinfo = '';
		this.cultureAreaKnowledge = '';
	}

}

export const ProfileStore = new ProfileStoreStatic();
