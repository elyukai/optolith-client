import * as React from 'react';
import { Dialog } from '../../components/DialogNew';
import { Dropdown } from '../../components/Dropdown';
import { SegmentedControls } from '../../components/SegmentedControls';
import { store } from '../../stores/AppStore';
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

export interface SettingsState {
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
	constructor() {
		super();
		const { locale: { id, type }, ui: { settings: { theme }}} = store.getState();
		this.state = {
			localeString: id,
			localeType: type,
			theme
		};
	}

	unsubscribe: () => void;

	componentDidMount() {
		this.unsubscribe = store.subscribe(() => {
			const { locale: { id, type }, ui: { settings: { theme }}} = store.getState();
			this.setState({
				localeString: id,
				localeType: type,
				theme
			});
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const { close, locale, localeString, localeType, setLocale, setTheme, saveConfig, showSettings, theme } = this.props;

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
}
