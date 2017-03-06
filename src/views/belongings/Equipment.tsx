import * as React from 'react';
import * as EquipmentActions from '../../actions/EquipmentActions';
import Aside from '../../components/Aside';
import BorderButton from '../../components/BorderButton';
import Scroll from '../../components/Scroll';
import Slidein from '../../components/Slidein';
import SortOptions from '../../components/SortOptions';
import TextField from '../../components/TextField';
import EquipmentStore from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import { isActive } from '../../utils/ActivatableUtils';
import createOverlay from '../../utils/createOverlay';
import dotToComma from '../../utils/dotToComma';
import { filterAndSort } from '../../utils/ListUtils';
import EquipmentListItem from './EquipmentListItem';
import ItemEditor from './ItemEditor';

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Munition', 'Rüstungen', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

interface State {
	items: ItemInstance[];
	filterText: string;
	filterTextSlidein: string;
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
		filterText: '',
		filterTextSlidein: '',
		items: EquipmentStore.getAll(),
		purse: EquipmentStore.getPurse(),
		showAddSlidein: false,
		sortOrder: EquipmentStore.getSortOrder(),
		templates: EquipmentStore.getAllTemplates(),
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
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
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as State);

	render() {

		const { filterText, items, showAddSlidein, sortOrder, templates, purse, filterTextSlidein } = this.state;

		const list = filterAndSort(items, filterText, sortOrder, GROUPS);
		const templateList = filterAndSort(templates, filterTextSlidein, 'name');

		const totalPrice = Math.round(list.reduce((n, i) => n + i.price || n, 0) * 100) / 100;
		let startMoney = 750;
		const ADV_36 = get('ADV_36') as AdvantageInstance;
		const DISADV_2 = get('DISADV_2') as DisadvantageInstance;
		if (isActive(ADV_36)) {
			startMoney += ADV_36.active[0].tier! * 250;
		}
		else if (isActive(DISADV_2)) {
			startMoney -= DISADV_2.active[0].tier! * 250;
		}
		const totalWeight = Math.round(list.reduce((n, i) => n + i.weight || n, 0) * 100) / 100;
		const carryingCapacity = (get('STR') as AttributeInstance).value * 2;

		return (
			<div className="page" id="equipment">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
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
					<div className="total-points">
						<h4>Gesamt</h4>
						<div className="fields">
							<div>{dotToComma(totalPrice)} / {startMoney} S</div>
							<div>{dotToComma(totalWeight)} / {carryingCapacity} Stn</div>
						</div>
					</div>
				</Aside>
			</div>
		);
	}

	private updateEquipmentStore = () => this.setState({ items: EquipmentStore.getAll(), sortOrder: EquipmentStore.getSortOrder(), purse: EquipmentStore.getPurse() } as State);
}
