import * as React from 'react';
import * as EquipmentActions from '../../actions/EquipmentActions';
import { Aside } from '../../components/Aside';
import { BorderButton } from '../../components/BorderButton';
import { List } from '../../components/List';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { APStore } from '../../stores/APStore';
import { ELStore } from '../../stores/ELStore';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import { AdvantageInstance, ArmorZonesInstance, AttributeInstance, DisadvantageInstance, InputTextEvent } from '../../types/data.d';
import { isActive } from '../../utils/ActivatableUtils';
import { createOverlay } from '../../utils/createOverlay';
import { dotToComma } from '../../utils/i18n';
import { filterAndSort } from '../../utils/ListUtils';
import { ArmorZonesEditor } from './ArmorZonesEditor';
import { ArmorZonesListItem } from './ArmorZonesListItem';

interface State {
	filterText: string;
	items: ArmorZonesInstance[];
	purse: {
		d: string;
		s: string;
		h: string;
		k: string;
	};
	sortOrder: string;
}

export class ArmorZones extends React.Component<undefined, State> {
	state = {
		filterText: '',
		items: EquipmentStore.getAllArmorZones(),
		purse: EquipmentStore.getPurse(),
		sortOrder: EquipmentStore.getSortOrder(),
	};

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

	showArmorZonesCreation = () => createOverlay(<ArmorZonesEditor create />);

	render() {
		const {
			filterText,
			items,
			sortOrder,
			purse,
		} = this.state;

		const list = filterAndSort(items, filterText, sortOrder);

		const { price: totalPrice, weight: totalWeight } = EquipmentStore.getTotalPriceAndWeight();
		let startMoney = 750;
		const ADV_36 = get('ADV_36') as AdvantageInstance;
		const DISADV_2 = get('DISADV_2') as DisadvantageInstance;
		if (isActive(ADV_36)) {
			startMoney += ADV_36.active[0].tier! * 250;
		}
		else if (isActive(DISADV_2)) {
			startMoney -= DISADV_2.active[0].tier! * 250;
		}
		const carryingCapacity = (get('STR') as AttributeInstance).value * 2;

		const hasNoAddedAP = APStore.getTotal() === ELStore.getStart().ap;

		return (
			<Page id="armor-zones">
				<Options>
					<TextField hint="Suchen" value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						options={[ 'name', 'groupname', 'where' ]}
						sortOrder={sortOrder}
						sort={this.sort}
						/>
					<BorderButton label="Erstellen" onClick={this.showArmorZonesCreation} />
				</Options>
				<Scroll>
					<List>
						{
							list.map(obj => <ArmorZonesListItem key={obj.id} data={obj} />)
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

	private updateEquipmentStore = () => this.setState({ items: EquipmentStore.getAllArmorZones(), sortOrder: EquipmentStore.getSortOrder(), purse: EquipmentStore.getPurse() } as State);
}
