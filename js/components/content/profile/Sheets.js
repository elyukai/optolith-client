import BorderButton from '../../layout/BorderButton';
import ChantSheet from './ChantSheet';
import CombatSheet from './CombatSheet';
import InventorySheet from './InventorySheet';
import MainSheet from './MainSheet';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';
import SpellsSheet from './SpellsSheet';
import TalentsSheet from './TalentsSheet';

class Sheets extends Component {

	constructor(props) {
		super(props);
	}

	print = () => window.print();

	render() {
		return (
			<div className="page" id="sheets">
				<div className="options">
					<BorderButton className="print-cs" label="Dokument drucken" onClick={this.print} />
				</div>
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

export default Sheets;
