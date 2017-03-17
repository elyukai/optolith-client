import * as React from 'react';
import SubTabs from '../../components/SubTabs';
import CultureStore from '../../stores/CultureStore';
import RaceStore from '../../stores/RaceStore';
import Cultures from './Cultures';
import Professions from './Professions';
import Races from './Races';

interface State {
	cultureID: string | null;
	raceID: string | null;
	tab: string;
}

export default class RCP extends React.Component<undefined, State> {
	state = {
		cultureID: CultureStore.getCurrentID(),
		raceID: RaceStore.getCurrentID(),
		tab: 'race',
	};

	_updateCultureStore = () => this.setState({ cultureID: CultureStore.getCurrentID() } as State);
	_updateRaceStore = () => this.setState({ raceID: RaceStore.getCurrentID() } as State);

	handleClick = (tab: string) => this.setState({ tab } as State);

	componentDidMount() {
		CultureStore.addChangeListener(this._updateCultureStore);
		RaceStore.addChangeListener(this._updateRaceStore);
	}

	componentWillUnmount() {
		CultureStore.removeChangeListener(this._updateCultureStore);
		RaceStore.removeChangeListener(this._updateRaceStore);
	}

	render() {
		let element;

		switch (this.state.tab) {
			case 'race':
				element = <Races changeTab={this.handleClick} />;
				break;
			case 'culture':
				element = <Cultures changeTab={this.handleClick} />;
				break;
			case 'profession':
				element = <Professions />;
				break;
		}

		const { raceID, cultureID } = this.state;

		const tabs = [
			{
				id: 'race',
				label: 'Spezies',
			},
		];

		if (raceID) {
			tabs.push({
				id: 'culture',
				label: 'Kultur',
			});
		}
		if (cultureID) {
			tabs.push({
				id: 'profession',
				label: 'Profession',
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
