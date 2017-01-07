import { ActivatableInstance } from '../../utils/data/Activatable';
import { filterAndSort } from '../../utils/ListUtils';
import BorderButton from '../../components/BorderButton';
import PhaseStore from '../../stores/PhaseStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import Slidein from '../../components/Slidein';
import SpecialAbilitiesActions from '../../_actions/SpecialAbilitiesActions';
import SpecialAbilitiesListAddItem, { Deactive } from './SpecialAbilitiesListAddItem';
import SpecialAbilitiesListRemoveItem, { Active } from './SpecialAbilitiesListRemoveItem';
import SpecialAbilitiesStore from '../../stores/SpecialAbilitiesStore';
import TextField from '../../components/TextField';

interface State {
	saActive: Active[];
	saDeactive: Deactive[];
	filterText: string;
	sortOrder: string;
	phase: number;
	showAddSlidein: boolean;
}

export default class SpecialAbilities extends Component<any, State> {

	state = {
		saActive: SpecialAbilitiesStore.getActiveForView(),
		saDeactive: SpecialAbilitiesStore.getDeactiveForView(),
		filterText: SpecialAbilitiesStore.getFilter(),
		sortOrder: SpecialAbilitiesStore.getSortOrder(),
		phase: PhaseStore.get(),
		showAddSlidein: false
	};

	_updateSpecialAbilitiesStore = () => this.setState({
		saActive: SpecialAbilitiesStore.getActiveForView(),
		saDeactive: SpecialAbilitiesStore.getDeactiveForView(),
		filterText: SpecialAbilitiesStore.getFilter(),
		sortOrder: SpecialAbilitiesStore.getSortOrder()
	} as State);

	filter = event => SpecialAbilitiesActions.filter(event.target.value);
	sort = option => SpecialAbilitiesActions.sort(option);
	changeView = option => SpecialAbilitiesActions.changeView(option);
	addToList = id => SpecialAbilitiesActions.addToList(id);
	removeFromList = id => SpecialAbilitiesActions.removeFromList(id);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	componentDidMount() {
		SpecialAbilitiesStore.addChangeListener(this._updateSpecialAbilitiesStore );
	}

	componentWillUnmount() {
		SpecialAbilitiesStore.removeChangeListener(this._updateSpecialAbilitiesStore );
	}

	render() {

		const { filterText, phase, saActive, saDeactive, showAddSlidein, sortOrder } = this.state;

		const sortArray = [
			{ name: 'Alphabetisch', value: 'name' },
			{ name: 'Nach Gruppe', value: 'group' }
		];

		const listActive = filterAndSort(saActive, filterText, sortOrder);
		const listDeactive = filterAndSort(saDeactive, filterText, sortOrder);

		return (
			<div className="page" id="specialabilities">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
						<RadioButtonGroup
							active={sortOrder}
							onClick={this.sort}
							array={sortArray}
							/>
					</div>
					<Scroll className="list">
						<table className="list large-list">
							<thead>
								<tr>
									<td className="type">Gruppe</td>
									<td className="name">Sonderfertigkeit</td>
									<td className="ap">AP</td>
									<td className="inc"></td>
								</tr>
							</thead>
							<tbody>
								{
									listDeactive.map((sa, index) => <SpecialAbilitiesListAddItem key={`SA_DEACTIVE_${index}`} item={sa} />)
								}
							</tbody>
						</table>
					</Scroll>
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={sortArray}
						/>
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
				</div>
				<Scroll className="list">
					<table className="list large-list">
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="name">Sonderfertigkeit</td>
								<td className="ap">AP</td>
								{ phase < 3 ? (
									<td className="inc"></td>
								) : null }
							</tr>
						</thead>
						<tbody>
							{
								listActive.map((sa, index) => <SpecialAbilitiesListRemoveItem key={`SA_ACTIVE_${index}`} item={sa} phase={phase} />)
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}
