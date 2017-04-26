import * as React from 'react';
import * as EquipmentActions from '../../actions/EquipmentActions';
import { Aside } from '../../components/Aside';
import { BorderButton } from '../../components/BorderButton';
import { Dropdown } from '../../components/Dropdown';
import { List } from '../../components/List';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { APStore } from '../../stores/APStore';
import { ELStore } from '../../stores/ELStore';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import { AdvantageInstance, AttributeInstance, DisadvantageInstance, InputTextEvent, ItemInstance } from '../../types/data.d';
import { isActive } from '../../utils/ActivatableUtils';
import { createOverlay } from '../../utils/createOverlay';
import { dotToComma } from '../../utils/i18n';
import { filterAndSort, sortByName } from '../../utils/ListUtils';
import { EquipmentListItem } from './EquipmentListItem';
import { ItemEditor } from './ItemEditor';

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Munition', 'Rüstungen', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Fortbewegungsmittel'];
const groupsSelectionItems = GROUPS.map((e, i) => ({ id: i + 1, name: e })).sort(sortByName);

interface State {
	filterGroupSlidein: number;
	filterText: string;
	filterTextSlidein: string;
	items: ItemInstance[];
	purse: {
		d: string;
		s: string;
		h: string;
		k: string;
	};
	showAddSlidein: boolean;
	sortOrder: string;
	templates: ItemInstance[];
}

export class Equipment extends React.Component<undefined, State> {
	state = {
		filterGroupSlidein: 1,
		filterText: '',
		filterTextSlidein: '',
		items: EquipmentStore.getAll(),
		purse: EquipmentStore.getPurse(),
		showAddSlidein: false,
		sortOrder: EquipmentStore.getSortOrder(),
		templates: EquipmentStore.getAllTemplates(),
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as State);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as State);
	filterGroupSlidein = (gr: number) => this.setState({ filterGroupSlidein: gr } as State);
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

		const {
			filterGroupSlidein,
			filterText,
			filterTextSlidein,
			items,
			showAddSlidein,
			sortOrder,
			templates,
			purse,
		} = this.state;

		const list = filterAndSort(items, filterText, sortOrder, GROUPS);

		const filterTemplates = (e: ItemInstance): boolean => {
			const isGroup = e.gr === filterGroupSlidein;
			const isNotInList = !items.find(item => item.template === e.template && item.isTemplateLocked);
			return isGroup && isNotInList;
		};

		const templateList = filterAndSort(templates.filter(filterTemplates), filterTextSlidein, 'name');

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
		const totalWeight = Math.round(list.reduce((n, i) => i.weight ? n + i.weight : n, 0) * 100) / 100;
		const carryingCapacity = (get('STR') as AttributeInstance).value * 2;

		const hasNoAddedAP = APStore.getTotal() === ELStore.getStart().ap;

		return (
			<Page id="equipment">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint="Suchen" value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
						<Dropdown
							value={filterGroupSlidein}
							onChange={this.filterGroupSlidein}
							options={groupsSelectionItems}
							fullWidth
							/>
					</Options>
					<Scroll>
						<List>
							{
								templateList.map(obj => <EquipmentListItem key={obj.id} data={obj} add />)
							}
						</List>
					</Scroll>
				</Slidein>
				<Options>
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						options={[ 'name', 'groupname', 'where' ]}
						sortOrder={sortOrder}
						sort={this.sort}
						/>
					<BorderButton label="Hinzufügen" onClick={this.showAddSlidein} />
					<BorderButton label="Erstellen" onClick={this.showItemCreation} />
				</Options>
				<Scroll>
					<List>
						{
							list.map(obj => <EquipmentListItem key={obj.id} data={obj} />)
						}
					</List>
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
						<h4>{hasNoAddedAP && 'Startgeld & '}Tragkraft</h4>
						<div className="fields">
							{hasNoAddedAP && <div>{dotToComma(totalPrice)} / {startMoney} S</div>}
							<div>{dotToComma(totalWeight)} / {carryingCapacity} Stn</div>
						</div>
					</div>
				</Aside>
			</Page>
		);
	}

	private updateEquipmentStore = () => this.setState({ items: EquipmentStore.getAll(), sortOrder: EquipmentStore.getSortOrder(), purse: EquipmentStore.getPurse() } as State);
}
