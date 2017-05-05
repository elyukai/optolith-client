import * as React from 'react';
import { SubTabs } from '../../components/SubTabs';
import { PhaseStore } from '../../stores/PhaseStore';
import { translate } from '../../utils/I18n';
import { OptionalRules } from './OptionalRules';
import { Overview } from './Overview';
import { Sheets } from './Sheets';

interface ProfileState {
	phase: number;
	tab: string;
}

export class Profile extends React.Component<{}, ProfileState> {

	state = {
		phase: PhaseStore.get(),
		tab: 'overview',
	};

	_updatePhaseStore = () => this.setState({ phase: PhaseStore.get() } as ProfileState);

	handleClick = (tab: string) => this.setState({ tab } as ProfileState);

	componentDidMount() {
		PhaseStore.addChangeListener(this._updatePhaseStore );
	}

	componentWillUnmount() {
		PhaseStore.removeChangeListener(this._updatePhaseStore );
	}

	render() {

		const { phase, tab } = this.state;

		let element;

		switch (tab) {
			case 'overview':
				element = <Overview />;
				break;
			case 'sheets':
				element = <Sheets />;
				break;
			case 'optionalRules':
				element = <OptionalRules />;
				break;
		}

		const tabs = [
			{
				id: 'overview',
				label: translate('titlebar.tabs.profileoverview'),
			},
		];

		if (phase === 3) {
			tabs.push({
				id: 'sheets',
				label: translate('titlebar.tabs.charactersheet'),
			}, {
				id: 'optionalRules',
				label: translate('titlebar.tabs.rules'),
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
