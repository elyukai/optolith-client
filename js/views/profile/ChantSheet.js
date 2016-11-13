import AttributeStore from '../../stores/AttributeStore';
import APStore from '../../stores/APStore';
import Avatar from '../../components/Avatar';
import Box from '../../components/Box';
import CultureStore from '../../stores/CultureStore';
import DisAdvStore from '../../stores/DisAdvStore';
import ELStore from '../../stores/ELStore';
import LabelBox from '../../components/LabelBox';
import MainSheetCalcItem from './MainSheetCalcItem';
import OverviewConstSkills from './OverviewConstSkills';
import Plain from '../../components/Plain';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import RaceStore from '../../stores/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

class ChantSheet extends Component {
	render() {

		const addHeader = [
			{ short: 'KaP Max.', value: 0 },
			{ short: 'Aktuell' }
		];

		return (
			<div className="sheet chants">
				<SheetHeader title="Liturgien & Zeremonien" add={addHeader} />
				<div className="upper">
					<TextBox label="Liturgien & Zeremonien">
					</TextBox>
				</div>
			</div>
		);
	}
}

export default ChantSheet;
