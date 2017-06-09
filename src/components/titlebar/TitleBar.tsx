import * as React from 'react';
import { APStore } from '../../stores/APStore';
import { AuthStore } from '../../stores/AuthStore';
import { ELStore } from '../../stores/ELStore';
import { HistoryStore } from '../../stores/HistoryStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { ProfileStore } from '../../stores/ProfileStore';
import { AdventurePoints, UILocale } from '../../types/data.d';
import { TitleBarForGroup } from './TitleBarForGroup';
import { TitleBarForHero } from './TitleBarForHero';
import { TitleBarForMain } from './TitleBarForMain';

interface State {
	account: {
		name: string;
		email: string;
		sessionToken?: string;
		displayName: string;
	};
	ap: AdventurePoints;
	avatar?: string;
	el: string;
	isUndoAvailable: boolean;
	phase: number;
}

interface Props {
	currentSection: string;
	currentTab: string;
	locale: UILocale;
}

export class TitleBar extends React.Component<Props, State> {
	state = {
		account: AuthStore.getAll(),
		ap: APStore.getAll(),
		avatar: ProfileStore.getAvatar(),
		el: ELStore.getStartID(),
		isUndoAvailable: HistoryStore.isUndoAvailable(),
		phase: PhaseStore.get()
	};

	componentDidMount() {
		AuthStore.addChangeListener(this.updateAuthStore);
		APStore.addChangeListener(this.updateAPStore);
		HistoryStore.addChangeListener(this.updateHistoryStore);
		PhaseStore.addChangeListener(this.updatePhaseStore);
		ProfileStore.addChangeListener(this.updateProfileStore);
	}

	componentWillUnmount() {
		AuthStore.removeChangeListener(this.updateAuthStore);
		APStore.removeChangeListener(this.updateAPStore);
		HistoryStore.removeChangeListener(this.updateHistoryStore);
		PhaseStore.removeChangeListener(this.updatePhaseStore);
		ProfileStore.removeChangeListener(this.updateProfileStore);
	}

	render() {
		const { currentSection, currentTab, locale } = this.props;
		const { ap, avatar, isUndoAvailable, phase } = this.state;

		if (currentSection === 'main') {
			return (
				<TitleBarForMain
					currentTab={currentTab}
					locale={locale}
					/>
			);
		}
		else if (currentSection === 'hero') {
			return (
				<TitleBarForHero
					ap={ap}
					avatar={avatar}
					currentTab={currentTab}
					isUndoAvailable={isUndoAvailable}
					locale={locale}
					phase={phase}
					/>
			);
		}
		else if (currentSection === 'group') {
			return (
				<TitleBarForGroup
					groupName=""
					locale={locale}
					/>
			);
		}
		return null;
	}

	private updateAuthStore = () => this.setState({ account: AuthStore.getAll() } as State);
	private updateAPStore = () => this.setState({ ap: APStore.getAll() } as State);
	private updateHistoryStore = () => this.setState({ isUndoAvailable: HistoryStore.isUndoAvailable() } as State);
	private updatePhaseStore = () => this.setState({ phase: PhaseStore.get() } as State);
	private updateProfileStore = () => this.setState({ avatar: ProfileStore.getAvatar() } as State);
}
