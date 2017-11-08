import { remote } from 'electron';
import * as React from 'react';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { IconButton } from '../../components/IconButton';
import { Text } from '../../components/Text';
import { TooltipToggle } from '../../components/TooltipToggle';
import { SettingsContainer } from '../../containers/Settings';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { ApTooltip } from './ApTooltip';
import { NavigationBarBack } from './NavigationBarBack';
import { NavigationBarLeft } from './NavigationBarLeft';
import { NavigationBarRight } from './NavigationBarRight';
import { NavigationBarTabs } from './NavigationBarTabs';
import { NavigationBarWrapper } from './NavigationBarWrapper';

export interface NavigationBarForHeroProps {
	currentTab: string;
	hero: CurrentHeroInstanceState;
	isRedoAvailable: boolean;
	isUndoAvailable: boolean;
	isRemovingEnabled: boolean;
	locale: UIMessages;
	showSettings?: boolean;
	closeSettings(): void;
	openSettings(): void;
	undo(): void;
	redo(): void;
	saveHero(): void;
	setSection(id: string): void;
	setTab(id: string): void;
}

export function NavigationBarForHero(props: NavigationBarForHeroProps) {
	const { closeSettings, currentTab, hero: { ap, dependent, phase, profile: { avatar } }, isRedoAvailable, isUndoAvailable, locale, openSettings, redo, saveHero, undo, setSection, setTab, isRemovingEnabled } = props;
	const { total, spent } = ap;

	const tabs = [
		{ label: _translate(locale, 'titlebar.tabs.profile'), tag: 'profile' }
	];

	if (phase === 1) {
		tabs.push(
			{ label: _translate(locale, 'titlebar.tabs.racecultureprofession'), tag: 'rcp' }
		);
	}
	else {
		tabs.push(
			{ label: _translate(locale, 'titlebar.tabs.attributes'), tag: 'attributes' },
		);
		if (isRemovingEnabled) {
			tabs.push(
				{ label: _translate(locale, 'titlebar.tabs.advantagesdisadvantages'), tag: 'disadv' },
			);
		}
		tabs.push(
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
				<SettingsContainer {...props} close={closeSettings} />
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
