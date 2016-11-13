import BorderButton from '../../components/BorderButton';
import DisAdvActions from '../../actions/DisAdvActions';
import Dropdown from '../../components/Dropdown';
import React, { Component, PropTypes } from 'react';
import TextField from '../../components/TextField';

class DisAdvRemoveListItem extends Component {

	static propTypes = {
		item: PropTypes.object
	};
	
	handleSelectTier = selected_tier => {
		var disadv = this.props.item;
		DisAdvActions.updateTier( disadv.id, selected_tier, (selected_tier - disadv.tier) * disadv.ap * (disadv.id.match('DIS') ? -1 : 1), disadv.sid );
	};
	removeFromList = args => DisAdvActions.removeFromList(args);

	render() {

		const disadv = this.props.item;

		var disabled = disadv.disabled;
		var args = { id: disadv.id };

		var name = disadv.name;
		var ap = disadv.ap;
		var tierElement;

		var roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

		if (disadv.tiers !== undefined && disadv.tiers !== null && ['DISADV_34','DISADV_50'].indexOf(disadv.id) === -1) {
			var array = [];
			for (let i = 0; i < disadv.tiers; i++ ) {
				array.push([roman[i], i + 1]);
			}
			tierElement = (
				<Dropdown
					className="tiers"
					value={disadv.tier}
					onChange={this.handleSelectTier}
					options={array} />
			);
			ap = disadv.ap * disadv.tier;
		}

		if (disadv.id.match('DIS')) ap = -ap;

		args.costs = -ap;

		if (disadv.hasOwnProperty('sid')) args.sid = disadv.sid;

		if (['ADV_28','ADV_29'].indexOf(disadv.id) > -1) name = `Immunität gegen ${disadv.add}`;
		else if (disadv.id === 'DISADV_1') name = `Angst vor ${disadv.add}`;
		else if (['DISADV_34','DISADV_50'].indexOf(disadv.id) > -1) name  += ` ${roman[disadv.tier - 1]} (${disadv.add})`;
		else if (disadv.hasOwnProperty('add')) name += ` (${disadv.add})`;

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

export default DisAdvRemoveListItem;
