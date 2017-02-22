import { filterAndSort } from '../../utils/ListUtils';
import * as EquipmentActions from '../../actions/EquipmentActions';
import * as React from 'react';
import Aside from '../../components/Aside';
import BorderButton from '../../components/BorderButton';
import createOverlay from '../../utils/createOverlay';
import EquipmentListItem from './EquipmentListItem';
import EquipmentStore from '../../stores/EquipmentStore';
import ItemEditor from './ItemEditor';
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
	purse: {
		d: string;
		s: string;
		h: string;
		k: string;
	};
	showAddSlidein: boolean;
}

export default class Inventory extends React.Component<undefined, State> {
	state = {
		items: EquipmentStore.getAll(),
		filterText: '',
		sortOrder: EquipmentStore.getSortOrder(),
		templates: EquipmentStore.getAllTemplates(),
		purse: EquipmentStore.getPurse(),
		showAddSlidein: false
	};

	private updateEquipmentStore = () => this.setState({ items: EquipmentStore.getAll(), sortOrder: EquipmentStore.getSortOrder(), purse: EquipmentStore.getPurse() } as State);

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	sort = (option: string) => EquipmentActions.setSortOrder(option);
	setDucates = (event: InputTextEvent) => EquipmentActions.setDucates(event.target.value as string);
	setSilverthalers = (event: InputTextEvent) => EquipmentActions.setSilverthalers(event.target.value as string);
	setHellers = (event: InputTextEvent) => EquipmentActions.setHellers(event.target.value as string);
	setKreutzers = (event: InputTextEvent) => EquipmentActions.setKreutzers(event.target.value as string);

	componentDidMount() {
		EquipmentStore.addChangeListener(this.updateEquipmentStore);
	}

	componentWillUnmount() {
		EquipmentStore.removeChangeListener(this.updateEquipmentStore);
	}

	showItemCreation = () => createOverlay(<ItemEditor create item={{} as ItemInstance} />);
	showAddSlidein = () => this.setState({ showAddSlidein: true } as State);
	hideAddSlidein = () => this.setState({ showAddSlidein: false } as State);

	render() {

		const { filterText, items, showAddSlidein, sortOrder, templates, purse } = this.state;

		const list = filterAndSort(items, filterText, sortOrder, GROUPS);
		const templateList = filterAndSort(templates, filterText, 'name');

		return (
			<div className="page" id="equipment">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					</div>
					<Scroll className="list">
						<div className="list-wrapper">
							{
								templateList.map(obj => <EquipmentListItem key={obj.id} data={obj} add />)
							}
						</div>
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
					<div className="list-wrapper">
						{
							list.map(obj => <EquipmentListItem key={obj.id} data={obj} />)
						}
					</div>
				</Scroll>
				<Aside>
					<div className="purse">
						<h4>Geldbeutel</h4>
						<div className="fields">
							<TextField label="D" value={purse.d} onChange={this.setDucates} />
							<TextField label="S" value={purse.s} onChange={this.setSilverthalers} />
							<TextField label="H" value={purse.h} onChange={this.setHellers} />
							<TextField label="K" value={purse.k} onChange={this.setKreutzers} />
						</div>
					</div>
				</Aside>
			</div>
		);
	}
}
