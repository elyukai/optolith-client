import { ItemInstance } from '../../utils/data/Item';
import { filterAndSort } from '../../utils/ListUtils';
import BorderButton from '../../components/BorderButton';
import createOverlay from '../../utils/createOverlay';
import InventoryActions from '../../actions/InventoryActions';
import InventoryListItem from './InventoryListItem';
import InventoryStore from '../../stores/InventoryStore';
import ItemEditor from './ItemEditor';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import Slidein from '../../components/Slidein';
import SortOptions from '../../components/SortOptions';
import TextField from '../../components/TextField';

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Munition', 'Rüstungen', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

interface State {
	items: ItemInstance[];
	filterText: string;
	sortOrder: string;
	templates: ItemInstance[];
	showAddSlidein: boolean;
}

const getInventoryStore = () => ({
	items: InventoryStore.getAll(),
	filterText: InventoryStore.getFilterText(),
	sortOrder: InventoryStore.getSortOrder(),
} as State);

export default class Inventory extends Component<any, State> {

	state = {
		...getInventoryStore(),
		templates: InventoryStore.getAllTemplates(),
		showAddSlidein: false
	};

	_updateInventoryStore = () => this.setState(getInventoryStore());

	filter = event => InventoryActions.filter(event.target.value);
	sort = option => InventoryActions.sort(option);

	componentDidMount() {
		InventoryStore.addChangeListener(this._updateInventoryStore);
	}

	componentWillUnmount() {
		InventoryStore.removeChangeListener(this._updateInventoryStore);
	}

	showItemCreation = () => createOverlay(<ItemEditor create />);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	render() {

		const { filterText, items, showAddSlidein, sortOrder, templates } = this.state;

		const list = filterAndSort(items, filterText, sortOrder, GROUPS);
		const templateList = filterAndSort(templates, filterText, 'name');

		return (
			<div className="page" id="inventory">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					</div>
					<Scroll className="list">
						<table className="list large-list">
							<thead>
								<tr>
									<td className="name">Gegenstand</td>
									<td className="inc"></td>
								</tr>
							</thead>
							<tbody>
								{
									templateList.map(obj => <InventoryListItem key={obj.id} data={obj} add />)
								}
							</tbody>
						</table>
					</Scroll>
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						options={[ 'name', 'groupname', 'where' ]}
						sortOrder={sortOrder}
						sort={this.sort}
						/>
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
					<BorderButton label="Erstellen" onClick={this.showItemCreation} />
				</div>
				<Scroll className="list">
					<table className="list large-list">
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
								list.map(obj => <InventoryListItem key={obj.id} data={obj} />)
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}
