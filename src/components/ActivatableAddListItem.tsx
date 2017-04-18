import classNames from 'classnames';
import * as React from 'react';
import * as Categories from '../constants/Categories';
import { get } from '../stores/ListStore';
import SpecialAbilitiesStore from '../stores/SpecialAbilitiesStore';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import Dropdown from './Dropdown';
import IconButton from './IconButton';
import ListItem from './ListItem';
import ListItemButtons from './ListItemButtons';
import ListItemGroup from './ListItemGroup';
import ListItemName from './ListItemName';
import ListItemSelections from './ListItemSelections';
import ListItemSeparator from './ListItemSeparator';
import ListItemValues from './ListItemValues';
import TextField from './TextField';

interface AddObject {
	id: string;
	cost?: number;
	sel?: string | number;
	sel2?: string | number;
	input?: string;
	tier?: number;
}

interface Props {
	item: DeactiveViewObject;
	isImportant?: boolean;
	isTypical?: boolean;
	isUntypical?: boolean;
	hideGroup?: boolean;
	addToList(args: ActivateArgs): void;
}

interface State {
	selected: string | number;
	selected2: string | number;
	selectedTier: number;
	input: string;
	input2: string;
}

const specialAbilityGroupNames = SpecialAbilitiesStore.getGroupNames();

export default class ActivatableAddListItem extends React.Component<Props, State> {
	state: State = {
		input: '',
		input2: '',
		selected: '',
		selected2: '',
		selectedTier: 0,
	};

	handleSelect = (selected: string | number) => {
		if (this.state.selected2) {
			this.setState({ selected, selected2: '' } as State);
		}
		else {
			this.setState({ selected } as State);
		}
	}
	handleSelect2 = (selected2: string | number) => this.setState({ selected2 } as State);
	handleSelectTier = (selectedTier: number) => {
		if (['DISADV_34', 'DISADV_50'].includes(this.props.item.id)) {
			this.setState({ selectedTier, selected: '' } as State);
		} else {
			this.setState({ selectedTier } as State);
		}
	}
	handleInput = (event: InputTextEvent) => this.setState({ input: event.target.value } as State);
	handleSecondInput = (event: InputTextEvent) => this.setState({ input2: event.target.value } as State);
	addToList = (args: ActivateArgs) => {
		this.props.addToList(args);
		if (this.state.selected !== '' || this.state.selectedTier !== 0 || this.state.input !== '') {
			this.setState({
				input: '',
				input2: '',
				selected: '',
				selected2: '',
				selectedTier: 0,
			} as State);
		}
	}

	render() {
		const { item, isImportant, isTypical, isUntypical, hideGroup } = this.props;
		const { id, name, cost, sel, tiers } = item as ActivatableInstance & { tiers?: number; };
		let { item: { input } } = this.props;
		const { category, gr } = get(id) as ActivatableInstance;
		let sel2: SelectionObject[] | undefined;

		const args: ActivateArgs = { id, cost: 0 };
		let currentCost: number | string | undefined;
		let disabled = false;

		let tierElement;
		let selectElement;
		let selectElement2;
		let selectElementDisabled = false;
		if (['ADV_32', 'DISADV_1', 'DISADV_24', 'DISADV_34', 'DISADV_36', 'DISADV_45', 'DISADV_50'].includes(id) && this.state.input) {
			selectElementDisabled = true;
		}
		let inputElement;

		switch (id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'ADV_17':
			case 'ADV_47':
			case 'DISADV_48':
				if (this.state.selected !== '') {
					currentCost = (cost as number[])[(get(this.state.selected as string) as SkillishInstance).ic - 1];
				}
				args.sel = this.state.selected;
				break;
			case 'ADV_28':
			case 'ADV_29': {
				const item = get(id) as ActivatableInstance;
				const selectionItem = ActivatableUtils.getSelectionItem(item, this.state.selected);
				currentCost = selectionItem && selectionItem.cost;
				break;
			}
			case 'DISADV_1':
				if (this.state.selectedTier > 0) {
					currentCost = (cost as number) * this.state.selectedTier;
				}
				if (this.state.selected === '' && this.state.input === '') {
					disabled = true;
				}
				args.sel = this.state.selected;
				args.input = this.state.input;
				args.tier = this.state.selectedTier;
				break;
			case 'DISADV_34':
			case 'DISADV_50': {
				if (this.state.selectedTier > 0) {
					const maxCurrentTier = (get(id) as DisadvantageInstance).active.reduce((a, b) => (b.tier as number) > a ? (b.tier as number) : a, 0);
					currentCost = maxCurrentTier >= this.state.selectedTier ? 0 : (cost as number) * (this.state.selectedTier - maxCurrentTier);
				}
				const currentSelIDs = new Set((get(id) as DisadvantageInstance).active.map(e => e.sid));
				const newSel = (sel as Array<SelectionObject & { tier: number; }>).filter(e => this.state.selectedTier === e.tier && !currentSelIDs.has(e.id));
				selectElement = (
					<Dropdown
						value={this.state.selected}
						onChange={this.handleSelect}
						options={newSel}
						disabled={this.state.selectedTier === 0 || selectElementDisabled} />
				);
				if (this.state.selected === '' && this.state.input === '') {
					disabled = true;
				}
				args.sel = this.state.selected;
				args.input = this.state.input;
				args.tier = this.state.selectedTier;
				break;
			}
			case 'ADV_32':
			case 'DISADV_24':
				if (this.state.selected === '' && this.state.input === '') {
					disabled = true;
				}
				args.sel = this.state.selected;
				args.input = this.state.input;
				currentCost = cost as number;
				break;
			case 'DISADV_33':
			case 'DISADV_37':
			case 'DISADV_51':
				if (id === 'DISADV_33') {
					let disab = true;
					if ([7, 8].includes(this.state.selected as number)) {
						args.input = this.state.input;
						const item = get(id) as ActivatableInstance;
						const selectionItem = ActivatableUtils.getSelectionItem(item, this.state.selected);
						currentCost = selectionItem && selectionItem.cost;
						disab = false;
					}
					inputElement = (
						<TextField
							value={this.state.input}
							onChange={this.handleInput}
							disabled={disab} />
					);
				}
				if (this.state.selected === 7 && (get(id) as DisadvantageInstance).active.filter(e => e.sid === 7).length > 0) {
					currentCost = 0;
				} else if (this.state.selected !== '') {
					const item = get(id) as ActivatableInstance;
					const selectionItem = ActivatableUtils.getSelectionItem(item, this.state.selected);
					currentCost = selectionItem && selectionItem.cost;
				}
				args.sel = this.state.selected;
				break;
			case 'DISADV_36':
			case 'DISADV_45':
				if (this.state.selected === '' && this.state.input === '') {
					disabled = true;
				}
				currentCost = id === 'DISADV_36' && (get(id) as DisadvantageInstance).active.length > 2 ? 0 : cost as number;
				args.sel = this.state.selected;
				args.input = this.state.input;
				break;
			case 'SA_10':
				type Sel = Array<SelectionObject & { specialisation: string[] | null; specialisationInput: string | null }>;
				if (this.state.selected !== '') {
					const o = ((get(id) as SpecialAbilityInstance).sel as Sel).filter(e => e.id === this.state.selected)[0];
					currentCost = o.cost;
					sel2 = o.specialisation ? o.specialisation.map((e, id) => ({ id: id + 1, name: e })) : undefined;
					input = o.specialisationInput;
				}
				args.sel = this.state.selected;
				args.sel2 = this.state.selected2;
				args.input = this.state.input;
				break;
			case 'SA_30':
				args.sel = this.state.selected;
				args.tier = this.state.selectedTier;
				if (this.state.selected !== '' && this.state.selectedTier !== 0) {
					currentCost = this.state.selectedTier === 4 ? 0 : (cost as number) * this.state.selectedTier;
				}
				break;
			default:
				if (cost === 'sel') {
					if (this.state.selected !== '') {
						const selected = typeof this.state.selected === 'string' ? Number.parseInt(this.state.selected) : this.state.selected;
						const item = get(id) as ActivatableInstance;
						const selectionItem = ActivatableUtils.getSelectionItem(item, selected);
						currentCost = selectionItem && selectionItem.cost;
					}
					args.sel = this.state.selected;
				} else if (sel !== undefined && sel.length > 0) {
					args.sel = this.state.selected;
					currentCost = cost as number;
				} else if (tiers) {
					if (this.state.selectedTier > 0) {
						currentCost = (cost as number) * this.state.selectedTier;
					}
					args.tier = this.state.selectedTier;
				} else if (input) {
					args.input = this.state.input;
					currentCost = cost as number;
				} else {
					currentCost = cost as number;
				}
				break;
		}

		if (category === Categories.DISADVANTAGES && currentCost) {
			currentCost = -currentCost;
		}

		if (typeof currentCost === 'number') {
			args.cost = currentCost;
		}

		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		if (tiers) {
			const array = Array.from(Array(tiers).keys()).map(e => ({ id: e + 1, name: roman[e] }));
			tierElement = (
				<Dropdown
					className="tiers"
					value={this.state.selectedTier}
					onChange={this.handleSelectTier}
					options={array} />
			);
			if (this.state.selectedTier === 0) {
				disabled = true;
			}
		}

		if (sel && sel.length > 0 && !['DISADV_34', 'DISADV_50'].includes(id)) {
			selectElement = (
				<Dropdown
					value={this.state.selected}
					onChange={this.handleSelect}
					options={sel}
					disabled={selectElementDisabled} />
			);
		}

		if (sel && this.state.selected === '' && !['ADV_32', 'DISADV_1', 'DISADV_24', 'DISADV_34', 'DISADV_36', 'DISADV_45', 'DISADV_50'].includes(id)) {
			disabled = true;
		}

		if (input && !['ADV_28', 'ADV_29'].includes(id)) {
			inputElement = (
				<TextField
					hint={input}
					value={this.state.input}
					onChange={this.handleInput} />
			);
			if (!this.state.input && !['ADV_32', 'DISADV_1', 'DISADV_24', 'DISADV_34', 'DISADV_36', 'DISADV_45', 'DISADV_50'].includes(id)) {
				disabled = true;
			}
		}

		if (id === 'SA_10' && sel2) {
			inputElement = (
				<TextField
					hint={input === null ? '' : input}
					value={this.state.input}
					onChange={this.handleInput}
					disabled={input === null} />
			);
			selectElement2 = (
				<Dropdown
					value={this.state.selected2}
					onChange={this.handleSelect2}
					options={sel2}
					disabled={sel2.length === 0 || this.state.input !== '' || this.state.selected === ''} />
			);
			if (this.state.selected2 === '' && this.state.input === '') {
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
				<ListItemName main={name} />
				<ListItemSelections>
					{tierElement1}
					{selectElement}
					{selectElement2}
					{inputElement}
					{tierElement2}
				</ListItemSelections>
				<ListItemSeparator/>
				{!hideGroup && <ListItemGroup list={specialAbilityGroupNames} index={gr} />}
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
