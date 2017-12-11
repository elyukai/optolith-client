import * as React from 'react';
import { Aside } from '../../components/Aside';
import { BorderButton } from '../../components/BorderButton';
import { Dropdown } from '../../components/Dropdown';
import { List } from '../../components/List';
import { ListHeader } from '../../components/ListHeader';
import { ListHeaderTag } from '../../components/ListHeaderTag';
import { MainContent } from '../../components/MainContent';
import { Options } from '../../components/Options';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { Slidein } from '../../components/Slidein';
import { SortOptions } from '../../components/SortOptions';
import { TextField } from '../../components/TextField';
import { WikiInfoContainer } from '../../containers/WikiInfo';
import { Purse } from '../../reducers/equipment';
import { AttributeInstance, InputTextEvent, ItemInstance, UIMessages } from '../../types/data.d';
import { CombatTechnique } from '../../types/view.d';
import { filterObjects, sortObjects } from '../../utils/FilterSortUtils';
import { _localizeNumber, _localizeWeight, _translate } from '../../utils/I18n';
import { EquipmentListItem } from './EquipmentListItem';

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
	meleeItemTemplateCombatTechniqueFilter?: string;
	rangedItemTemplateCombatTechniqueFilter?: string;
}

export interface EquipmentDispatchProps {
	setSortOrder(option: string): void;
	setDucates(value: string): void;
	setSilverthalers(value: string): void;
	setHellers(value: string): void;
	setKreutzers(value: string): void;
	addTemplateToList(id: string): void;
	createItem(): void;
	deleteItem(id: string): void;
	editItem(id: string): void;
	setMeleeItemTemplatesCombatTechniqueFilter(filterOption: string | undefined): void;
	setRangedItemTemplatesCombatTechniqueFilter(filterOption: string | undefined): void;
}

export type EquipmentProps = EquipmentStateProps & EquipmentDispatchProps & EquipmentOwnProps;

export interface EquipmentState {
	filterGroupSlidein: number;
	filterText: string;
	filterTextSlidein: string;
	showAddSlidein: boolean;
	currentId?: string;
	currentSlideinId?: string;
}

export class Equipment extends React.Component<EquipmentProps, EquipmentState> {
	state = {
		filterGroupSlidein: 1,
		filterText: '',
		filterTextSlidein: '',
		showAddSlidein: false,
		currentId: undefined,
		currentSlideinId: undefined,
	};

	filter = (event: InputTextEvent) => this.setState({ filterText: event.target.value } as EquipmentState);
	filterSlidein = (event: InputTextEvent) => this.setState({ filterTextSlidein: event.target.value } as EquipmentState);
	filterGroupSlidein = (gr: number) => this.setState({ filterGroupSlidein: gr } as EquipmentState);
	sort = (option: string) => this.props.setSortOrder(option);
	setDucates = (event: InputTextEvent) => this.props.setDucates(event.target.value as string);
	setSilverthalers = (event: InputTextEvent) => this.props.setSilverthalers(event.target.value as string);
	setHellers = (event: InputTextEvent) => this.props.setHellers(event.target.value as string);
	setKreutzers = (event: InputTextEvent) => this.props.setKreutzers(event.target.value as string);
	showInfo = (id: string) => this.setState({ currentId: id } as EquipmentState);
	showSlideinInfo = (id: string) => this.setState({ currentSlideinId: id } as EquipmentState);

	showAddSlidein = () => this.setState({ showAddSlidein: true } as EquipmentState);
	hideAddSlidein = () => this.setState({ showAddSlidein: false, filterTextSlidein: '' } as EquipmentState);

	render() {
		const { carryingCapacity, combatTechniques, hasNoAddedAP, initialStartingWealth, items, locale, purse, sortOrder, templates, totalPrice, totalWeight, meleeItemTemplateCombatTechniqueFilter, rangedItemTemplateCombatTechniqueFilter, setMeleeItemTemplatesCombatTechniqueFilter, setRangedItemTemplatesCombatTechniqueFilter } = this.props;
		const { filterGroupSlidein, filterText, filterTextSlidein, showAddSlidein } = this.state;

		const groups = _translate(locale, 'equipment.view.groups');

		const groupsSelectionItems = sortObjects(groups.map((e, i) => ({ id: i + 1, name: e })), locale.id);

		const list = filterObjects(items, filterText);

		const filterTemplatesByIsActiveAndInGroup = (e: ItemInstance): boolean => {
			const isGroup = e.gr === filterGroupSlidein;
			let isCombatTechnique = true;
			if (meleeItemTemplateCombatTechniqueFilter !== undefined && e.gr === 1) {
				isCombatTechnique = e.combatTechnique === meleeItemTemplateCombatTechniqueFilter;
			}
			else if (rangedItemTemplateCombatTechniqueFilter !== undefined && e.gr === 2) {
				isCombatTechnique = e.combatTechnique === rangedItemTemplateCombatTechniqueFilter;
			}
			const isNotInList = !items.find(item => item.template === e.template && item.isTemplateLocked);
			return isGroup && isCombatTechnique && isNotInList;
		};

		const filterTemplatesByIsActive = (e: ItemInstance): boolean => {
			return !items.find(item => item.template === e.template && item.isTemplateLocked);
		};

		const combatTechniquesList = sortObjects(combatTechniques, locale.id);
		const meleeCombatTechniques = combatTechniquesList.filter(e => e.gr === 1);
		const rangedCombatTechniques = combatTechniquesList.filter(e => e.gr === 2);
		const templateList = filterObjects(filterTextSlidein.length === 0 ? templates.filter(filterTemplatesByIsActiveAndInGroup) : templates.filter(filterTemplatesByIsActive), filterTextSlidein);

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
						{filterGroupSlidein === 1 && <Dropdown
							value={meleeItemTemplateCombatTechniqueFilter}
							onChange={setMeleeItemTemplatesCombatTechniqueFilter}
							options={[
								{ name: _translate(locale, 'allcombattechniques') },
								...meleeCombatTechniques
							]}
							fullWidth
							/>}
						{filterGroupSlidein === 2 && <Dropdown
							value={rangedItemTemplateCombatTechniqueFilter}
							onChange={setRangedItemTemplatesCombatTechniqueFilter}
							options={[
								{ name: _translate(locale, 'allcombattechniques') },
								...rangedCombatTechniques
							]}
							fullWidth
							/>}
					</Options>
					<MainContent>
						<ListHeader>
							<ListHeaderTag className="name">
								{_translate(locale, 'name')}
							</ListHeaderTag>
							<ListHeaderTag className="btn-placeholder" />
						</ListHeader>
						<Scroll>
							<List>
								{
									templateList.map(obj => <EquipmentListItem {...this.props} key={obj.id} data={obj} add selectForInfo={this.showSlideinInfo} />)
								}
							</List>
						</Scroll>
					</MainContent>
					<WikiInfoContainer {...this.props} currentId={this.state.currentSlideinId} />
				</Slidein>
				<Options>
					<TextField hint={_translate(locale, 'options.filtertext')} value={filterText} onChange={this.filter} fullWidth />
					<SortOptions
						options={[ 'name', 'groupname', 'where', 'weight' ]}
						sortOrder={sortOrder}
						sort={this.sort}
						locale={locale}
						/>
					<BorderButton label={_translate(locale, 'actions.addtolist')} onClick={this.showAddSlidein} />
					<BorderButton label={_translate(locale, 'equipment.actions.create')} onClick={this.props.createItem} />
				</Options>
				<MainContent>
					<ListHeader>
						<ListHeaderTag className="name">
							{_translate(locale, 'name')}
						</ListHeaderTag>
						<ListHeaderTag className="group">
							{_translate(locale, 'group')}
							</ListHeaderTag>
						<ListHeaderTag className="btn-placeholder" />
						<ListHeaderTag className="btn-placeholder" />
					</ListHeader>
					<Scroll>
						<List>
							{
								list.map(obj => <EquipmentListItem {...this.props} key={obj.id} data={obj} selectForInfo={this.showInfo} />)
							}
						</List>
					</Scroll>
				</MainContent>
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
					<WikiInfoContainer {...this.props} {...this.state} noWrapper />
				</Aside>
			</Page>
		);
	}
}
