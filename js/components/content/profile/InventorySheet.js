import AttributeStore from '../../../stores/AttributeStore';
import APStore from '../../../stores/APStore';
import Avatar from '../../layout/Avatar';
import Box from '../../layout/sheets/Box';
import CultureStore from '../../../stores/CultureStore';
import DisAdvStore from '../../../stores/DisAdvStore';
import ELStore from '../../../stores/ELStore';
import LabelBox from '../../layout/sheets/LabelBox';
import MainSheetCalcItem from './MainSheetCalcItem';
import Plain from '../../layout/sheets/Plain';
import ProfessionStore from '../../../stores/ProfessionStore';
import ProfessionVariantStore from '../../../stores/ProfessionVariantStore';
import RaceStore from '../../../stores/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../layout/sheets/TextBox';

class InventorySheet extends Component {

	constructor(props) {
		super(props);
	}

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
