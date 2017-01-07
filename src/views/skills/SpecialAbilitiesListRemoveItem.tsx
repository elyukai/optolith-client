import BorderButton from '../../components/BorderButton';
import SpecialAbilitiesActions from '../../_actions/SpecialAbilitiesActions';
import Dropdown from '../../components/Dropdown';
import React, { Component, PropTypes } from 'react';

export interface Active {
    id: string;
    name: string;
    sid?: string | number;
    add?: any;
    cost: number;
    tier?: number;
    tiers?: number;
    gr: number;
    disabled: boolean;
}

interface RemoveObject {
	id: string;
	cost?: number;
	sid?: string | number;
}

interface Props {
	item: Active;
	phase: number;
}

interface State {
	selected_tier: number;
}

export default class SpecialAbilitiesListRemoveItem extends Component<Props, State> {

	static propTypes = {
		item: PropTypes.object,
		phase: PropTypes.number
	};

	state = {
		selected_tier: 0
	};

	handleSelectTier = selected_tier => {
		var item = this.props.item;
		SpecialAbilitiesActions.updateTier(
			item.id,
			selected_tier,
			(selected_tier === 4 && item.id === 'SA_30' ? 0 : item.cost * selected_tier) - (item.tier === 4 && item.id === 'SA_30' ? 0 : item.cost * item.tier),
			item.sid
		);
	};
	removeFromList = args => SpecialAbilitiesActions.removeFromList(args);

	render() {

		const item = this.props.item;

		var cost = item.cost;
		var disabled = item.disabled;
		var args: RemoveObject = { id: item.id };

		var name = item.name;

		var tierElement;
		var addSpecial;

		var roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

		if (item.tiers !== undefined && item.tiers !== null) {
			var array = [];
			if (item.id === 'SA_30' && (item.tier === 4 || this.props.phase < 3)) array.push(['MS', 4]);
			for (let i = 0; i < item.tiers; i++ ) {
				if (this.props.phase < 3 || i + 1 >= item.tier) {
					array.push([roman[i], i + 1]);
				}
			}
			if (array.length > 1) {
				tierElement = (
					<Dropdown
						className="tiers"
						value={item.tier}
						onChange={this.handleSelectTier}
						options={array} />
				);
			} else {
				addSpecial = ' ' + array[0][0];
			}
			cost = item.tier === 4 && item.id === 'SA_30' ? 0 : item.cost * item.tier;
		}

		args.cost = cost;

		if (item.hasOwnProperty('sid')) args.sid = item.sid;

		if (item.hasOwnProperty('add')) name += ` (${item.add})`;
		if (addSpecial) name += addSpecial;

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
				<td className="ap">{cost}</td>
				{ this.props.phase < 3 ? (
					<td className="inc">
						<BorderButton label="-" onClick={this.removeFromList.bind(null, args)} disabled={disabled} />
					</td>
				) : null }
			</tr>
		);
	}
}
