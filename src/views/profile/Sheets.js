import ChantSheet from './ChantSheet';
import CombatSheet from './CombatSheet';
import InventorySheet from './InventorySheet';
import MainSheet from './MainSheet';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';
import SpellsSheet from './SpellsSheet';
import SkillsSheet from './SkillsSheet';

export default class Sheets extends Component {

	print = () => window.print();

	render() {
		return (
			<div className="page" id="sheets">
				<Scroll className="sheet-wrapper">
					<MainSheet />
					<SkillsSheet />
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
