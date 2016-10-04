import BorderButton from '../../layout/BorderButton';
import SpecialAbilitiesActions from '../../../actions/SpecialAbilitiesActions';
import SpecialAbilitiesStore from '../../../stores/SpecialAbilitiesStore';
import Dropdown from '../../layout/Dropdown';
import React, { Component, PropTypes } from 'react';

class SpecialAbilitiesListAddItem extends Component {

	static propTypes = {
		apLeft: PropTypes.number,
		item: PropTypes.object
	};

	state = {
		selected: '',
		selected_tier: 0
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
	handleSelectTier = selected_tier => this.setState({ selected_tier });
	addToList = args => {
		SpecialAbilitiesActions.addToList(args);
		if (this.state.selected !== '' || this.state.selected_tier !== 0 || this.state.input !== '') {
			this.setState({
				selected: '',
				selected_tier: 0
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

		if (item.id === 'SA_30') {
			args.sel = this.state.selected;
			args.tier = this.state.selected_tier;
			if (this.state.selected !== '' && this.state.selected_tier !== 0)
				ap = item.ap * this.state.selected_tier;
		} else {
			if (this.state.selected !== '') {
				ap = SpecialAbilitiesStore.get(item.id).sel[this.state.selected - 1][2];
			}
			args.sel = this.state.selected;
		}

		args.costs = 0;

		var roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

		if (item.tiers !== undefined && item.tiers !== null) {
			var array = [];
			if (this.props.apLeft < 4) item.tiers = 1;
			else if (this.props.apLeft < 6) item.tiers = 2;
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
			if (item.id === 'SA_28') item.sel = item.sel.filter(e => SpecialAbilitiesStore.get(item.id).sel[e[1] - 1][2] <= this.props.apLeft);
			selectElement = (
				<Dropdown
					value={this.state.selected}
					onChange={this.handleSelect}
					options={item.sel} />
			);
			if (this.state.selected === '') disabled = true;
		}

		return (
			<tr>
				<td className="name">
					<div>
						<h2>{item.name}</h2>
						{selectElement}
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
