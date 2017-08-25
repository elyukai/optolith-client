import * as React from 'react';
import { store } from '../../stores/AppStore';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { Dialog } from '../Dialog';
import { Dropdown } from '../Dropdown';

export interface SettingsProps {
	locale: UIMessages;
	node?: HTMLDivElement;
	saveConfig(): void;
	setLocale(id?: string): void;
}

export interface SettingsState {
	localeString?: string;
	localeType: 'default' | 'set';
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
	constructor() {
		super();
		const { id, type } = store.getState().locale;
		this.state = {
			localeString: id,
			localeType: type
		};
	}

	unsubscribe: () => void;

	componentDidMount() {
		this.unsubscribe = store.subscribe(() => {
			const { id, type } = store.getState().locale;
			this.setState({
				localeString: id,
				localeType: type
			});
		});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const { locale, node, setLocale, saveConfig } = this.props;
		const { localeString, localeType } = this.state;

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
			</Dialog>
		);
	}
}
