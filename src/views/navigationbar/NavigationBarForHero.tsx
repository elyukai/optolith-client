import { remote } from 'electron';
import * as React from 'react';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { IconButton } from '../../components/IconButton';
import { Text } from '../../components/Text';
import { TooltipToggle } from '../../components/TooltipToggle';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { ApTooltip } from './ApTooltip';
import { NavigationBarBack } from './NavigationBarBack';
import { NavigationBarLeft } from './NavigationBarLeft';
import { NavigationBarRight } from './NavigationBarRight';
import { NavigationBarTabs } from './NavigationBarTabs';
import { NavigationBarWrapper } from './NavigationBarWrapper';
import { Settings } from './Settings';

export interface NavigationBarForHeroProps {
	currentTab: string;
	hero: CurrentHeroInstanceState;
	isRedoAvailable: boolean;
	isUndoAvailable: boolean;
	locale: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	showSettings?: boolean;
	theme: string;
	closeSettings(): void;
	openSettings(): void;
	undo(): void;
	redo(): void;
	saveConfig(): void;
	saveHero(): void;
	setLocale(id?: string): void;
	setSection(id: string): void;
	setTab(id: string): void;
	setTheme(id: string): void;
}

export function NavigationBarForHero(props: NavigationBarForHeroProps) {
	const { closeSettings, currentTab, hero: { ap, dependent, phase, profile: { avatar } }, isRedoAvailable, isUndoAvailable, locale, openSettings, redo, saveHero, undo, setSection, setTab } = props;
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
		<NavigationBarWrapper>
			<NavigationBarLeft>
				<NavigationBarBack setSection={setSection} />
				<AvatarWrapper src={avatar} />
				<NavigationBarTabs active={currentTab} tabs={tabs} setTab={setTab} />
			</NavigationBarLeft>
			<NavigationBarRight>
				<TooltipToggle
					position="bottom"
					margin={12}
					content={<ApTooltip ap={ap} dependent={dependent} locale={locale} />}
					>
					<Text className="collected-ap">{total - spent} {_translate(locale, 'titlebar.view.adventurepoints')}</Text>
				</TooltipToggle>
				<IconButton
					icon="&#xE90f;"
					onClick={undo}
					disabled={!isUndoAvailable}
					/>
				<IconButton
					icon="&#xE910;"
					onClick={redo}
					disabled={!isRedoAvailable}
					/>
				<BorderButton
					label={_translate(locale, 'actions.save')}
					onClick={saveHero}
					/>
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
}

function toggleDevtools() {
	remote.getCurrentWindow().webContents.toggleDevTools();
}
