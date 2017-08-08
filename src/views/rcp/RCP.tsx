import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { CulturesContainer } from '../../containers/Cultures';
import { ProfessionsContainer } from '../../containers/Professions';
import { RacesContainer } from '../../containers/Races';
import { _translate, UIMessages } from '../../utils/I18n';

export interface RCPOwnProps {
	locale: UIMessages;
}

export interface RCPStateProps {
	currentCultureId?: string;
	currentRaceId?: string;
}

export interface RCPDispatchProps {}

export type RCPProps = RCPStateProps & RCPDispatchProps & RCPOwnProps;

export interface RCPState {
	tab: string;
}

export class RCP extends React.Component<RCPProps, RCPState> {
	state = {
		tab: 'race',
	};

	handleClick = (tab: string) => this.setState({ tab } as RCPState);
	switchToCultures = () => this.setState({ tab: 'culture' } as RCPState);
	switchToProfessions = () => this.setState({ tab: 'profession' } as RCPState);

	render() {
		const { currentCultureId, currentRaceId, locale } = this.props;

		let element;

		switch (this.state.tab) {
			case 'race':
				element = <RacesContainer switchToCultures={this.switchToCultures} locale={locale} />;
				break;
			case 'culture':
				element = <CulturesContainer switchToProfessions={this.switchToProfessions} locale={locale} />;
				break;
			case 'profession':
				element = <ProfessionsContainer locale={locale} />;
				break;
		}

		const tabs = [
			{
				id: 'race',
				label: _translate(locale, 'titlebar.tabs.race'),
			},
		];

		if (currentRaceId) {
			tabs.push({
				id: 'culture',
				label: _translate(locale, 'titlebar.tabs.culture'),
			});
		}
		if (currentCultureId) {
			tabs.push({
				id: 'profession',
				label: _translate(locale, 'titlebar.tabs.profession'),
			});
		}

		return (
			<section id="rcp">
				<SubTabs
					tabs={tabs}
					active={this.state.tab}
					onClick={this.handleClick}
					/>
				{element}
			</section>
		);
	}
}
