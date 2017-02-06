import BorderButton from '../../components/BorderButton';
import DisAdvActions from '../../_actions/DisAdvActions';
import { get } from '../../stores/ListStore';
import Dropdown from '../../components/Dropdown';
import * as React from 'react';
import * as Categories from '../../constants/Categories';
import TextField from '../../components/TextField';

// export interface Deactive {
// 	id: string;
// 	name: string;
// 	sel?: any;
// 	sid?: any;
// 	input?: string;
// 	cost: number;
// 	tier?: number;
// 	tiers?: number;
// 	gr: number;
// }

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
	item: Advantage | Disadvantage;
}

interface State {
	selected: string | number;
	selectedTier: number;
	input: string;
	input2: string;
}

export default class DisAdvAddListItem extends React.Component<Props, State> {

	static propTypes = {
		className: React.PropTypes.string,
		item: React.PropTypes.object
	};

	state = {
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
	addToList = (args: AddObject) => {
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
		const { id, name, cost, sel, input, tiers, category } = this.props.item;

		const args: AddObject = { id };
		let ap = 0;
		let disabled = false;

		let tierElement;
		let selectElement;
		let selectElementDisabled = false;
		if (['ADV_32','DISADV_1','DISADV_24','DISADV_34','DISADV_36','DISADV_45','DISADV_50'].includes(id) && this.state.input !== '') {
			selectElementDisabled = true;
		}
		let inputElement;

		if (['ADV_4','ADV_16','ADV_17','ADV_47','DISADV_48'].includes(id)) {
			if (this.state.selected !== '') {
				ap = (cost as number[])[(get(this.state.selected as string) as CombatTechnique | Liturgy | Spell | Talent).ic - 1];
			}
			args.sel = this.state.selected;
		} else if (['ADV_28','ADV_29'].includes(id)) {
			selectElement = (
				<Dropdown
					options={sel}
					value={this.state.selected}
					onChange={this.handleSelect}
					disabled={this.state.input !== '' || this.state.input2 !== ''} />
			);
			// inputElement = (
			// 	<TextField
			// 		hint={disadv.input[0]}
			// 		value={this.state.input}
			// 		onChange={this.handleInput} />
			// );
			// inputElement2 = (
			// 	<TextField
			// 		hint={disadv.input[1]}
			// 		value={this.state.input2}
			// 		onChange={this.handleSecondInput} />
			// );
			ap = typeof this.state.selected === 'number' ? get(id).sel[this.state.selected - 1][2] : '';
			if (this.state.selected === '') disabled = true;
			// ap = this.state.input2 !== '' && !Number.isNaN(parseInt(this.state.input2)) ? Math.round(parseInt(this.state.input2) / 2) : this.state.selected !== '' ? get(disadv.id).sel[this.state.selected - 1][2] : '';
			// if (!((this.state.selected !== '' && this.state.input === '' && this.state.input2 === '') ||
			// 	(this.state.input !== '' && this.state.input2 !== '' && !Number.isNaN(parseInt(this.state.input2)))
			// )) disabled = true;
			// args.input = [this.state.input, this.state.input2];
			args.sel = this.state.selected;
		} else if (id === 'DISADV_1') {
			if (this.state.selectedTier > 0) {
				ap = cost * this.state.selectedTier;
			}
			if (this.state.selected === '' && this.state.input === '') disabled = true;
			args.sel = this.state.selected;
			args.input = this.state.input;
			args.tier = this.state.selectedTier;
		} else if (['DISADV_34','DISADV_50'].includes(id)) {
			if (this.state.selectedTier > 0) {
				let maxCurrentTier = get(id).active.reduce((a,b) => b[1] > a ? b[1] : a, 0);
				ap = maxCurrentTier >= this.state.selectedTier ? 0 : cost * (this.state.selectedTier - maxCurrentTier);
			}
			let currentSelIDs = new Set(get(id).active.map(e => e[0]));
			let sel = sel.filter(e => this.state.selectedTier === e[2] && !currentSelIDs.has(e[1]));
			selectElement = (
				<Dropdown
					value={this.state.selected}
					onChange={this.handleSelect}
					options={sel}
					disabled={this.state.selectedTier === 0 || selectElementDisabled} />
			);
			if (this.state.selected === '' && this.state.input === '') disabled = true;
			args.sel = this.state.selected;
			args.input = this.state.input;
			args.tier = this.state.selectedTier;
		} else if (['ADV_32','DISADV_24'].includes(id)) {
			if (this.state.selected === '' && this.state.input === '') disabled = true;
			args.sel = this.state.selected;
			args.input = this.state.input;
			ap = cost;
		} else if (['DISADV_33','DISADV_37','DISADV_51'].includes(id)) {
			if (id === 'DISADV_33') {
				let disab = true;
				if ([7,8].includes(this.state.selected)) {
					args.input = this.state.input;
					ap = get(id).sel[this.state.selected - 1][2];
					disab = false;
				}
				inputElement = (
					<TextField
						value={this.state.input}
						onChange={this.handleInput}
						disabled={disab} />
				);
			}
			if (this.state.selected === 7 && get(id).active.filter(e => Array.isArray(e) && e[0] === 7).length > 0) {
				ap = 0;
			} else if (this.state.selected !== '') {
				ap = get(id).sel[this.state.selected - 1][2];
			}
			args.sel = this.state.selected;
		} else if (['DISADV_36','DISADV_45'].includes(id)) {
			if (this.state.selected === '' && this.state.input === '') disabled = true;
			if (id === 'DISADV_36' && get(id).active.length > 2) {
				ap = 0;
			} else {
				ap = cost;
			}
			args.sel = this.state.selected;
			args.input = this.state.input;
		} else if (tiers !== undefined && tiers !== null) {
			if (this.state.selectedTier > 0) {
				ap = cost * this.state.selectedTier;
			}
			args.tier = this.state.selectedTier;
		} else if (input !== undefined && input !== null) {
			args.input = this.state.input;
			ap = cost;
		} else {
			ap = cost;
		}

		if (category === Categories.DISADVANTAGES && ap !== undefined) {
			ap = -ap;
		}

		args.cost = ap;

		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

		if (tiers !== undefined && tiers !== null) {
			let array = [];
			for (let i = 0; i < tiers; i++ ) {
				array.push([roman[i], i + 1]);
			}
			tierElement = (
				<Dropdown
					className="tiers"
					value={this.state.selectedTier}
					onChange={this.handleSelectTier}
					options={array} />
			);
			if (this.state.selectedTier === 0) disabled = true;
		}

		if (sel !== undefined && sel.length > 0 && ['ADV_28','ADV_29','DISADV_34','DISADV_50'].indexOf(id) === -1) {
			selectElement = (
				<Dropdown
					value={this.state.selected}
					onChange={this.handleSelect}
					options={sel}
					disabled={selectElementDisabled} />
			);
			if (this.state.selected === '' &&  ['ADV_32','DISADV_1','DISADV_24','DISADV_36','DISADV_45'].indexOf(id) === -1) disabled = true;
		}

		if (input !== undefined && input !== null && ['ADV_28','ADV_29'].indexOf(id) === -1) {
			inputElement = (
				<TextField
					hint={input}
					value={this.state.input}
					onChange={this.handleInput} />
			);
			if (this.state.input === '' && ['ADV_32','DISADV_1','DISADV_24','DISADV_34','DISADV_36','DISADV_45','DISADV_50'].indexOf(id) === -1) disabled = true;
		}

		let tierElement1;
		let tierElement2;

		if (['DISADV_34','DISADV_50'].includes(id)) {
			tierElement1 = tierElement;
		} else {
			tierElement2 = tierElement;
		}

		return (
			<tr className={this.props.className}>
				<td className="name">
					<div>
						<h2>{name}</h2>
						{tierElement1}
						{selectElement}
						{inputElement}
						{tierElement2}
					</div>
				</td>
				<td className="ap">{ap}</td>
				<td className="inc">
					<BorderButton label="+" disabled={disabled} onClick={this.addToList.bind(null, args)} />
				</td>
			</tr>
		);
	}
}
					// case 'ADV_47':
					// 	advs.push({ id, name, sel, cost });
					// 	break;
					// case 'ADV_32': {
					// 	const sel = adv.sel.filter(e => !(get('DISADV_24') as Disadvantage).sid.includes(e[1]) && !dependencies.includes(e[1]));
					// 	advs.push({ id, name, sel, input, cost });
					// 	break;
					// }
					// case 'DISADV_24': {
					// 	const sel = adv.sel.filter(e => !(get('ADV_32') as Advantage).sid.includes(e[1]) && !dependencies.includes(e[1]));
					// 	advs.push({ id, name, sel, input, cost });
					// 	break;
					// }
					// case 'DISADV_45':
					// 	advs.push({ id, name, sel, input, cost });
					// 	break;
					// case 'ADV_4':
					// case 'ADV_17': {
					// 	const sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
					// 	advs.push({ id, name, sel, cost });
					// 	break;
					// }
					// case 'ADV_16': {
					// 	const sel = adv.sel.filter(e => adv.active.filter(c => c === e[1]).length < 2 && !dependencies.includes(e[1]));
					// 	advs.push({ id, name, sel, cost });
					// 	break;
					// }
					// case 'ADV_28':
					// case 'ADV_29': {
					// 	const sel = adv.sel.filter(e => !dependencies.includes(e[1]));
					// 	advs.push({ id, name, sel });
					// 	// advs.push({ id, name, sel, input });
					// 	break;
					// }
					// case 'ADV_47': {
					// 	const sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
					// 	advs.push({ id, name, sel, cost });
					// 	break;
					// }
					// case 'DISADV_1': {
					// 	const sel = adv.sel.map((e, index) => [e[0], index + 1]).filter(e => !dependencies.includes(e[1]));
					// 	advs.push({ id, name, tiers, sel, input, cost });
					// 	break;
					// }
					// case 'DISADV_33':
					// case 'DISADV_37':
					// case 'DISADV_51': {
					// 	let sel;
					// 	if (adv.id === 'DISADV_33') {
					// 		sel = adv.sel.filter(e => ([7,8].includes(e[1] as number) || !adv.active.includes(e[1])) && !dependencies.includes(e[1]));
					// 	}
					// 	else {
					// 		sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
					// 	}
					// 	advs.push({ id, name, sel, cost });
					// 	break;
					// }
					// case 'DISADV_34':
					// case 'DISADV_50': {
					// 	const sel = adv.sel.filter(e => !dependencies.includes(e[1]));
					// 	advs.push({ id, name, tiers, sel, input, cost });
					// 	break;
					// }
					// case 'DISADV_36': {
					// 	const sel = adv.sel.filter(e => !adv.active.includes(e[1]) && !dependencies.includes(e[1]));
					// 	advs.push({ id, name, sel, input, cost });
					// 	break;
					// }
					// case 'DISADV_48': {
					// 	const sel = adv.sel.filter(e => {
					// 		if ((get('ADV_40') as Advantage).active.length > 0 || (get('ADV_46') as Advantage).active.length > 0) {
					// 			if ((get(e[1] as string) as Liturgy | Spell | Talent).gr === 2) {
					// 				return false;
					// 			}
					// 		}
					// 		return !adv.active.includes(e[1]) && !dependencies.includes(e[1]);
					// 	});
					// 	advs.push({ id, name, sel, cost });
					// 	break;
					// }
					// default:
					// 	if (adv.tiers !== null) {
					// 		advs.push({ id, name, tiers, cost });
					// 	}
					// 	else {
					// 		advs.push({ id, name, cost });
					// 	}
					// 	if (adv.input !== null) {
					// 		advs.push({ id, name, input, cost });
					// 	}
					// 	break;
