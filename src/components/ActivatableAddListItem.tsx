import * as React from 'react';
import * as Categories from '../constants/Categories';
import { TalentsStore } from '../stores/TalentsStore';
import { ActivatableInstance, ActivateArgs, DeactiveViewObject, DisadvantageInstance, InputTextEvent, Instance, SelectionObject, SkillishInstance, SpecialAbilityInstance, TalentInstance } from '../types/data.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import { sort } from '../utils/FilterSortUtils';
import { translate } from '../utils/I18n';
import { getRoman } from '../utils/NumberUtils';
import { Dropdown } from './Dropdown';
import { IconButton } from './IconButton';
import { ListItem } from './ListItem';
import { ListItemButtons } from './ListItemButtons';
import { ListItemGroup } from './ListItemGroup';
import { ListItemName } from './ListItemName';
import { ListItemSelections } from './ListItemSelections';
import { ListItemSeparator } from './ListItemSeparator';
import { ListItemValues } from './ListItemValues';
import { TextField } from './TextField';

interface Props {
	item: DeactiveViewObject;
	isImportant?: boolean;
	isTypical?: boolean;
	isUntypical?: boolean;
	hideGroup?: boolean;
	addToList(args: ActivateArgs): void;
	get(id: string): Instance | undefined;
}

interface State {
	selected?: string | number;
	selected2?: string | number;
	selectedTier?: number;
	input?: string;
	input2?: string;
}

export class ActivatableAddListItem extends React.Component<Props, State> {
	state: State = {};

	handleSelect = (selected: string | number) => {
		if (this.state.selected2) {
			this.setState({ selected, selected2: undefined } as State);
		}
		else {
			this.setState({ selected } as State);
		}
	}
	handleSelect2 = (selected2: string | number) => this.setState({ selected2 } as State);
	handleSelectTier = (selectedTier: number) => {
		if (['DISADV_34', 'DISADV_50'].includes(this.props.item.id)) {
			this.setState({ selectedTier, selected: undefined } as State);
		} else {
			this.setState({ selectedTier } as State);
		}
	}
	handleInput = (event: InputTextEvent) => this.setState({ input: event.target.value || undefined } as State);
	handleSecondInput = (event: InputTextEvent) => this.setState({ input2: event.target.value || undefined } as State);
	addToList = (args: ActivateArgs) => {
		this.props.addToList(args);
		if (this.state.selected !== undefined || this.state.selectedTier !== undefined || this.state.input !== undefined) {
			this.setState({
				input: undefined,
				input2: undefined,
				selected: undefined,
				selected2: undefined,
				selectedTier: undefined
			} as State);
		}
	}

	render() {
		const { get, item, isImportant, isTypical, isUntypical, hideGroup } = this.props;
		const { id, name, cost, instance: { category, gr }, sel, tiers, minTier = 1, maxTier = Number.MAX_SAFE_INTEGER } = item;
		let { item: { input } } = this.props;
		const { input: inputText, selected, selected2, selectedTier } = this.state;
		let sel2: SelectionObject[] | undefined;

		const args: ActivateArgs = { id, cost: 0 };
		let currentCost: number | string | undefined;
		let disabled = false;

		let tierElement;
		let selectElement;
		let selectElement2;
		let selectElementDisabled = false;
		if (['ADV_32', 'DISADV_1', 'DISADV_24', 'DISADV_34', 'DISADV_36', 'DISADV_45', 'DISADV_50'].includes(id) && inputText) {
			selectElementDisabled = true;
		}
		let inputElement;

		switch (id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'ADV_17':
			case 'ADV_47':
			case 'DISADV_48':
			case 'SA_252':
			case 'SA_273':
				if (typeof selected === 'string') {
					currentCost = (cost as number[])[(get(selected) as SkillishInstance).ic - 1];
				}
				args.sel = selected;
				break;
			case 'ADV_28':
			case 'ADV_29': {
				const item = get(id) as ActivatableInstance;
				const selectionItem = ActivatableUtils.getSelectionItem(item, selected);
				currentCost = selectionItem && selectionItem.cost;
				args.sel = selected;
				break;
			}
			case 'DISADV_1':
				if (typeof selectedTier === 'number') {
					currentCost = (cost as number) * selectedTier;
				}
				if (typeof selected === 'string' && typeof inputText === 'string') {
					disabled = true;
				}
				args.sel = selected;
				args.input = inputText;
				args.tier = selectedTier;
				break;
			case 'DISADV_34':
			case 'DISADV_50': {
				if (typeof selectedTier === 'number') {
					const maxCurrentTier = (get(id) as DisadvantageInstance).active.reduce((a, b) => (b.tier as number) > a ? (b.tier as number) : a, 0);
					currentCost = maxCurrentTier >= selectedTier ? 0 : (cost as number) * (selectedTier - maxCurrentTier);
				}
				const currentSelIDs = new Set((get(id) as DisadvantageInstance).active.map(e => e.sid));
				const newSel = (sel as Array<SelectionObject & { tier: number; }>).filter(e => selectedTier === e.tier && !currentSelIDs.has(e.id));
				selectElement = (
					<Dropdown
						value={selected}
						onChange={this.handleSelect}
						options={newSel}
						disabled={selectedTier === 0 || selectElementDisabled} />
				);
				if (typeof selected === 'string' && typeof inputText === 'string') {
					disabled = true;
				}
				args.sel = selected;
				args.input = inputText;
				args.tier = selectedTier;
				break;
			}
			case 'ADV_32':
			case 'DISADV_24':
				if (typeof selected === 'string' && typeof inputText === 'string') {
					disabled = true;
				}
				args.sel = selected;
				args.input = inputText;
				currentCost = cost as number;
				break;
			case 'ADV_68':
				args.sel = selected;
				args.input = inputText;
				const item = get(id) as ActivatableInstance;
				const selectionItem = ActivatableUtils.getSelectionItem(item, selected);
				currentCost = selectionItem && selectionItem.cost;
				break;
			case 'DISADV_33':
			case 'DISADV_37':
			case 'DISADV_51':
				if (id === 'DISADV_33') {
					let disab = true;
					if ([7, 8].includes(selected as number)) {
						args.input = inputText;
						const item = get(id) as ActivatableInstance;
						const selectionItem = ActivatableUtils.getSelectionItem(item, selected);
						currentCost = selectionItem && selectionItem.cost;
						disab = false;
					}
					inputElement = (
						<TextField
							value={inputText}
							onChange={this.handleInput}
							disabled={disab} />
					);
				}
				if (selected === 7 && (get(id) as DisadvantageInstance).active.find(e => e.sid === 7) !== undefined) {
					currentCost = 0;
				}
				else if (typeof selected === 'number') {
					const item = get(id) as ActivatableInstance;
					const selectionItem = ActivatableUtils.getSelectionItem(item, selected);
					currentCost = selectionItem && selectionItem.cost;
				}
				args.sel = selected;
				break;
			case 'DISADV_36':
			case 'DISADV_45':
				if (typeof selected === 'string' && typeof inputText === 'string') {
					disabled = true;
				}
				currentCost = id === 'DISADV_36' && (get(id) as DisadvantageInstance).active.length > 2 ? 0 : cost as number;
				args.sel = selected;
				args.input = inputText;
				break;
			case 'SA_10':
				type Sel = Array<SelectionObject & TalentInstance>;
				if (typeof selected === 'string') {
					const o = ((get(id) as SpecialAbilityInstance).sel as Sel).find(e => e.id === selected);
					if (o) {
						currentCost = o.cost;
						sel2 = o.applications;
						input = o.applicationsInput;
					}
				}
				args.sel = selected;
				args.sel2 = selected2;
				args.input = inputText;
				break;
			case 'SA_30':
				args.sel = selected;
				args.tier = selectedTier;
				if (typeof selected === 'number' && typeof selectedTier === 'number') {
					currentCost = selectedTier === 4 ? 0 : (cost as number) * selectedTier;
				}
				break;
			case 'SA_86':
				args.sel = selected;
				args.sel2 = selected2;
				if (selected === 9) {
					sel2 = sort(TalentsStore.getAll());
				}
				else if (selected === 6) {
					const musictraditionIds = [1, 2, 3];
					sel2 = musictraditionIds.map((id, index) => ({ id, name: translate('musictraditions')[index]}));
				}
				else if (selected === 7) {
					const dancetraditionIds = [4, 5, 6, 7];
					sel2 = dancetraditionIds.map((id, index) => ({ id, name: translate('dancetraditions')[index]}));
				}
				break;
			default:
				if (cost === 'sel') {
					args.sel = selected;
				}
				else if (sel !== undefined && sel.length > 0) {
					args.sel = selected;
					currentCost = cost as number;
				}
				else if (tiers && typeof selectedTier === 'number') {
					if (selectedTier > 0) {
						currentCost = (cost as number) * selectedTier;
					}
					args.tier = selectedTier;
				}
				else if (input) {
					args.input = inputText;
					currentCost = cost as number;
				}
				else {
					currentCost = cost as number;
				}
				break;
		}

		if (selected !== undefined && cost === 'sel' && currentCost === undefined) {
			const sid = typeof selected === 'string' ? Number.parseInt(selected) : selected;
			const item = get(id) as ActivatableInstance;
			const selectionItem = ActivatableUtils.getSelectionItem(item, sid);
			currentCost = selectionItem && selectionItem.cost;
		}

		if (category === Categories.DISADVANTAGES && currentCost) {
			currentCost = -currentCost;
		}

		if (typeof currentCost === 'number') {
			args.cost = currentCost;
		}

		if (typeof tiers === 'number') {
			const min = Math.max(1, minTier);
			const max = Math.min(tiers, maxTier);
			const array = Array.from({ length: max - min + 1 }, (_, index) => ({ id: index + min, name: getRoman(index + min) }));
			tierElement = (
				<Dropdown
					className="tiers"
					value={selectedTier}
					onChange={this.handleSelectTier}
					options={array} />
			);
			if (selectedTier === undefined) {
				disabled = true;
			}
		}

		if (Array.isArray(sel) && sel.length > 0 && !['DISADV_34', 'DISADV_50'].includes(id)) {
			selectElement = (
				<Dropdown
					value={selected}
					onChange={this.handleSelect}
					options={sel}
					disabled={selectElementDisabled} />
			);
		}

		if (Array.isArray(sel) && selected === undefined && !['ADV_32', 'DISADV_1', 'DISADV_24', 'DISADV_34', 'DISADV_36', 'DISADV_45', 'DISADV_50'].includes(id)) {
			disabled = true;
		}

		if (typeof input === 'string' && !['ADV_28', 'ADV_29'].includes(id)) {
			inputElement = (
				<TextField
					hint={input}
					value={inputText}
					onChange={this.handleInput} />
			);
			if (inputText === undefined && !['ADV_32', 'DISADV_1', 'DISADV_24', 'DISADV_34', 'DISADV_36', 'DISADV_45', 'DISADV_50'].includes(id)) {
				disabled = true;
			}
		}

		if (id === 'SA_10') {
			inputElement = (
				<TextField
					hint={!input ? '' : input}
					value={inputText}
					onChange={this.handleInput}
					disabled={!input} />
			);
			selectElement2 = Array.isArray(sel2) && (
				<Dropdown
					value={selected2}
					onChange={this.handleSelect2}
					options={sel2}
					disabled={sel2.length === 0 || inputText !== undefined || selected === undefined} />
			);
			if (selected2 === undefined && inputText === undefined) {
				disabled = true;
			}
		}
		else if (Array.isArray(sel2)) {
			selectElement2 = (
				<Dropdown
					value={selected2}
					onChange={this.handleSelect2}
					options={sel2}
					disabled={sel2.length === 0 || selected === undefined} />
			);
			if (selected2 === undefined) {
				disabled = true;
			}
		}

		let tierElement1;
		let tierElement2;

		if (['DISADV_34', 'DISADV_50'].includes(id)) {
			tierElement1 = tierElement;
		} else {
			tierElement2 = tierElement;
		}

		return (
			<ListItem important={isImportant} recommended={isTypical} unrecommended={isUntypical}>
				<ListItemName name={name} />
				<ListItemSelections>
					{tierElement1}
					{selectElement}
					{selectElement2}
					{inputElement}
					{tierElement2}
				</ListItemSelections>
				<ListItemSeparator/>
				{!hideGroup && <ListItemGroup list={translate('specialabilities.view.groups')} index={gr} />}
				<ListItemValues>
					<div className="cost">{currentCost}</div>
				</ListItemValues>
				<ListItemButtons>
					<IconButton icon="&#xE145;" disabled={disabled} onClick={this.addToList.bind(null, args as ActivateArgs)} flat />
					<IconButton icon="&#xE88F;" flat disabled />
				</ListItemButtons>
			</ListItem>
		);
	}
}
