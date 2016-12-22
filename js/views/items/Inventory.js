import { filterAndSort } from '../../utils/ListUtils';
import BorderButton from '../../components/BorderButton';
import InventoryActions from '../../actions/InventoryActions';
import InventoryStore from '../../stores/InventoryStore';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import TextField from '../../components/TextField';

const getInventoryStore = () => ({
	items: InventoryStore.getAll(),
	filterText: InventoryStore.getFilterText(),
	sortOrder: InventoryStore.getSortOrder(),
});

export default class Inventory extends Component {

	state = getInventoryStore();
	
	_updateInventoryStore = () => this.setState(getInventoryStore());

	filter = event => InventoryActions.filter(event.target.value);
	sort = option => InventoryActions.sort(option);
	
	componentDidMount() {
		InventoryStore.addChangeListener(this._updateInventoryStore);
	}
	
	componentWillUnmount() {
		InventoryStore.removeChangeListener(this._updateInventoryStore);
	}

	showItemCreation = () => InventoryActions.showItemCreation();

	render() {

		const { filterText, items, sortOrder } = this.state;

		const list = filterAndSort(items, filterText, sortOrder);

		return (
			<div className="page" id="inventory">
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<RadioButtonGroup
						active={sortOrder}
						onClick={this.sort}
						array={[
							{ name: 'Alphabetisch', value: 'name' },
							{ name: 'Gruppen', value: 'group' }
						]}
						/>
						<BorderButton label="Hinzufügen" disabled />
						<BorderButton label="Erstellen" onClick={this.showItemCreation} />
				</div>
				<Scroll className="list">
					<table>
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="number">#</td>
								<td className="name">Gegenstand</td>
								<td className="price">Wert</td>
								<td className="weight">Gewicht</td>
								<td className="where">Wo getragen</td>
								<td className="inc"></td>
							</tr>
						</thead>
						<tbody>
							{
								list
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}
