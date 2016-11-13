import AttributeStore from '../../stores/AttributeStore';
import APStore from '../../stores/APStore';
import Avatar from '../../components/Avatar';
import Box from '../../components/Box';
import CultureStore from '../../stores/CultureStore';
import DisAdvStore from '../../stores/DisAdvStore';
import ELStore from '../../stores/ELStore';
import LabelBox from '../../components/LabelBox';
import MainSheetCalcItem from './MainSheetCalcItem';
import Plain from '../../components/Plain';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import RaceStore from '../../stores/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

class InventorySheet extends Component {
	render() {
		return (
			<div className="sheet inventory">
				<SheetHeader title="Besitz" />
				<div className="upper">
					<TextBox label="Ausrüstung">
					</TextBox>
				</div>
			</div>
		);
	}
}

export default InventorySheet;
