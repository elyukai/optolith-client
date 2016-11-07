import AccountActions from '../../actions/AccountActions';
import AccountStore from '../../stores/AccountStore';
import APStore from '../../stores/APStore';
import Avatar from './Avatar';
import BorderButton from './BorderButton';
import ELStore from '../../stores/ELStore';
import HerolistActions from '../../actions/HerolistActions';
import IconButton from './IconButton';
import InGameActions from '../../actions/InGameActions';
import PhaseStore from '../../stores/PhaseStore';
import ProfileStore from '../../stores/ProfileStore';
import React, { Component, PropTypes } from 'react';
import Tab from './Tab';
import TabActions from '../../actions/TabActions';
import TitleBarArrow from './TitleBarArrow';
import TitleBarNav from './TitleBarNav';

class TitleBar extends Component {

	static propTypes = {
		section: PropTypes.string.isRequired,
		tab: PropTypes.string.isRequired
	};

	state = {
		account: AccountStore.getAll(),
		ap: APStore.get(),
		used: APStore.getUsed(),
		disadv: APStore.getForDisAdv(),
		phase: PhaseStore.get(),
		portrait: ProfileStore.getAvatar()
	};

	_updateAccountStore = () => this.setState({ account: AccountStore.getAll() });
	_updateAPStore = () => this.setState({ ap: APStore.get(), used: APStore.getUsed(), disadv: APStore.getForDisAdv() });
	_updatePhaseStore = () => this.setState({ phase: PhaseStore.get() });
	_updateProfileStore = () => this.setState({ portrait: ProfileStore.getAvatar() });

	componentDidMount() {
		AccountStore.addChangeListener(this._updateAccountStore);
		APStore.addChangeListener(this._updateAPStore);
		PhaseStore.addChangeListener(this._updatePhaseStore);
		ProfileStore.addChangeListener(this._updateProfileStore);
	}

	componentWillUnmount() {
		AccountStore.removeChangeListener(this._updateAccountStore);
		APStore.removeChangeListener(this._updateAPStore);
		PhaseStore.removeChangeListener(this._updatePhaseStore);
		ProfileStore.removeChangeListener(this._updateProfileStore);
	}

	back = () => TabActions.showSection('main');
	test = () => {
		if (ELStore.getStartID() === 'EL_0') {
			HerolistActions.showHeroCreation();
		} else {
			TabActions.showSection('hero');
		}
	}

	render() {

		const { section, tab } = this.props;
		const { account, ap, used, phase, portrait = '' } = this.state;

		var showBackNav = section !== 'main';
		var tabsElement;
		var actionsElement;

		switch (section) {
			case 'main': {
				if (account.id === null) {
					tabsElement = (
						<TitleBarNav active={tab} tabs={[
							{ label: 'Start', tag: 'home' },
							{ label: 'Über', tag: 'about' }
						]} />
					);
					actionsElement = (
						<div className="right">
							<BorderButton label="Testen" onClick={this.test} disabled />
							<BorderButton label="Anmelden" onClick={AccountActions.showLogin} primary disabled />
						</div>
					);
				} else {
					tabsElement = (
						<TitleBarNav active={tab} tabs={[
							{ label: 'Start', tag: 'home' },
							{ label: 'Helden', tag: 'herolist' },
							{ label: 'Gruppen', tag: 'grouplist', disabled: true },
							{ label: 'Konto', tag: 'account' },
							{ label: 'Über', tag: 'about' }
						]} />
					);
					actionsElement = (
						<div className="right">
							<div className="account">{account.name}</div>
							<BorderButton label="Abmelden" onClick={AccountActions.logout} />
						</div>
					);
				}
				break;
			}
			case 'hero': {
				switch (phase) {
					case 1:
						tabsElement = (
							<TitleBarNav active={tab} avatar={portrait} tabs={[
								{ label: 'Profil', tag: 'profile' },
								{ label: 'Spezies, Kultur & Profession', tag: 'rcp' }
							]} />
						);
						break;
					case 2:
						tabsElement = (
							<TitleBarNav active={tab} avatar={portrait} tabs={[
								{ label: 'Profil', tag: 'profile' },
								{ label: 'Eigenschaften', tag: 'attributes' },
								{ label: 'Vorteile & Nachteile', tag: 'disadv' },
								{ label: 'Fertigkeiten', tag: 'skills' }
							]} />
						);
						break;
					case 3:
						tabsElement = (
							<TitleBarNav active={tab} avatar={portrait} tabs={[
								{ label: 'Profil', tag: 'profile' },
								{ label: 'Eigenschaften', tag: 'attributes' },
								{ label: 'Fertigkeiten', tag: 'skills' },
								{ label: 'Gegenstände', tag: 'items', disabled: true }
							]} />
						);
						break;
				}

				actionsElement = (
					<div className="right">
						<div className="ap">{ap - used} AP</div>
						<IconButton icon="&#xE166;" disabled />
						<BorderButton label="Speichern" onClick={TabActions.saveHero} />
					</div>
				);
				break;
			}
			case 'group': {
				tabsElement = (
					<div className="left">
						<h1 className="group-name">Gruppenname</h1>
					</div>
				);

				actionsElement = (
					<div className="right">
						<BorderButton label="Speichern" onClick={InGameActions.save} />
					</div>
				);
				break;
			}
		}

		const backElement = showBackNav ? (
			<div className="back">
				<TitleBarArrow onClick={this.back} />
			</div>
		) : null;

		return (
			<div className="titlebar">
				<div className="main">
					{backElement}
					{tabsElement}
					{actionsElement}
				</div>
			</div>
		);
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

export default TitleBar;
