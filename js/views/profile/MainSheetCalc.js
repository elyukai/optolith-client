import ListStore from '../../stores/ListStore';
import MainSheetCalcItem from './MainSheetCalcItem';
import React, { Component, PropTypes } from 'react';

class MainSheetCalc extends Component {

	static propTypes = {
		attributes: PropTypes.array.isRequired,
		attrPrimary: PropTypes.array.isRequired,
		baseValues: PropTypes.object.isRequired
	};

	render() {

		const { attributes, attrPrimary, baseValues } = this.props;

		return attributes.length > 0 ? (
			<div className="calculated">
				<div className="calc-header">
					<div>Wert</div>
					<div>Bonus/<br/>Malus</div>
					<div>Zukauf</div>
					<div>Max</div>
				</div>
				<MainSheetCalcItem
					label="Lebensenergie"
					calc="(GW der Spezies + KO + KO)"
					value={baseValues.le + attributes[6].value * 2}
					add={do {
						if (ListStore.get('ADV_25') && ListStore.get('ADV_25').active)
							ListStore.get('ADV_25').tier;
						else if (ListStore.get('DISADV_28') && ListStore.get('DISADV_28').active)
							-ListStore.get('DISADV_28').tier;
						else
							0;
					}}
					purchased={baseValues.leAdd}
					subLabel="Grundwert"
					subArray={[baseValues.le]} />
				<MainSheetCalcItem
					label="Astralenergie"
					calc="(20 durch Zauberer + Leiteigenschaft)"
					value={attrPrimary[0] === 'ATTR_0' || !ListStore.get(attrPrimary[0]) ? 0 : 20 + ListStore.get(attrPrimary[0]).value}
					add={do {
						if (ListStore.get('ADV_23') && ListStore.get('ADV_23').active)
							ListStore.get('ADV_23').tier;
						else if (ListStore.get('DISADV_26') && ListStore.get('DISADV_26').active)
							-ListStore.get('DISADV_26').tier;
						else
							0;
					}}
					purchased={baseValues.aeAdd}
					subLabel="perm. eingesetzt/davon zurückgekauft"
					subArray={[0,0]}
					empty={attrPrimary[0] === 'ATTR_0'} />
				<MainSheetCalcItem
					label="Karmaenergie"
					calc="(20 durch Geweihter + Leiteigenschaft)"
					value={attrPrimary[1] === 'ATTR_0' || !ListStore.get(attrPrimary[1]) ? 0 : 20 + ListStore.get(attrPrimary[1]).value}
					add={do {
						if (ListStore.get('ADV_24') && ListStore.get('ADV_24').active)
							ListStore.get('ADV_24').tier;
						else if (ListStore.get('DISADV_27') && ListStore.get('DISADV_27').active)
							-ListStore.get('DISADV_27').tier;
						else
							0;
					}}
					purchased={baseValues.keAdd}
					subLabel="perm. eingesetzt/davon zurückgekauft"
					subArray={[0,0]}
					empty={attrPrimary[1] === 'ATTR_0'} />
				<MainSheetCalcItem
					label="Seelenkraft"
					calc="(GW der Spezies + (MU + KL + IN)/6)"
					value={baseValues.sk + Math.round((attributes[0].value + attributes[1].value + attributes[2].value) / 6)}
					add={do {
						if (ListStore.get('ADV_26') && ListStore.get('ADV_26').active)
							1;
						else if (ListStore.get('DISADV_29') && ListStore.get('DISADV_29').active)
							-1;
						else
							0;
					}}
					purchased={null}
					subLabel="Grundwert"
					subArray={[baseValues.sk]} />
				<MainSheetCalcItem
					label="Zähigkeit"
					calc="(GW der Spezies + (KO + KO + KK)/6)"
					value={baseValues.zk + Math.round((attributes[6].value * 2 + attributes[7].value) / 6)}
					add={do {
						if (ListStore.get('ADV_27') && ListStore.get('ADV_27').active)
							1;
						else if (ListStore.get('DISADV_30') && ListStore.get('DISADV_30').active)
							-1;
						else
							0;
					}}
					purchased={null}
					subLabel="Grundwert"
					subArray={[baseValues.zk]} />
				<MainSheetCalcItem
					label="Ausweichen"
					calc="(GE/2)"
					value={Math.round(attributes[5].value / 2)}
					add={0}
					purchased={null} />
				<MainSheetCalcItem
					label="Initiative"
					calc="(MU + GE)/2"
					value={Math.round((attributes[0].value + attributes[5].value) / 2)}
					add={0}
					purchased={null} />
				<MainSheetCalcItem
					label="Geschwindigkeit"
					calc="(GW der Spezies, mögl. Einbeinig)"
					value={baseValues.gs}
					add={0}
					purchased={null}
					subLabel="Grundwert"
					subArray={[baseValues.gs]} />
				<div className="fate">
					<h3>Schicksalspunkte</h3>
				</div>
			</div>
		) : null;
	}
}

export default MainSheetCalc;
