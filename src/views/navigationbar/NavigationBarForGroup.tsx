import { remote } from 'electron';
import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { IconButton } from '../../components/IconButton';
import { Text } from '../../components/Text';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { NavigationBarBack } from './NavigationBarBack';
import { NavigationBarLeft } from './NavigationBarLeft';
import { NavigationBarRight } from './NavigationBarRight';
import { NavigationBarWrapper } from './NavigationBarWrapper';
import { Settings } from './Settings';

export interface NavigationBarForGroupProps {
	locale: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	groupName: string;
	showSettings?: boolean;
	theme: string;
	closeSettings(): void;
	openSettings(): void;
	saveConfig(): void;
	saveGroup(): void;
	setLocale(id?: string): void;
	setSection(id: string): void;
	setTheme(id: string): void;
}

export function NavigationBarForGroup(props: NavigationBarForGroupProps) {
	const { closeSettings, groupName, locale, openSettings, saveGroup, setSection } = props;
	return (
		<NavigationBarWrapper>
			<NavigationBarLeft>
				<NavigationBarBack setSection={setSection} />
				<Text>{groupName}</Text>
			</NavigationBarLeft>
			<NavigationBarRight>
				<BorderButton
					label={_translate(locale, 'actions.save')}
					onClick={saveGroup}
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
