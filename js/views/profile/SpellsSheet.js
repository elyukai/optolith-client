import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

export default class SpellsSheet extends Component {
	render() {

		const addHeader = [
			{ short: 'AsP Max.', value: 0 },
			{ short: 'Aktuell' }
		];

		return (
			<div className="sheet spells">
				<SheetHeader title="Zauber & Rituale" add={[]} />
				<div className="upper">
					<TextBox label="Zauber & Rituale">
					</TextBox>
				</div>
			</div>
		);
	}
}
