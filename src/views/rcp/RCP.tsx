import * as React from 'react';
import Cultures from './Cultures';
import CultureStore from '../../stores/CultureStore';
import Professions from './Professions';
import Races from './Races';
import RaceStore from '../../stores/RaceStore';
import SubTabs from '../../components/SubTabs';

interface State {
	cultureID: string | null;
	raceID: string | null;
	tab: string;
}

export default class RCP extends React.Component<undefined, State> {
	state = {
		tab: 'race',
		raceID: RaceStore.getCurrentID(),
		cultureID: CultureStore.getCurrentID()
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
				label: 'Spezies',
				tag: 'race'
			}
		];

		if (raceID) {
			tabs.push({
				label: 'Kultur',
				tag: 'culture'
			});
		}
		if (cultureID) {
			tabs.push({
				label: 'Profession',
				tag: 'profession'
			});
		}

		return (
			<section id="rcp">
				<SubTabs
					tabs={tabs}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
