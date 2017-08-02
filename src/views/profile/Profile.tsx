import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { PersonalDataContainer } from '../../containers/PersonalData';
import { SheetsContainer } from '../../containers/Sheets';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { OptionalRules } from './OptionalRules';

export interface ProfileOwnProps {
	locale: UIMessages;
}

export interface ProfileStateProps {
	phase: number;
}

export interface ProfileDispatchProps {}

export type ProfileProps = ProfileStateProps & ProfileDispatchProps & ProfileOwnProps;

export interface ProfileState {
	tab: string;
}

export class Profile extends React.Component<ProfileProps, ProfileState> {
	state = {
		tab: 'profileoverview',
	};

	handleClick = (tab: string) => this.setState({ tab } as ProfileState);

	render() {
		const { locale, phase } = this.props;
		const { tab } = this.state;

		let element;

		switch (tab) {
			case 'profileoverview':
				element = <PersonalDataContainer locale={locale} />;
				break;
			case 'sheets':
				element = <SheetsContainer locale={locale} />;
				break;
			case 'optionalRules':
				element = <OptionalRules />;
				break;
		}

		const tabs = [
			{
				id: 'profileoverview',
				label: _translate(locale, 'titlebar.tabs.profileoverview'),
			},
			{
				id: 'personaldata',
				label: _translate(locale, 'titlebar.tabs.personaldata'),
				disabled: true
			},
		];

		if (phase === 3) {
			tabs.push({
				id: 'sheets',
				label: _translate(locale, 'titlebar.tabs.charactersheet'),
			}, {
				id: 'optionalRules',
				label: _translate(locale, 'titlebar.tabs.rules'),
			});
		}

		return (
			<section id="profile">
				<SubTabs
					tabs={tabs}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
