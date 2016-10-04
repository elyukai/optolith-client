import React, { Component, PropTypes } from 'react';

class OverviewDisAdv extends Component {

	static propTypes = {
		list: PropTypes.array
	};

	constructor(props) {
		super(props);
	}

	render() {

		var roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

		return (
			<div className="list">
				{
					this.props.list.map(disadv => {

						var name = disadv.name;

						if (['ADV_28','ADV_29'].indexOf(disadv.id) > -1) name = `Immunität gegen ${disadv.add}`;
						else if (disadv.id === 'DISADV_1') name = `Angst vor ${disadv.add}`;
						else if (['DISADV_34','DISADV_50'].indexOf(disadv.id) > -1) name  += ` ${roman[disadv.tier - 1]} (${disadv.add})`;
						else if (disadv.hasOwnProperty('add')) name += ` (${disadv.add})`;
						
						if (disadv.tiers !== undefined && disadv.tiers !== null && ['DISADV_34','DISADV_50'].indexOf(disadv.id) === -1) {
							name += ` ${roman[disadv.tier - 1]}`;
						}

						return name;

					}).join(', ')
				}
			</div>
		);
	}
}

export default OverviewDisAdv;
