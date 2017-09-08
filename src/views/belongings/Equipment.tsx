import * as React from 'react';
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
import { Purse } from '../../reducers/equipment';
import { AttributeInstance, InputTextEvent, ItemInstance, UIMessages } from '../../types/data.d';
import { CombatTechnique } from '../../types/view.d';
import { createOverlay } from '../../utils/createOverlay';
import { filterAndSortObjects, sortObjects } from '../../utils/FilterSortUtils';
import { _localizeNumber, _localizeWeight, _translate } from '../../utils/I18n';
import { EquipmentListItem } from './EquipmentListItem';
import { ItemEditor } from './ItemEditor';

export interface EquipmentOwnProps {
	locale: UIMessages;
}

export interface EquipmentStateProps {
	attributes: Map<string, AttributeInstance>;
	combatTechniques: CombatTechnique[];
	carryingCapacity: number;
	initialStartingWealth: number;
	items: ItemInstance[];
	hasNoAddedAP: boolean;
	purse: Purse;
	sortOrder: string;
	templates: ItemInstance[];
	totalPrice: number;
	totalWeight: number;
}

export interface EquipmentDispatchProps {
	addToList(item: ItemInstance): void;
	deleteItem(id: string): void;
	set(id: string, item: ItemInstance): void;
	setSortOrder(option: string): void;
	setDucates(value: string): void;
	setSilverthalers(value: string): void;
	setHellers(value: string): void;
	setKreutzers(value: string): void;
}

export type EquipmentProps = EquipmentStateProps & EquipmentDispatchProps & EquipmentOwnProps;

export interface EquipmentState {
	filterGroupSlidein: number;
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
}

export class Equipment extends React.Component<EquipmentProps, EquipmentState> {
	state = {
		filterGroupSlidein: 1,
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as EquipmentState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as EquipmentState);
	filterGroupSlidein = (gr: number) => this.setState({ filterGroupSlidein: gr } as EquipmentState);
	sort = (option: string) => this.props.setSortOrder(option);
	setDucates = (event: InputTextEvent) => this.props.setDucates(event.target.value as string);
	setSilverthalers = (event: InputTextEvent) => this.props.setSilverthalers(event.target.value as string);
	setHellers = (event: InputTextEvent) => this.props.setHellers(event.target.value as string);
	setKreutzers = (event: InputTextEvent) => this.props.setKreutzers(event.target.value as string);

	showAddSlidein = () => this.setState({ showAddSlidein: true } as EquipmentState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as EquipmentState);

	showItemCreation = () => {
		createOverlay(
			<ItemEditor {...this.props} create />
		);
	}

	render() {
		const { carryingCapacity, hasNoAddedAP, initialStartingWealth, items, locale, purse, sortOrder, templates, totalPrice, totalWeight } = this.props;
		const { filterGroupSlidein, filterText, filterTextSlidein, showAddSlidein } = this.state;

		const groups = _translate(locale, 'equipment.view.groups');

		const groupsSelectionItems = sortObjects(groups.map((e, i) => ({ id: i + 1, name: e })), locale.id);

		const sortOptionArrays = {
			name: ['name' as 'name'],
			groupname: [{ key: 'gr' as 'gr', mapToIndex: groups }, 'name' as 'name'],
			where: ['where' as 'where', 'name' as 'name']
		};

		const list = filterAndSortObjects(items, locale.id, filterText, sortOptionArrays[sortOrder as keyof typeof sortOptionArrays]);

		const filterTemplatesByIsActiveAndInGroup = (e: ItemInstance): boolean => {
			const isGroup = e.gr === filterGroupSlidein;
			const isNotInList = !items.find(item => item.template === e.template && item.isTemplateLocked);
			return isGroup && isNotInList;
		};

		const filterTemplatesByIsActive = (e: ItemInstance): boolean => {
			return !items.find(item => item.template === e.template && item.isTemplateLocked);
		};

		const templateList = filterAndSortObjects(filterTextSlidein.length === 0 ? templates.filter(filterTemplatesByIsActiveAndInGroup) : templates.filter(filterTemplatesByIsActive), locale.id, filterTextSlidein);

		return (
			<Page id="equipment">
				<Slidein isOpened={showAddSlidein} close={this.hideAddSlidein}>
					<Options>
						<TextField hint={_translate(locale, 'options.filtertext')} value={filterTextSlidein} onChange={this.filterSlidein} fullWidth />
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
								templateList.map(obj => <EquipmentListItem {...this.props} key={obj.id} data={obj} add />)
							}
						</List>
					</Scroll>
				</Slidein>
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						options={[ 'name', 'groupname', 'where' ]}
						sortOrder={sortOrder}
						sort={this.sort}
						/>
					<BorderButton label={_translate(locale, 'actions.addtolist')} onClick={this.showAddSlidein} />
					<BorderButton label={_translate(locale, 'equipment.actions.create')} onClick={this.showItemCreation} />
				</Options>
				<Scroll>
					<List>
						{
							list.map(obj => <EquipmentListItem {...this.props} key={obj.id} data={obj} />)
						}
					</List>
				</Scroll>
				<Aside>
					<div className="purse">
						<h4>{_translate(locale, 'equipment.view.purse')}</h4>
						<div className="fields">
							<TextField label={_translate(locale, 'equipment.view.ducates')} value={purse.d} onChange={this.setDucates} />
							<TextField label={_translate(locale, 'equipment.view.silverthalers')} value={purse.s} onChange={this.setSilverthalers} />
							<TextField label={_translate(locale, 'equipment.view.hellers')} value={purse.h} onChange={this.setHellers} />
							<TextField label={_translate(locale, 'equipment.view.kreutzers')} value={purse.k} onChange={this.setKreutzers} />
						</div>
					</div>
					<div className="total-points">
						<h4>{hasNoAddedAP && `${_translate(locale, 'equipment.view.initialstartingwealth')} & `}{_translate(locale, 'equipment.view.carringandliftingcapactity')}</h4>
						<div className="fields">
							{hasNoAddedAP && <div>{_localizeNumber(totalPrice, locale.id)} / {_localizeNumber(initialStartingWealth, locale.id)} {_translate(locale, 'equipment.view.price')}</div>}
							<div>{_localizeNumber(_localizeWeight(totalWeight, locale.id), locale.id)} / {_localizeNumber(_localizeWeight(carryingCapacity, locale.id), locale.id)} {_translate(locale, 'equipment.view.weight')}</div>
						</div>
					</div>
				</Aside>
			</Page>
		);
	}
}
