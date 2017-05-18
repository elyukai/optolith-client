import * as React from 'react';
import { setLocale } from '../../actions/LocaleActions';
import { LocaleStore } from '../../stores/LocaleStore';
import { saveConfig } from '../../utils/FileAPIUtils';
import { translate } from '../../utils/I18n';
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
		locale: LocaleStore.getLocale(),
		localeType: LocaleStore.getLocaleType()
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
				title={translate('settings.title')}
				node={this.props.node}
				buttons={[{label: translate('settings.actions.close'), onClick: saveConfig }]}
				>
				<Dropdown
					options={[
						{name: translate('settings.options.defaultlanguage')},
						{id: 'de-DE', name: 'Deutsch (Deutschland)'},
						{id: 'en-US', name: 'English (United States)'}
					]}
					value={localeType === 'default' ? undefined : locale}
					label={translate('settings.options.language')}
					onChange={this.selectLocale}
					/>
			</Dialog>
		);
	}

	private updateLocaleStore = () => {
		this.setState({
			locale: LocaleStore.getLocale(),
			localeType: LocaleStore.getLocaleType()
		} as SettingsState);
	}
}
