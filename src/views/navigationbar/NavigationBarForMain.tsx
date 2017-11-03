import { remote } from 'electron';
import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { NavigationBarLeft } from './NavigationBarLeft';
import { NavigationBarRight } from './NavigationBarRight';
import { NavigationBarTabProps, NavigationBarTabs } from './NavigationBarTabs';
import { NavigationBarWrapper } from './NavigationBarWrapper';
import { Settings } from './Settings';

export interface NavigationBarForMainProps {
	currentTab: string;
	locale: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	showSettings?: boolean;
	theme: string;
	closeSettings(): void;
	openSettings(): void;
	saveConfig(): void;
	setLocale(id?: string): void;
	setTab(id: string): void;
	setTheme(id: string): void;
}

export function NavigationBarForMain(props: NavigationBarForMainProps) {
	const { closeSettings, currentTab, locale, openSettings, setTab } = props;

	const tabs: NavigationBarTabProps[] = [
		{ label: _translate(locale, 'titlebar.tabs.heroes'), tag: 'herolist' },
		{ label: _translate(locale, 'titlebar.tabs.groups'), tag: 'grouplist', disabled: true },
		{ label: _translate(locale, 'titlebar.tabs.wiki'), tag: 'wiki' },
		{ label: _translate(locale, 'titlebar.tabs.about'), tag: 'about' }
	];

	return (
		<NavigationBarWrapper>
			<NavigationBarLeft>
				<NavigationBarTabs active={currentTab} tabs={tabs} setTab={setTab} />
			</NavigationBarLeft>
			<NavigationBarRight>
				<IconButton
					icon="&#xE906;"
					onClick={openSettings}
					/>
				<Settings {...props} close={closeSettings} />
				<IconButton
					icon="&#xE911;"
					onClick={toggleDevtools}
					/>
			</NavigationBarRight>
		</NavigationBarWrapper>
	);
				/*<TitleBarTabs active={currentTab} tabs={[
					{ label: account.name, tag: 'account', disabled: true },
				]} />
				<BorderButton label={_translate(locale, 'titlebar.actions.logout')} onClick={this.logout} disabled />*/
	/*return (
		<TitleBarWrapper>
			<TitleBarLeft>
				<TitleBarTabs active={currentTab} tabs={tabs} />
			</TitleBarLeft>
			<TitleBarRight>
				<BorderButton
					label={_translate(locale, 'titlebar.actions.logout')}
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

function toggleDevtools() {
	remote.getCurrentWindow().webContents.toggleDevTools();
}
