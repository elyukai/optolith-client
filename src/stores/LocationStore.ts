import { remote } from 'electron';
import { CreateHeroAction, LoadHeroAction, saveHero } from '../actions/HerolistActions';
import { SetSectionAction, SetTabAction } from '../actions/LocationActions';
import { SetSelectionsAction } from '../actions/ProfessionActions';
import { ReceiveLogoutAction, ReceiveRegistrationAction, ReceiveUserDeletionAction } from '../actions/ServerActions';
import * as ActionTypes from '../constants/ActionTypes';

import { AuthStore } from './AuthStore';
import { Store } from './Store';

type Action = SetTabAction | SetSectionAction | ReceiveLogoutAction | CreateHeroAction | LoadHeroAction | SetSelectionsAction | ReceiveUserDeletionAction | ReceiveRegistrationAction;

class TabStoreStatic extends Store {
	private currentTab = 'home';
	private currentSection = 'main';
	readonly dispatchToken: string;

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

			if (before === 'hero') {
				remote.globalShortcut.unregister('Ctrl+S');
			}

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
						remote.globalShortcut.register('Ctrl+S', () => {
							saveHero();
						});
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
