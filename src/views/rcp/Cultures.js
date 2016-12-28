import Checkbox from '../../components/Checkbox';
import CultureActions from '../../actions/CultureActions';
import CulturesListItem from './CulturesListItem';
import CultureStore from '../../stores/CultureStore';
import Dropdown from '../../components/Dropdown';
import { filterAndSort } from '../../utils/ListUtils';
import RaceStore from '../../stores/RaceStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component, PropTypes } from 'react';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';

const getCultureStore = () => ({
	cultures: CultureStore.getAll(),
	currentID: CultureStore.getCurrentID(),
	filterText: CultureStore.getFilter(),
	sortOrder: CultureStore.getSortOrder(),
	showDetails: CultureStore.areValuesVisible(),
	showAllCultures: CultureStore.areAllVisible()
});

export default class Cultures extends Component {

	static propTypes = {
		changeTab: PropTypes.func
	};

	state = getCultureStore();
	
	_updateCultureStore = () => this.setState(getCultureStore());

	filter = event => CultureActions.filter(event.target.value);
	sort = option => CultureActions.sort(option);
	changeValueVisibility = () => CultureActions.changeValueVisibility();
	changeView = view => CultureActions.changeView(view);
	
	componentDidMount() {
		CultureStore.addChangeListener(this._updateCultureStore);
	}
	
	componentWillUnmount() {
		CultureStore.removeChangeListener(this._updateCultureStore);
	}

	render() {

		const { currentID, filterText, cultures, showAllCultures, showDetails, sortOrder } = this.state;

		const currentRace = RaceStore.getCurrent();

		const list = filterAndSort(cultures.filter(e => showAllCultures || currentRace.typ_cultures.includes(e.id)), filterText, sortOrder);

		return (
			<div className="page" id="cultures">
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<Dropdown
						value={showAllCultures}
						onChange={this.changeView}
						options={[['Alle Kulturen', true], ['Übliche Kulturen', false]]}
						fullWidth
						/>
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={[
							{ name: 'Alphabetisch', value: 'name' },
							{ name: 'Nach Kosten', value: 'cost' }
						]}
						/>
					<Checkbox checked={showDetails} onClick={this.changeValueVisibility}>Werte anzeigen</Checkbox>
				</div>
				<Scroll className="list">
					<ul>
						{
							list.map(culture => <CulturesListItem
								key={culture.id}
								changeTab={this.props.changeTab.bind(null, 'profession')}
								currentID={currentID}
								culture={culture}
								showDetails={showDetails}
								/>
							)
						}
					</ul>
				</Scroll>
			</div>
		);
	}
}
