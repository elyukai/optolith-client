import AttributeStore from '../../stores/AttributeStore';
import APStore from '../../stores/APStore';
import CultureStore from '../../stores/CultureStore';
import DisAdvStore from '../../stores/DisAdvStore';
import ELStore from '../../stores/ELStore';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import RaceStore from '../../stores/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

export default class CombatSheet extends Component {
	render() {

		const source = {
			attributes: AttributeStore.getAllForView(),
			baseValues: AttributeStore.getBaseValues(),
			race: RaceStore.getCurrentName(),
			culture: CultureStore.getCurrentName(),
			profession: ProfessionVariantStore.getCurrentName() !== null ? `${ProfessionStore.getCurrentName()} (${ProfessionVariantStore.getCurrentName()})` : ProfessionStore.getCurrentName(),
			el: ELStore.getStart().name,
			apTotal: APStore.get(),
			apUsed: APStore.getUsed(),
			advActive: DisAdvStore.getActiveForView(true),
			disadvActive: DisAdvStore.getActiveForView(false)
		};

		const { attributes, baseValues, race, culture, profession, el, apTotal, apUsed, advActive, disadvActive } = source;

		const addHeader = attributes.length > 0 ? [
			{ short: 'LE', value: baseValues.le + attributes[6].value * 2 },
			{ short: 'AW', value: Math.round(attributes[5].value / 2) },
			{ short: 'INI', value: Math.round((attributes[0].value + attributes[5].value) / 2) },
			{ short: 'SK', value: baseValues.sk + Math.round((attributes[0].value + attributes[1].value + attributes[2].value) / 6) },
			{ short: 'ZK', value: baseValues.zk + Math.round((attributes[6].value * 2 + attributes[7].value) / 6) },
			{ short: 'WS', value: Math.round(attributes[6].value / 2) }
		] : [];

		return (
			<div className="sheet combat">
				<SheetHeader title="Kampf" add={addHeader} />
				<div className="upper">
					<TextBox label="Kampftechniken">
					</TextBox>
				</div>
			</div>
		);
	}
}
