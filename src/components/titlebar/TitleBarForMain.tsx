import { remote } from 'electron';
import * as React from 'react';
import * as HerolistActions from '../../actions/HerolistActions';
import { UILocale } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { BorderButton } from '../BorderButton';
import { IconButton } from '../IconButton';
import { Settings } from './Settings';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRight } from './TitleBarRight';
import { TitleBarTabProps, TitleBarTabs } from './TitleBarTabs';
import { TitleBarWrapper } from './TitleBarWrapper';

export interface TitleBarForMainProps {
	currentTab: string;
	locale: UILocale;
}

export class TitleBarForMain extends React.Component<TitleBarForMainProps, object> {
	// test = () => {
	// 	if (this.state.el === 'EL_0') {
	// 		createOverlay(<HeroCreation />);
	// 	} else {
	// 		LocationActions.setSection('hero');
	// 	}
	// }
	// login = () => createOverlay(<Login />);
	// logout = () => AuthActions.requestLogout();
	saveHeroes = () => HerolistActions.save();
	toggleDevtools = () => remote.getCurrentWindow().webContents.toggleDevTools();
	showSettings = () => createOverlay(<Settings />);

	render() {
		const { currentTab, locale } = this.props;

		const tabs: TitleBarTabProps[] = [
			{ label: locale['titlebar.tabs.home'], tag: 'home' },
			{ label: locale['titlebar.tabs.heroes'], tag: 'herolist' },
			{ label: locale['titlebar.tabs.groups'], tag: 'grouplist', disabled: true },
			{ label: locale['titlebar.tabs.wiki'], tag: 'wiki', disabled: true },
			{ label: locale['titlebar.tabs.about'], tag: 'about' }
		];

		return (
			<TitleBarWrapper>
				<TitleBarLeft>
					<TitleBarTabs active={currentTab} tabs={tabs} />
				</TitleBarLeft>
				<TitleBarRight>
					{currentTab === 'herolist' && <BorderButton
						label={locale['actions.save']}
						onClick={this.saveHeroes}
						/>}
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
		/*return (
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
		);*/
	}
}
