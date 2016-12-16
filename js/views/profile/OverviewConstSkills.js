import React, { Component, PropTypes } from 'react';

export default class OverviewConstSkills extends Component {

	static propTypes = {
		list: PropTypes.array
	};

	render() {

		var roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		var langLitc = new Set(['SA_28','SA_30']);

		return (
			<div className="list">
				{
					this.props.list.map(obj => {
						let { id, name, add, tiers, tier } = obj;

						if (langLitc.has(id)) {
							return;
						}

						if (['ADV_28','ADV_29'].indexOf(id) > -1) name = `Immunität gegen ${add}`;
						else if (id === 'DISADV_1') name = `Angst vor ${add}`;
						else if (['DISADV_34','DISADV_50'].indexOf(id) > -1) name  += ` ${roman[tier - 1]} (${add})`;
						else if (add) name += ` (${add})`;
						
						if (tiers !== undefined && tiers !== null && ['DISADV_34','DISADV_50'].indexOf(id) === -1) {
							if (id === 'SA_30' && tier === 4) {
								name += ` MS`;
							} else {
								name += ` ${roman[tier - 1]}`;
							}
						}

						return name;
					}).filter(e => e).join(', ')
				}
			</div>
		);
	}
}
