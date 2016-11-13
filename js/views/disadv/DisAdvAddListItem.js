import BorderButton from '../../components/BorderButton';
import DisAdvActions from '../../actions/DisAdvActions';
import DisAdvStore from '../../stores/DisAdvStore';
import Dropdown from '../../components/Dropdown';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

class DisAdvAddListItem extends Component {

	static propTypes = {
		className: PropTypes.string,
		item: PropTypes.object
	};

	state = {
		selected: '',
		selected_tier: 0,
		input: '',
		input2: ''
	};

	handleSelect = selected => this.setState({ selected });
	handleSelectTier = selected_tier => {
		if (['DISADV_34','DISADV_50'].indexOf(this.props.item.id) > -1) {
			this.setState({ selected_tier, selected: '' });
		} else {
			this.setState({ selected_tier });
		}
	};
	handleInput = event => this.setState({ input: event.target.value });
	handleSecondInput = event => this.setState({ input2: event.target.value });
	addToList = args => {
		DisAdvActions.addToList(args);
		if (this.state.selected !== '' || this.state.selected_tier !== 0 || this.state.input !== '') {
			this.setState({
				selected: '',
				selected_tier: 0,
				input: '',
				input2: ''
			});
		}
	};

	render() {

		const disadv = this.props.item;

		var ap;
		var disabled = false;
		var args = { id: disadv.id };

		var tierElement;
		var selectElement;
		var selectElement_disabled = false;
		if (['ADV_32','DISADV_1','DISADV_24','DISADV_34','DISADV_36','DISADV_45','DISADV_50'].indexOf(disadv.id) > -1 && this.state.input !== '') {
			selectElement_disabled = true;
		}
		var inputElement;
		var inputElement2;

		if (['ADV_4','ADV_16','ADV_17','ADV_47','DISADV_48'].indexOf(disadv.id) > -1) {
			if (this.state.selected !== '') {
				ap = disadv.ap[DisAdvStore.get(this.state.selected).skt - 1];
			}
			args.sel = this.state.selected;
		} else if (['ADV_28','ADV_29'].indexOf(disadv.id) > -1) {
			selectElement = (
				<Dropdown
					options={disadv.sel}
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
			ap = this.state.selected !== '' ? DisAdvStore.get(disadv.id).sel[this.state.selected - 1][2] : '';
			if (this.state.selected === '') disabled = true;
			// ap = this.state.input2 !== '' && !Number.isNaN(parseInt(this.state.input2)) ? Math.round(parseInt(this.state.input2) / 2) : this.state.selected !== '' ? DisAdvStore.get(disadv.id).sel[this.state.selected - 1][2] : '';
			// if (!((this.state.selected !== '' && this.state.input === '' && this.state.input2 === '') || 
			// 	(this.state.input !== '' && this.state.input2 !== '' && !Number.isNaN(parseInt(this.state.input2)))
			// )) disabled = true;
			// args.input = [this.state.input, this.state.input2];
			args.sel = this.state.selected;
		} else if (disadv.id === 'DISADV_1') {
			if (this.state.selected_tier > 0) {
				ap = disadv.ap * this.state.selected_tier;
			}
			if (this.state.selected === '' && this.state.input === '') disabled = true;
			args.sel = this.state.selected;
			args.input = this.state.input;
			args.tier = this.state.selected_tier;
		} else if (['DISADV_34','DISADV_50'].indexOf(disadv.id) > -1) {
			if (this.state.selected_tier > 0) {
				let maxCurrentTier = DisAdvStore.get(disadv.id).active.reduce((a,b) => b[1] > a ? b[1] : a, 0);
				ap = maxCurrentTier >= this.state.selected_tier ? 0 : disadv.ap * (this.state.selected_tier - maxCurrentTier);
			}
			let currentSelIDs = new Set(DisAdvStore.get(disadv.id).active.map(e => e[0]));
			let sel = disadv.sel.filter(e => this.state.selected_tier === e[2] && !currentSelIDs.has(e[1]));
			selectElement = (
				<Dropdown
					value={this.state.selected}
					onChange={this.handleSelect}
					options={sel}
					disabled={this.state.selected_tier === 0 || selectElement_disabled} />
			);
			if (this.state.selected === '' && this.state.input === '') disabled = true;
			args.sel = this.state.selected;
			args.input = this.state.input;
			args.tier = this.state.selected_tier;
		} else if (['ADV_32','DISADV_24'].indexOf(disadv.id) > -1) {
			if (this.state.selected === '' && this.state.input === '') disabled = true;
			args.sel = this.state.selected;
			args.input = this.state.input;
			ap = disadv.ap;
		} else if (['DISADV_33','DISADV_37','DISADV_51'].indexOf(disadv.id) > -1) {
			if (disadv.id === 'DISADV_33') {
				var disab = true;
				if ([7,8].indexOf(this.state.selected) > -1) {
					args.input = this.state.input;
					ap = DisAdvStore.get(disadv.id).sel[this.state.selected - 1][2];
					disab = false;
				}
				inputElement = (
					<TextField
						value={this.state.input}
						onChange={this.handleInput}
						disabled={disab} />
				);
			}
			if (this.state.selected === 7 && DisAdvStore.get(disadv.id).active.filter(e => Array.isArray(e) && e[0] === 7).length > 0) {
				ap = 0;
			} else if (this.state.selected !== '') {
				ap = DisAdvStore.get(disadv.id).sel[this.state.selected - 1][2];
			}
			args.sel = this.state.selected;
		} else if (['DISADV_36','DISADV_45'].indexOf(disadv.id) > -1) {
			if (this.state.selected === '' && this.state.input === '') disabled = true;
			if (disadv.id === 'DISADV_36' && DisAdvStore.get(disadv.id).active.length > 2) {
				ap = 0;
			} else {
				ap = disadv.ap;
			}
			args.sel = this.state.selected;
			args.input = this.state.input;
		} else if (disadv.tiers !== undefined && disadv.tiers !== null) {
			if (this.state.selected_tier > 0) {
				ap = disadv.ap * this.state.selected_tier;
			}
			args.tier = this.state.selected_tier;
		} else if (disadv.input !== undefined && disadv.input !== null) {
			args.input = this.state.input;
			ap = disadv.ap;
		} else {
			ap = disadv.ap;
		}

		if (disadv.id.match('DIS') && ap !== undefined) ap = -ap;

		args.costs = ap;

		var roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

		if (disadv.tiers !== undefined && disadv.tiers !== null) {
			var array = [];
			for (let i = 0; i < disadv.tiers; i++ ) {
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

		if (disadv.sel !== undefined && disadv.sel.length > 0 && ['ADV_28','ADV_29','DISADV_34','DISADV_50'].indexOf(disadv.id) === -1) {
			selectElement = (
				<Dropdown
					value={this.state.selected}
					onChange={this.handleSelect}
					options={disadv.sel}
					disabled={selectElement_disabled} />
			);
			if (this.state.selected === '' &&  ['ADV_32','DISADV_1','DISADV_24','DISADV_36','DISADV_45'].indexOf(disadv.id) === -1) disabled = true;
		}

		if (disadv.input !== undefined && disadv.input !== null && ['ADV_28','ADV_29'].indexOf(disadv.id) === -1) {
			inputElement = (
				<TextField
					hint={disadv.input}
					value={this.state.input}
					onChange={this.handleInput} />
			);
			if (this.state.input === '' && ['ADV_32','DISADV_1','DISADV_24','DISADV_34','DISADV_36','DISADV_45','DISADV_50'].indexOf(disadv.id) === -1) disabled = true;
		}

		var tierElement1;
		var tierElement2;

		if (['DISADV_34','DISADV_50'].indexOf(disadv.id) > -1) {
			tierElement1 = tierElement;
		} else {
			tierElement2 = tierElement;
		}

		return (
			<tr className={this.props.className}>
				<td className="name">
					<div>
						<h2>{disadv.name}</h2>
						{tierElement1}
						{selectElement}
						{inputElement}
						{inputElement2}
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

export default DisAdvAddListItem;
