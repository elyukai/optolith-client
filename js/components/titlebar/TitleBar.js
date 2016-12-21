import AccountActions from '../../actions/AccountActions';
import APStore from '../../stores/APStore';
import AuthStore from '../../stores/AuthStore';
import AvatarWrapper from '../AvatarWrapper';
import BorderButton from '../BorderButton';
import HerolistActions from '../../actions/HerolistActions';
import HistoryActions from '../../actions/HistoryActions';
import HistoryStore from '../../stores/HistoryStore';
import IconButton from '../IconButton';
import InGameActions from '../../actions/InGameActions';
import PhaseStore from '../../stores/PhaseStore';
import ProfileStore from '../../stores/ProfileStore';
import React, { Component, PropTypes } from 'react';
import TabActions from '../../actions/TabActions';
import Text from '../Text';
import TitleBarBack from './TitleBarBack';
import TitleBarLeft from './TitleBarLeft';
import TitleBarRight from './TitleBarRight';
import TitleBarTabs from './TitleBarTabs';
import TitleBarWrapper from './TitleBarWrapper';

export default class TitleBar extends Component {

	static propTypes = {
		currentSection: PropTypes.string.isRequired,
		currentTab: PropTypes.string.isRequired
	};

	state = {
		account: AuthStore.getAll(),
		ap: APStore.getAll(),
		avatar: ProfileStore.getAvatar(),
		isUndoAvailable: HistoryStore.isUndoAvailable(),
		phase: PhaseStore.get()
	};

	_updateAuthStore = () => this.setState({ account: AuthStore.getAll() });
	_updateAPStore = () => this.setState({ ap: APStore.getAll() });
	_updateHistoryStore = () => this.setState({ isUndoAvailable: HistoryStore.isUndoAvailable() });
	_updatePhaseStore = () => this.setState({ phase: PhaseStore.get() });
	_updateProfileStore = () => this.setState({ avatar: ProfileStore.getAvatar() });

	componentDidMount() {
		AuthStore.addChangeListener(this._updateAuthStore);
		APStore.addChangeListener(this._updateAPStore);
		HistoryStore.addChangeListener(this._updateHistoryStore);
		PhaseStore.addChangeListener(this._updatePhaseStore);
		ProfileStore.addChangeListener(this._updateProfileStore);
	}

	componentWillUnmount() {
		AuthStore.removeChangeListener(this._updateAuthStore);
		APStore.removeChangeListener(this._updateAPStore);
		HistoryStore.removeChangeListener(this._updateHistoryStore);
		PhaseStore.removeChangeListener(this._updatePhaseStore);
		ProfileStore.removeChangeListener(this._updateProfileStore);
	}

	test = () => {
		if (this.state.el === 'EL_0') {
			HerolistActions.showHeroCreation();
		} else {
			TabActions.showSection('hero');
		}
	}
	login = () => AccountActions.showLogin();
	logout = () => AccountActions.logout();
	saveHero = () => TabActions.saveHero();
	saveGroup = () => InGameActions.save();
	undo = () => HistoryActions.undoLastAction();

	render() {

		const { currentSection, currentTab } = this.props;
		const { account, ap: { total, spent }, avatar, isUndoAvailable, phase } = this.state;

		switch (currentSection) {
			case 'main': {
				let tabs = [
					{ label: 'Start', tag: 'home' },
					{ label: 'Über', tag: 'about' }
				];
				if (account.id === null) {
					return (
						<TitleBarWrapper>
							<TitleBarLeft>
								<TitleBarTabs active={currentTab} tabs={tabs} />
							</TitleBarLeft>
							<TitleBarRight>
								<BorderButton
									label={this.state.el === 'EL_0' ? 'Testen' : 'Test fortsetzen'}
									onClick={this.test}
									/>
								<BorderButton
									label="Anmelden"
									onClick={this.login}
									primary
									disabled
									/>
							</TitleBarRight>
						</TitleBarWrapper>
					);
				} else {
					tabs.splice(1, 0,
						{ label: 'Helden', tag: 'herolist' },
						{ label: 'Gruppen', tag: 'grouplist', disabled: true }
					);
					return (
						<TitleBarWrapper>
							<TitleBarLeft>
								<TitleBarTabs active={currentTab} tabs={tabs} />
							</TitleBarLeft>
							<TitleBarRight>
								<TitleBarTabs active={currentTab} tabs={[
									{ label: account.name, tag: 'account' }									
								]} />
								<BorderButton label="Abmelden" onClick={this.logout} disabled />
							</TitleBarRight>
						</TitleBarWrapper>
					);
				}
			}
			case 'hero': {
				let tabs = [
					{ label: 'Profil', tag: 'profile' }
				];
				switch (phase) {
					case 1:
						tabs.push(
							{ label: 'Spezies, Kultur & Profession', tag: 'rcp' }
						);
						break;
					case 2:
						tabs.push(
							{ label: 'Eigenschaften', tag: 'attributes' },
							{ label: 'Vorteile & Nachteile', tag: 'disadv' },
							{ label: 'Fertigkeiten', tag: 'skills' }
						);
						break;
					case 3:
						tabs.push(
							{ label: 'Eigenschaften', tag: 'attributes' },
							{ label: 'Fertigkeiten', tag: 'skills' },
							{ label: 'Gegenstände', tag: 'items' }
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
							<Text className="collected-ap">{total - spent} AP</Text>
							<IconButton
								icon="&#xE166;"
								onClick={this.undo}
								disabled={!isUndoAvailable}
								/>
							<BorderButton
								label="Speichern"
								onClick={this.saveHero}
								disabled
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
								label="Speichern"
								onClick={this.saveGroup}
								/>
						</TitleBarRight>
					</TitleBarWrapper>
				);
			}
		}
	}
}
						// <div className="details">
						// 	<div className="all"><span>{this.state.ap}</span> AP gesamt</div>
						// 	<div className="used"><span>{this.state.used}</span> AP verwendet</div>
						// 	<hr />
						// 	<div className="adv">
						// 		<span>{this.state.disadv.adv[0]} / 80</span> AP für Vorteile
						// 		{this.state.disadv.adv[1] > 0 ? ` (davon ${this.state.disadv.adv[1]} für magische)`:null}
						// 		{this.state.disadv.adv[2] > 0 ? ` (davon ${this.state.disadv.adv[2]} für karmale)`:null}
						// 	</div>
						// 	<div className="disadv">
						// 		<span>{this.state.disadv.disadv[0]} / 80</span> AP für Nachteile
						// 		{this.state.disadv.disadv[1] > 0 ? `(davon ${this.state.disadv.disadv[1]} für magische)`:null}
						// 		{this.state.disadv.disadv[2] > 0 ? `(davon ${this.state.disadv.disadv[2]} für karmale)`:null}
						// 	</div>
						// </div>
