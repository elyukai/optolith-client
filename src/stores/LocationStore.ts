import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SetSectionAction, SetTabAction } from '../actions/LocationActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { ReceiveLogoutAction, ReceiveRegistrationAction, ReceiveUserDeletionAction } from '../actions/ServerActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { AuthStore } from './AuthStore';
import { Store } from './Store';

type Action = SetTabAction | SetSectionAction | ReceiveLogoutAction | CreateHeroAction | LoadHeroAction | SetSelectionsAction | ReceiveUserDeletionAction | ReceiveRegistrationAction;

class TabStoreStatic extends Store {
	private currentTab = 'home';
	private currentSection = 'main';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.SET_TAB:
					this.updateTab(action.payload.tab);
					break;

				case ActionTypes.SET_SECTION:
					this.updateSection(action.payload.section);
					break;

				case ActionTypes.RECEIVE_REGISTRATION:
					this.updateTab('confirmRegistration');
					break;

				case ActionTypes.RECEIVE_LOGOUT:
					this.updateTab('home');
					break;

				case ActionTypes.CREATE_HERO:
					this.updateSection('hero', 'rcp');
					break;

				case ActionTypes.LOAD_HERO:
					this.updateSection('hero', 'profile');
					break;

				case ActionTypes.ASSIGN_RCP_OPTIONS:
					this.updateTab('attributes');
					break;

				case ActionTypes.RECEIVE_USER_DELETION:
					this.updateTab('login');
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	getCurrentID() {
		return this.currentTab;
	}

	getCurrentSID() {
		return this.currentSection;
	}

	private updateTab(tab: string) {
		this.currentTab = tab;
	}

	private updateSection(section: 'main' | 'hero' | 'group', tab?: string) {
		if (section !== this.currentSection) {
			const before = this.currentSection;

			this.currentSection = section;

			if (tab) {
				this.updateTab(tab);
			}
			else {
				switch (section) {
					case 'main':
						if (before === 'hero') {
							if (AuthStore.getName() === '') {
								this.currentTab = 'home';
							} else {
								this.currentTab = 'herolist';
							}
						} else if (before === 'group') {
							this.currentTab = 'grouplist';
						}
						break;
					case 'hero':
						this.currentTab = 'profile';
						break;
					case 'group':
						this.currentTab = 'master';
						break;
				}
			}
		}
	}
}

export const TabStore = new TabStoreStatic();
