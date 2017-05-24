import { remote } from 'electron';
import * as React from 'react';
import * as AuthActions from '../../actions/AuthActions';
import * as HerolistActions from '../../actions/HerolistActions';
import * as HistoryActions from '../../actions/HistoryActions';
import * as InGameActions from '../../actions/InGameActions';
import * as LocationActions from '../../actions/LocationActions';
import { APStore } from '../../stores/APStore';
import { AuthStore } from '../../stores/AuthStore';
import { ELStore } from '../../stores/ELStore';
import { HistoryStore } from '../../stores/HistoryStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { ProfileStore } from '../../stores/ProfileStore';
import { UILocale } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { Login } from '../../views/account/Login';
import { HeroCreation } from '../../views/herolist/HeroCreation';
import { AvatarWrapper } from '../AvatarWrapper';
import { BorderButton } from '../BorderButton';
import { IconButton } from '../IconButton';
import { Text } from '../Text';
import { TooltipToggle } from '../TooltipToggle';
import { Settings } from './Settings';
import { TitleBarBack } from './TitleBarBack';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRight } from './TitleBarRight';
import { TitleBarTabProps, TitleBarTabs } from './TitleBarTabs';
import { TitleBarWrapper } from './TitleBarWrapper';

interface State {
	account: {
		name: string;
		email: string;
		sessionToken?: string;
		displayName: string;
	};
	ap: {
		total: number;
		spent: number;
		adv: [number, number, number];
		disadv: [number, number, number];
	};
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

	test = () => {
		if (this.state.el === 'EL_0') {
			createOverlay(<HeroCreation />);
		} else {
			LocationActions.setSection('hero');
		}
	}
	login = () => createOverlay(<Login />);
	logout = () => AuthActions.requestLogout();
	saveHero = () => HerolistActions.saveHero();
	saveGroup = () => InGameActions.save();
	undo = () => HistoryActions.undoLastAction();
	toggleDevtools = () => remote.getCurrentWindow().webContents.toggleDevTools();
	showSettings = () => createOverlay(<Settings />);

	render() {

		const { currentSection, currentTab, locale } = this.props;
		const { ap: { total, spent, adv, disadv }, avatar, isUndoAvailable, phase } = this.state;

		switch (currentSection) {
			case 'main': {
				const tabs: TitleBarTabProps[] = [
					{ label: locale['titlebar.tabs.home'], tag: 'home' },
					{ label: locale['titlebar.tabs.wiki'], tag: 'wiki', disabled: true },
					{ label: locale['titlebar.tabs.about'], tag: 'about' }
				];
				/*if (!account.name) {
					return (
						<TitleBarWrapper>
							<TitleBarLeft>
								<TitleBarTabs active={currentTab} tabs={tabs} />
							</TitleBarLeft>
							<TitleBarRight>
								<BorderButton
									label={locale['titlebar.actions.logout']}
									onClick={this.login}
									primary
									disabled
									/>
								<IconButton
									icon="&#xE8B8;"
									onClick={this.showSettings}
									/>
								<IconButton
									icon="&#xE868;"
									onClick={this.openDevtools}
									/>
							</TitleBarRight>
						</TitleBarWrapper>
					);
				} else {*/
					tabs.splice(1, 0,
						{ label: locale['titlebar.tabs.heroes'], tag: 'herolist' },
						{ label: locale['titlebar.tabs.groups'], tag: 'grouplist', disabled: true }
					);
					return (
						<TitleBarWrapper>
							<TitleBarLeft>
								<TitleBarTabs active={currentTab} tabs={tabs} />
							</TitleBarLeft>
							<TitleBarRight>
								<IconButton
									icon="&#xE8B8;"
									onClick={this.showSettings}
									/>
								<IconButton
									icon="&#xE868;"
									onClick={this.toggleDevtools}
									/>
							</TitleBarRight>
						</TitleBarWrapper>
					);
								/*<TitleBarTabs active={currentTab} tabs={[
									{ label: account.name, tag: 'account', disabled: true },
								]} />
								<BorderButton label={locale['titlebar.actions.logout']} onClick={this.logout} disabled />*/
				// }
			}
			case 'hero': {
				const tabs = [
					{ label: locale['titlebar.tabs.profile'], tag: 'profile' }
				];
				switch (phase) {
					case 1:
						tabs.push(
							{ label: locale['titlebar.tabs.racecultureprofession'], tag: 'rcp' }
						);
						break;
					case 2:
						tabs.push(
							{ label: locale['titlebar.tabs.attributes'], tag: 'attributes' },
							{ label: locale['titlebar.tabs.advantagesdisadvantages'], tag: 'disadv' },
							{ label: locale['titlebar.tabs.skills'], tag: 'skills' }
						);
						break;
					case 3:
						tabs.push(
							{ label: locale['titlebar.tabs.attributes'], tag: 'attributes' },
							{ label: locale['titlebar.tabs.skills'], tag: 'skills' },
							{ label: locale['titlebar.tabs.belongings'], tag: 'belongings' }
						);
						break;
				}
				return (
					<TitleBarWrapper>
						<TitleBarLeft>
							<TitleBarBack />
							<AvatarWrapper src={avatar} />
							<TitleBarTabs active={currentTab} tabs={tabs} />
						</TitleBarLeft>
						<TitleBarRight>
							<TooltipToggle
								position="bottom"
								margin={12}
								content={
									<div className="ap-details">
										<h4>{locale['titlebar.adventurepoints.title']}</h4>
										<p className="general">
											{total} {locale['titlebar.adventurepoints.total']}<br/>
											{spent} {locale['titlebar.adventurepoints.spent']}
										</p>
										<hr />
										<p>
											<span>{adv[0]} / 80 {locale['titlebar.adventurepoints.advantages']}</span>
											<span>{adv[1] > 0 && `${locale['titlebar.adventurepoints.subprefix']} ${adv[1]} / 50 ${locale['titlebar.adventurepoints.advantagesmagic']}`}</span>
											<span>{adv[2] > 0 && `${locale['titlebar.adventurepoints.subprefix']} ${adv[2]} / 50 ${locale['titlebar.adventurepoints.advantagesblessed']}`}</span>
											<span>{disadv[0]} / 80 {locale['titlebar.adventurepoints.disadvantages']}</span>
											<span>{disadv[1] > 0 && `${locale['titlebar.adventurepoints.subprefix']} ${disadv[1]} / 50 ${locale['titlebar.adventurepoints.disadvantagesmagic']}`}</span>
											<span>{disadv[2] > 0 && `${locale['titlebar.adventurepoints.subprefix']} ${disadv[2]} / 50 ${locale['titlebar.adventurepoints.disadvantagesblessed']}`}</span>
										</p>
									</div>
								}
								>
								<Text className="collected-ap">{total - spent} {locale['titlebar.view.adventurepoints']}</Text>
							</TooltipToggle>
							<IconButton
								icon="&#xE166;"
								onClick={this.undo}
								disabled={!isUndoAvailable}
								/>
							<BorderButton
								label={locale['actions.save']}
								onClick={this.saveHero}
								/>
							<IconButton
								icon="&#xE8B8;"
								onClick={this.showSettings}
								/>
							<IconButton
								icon="&#xE868;"
								onClick={this.toggleDevtools}
								/>
						</TitleBarRight>
					</TitleBarWrapper>
				);
			}

			case 'group': {
				return (
					<TitleBarWrapper>
						<TitleBarLeft>
							<TitleBarBack />
							<Text>Gruppenname</Text>
						</TitleBarLeft>
						<TitleBarRight>
							<BorderButton
								label={locale['actions.save']}
								onClick={this.saveGroup}
								/>
							<IconButton
								icon="&#xE8B8;"
								onClick={this.showSettings}
								/>
							<IconButton
								icon="&#xE868;"
								onClick={this.toggleDevtools}
								/>
						</TitleBarRight>
					</TitleBarWrapper>
				);
			}

			default:
				return null;
		}
	}

	private updateAuthStore = () => this.setState({ account: AuthStore.getAll() } as State);
	private updateAPStore = () => this.setState({ ap: APStore.getAll() } as State);
	private updateHistoryStore = () => this.setState({ isUndoAvailable: HistoryStore.isUndoAvailable() } as State);
	private updatePhaseStore = () => this.setState({ phase: PhaseStore.get() } as State);
	private updateProfileStore = () => this.setState({ avatar: ProfileStore.getAvatar() } as State);
}
