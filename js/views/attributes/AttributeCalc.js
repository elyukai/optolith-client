import AttributeCalcItem from './AttributeCalcItem';
import AttributeStore from '../../stores/AttributeStore';
import ListStore from '../../stores/ListStore';
import React, { Component, PropTypes } from 'react';

class AttributeCalc extends Component {

	static propTypes = {
		attributes: PropTypes.array.isRequired,
		baseValues: PropTypes.object.isRequired,
		phase: PropTypes.number.isRequired
	};

	render() {

		const { attributes, baseValues, phase } = this.props;

		const calculated = [
			{
				label: 'LE',
				value: do {
					let a = baseValues.le + attributes[6].value * 2 + baseValues.leAdd;
					if (ListStore.get('ADV_25') && ListStore.get('ADV_25').active)
						a += ListStore.get('ADV_25').tier;
					else if (ListStore.get('DISADV_28') && ListStore.get('DISADV_28').active)
						a -= ListStore.get('DISADV_28').tier;
					a;
				},
				disabledIncrease: baseValues.leAdd >= ListStore.get('ATTR_7').value
			},
			{
				label: 'AE',
				value: do {
					let primary = ListStore.getPrimaryAttrID(1);
					if (primary === 'ATTR_0')
						'-';
					else {
						let a = 20 + AttributeStore.get(primary).value + baseValues.aeAdd;
						if (ListStore.get('ADV_23') && ListStore.get('ADV_23').active)
							a += ListStore.get('ADV_23').tier;
						else if (ListStore.get('DISADV_26') && ListStore.get('DISADV_26').active)
							a -= ListStore.get('DISADV_26').tier;
						a;
					}
				},
				disabledIncrease: do {
					let primary = ListStore.getPrimaryAttrID(1);
					if (primary === 'ATTR_0')
						false;
					else {
						baseValues.aeAdd >= ListStore.get(primary).value;
					}
				},
				permanent: 0,
				permanentRe: 0,
				disabledPermanent: true
			},
			{
				label: 'KE',
				value: do {
					let primary = ListStore.getPrimaryAttrID(2);
					if (primary === 'ATTR_0')
						'-';
					else {
						let a = 20 + AttributeStore.get(primary).value + baseValues.keAdd;
						if (ListStore.get('ADV_24') && ListStore.get('ADV_24').active)
							a += ListStore.get('ADV_24').tier;
						else if (ListStore.get('DISADV_27') && ListStore.get('DISADV_27').active)
							a -= ListStore.get('DISADV_27').tier;
						a;
					}
				},
				disabledIncrease: do {
					let primary = ListStore.getPrimaryAttrID(2);
					if (primary === 'ATTR_0')
						false;
					else {
						baseValues.keAdd >= ListStore.get(primary).value;
					}
				},
				permanent: 0,
				permanentRe: 0,
				disabledPermanent: true
			},
			{
				label: 'SK',
				value: do {
					let a = baseValues.sk + Math.round((attributes[0].value + attributes[1].value + attributes[2].value) / 6);
					if (ListStore.get('ADV_26') && ListStore.get('ADV_26').active)
						a++;
					else if (ListStore.get('DISADV_29') && ListStore.get('DISADV_29').active)
						a--;
					a;
				}
			},
			{
				label: 'ZK',
				value: do {
					let a = baseValues.zk + Math.round((attributes[6].value * 2 + attributes[7].value) / 6);
					if (ListStore.get('ADV_27') && ListStore.get('ADV_27').active)
						a++;
					else if (ListStore.get('DISADV_30') && ListStore.get('DISADV_30').active)
						a--;
					a;
				}
			},
			{
				label: 'AW',
				value: Math.round(attributes[5].value / 2)
			},
			{
				label: 'INI',
				value: Math.round((attributes[0].value + attributes[5].value) / 2)
			},
			{
				label: 'GS',
				value: baseValues.gs
			}
		];

		return (
			<div className="calculated">
				{
					calculated.map(attribute => (
						<AttributeCalcItem
							key={attribute.label}
							attribute={attribute}
							phase={phase}
							/>
					))
				}
			</div>
		);
	}
}

export default AttributeCalc;
