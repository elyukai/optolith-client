import * as React from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

export default () => {
	const addHeader = [
		{ short: 'AsP Max.', value: 0 },
		{ short: 'Aktuell' }
	];

	return (
		<div className="sheet spells">
			<SheetHeader title="Zauber &amp; Rituale" add={[]} />
			<div className="upper">
				<TextBox label="Zauber &amy; Rituale">
				</TextBox>
			</div>
		</div>
	);
};
