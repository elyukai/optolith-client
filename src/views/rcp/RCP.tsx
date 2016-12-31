import Cultures from './Cultures';
import CultureStore from '../../stores/CultureStore';
import Professions from './Professions';
import Races from './Races';
import RaceStore from '../../stores/RaceStore';
import React, { Component } from 'react';
import SubTabs from '../../components/SubTabs';

interface State {
	cultureID: string;
	raceID: string;
	tab: string;
}

export default class RCP extends Component<any, State> {

	state = {
		tab: 'race',
		raceID: RaceStore.getCurrentID(),
		cultureID: CultureStore.getCurrentID()
	};
	
	_updateCultureStore = () => this.setState({ cultureID: CultureStore.getCurrentID() } as State);
	_updateRaceStore = () => this.setState({ raceID: RaceStore.getCurrentID() } as State);

	handleClick = tab => this.setState({ tab } as State);
	
	componentDidMount() {
		CultureStore.addChangeListener(this._updateCultureStore);
		RaceStore.addChangeListener(this._updateRaceStore);
	}
	
	componentWillUnmount() {
		CultureStore.removeChangeListener(this._updateCultureStore);
		RaceStore.removeChangeListener(this._updateRaceStore);
	}

	render() {

		var element;

		switch (this.state.tab) {
			case 'race':
				element = <Races changeTab={this.handleClick} />;
				break;
			case 'culture':
				element = <Cultures changeTab={this.handleClick} />;
				break;
			case 'profession':
				element = <Professions changeTab={this.handleClick} />;
				break;
		}

		const { raceID, cultureID } = this.state;

		return (
			<section id="rcp">
				<SubTabs
					tabs={[
						{
							label: 'Spezies',
							tag: 'race'
						},
						{
							label: 'Kultur',
							tag: 'culture',
							disabled: raceID === null
						},
						{
							label: 'Profession',
							tag: 'profession',
							disabled: cultureID === null
						}
					]}
					active={this.state.tab}
					onClick={this.handleClick} />
				{element}
			</section>
		);
	}
}
