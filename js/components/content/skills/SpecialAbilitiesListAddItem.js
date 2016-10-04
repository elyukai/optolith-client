import BorderButton from '../../layout/BorderButton';
import SpecialAbilitiesActions from '../../../actions/SpecialAbilitiesActions';
import SpecialAbilitiesStore from '../../../stores/SpecialAbilitiesStore';
import Dropdown from '../../layout/Dropdown';
import React, { Component, PropTypes } from 'react';
import TextField from '../../layout/TextField';

class SpecialAbilitiesListAddItem extends Component {

	static propTypes = {
		item: PropTypes.object
	};

	state = {
		selected: '',
		selected2: '',
		selected_tier: 0,
		input: ''
	};

	constructor(props) {
		super(props);
	}

	handleSelect = selected => {
		if (this.props.item.id === 'SA_10')
			this.setState({ selected, selected2: '', input: '' });
		else
			this.setState({ selected });
	};
	handleSelect2 = selected2 => this.setState({ selected2 });
	handleSelectTier = selected_tier => this.setState({ selected_tier });
	handleInput = event => this.setState({ input: event.target.value });
	addToList = args => {
		SpecialAbilitiesActions.addToList(args);
		if (this.state.selected !== '' || this.state.selected_tier !== 0 || this.state.input !== '') {
			this.setState({
				selected: '',
				selected2: '',
				selected_tier: 0,
				input: ''
			});
		}
	};

	render() {

		const item = this.props.item;

		var ap;
		var disabled = false;
		var args = { id: item.id };

		var tierElement;
		var selectElement;
		var selectElement2;
		var _sel2 = [];
		var selectElement_disabled = false;
		var inputElement;
		var _input = null;

		if (item.id === 'SA_10') {
			if (this.state.selected !== '') {
				let option = SpecialAbilitiesStore.get(item.id).sel.filter(e => e[1] === this.state.selected)[0];
				ap = option[2];
				_sel2 = option[3];
				_input = option[4];
			}
			args.sel = this.state.selected;
			args.sel2 = this.state.selected2;
			args.input = this.state.input;
		} else if (item.id === 'SA_30') {
			args.sel = this.state.selected;
			args.tier = this.state.selected_tier;
			if (this.state.selected !== '' && this.state.selected_tier !== 0)
				ap = this.state.selected_tier === 4 ? 0 : item.ap * this.state.selected_tier;
		} else if (item.ap === 'sel') {
			if (this.state.selected !== '') {
				ap = SpecialAbilitiesStore.get(item.id).sel[this.state.selected - 1][2];
			}
			args.sel = this.state.selected;
		} else if (item.input !== undefined && item.input !== null) {
			args.input = this.state.input;
			ap = item.ap;
		} else if (item.sel !== undefined && item.sel.length > 0) {
			args.sel = this.state.selected;
			ap = item.ap;
		} else {
			ap = item.ap;
		}

		args.costs = ap;

		var roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

		if (item.tiers !== undefined && item.tiers !== null) {
			var array = [];
			if (item.id === 'SA_30') array.push(['MS', 4]);
			for (let i = 0; i < item.tiers; i++ ) {
				array.push([roman[i], i + 1]);
			}
			tierElement = (
				<Dropdown
					className="tiers"
					value={this.state.selected_tier}
					onChange={this.handleSelectTier}
					options={array} />
			);
			if (this.state.selected_tier === 0) disabled = true;
		}

		if (item.sel !== undefined && item.sel.length > 0) {
			selectElement = (
				<Dropdown
					value={this.state.selected}
					onChange={this.handleSelect}
					options={item.sel}
					disabled={selectElement_disabled} />
			);
			if (this.state.selected === '') disabled = true;
		}

		if (item.input !== undefined && item.input !== null) {
			inputElement = (
				<TextField
					hint={item.input}
					value={this.state.input}
					onChange={this.handleInput} />
			);
			if (this.state.input === '') disabled = true;
		}

		if (item.id === 'SA_10') {
			inputElement = (
				<TextField
					hint={_input === null ? '' : _input}
					value={this.state.input}
					onChange={this.handleInput}
					disabled={_input === null} />
			);
			selectElement2 = (
				<Dropdown
					value={this.state.selected2}
					onChange={this.handleSelect2}
					options={_sel2}
					disabled={_sel2.length === 0 || this.state.input !== '' || this.state.selected === ''} />
			);
			if (this.state.selected2 === '' && this.state.input === '') disabled = true;
		}

		const GROUPS = ['Allgemein', 'Schicksal', 'Kampf', 'Magisch', 'Magisch (Stab)', 'Magisch (Hexe)', 'Geweiht'];

		return (
			<tr>
				<td className="gr">{GROUPS[item.gr - 1]}</td>
				<td className="name">
					<div>
						<h2>{item.name}</h2>
						{selectElement}
						{selectElement2}
						{inputElement}
						{tierElement}
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

export default SpecialAbilitiesListAddItem;
