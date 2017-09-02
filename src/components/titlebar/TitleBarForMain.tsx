import { remote } from 'electron';
import * as React from 'react';
import { UIMessages } from '../../types/ui.d';
import { createOverlay } from '../../utils/createOverlay';
import { _translate } from '../../utils/I18n';
import { BorderButton } from '../BorderButton';
import { IconButton } from '../IconButton';
import { Settings } from './Settings';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRight } from './TitleBarRight';
import { TitleBarTabProps, TitleBarTabs } from './TitleBarTabs';
import { TitleBarWrapper } from './TitleBarWrapper';

export interface TitleBarForMainProps {
	currentTab: string;
	locale: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	saveConfig(): void;
	saveHeroes(): void;
	setLocale(id?: string): void;
	setTab(id: string): void;
}

export function TitleBarForMain(props: TitleBarForMainProps) {
	const { currentTab, locale, saveConfig, saveHeroes, setLocale, setTab } = props;

	const tabs: TitleBarTabProps[] = [
		{ label: _translate(locale, 'titlebar.tabs.heroes'), tag: 'herolist' },
		{ label: _translate(locale, 'titlebar.tabs.groups'), tag: 'grouplist', disabled: true },
		{ label: _translate(locale, 'titlebar.tabs.wiki'), tag: 'wiki', disabled: true },
		{ label: _translate(locale, 'titlebar.tabs.about'), tag: 'about' }
	];

	return (
		<TitleBarWrapper>
			<TitleBarLeft>
				<TitleBarTabs active={currentTab} tabs={tabs} setTab={setTab} />
			</TitleBarLeft>
			<TitleBarRight>
				{currentTab === 'herolist' && <BorderButton
					label={_translate(locale, 'actions.save')}
					onClick={saveHeroes}
					/>}
				<IconButton
					icon="&#xE8B8;"
					onClick={() => showSettings(locale, setLocale, saveConfig)}
					/>
				<IconButton
					icon="&#xE868;"
					onClick={toggleDevtools}
					/>
			</TitleBarRight>
		</TitleBarWrapper>
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

function showSettings(locale: UIMessages, setLocale: (id?: string) => void, saveConfig: () => void) {
	createOverlay(<Settings locale={locale} setLocale={setLocale} saveConfig={saveConfig} />);
}

function toggleDevtools() {
	remote.getCurrentWindow().webContents.toggleDevTools();
}
