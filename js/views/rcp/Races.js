import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import Dropdown from '../../components/Dropdown';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component, PropTypes } from 'react';
import RaceActions from '../../actions/RaceActions';
import RaceStore from '../../stores/RaceStore';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';
import classNames from 'classnames';

class Races extends Component {

	static propTypes = {
		changeTab: PropTypes.func
	};

	state = {
		races: RaceStore.getAllForView(),
		currentID: RaceStore.getCurrentID(),
		filter: RaceStore.getFilter(),
		sortOrder: RaceStore.getSortOrder(),
		showValues: RaceStore.areValuesVisible()
	};
	
	_updateRaceStore = () => this.setState({
		races: RaceStore.getAllForView(),
		currentID: RaceStore.getCurrentID(),
		filter: RaceStore.getFilter(),
		sortOrder: RaceStore.getSortOrder(),
		showValues: RaceStore.areValuesVisible()
	});

	selectRace = id => RaceActions.selectRace(id);
	filter = event => RaceActions.filter(event.target.value);
	sort = option => RaceActions.sort(option);
	changeValueVisibility = () => RaceActions.changeValueVisibility();
	
	componentDidMount() {
		RaceStore.addChangeListener(this._updateRaceStore);
	}
	
	componentWillUnmount() {
		RaceStore.removeChangeListener(this._updateRaceStore);
	}

	render() {
		return (
			<div className="page" id="races">
				<div className="options">
					<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
					<RadioButtonGroup active={this.state.sortOrder} onClick={this.sort} array={[
						{
							name: 'Alphabetisch',
							value: 'name'
						},
						{
							name: 'AP',
							value: 'ap'
						}
					]} />
					<Checkbox checked={this.state.showValues} onClick={this.changeValueVisibility}>Werte anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<ul>
						{
							this.state.races.map(race => {
								const className = classNames(race.id === this.state.currentID && 'active', `race-${race.id}`);

								return (
									<li key={race.id} className={className}>
										<div className="left">
											<h2>{race.name} ({race.ap} AP)</h2>
											{
												this.state.showValues ? (
													<div className="base-values">
														<div>LE {race.le}</div>
														<div>SK {race.sk}</div>
														<div>ZK {race.zk}</div>
														<div>GS {race.gs}</div>
													</div>
												) : null
											}
										</div>
										<div className="right">
											{
												race.id === this.state.currentID ? (
													<BorderButton label="Weiter" onClick={this.props.changeTab.bind(null, 'culture')} primary />
												) : (
													<BorderButton label="Auswählen" onClick={this.selectRace.bind(null, race.id)} />
												)
											}
										</div>
									</li>
								);
							})
						}
					</ul>
				</Scroll>
			</div>
		);
	}
}

export default Races;
