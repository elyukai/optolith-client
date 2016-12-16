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

export default class TalentsSheet extends Component {
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

		return (
			<div className="sheet talents">
				<SheetHeader title="Spielwerte" />
				<div className="upper">
					<TextBox label="Fertigkeiten">
					</TextBox>
				</div>
			</div>
		);
	}
}
