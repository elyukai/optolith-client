import AttributeStore from '../../../stores/AttributeStore';
import APStore from '../../../stores/APStore';
import Avatar from '../../layout/Avatar';
import Box from '../../layout/sheets/Box';
import CultureStore from '../../../stores/rcp/CultureStore';
import DisAdvStore from '../../../stores/DisAdvStore';
import ELStore from '../../../stores/ELStore';
import LabelBox from '../../layout/sheets/LabelBox';
import MainSheetCalcItem from './MainSheetCalcItem';
import OverviewConstSkills from './OverviewConstSkills';
import Plain from '../../layout/sheets/Plain';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../../../stores/rcp/ProfessionVariantStore';
import RaceStore from '../../../stores/rcp/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../layout/sheets/TextBox';

class TalentsSheet extends Component {

	constructor(props) {
		super(props);
	}

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

export default TalentsSheet;
