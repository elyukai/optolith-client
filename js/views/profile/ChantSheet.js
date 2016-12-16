import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

export default class ChantSheet extends Component {
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
