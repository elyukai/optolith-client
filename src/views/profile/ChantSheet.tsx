import * as React from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

export default () => {
	const addHeader = [
		{ short: 'KaP Max.', value: 0 },
		{ short: 'Aktuell' }
	];

	return (
		<div className="sheet chants">
			<SheetHeader title="Liturgien & Zeremonien" add={[]} />
			<div className="upper">
				<TextBox label="Liturgien & Zeremonien">
				</TextBox>
			</div>
		</div>
	);
}
