import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import * as secondaryAttributes from '../../utils/secondaryAttributes';
import TextBox from '../../components/TextBox';

export default class CombatSheet extends Component {

	render() {

		const addHeader = secondaryAttributes.getAll();

		addHeader.splice(1, 2);

		return (
			<div className="sheet combat">
				<SheetHeader title="Kampf" add={addHeader} />
				<div className="upper">
					<TextBox label="Kampftechniken">
					</TextBox>
				</div>
			</div>
		);
	}
}
