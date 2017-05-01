import * as React from 'react';
import { setLocale } from '../../actions/LocaleActions';
import { getLocale, LocaleStore } from '../../stores/LocaleStore';
import { Dialog } from '../Dialog';
import { Dropdown } from '../Dropdown';

export interface SettingsProps {
	node?: HTMLDivElement;
}

export interface SettingsState {
	locale?: string;
	localeType: string;
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
	state = {
		locale: LocaleStore.getCurrentId(),
		localeType: LocaleStore.getCurrentIdType()
	};

	componentDidMount() {
		LocaleStore.addChangeListener(this.updateLocaleStore);
	}

	componentWillUnmount() {
		LocaleStore.removeChangeListener(this.updateLocaleStore);
	}

	selectLocale = (id?: string) => {
		setLocale(id);
	}

	render() {
		const { locale, localeType } = this.state;

		return (
			<Dialog
				id="settings"
				title={getLocale()['settings.title']}
				node={this.props.node}
				buttons={[{label: getLocale()['settings.actions.close']}]}
				>
				<Dropdown
					options={[
						{name: getLocale()['settings.options.defaultlanguage']},
						{id: 'de-DE', name: 'Deutsch (Deutschland)'},
						{id: 'en-US', name: 'English (United States)'}
					]}
					value={localeType === 'default' ? undefined : locale}
					label={getLocale()['settings.options.language']}
					onChange={this.selectLocale}
					/>
			</Dialog>
		);
	}

	private updateLocaleStore = () => {
		this.setState({
			locale: LocaleStore.getCurrentId(),
			localeType: LocaleStore.getCurrentIdType()
		} as SettingsState);
	}
}
