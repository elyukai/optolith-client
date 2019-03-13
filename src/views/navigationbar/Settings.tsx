import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { Dialog } from '../../components/DialogNew';
import { Dropdown } from '../../components/Dropdown';
import { SegmentedControls } from '../../components/SegmentedControls';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';

export interface SettingsOwnProps {
	locale: UIMessages;
	isSettingsOpen: boolean;
	platform: string;
	close(): void;
	checkForUpdates(): void;
}

export interface SettingsStateProps {
	localeString?: string;
	localeType: 'default' | 'set';
	theme: string;
	isEditingHeroAfterCreationPhaseEnabled: boolean;
	areAnimationsEnabled: boolean;
}

export interface SettingsDispatchProps {
	saveConfig(): void;
	setLocale(id?: string): void;
	setTheme(id: string): void;
	switchEnableEditingHeroAfterCreationPhase(): void;
	switchEnableAnimations(): void;
}

export type SettingsProps = SettingsStateProps & SettingsDispatchProps & SettingsOwnProps;

export function Settings(props: SettingsProps) {
	const { close, isEditingHeroAfterCreationPhaseEnabled, locale, localeString, localeType, setLocale, setTheme, saveConfig, isSettingsOpen, theme, switchEnableEditingHeroAfterCreationPhase, switchEnableAnimations, areAnimationsEnabled, platform, checkForUpdates } = props;

	return (
		<Dialog
			id="settings"
			title={_translate(locale, 'settings.title')}
			buttons={[{label: _translate(locale, 'settings.actions.close'), onClick: saveConfig }]}
			close={close}
			isOpened={isSettingsOpen}
			>
			<Dropdown
				options={[
					{name: _translate(locale, 'settings.options.defaultlanguage')},
					{id: 'de-DE', name: 'Deutsch (Deutschland)'},
					{id: 'en-US', name: 'English (United States)'},
					{id: 'nl-BE', name: 'Nederlands (België)'}
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
			<Checkbox
				checked={isEditingHeroAfterCreationPhaseEnabled}
				className="editor-switch"
				label={_translate(locale, 'enableeditingheroaftercreationphase')}
				onClick={switchEnableEditingHeroAfterCreationPhase}
				/>
			<Checkbox
				checked={areAnimationsEnabled}
				className="animations"
				label={_translate(locale, 'settings.options.showanimations')}
				onClick={switchEnableAnimations}
				/>
			<BorderButton
				label={_translate(locale, 'checkforupdates')}
				onClick={checkForUpdates}
				autoWidth
				/>
		</Dialog>
	);
}
