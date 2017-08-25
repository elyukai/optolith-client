import { remote } from 'electron';
import * as React from 'react';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { UIMessages } from '../../types/ui.d';
import { createOverlay } from '../../utils/createOverlay';
import { _translate } from '../../utils/I18n';
import { AvatarWrapper } from '../AvatarWrapper';
import { BorderButton } from '../BorderButton';
import { IconButton } from '../IconButton';
import { Text } from '../Text';
import { TooltipToggle } from '../TooltipToggle';
import { ApTooltip } from './ApTooltip';
import { Settings } from './Settings';
import { TitleBarBack } from './TitleBarBack';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRight } from './TitleBarRight';
import { TitleBarTabs } from './TitleBarTabs';
import { TitleBarWrapper } from './TitleBarWrapper';

export interface TitleBarForHeroProps {
	currentTab: string;
	hero: CurrentHeroInstanceState;
	isRedoAvailable: boolean;
	isUndoAvailable: boolean;
	locale: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	undo(): void;
	redo(): void;
	saveConfig(): void;
	saveHero(): void;
	setLocale(id?: string): void;
	setSection(id: string): void;
	setTab(id: string): void;
}

export function TitleBarForHero(props: TitleBarForHeroProps) {
	const { currentTab, hero: { ap, dependent, phase, profile: { avatar } }, isRedoAvailable, isUndoAvailable, locale, redo, saveConfig, saveHero, undo, setLocale, setSection, setTab } = props;
	const { total, spent } = ap;

	const tabs = [
		{ label: _translate(locale, 'titlebar.tabs.profile'), tag: 'profile' }
	];

	if (phase === 1) {
		tabs.push(
			{ label: _translate(locale, 'titlebar.tabs.racecultureprofession'), tag: 'rcp' }
		);
	}
	else if (phase === 2) {
		tabs.push(
			{ label: _translate(locale, 'titlebar.tabs.attributes'), tag: 'attributes' },
			{ label: _translate(locale, 'titlebar.tabs.advantagesdisadvantages'), tag: 'disadv' },
			{ label: _translate(locale, 'titlebar.tabs.skills'), tag: 'skills' },
			{ label: _translate(locale, 'titlebar.tabs.belongings'), tag: 'belongings' }
		);
	}
	else {
		tabs.push(
			{ label: _translate(locale, 'titlebar.tabs.attributes'), tag: 'attributes' },
			{ label: _translate(locale, 'titlebar.tabs.skills'), tag: 'skills' },
			{ label: _translate(locale, 'titlebar.tabs.belongings'), tag: 'belongings' }
		);
	}

	return (
		<TitleBarWrapper>
			<TitleBarLeft>
				<TitleBarBack setSection={setSection} />
				<AvatarWrapper src={avatar} />
				<TitleBarTabs active={currentTab} tabs={tabs} setTab={setTab} />
			</TitleBarLeft>
			<TitleBarRight>
				<TooltipToggle
					position="bottom"
					margin={12}
					content={<ApTooltip ap={ap} dependent={dependent} locale={locale} />}
					>
					<Text className="collected-ap">{total - spent} {_translate(locale, 'titlebar.view.adventurepoints')}</Text>
				</TooltipToggle>
				<IconButton
					icon="&#xE166;"
					onClick={undo}
					disabled={!isUndoAvailable}
					/>
				<IconButton
					icon="&#xE15A;"
					onClick={redo}
					disabled={!isRedoAvailable}
					/>
				<BorderButton
					label={_translate(locale, 'actions.save')}
					onClick={saveHero}
					/>
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
}

function showSettings(locale: UIMessages, setLocale: (id?: string) => void, saveConfig: () => void) {
	createOverlay(<Settings locale={locale} setLocale={setLocale} saveConfig={saveConfig} />);
}

function toggleDevtools() {
	remote.getCurrentWindow().webContents.toggleDevTools();
}
