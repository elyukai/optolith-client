import BorderButton from '../../layout/BorderButton';
import SpecialAbilitiesActions from '../../../actions/SpecialAbilitiesActions';
import Dropdown from '../../layout/Dropdown';
import React, { Component, PropTypes } from 'react';
import TextField from '../../layout/TextField';

class SpecialAbilitiesListRemoveItem extends Component {

	static propTypes = {
		apLeft: PropTypes.number,
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
			0,
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
			item.tiers = Math.min(item.tiers, item.tier + Math.floor(this.props.apLeft / 2));
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
			ap = item.ap * item.tier;
		}

		args.costs = 0;

		if (item.hasOwnProperty('sid')) args.sid = item.sid;

		if (item.hasOwnProperty('add')) name += ` (${item.add})`;

		return (
			<tr>
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
