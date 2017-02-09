import { get } from '../../stores/ListStore';
import * as Categories from '../../constants/Categories';
import * as DisAdvActions from '../../actions/DisAdvActions';
import * as React from 'react';
import Dropdown from '../../components/Dropdown';
import IconButton from '../../components/IconButton';
import TextField from '../../components/TextField';

interface AddObject {
	id: string;
	cost?: number;
	sel?: string | number;
	sel2?: string | number;
	input?: string;
	tier?: number;
}

interface Props {
	className?: string;
	item: AdvantageInstance | DisadvantageInstance;
}

interface State {
	selected: string | number;
	selectedTier: number;
	input: string;
	input2: string;
}

export default class DisAdvAddListItem extends React.Component<Props, State> {
	state: State = {
		selected: '',
		selectedTier: 0,
		input: '',
		input2: ''
	};

	handleSelect = (selected: string | number) => this.setState({ selected } as State);
	handleSelectTier = (selectedTier: number) => {
		if (['DISADV_34','DISADV_50'].indexOf(this.props.item.id) > -1) {
			this.setState({ selectedTier, selected: '' } as State);
		} else {
			this.setState({ selectedTier } as State);
		}
	};
	handleInput = (event: Event) => this.setState({ input: event.target.value } as State);
	handleSecondInput = (event: Event) => this.setState({ input2: event.target.value } as State);
	addToList = (args: ActivateArgs) => {
		DisAdvActions.addToList(args);
		if (this.state.selected !== '' || this.state.selectedTier !== 0 || this.state.input !== '') {
			this.setState({
				selected: '',
				selectedTier: 0,
				input: '',
				input2: ''
			});
		}
	};

	render() {
		const { className, item: { id, name, cost, sel, input, tiers } } = this.props;
		const { category } = get(id) as AdvantageInstance | DisadvantageInstance;

		const args: ActivateArgs = { id, cost: 0 };
		let currentCost: number | string | undefined;
		let disabled = false;

		let tierElement;
		let selectElement;
		let selectElementDisabled = false;
		if (['ADV_32','DISADV_1','DISADV_24','DISADV_34','DISADV_36','DISADV_45','DISADV_50'].includes(id) && this.state.input) {
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
					currentCost = (cost as number[])[(get(this.state.selected as string) as CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance).ic - 1];
				}
				args.sel = this.state.selected;
				break;
			case 'ADV_28':
			case 'ADV_29':
				currentCost = typeof this.state.selected === 'number' ? (get(id) as AdvantageInstance).sel[this.state.selected as number - 1][2] : '';
				break;
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
					const maxCurrentTier = (get(id) as DisadvantageInstance).active.reduce((a,b) => b.tier > a ? b.tier as number : a, 0);
					currentCost = maxCurrentTier >= this.state.selectedTier ? 0 : (cost as number) * (this.state.selectedTier - maxCurrentTier);
				}
				const currentSelIDs = new Set((get(id) as DisadvantageInstance).active.map(e => e.sid));
				const newSel = sel.filter(e => this.state.selectedTier === e[2] && !currentSelIDs.has(e[1])) as [string, number][];
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
					if ([7,8].includes(this.state.selected as number)) {
						args.input = this.state.input;
						currentCost = (get(id) as DisadvantageInstance).sel[this.state.selected as number - 1][2];
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
					currentCost = (get(id) as DisadvantageInstance).sel[this.state.selected as number - 1][2];
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
			default:
				if (tiers !== undefined && tiers !== null) {
					if (this.state.selectedTier > 0) {
						currentCost = (cost as number) * this.state.selectedTier;
					}
					args.tier = this.state.selectedTier;
				} else if (input !== undefined && input !== null) {
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
			const array = Array.from(Array(tiers).keys()).map(e => [roman[e], e + 1] as [string, number]);
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

		if (sel && sel.length > 0 && !['DISADV_34','DISADV_50'].includes(id)) {
			selectElement = (
				<Dropdown
					value={this.state.selected}
					onChange={this.handleSelect}
					options={sel as [string, number | string][]}
					disabled={selectElementDisabled} />
			);
		}

		if (sel && this.state.selected === '' && !['ADV_32','DISADV_1','DISADV_24','DISADV_34','DISADV_36','DISADV_45','DISADV_50'].includes(id)) {
			disabled = true;
		}

		if (input !== undefined && input !== null && !['ADV_28','ADV_29'].includes(id)) {
			inputElement = (
				<TextField
					hint={input}
					value={this.state.input}
					onChange={this.handleInput} />
			);
			if (!this.state.input && !['ADV_32','DISADV_1','DISADV_24','DISADV_34','DISADV_36','DISADV_45','DISADV_50'].includes(id)) {
				disabled = true;
			}
		}

		let tierElement1;
		let tierElement2;

		if (['DISADV_34','DISADV_50'].includes(id)) {
			tierElement1 = tierElement;
		} else {
			tierElement2 = tierElement;
		}

		return (
			<div className={className ? 'list-item ' + className : 'list-item'}>
				<div className="name">
					<p className="title">{name}</p>
				</div>
				<div className="selections">
					{tierElement1}
					{selectElement}
					{inputElement}
					{tierElement2}
				</div>
				<div className="hr"></div>
				<div className="values">
					<div className="cost">{currentCost}</div>
				</div>
				<div className="btns">
					<IconButton icon="&#xE145;" disabled={disabled} onClick={this.addToList.bind(null, args as ActivateArgs)} flat />
					<IconButton icon="&#xE88F;" flat disabled />
				</div>
			</div>
		);
	}
}
