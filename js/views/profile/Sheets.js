import BorderButton from '../../components/BorderButton';
import ChantSheet from './ChantSheet';
import CombatSheet from './CombatSheet';
import InventorySheet from './InventorySheet';
import MainSheet from './MainSheet';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import SpellsSheet from './SpellsSheet';
import TalentsSheet from './TalentsSheet';

class Sheets extends Component {

	print = () => window.print();

	render() {
		return (
			<div className="page" id="sheets">
				<Scroll className="sheet-wrapper">
					<MainSheet />
					<TalentsSheet />
					<CombatSheet />
					<InventorySheet />
					<SpellsSheet />
					<ChantSheet />
				</Scroll>
			</div>
		);
	}
}
				// <div className="options">
				// 	<BorderButton className="print-cs" label="Dokument drucken" onClick={this.print} />
				// </div>

export default Sheets;
