import BorderButton from '../../layout/BorderButton';
import SpecialAbilitiesActions from '../../../actions/SpecialAbilitiesActions';
import Dropdown from '../../layout/Dropdown';
import React, { Component, PropTypes } from 'react';
import TextField from '../../layout/TextField';

class SpecialAbilitiesListRemoveItem extends Component {

	static propTypes = {
		item: PropTypes.object
	};

	state = {
		selected_tier: 0
	};

	constructor(props) {
		super(props);
	}

	handleSelectTier = selected_tier => {
		var item = this.props.item;
		SpecialAbilitiesActions.updateTier(
			item.id,
			selected_tier,
			(selected_tier === 4 && item.id === 'SA_30' ? 0 : item.ap * selected_tier) - (item.tier === 4 && item.id === 'SA_30' ? 0 : item.ap * item.tier),
			item.sid
		);
	};
	removeFromList = args => SpecialAbilitiesActions.removeFromList(args);

	render() {

		const item = this.props.item;

		var ap = item.ap;
		var disabled = item.disabled;
		var args = { id: item.id };

		var name = item.name;

		var tierElement;

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
					value={item.tier}
					onChange={this.handleSelectTier}
					options={array} />
			);
			ap = item.tier === 4 && item.id === 'SA_30' ? 0 : item.ap * item.tier;
		}

		args.costs = -ap;

		if (item.hasOwnProperty('sid')) args.sid = item.sid;

		if (item.hasOwnProperty('add')) name += ` (${item.add})`;

		const GROUPS = ['Allgemein', 'Schicksal', 'Kampf', 'Magisch', 'Magisch (Stab)', 'Magisch (Hexe)', 'Geweiht'];

		return (
			<tr>
				<td className="gr">{GROUPS[item.gr - 1]}</td>
				<td className="name">
					<div>
						<h2>{name}</h2>
						{tierElement}
					</div>
				</td>
				<td className="ap">{ap}</td>
				<td className="inc">
					<BorderButton label="-" onClick={this.removeFromList.bind(null, args)} disabled={disabled} />
				</td>
			</tr>
		);
	}
}

export default SpecialAbilitiesListRemoveItem;
