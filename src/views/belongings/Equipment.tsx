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
import { localizeNumber, localizeWeight, translate } from '../../utils/I18n';
import { filterAndSort, sortByName } from '../../utils/FilterSortUtils';
import { EquipmentListItem } from './EquipmentListItem';
import { ItemEditor } from './ItemEditor';

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

export class Equipment extends React.Component<{}, State> {
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

		const groups = translate('equipment.view.groups');

		const groupsSelectionItems = groups.map((e, i) => ({ id: i + 1, name: e })).sort(sortByName);

		const list = filterAndSort(items, filterText, sortOrder, groups);

		const filterTemplates = (e: ItemInstance): boolean => {
			const isGroup = e.gr === filterGroupSlidein;
			const isNotInList = !items.find(item => item.template === e.template && item.isTemplateLocked);
			return isGroup && isNotInList;
		};

		const templateList = filterAndSort(filterTextSlidein.length === 0 ? templates.filter(filterTemplates) : templates, filterTextSlidein, 'name');

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
			<Page id="equipment">
				<Slidein isOpen={showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={translate('options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
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
					<TextField hint={translate('options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						options={[ 'name', 'groupname', 'where' ]}
						sortOrder={sortOrder}
						sort={this.sort}
						/>
					<BorderButton label={translate('actions.addtolist')} onClick={this.showAddSlidein} />
					<BorderButton label={translate('equipment.actions.create')} onClick={this.showItemCreation} />
				</Options>
				<Scroll>
					<List>
						{
							list.map(obj => <EquipmentListItem key={obj.id} data={EquipmentStore.getFullItem(obj)} />)
						}
					</List>
				</Scroll>
				<Aside>
					<div className="purse">
						<h4>{translate('equipment.view.purse')}</h4>
						<div className="fields">
							<TextField label={translate('equipment.view.ducates')} value={purse.d} onChange={this.setDucates} />
							<TextField label={translate('equipment.view.silverthalers')} value={purse.s} onChange={this.setSilverthalers} />
							<TextField label={translate('equipment.view.hellers')} value={purse.h} onChange={this.setHellers} />
							<TextField label={translate('equipment.view.kreutzers')} value={purse.k} onChange={this.setKreutzers} />
						</div>
					</div>
					<div className="total-points">
						<h4>{hasNoAddedAP && `${translate('equipment.view.initialstartingwealth')} & `}{translate('equipment.view.carringandliftingcapactity')}</h4>
						<div className="fields">
							{hasNoAddedAP && <div>{localizeNumber(totalPrice)} / {localizeNumber(startMoney)} {translate('equipment.view.price')}</div>}
							<div>{localizeNumber(localizeWeight(totalWeight))} / {localizeNumber(localizeWeight(carryingCapacity))} {translate('equipment.view.weight')}</div>
						</div>
					</div>
				</Aside>
			</Page>
		);
	}

	private updateEquipmentStore = () => this.setState({ items: EquipmentStore.getAll(), sortOrder: EquipmentStore.getSortOrder(), purse: EquipmentStore.getPurse() } as State);
}
