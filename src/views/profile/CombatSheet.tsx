import * as React from 'react';
import * as secondaryAttributes from '../../utils/secondaryAttributes';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

export default () => {
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
};
