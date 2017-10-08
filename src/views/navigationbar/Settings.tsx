import * as React from 'react';
import { Dialog } from '../../components/DialogNew';
import { Dropdown } from '../../components/Dropdown';
import { SegmentedControls } from '../../components/SegmentedControls';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface SettingsProps {
	locale: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	showSettings?: boolean;
	theme: string;
	close(): void;
	saveConfig(): void;
	setLocale(id?: string): void;
	setTheme(id: string): void;
}

export function Settings(props: SettingsProps) {
	const { close, locale, localeString, localeType, setLocale, setTheme, saveConfig, showSettings, theme } = props;

	return (
		<Dialog
			id="settings"
			title={_translate(locale, 'settings.title')}
			buttons={[{label: _translate(locale, 'settings.actions.close'), onClick: saveConfig }]}
			close={close}
			isOpened={showSettings}
			>
			<Dropdown
				options={[
					{name: _translate(locale, 'settings.options.defaultlanguage')},
					{id: 'de-DE', name: 'Deutsch (Deutschland)'},
					{id: 'en-US', name: 'English (United States)'}
				]}
				value={localeType === 'default' ? undefined : localeString}
				label={_translate(locale, 'settings.options.language')}
				onChange={setLocale}
				/>
			<p>{_translate(locale, 'settings.options.languagehint')}</p>
			<SegmentedControls
				options={[
					{name: _translate(locale, 'settings.options.themedark'), value: 'dark'},
					{name: _translate(locale, 'settings.options.themelight'), value: 'light'}
				]}
				active={theme}
				onClick={setTheme}
				label={_translate(locale, 'settings.options.theme')}
				/>
		</Dialog>
	);
}
