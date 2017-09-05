import * as React from 'react';
import { store } from '../../stores/AppStore';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { Dialog } from '../Dialog';
import { Dropdown } from '../Dropdown';
import { SegmentedControls } from '../SegmentedControls';

export interface SettingsProps {
	locale: UIMessages;
	node?: HTMLDivElement;
	saveConfig(): void;
	setLocale(id?: string): void;
	setTheme(id: string): void;
}

export interface SettingsState {
	localeString?: string;
	localeType: 'default' | 'set';
	theme: string;
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
		const { locale, node, setLocale, setTheme, saveConfig } = this.props;
		const { localeString, localeType, theme } = this.state;

		return (
			<Dialog
				id="settings"
				title={_translate(locale, 'settings.title')}
				node={node}
				buttons={[{label: _translate(locale, 'settings.actions.close'), onClick: saveConfig }]}
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
