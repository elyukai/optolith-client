import { remote } from 'electron';
import * as React from 'react';
import { UIMessages } from '../../types/ui.d';
import { createOverlay } from '../../utils/createOverlay';
import { _translate } from '../../utils/I18n';
import { BorderButton } from '../BorderButton';
import { IconButton } from '../IconButton';
import { Text } from '../Text';
import { Settings } from './Settings';
import { TitleBarBack } from './TitleBarBack';
import { TitleBarLeft } from './TitleBarLeft';
import { TitleBarRight } from './TitleBarRight';
import { TitleBarWrapper } from './TitleBarWrapper';

export interface TitleBarForGroupProps {
	locale: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	groupName: string;
	saveConfig(): void;
	saveGroup(): void;
	setLocale(id?: string): void;
	setSection(id: string): void;
}

export function TitleBarForGroup(props: TitleBarForGroupProps) {
	const { groupName, locale, saveGroup, setLocale, setSection } = props;
	return (
		<TitleBarWrapper>
			<TitleBarLeft>
				<TitleBarBack setSection={setSection} />
				<Text>{groupName}</Text>
			</TitleBarLeft>
			<TitleBarRight>
				<BorderButton
					label={_translate(locale, 'actions.save')}
					onClick={saveGroup}
					/>
				<IconButton
					icon="&#xE8B8;"
					onClick={showSettings.bind(null, locale, setLocale)}
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
