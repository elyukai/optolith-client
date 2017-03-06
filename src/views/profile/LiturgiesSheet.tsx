import * as React from 'react';
import { getKP } from '../../utils/secondaryAttributes';
import AttributeMods from './AttributeMods';
import LiturgiesSheetBlessings from './LiturgiesSheetBlessings';
import LiturgiesSheetLiturgies from './LiturgiesSheetLiturgies';
import LiturgiesSheetSpecialAbilities from './LiturgiesSheetSpecialAbilities';
import LiturgiesSheetTraditionsAspects from './LiturgiesSheetTraditionsAspects';
import SheetHeader from './SheetHeader';

export default () => {
	const addHeader = [
		{ id: 'KP_MAX', short: 'KaP Max.', value: getKP().value },
		{ id: 'KP_CURRENT', short: 'Aktuell' },
	];

	return (
		<div className="sheet" id="liturgies">
			<SheetHeader title="Liturgien &amp; Zeremonien" add={addHeader} />
			<div className="all">
				<LiturgiesSheetLiturgies />
				<AttributeMods />
				<LiturgiesSheetTraditionsAspects />
				<LiturgiesSheetSpecialAbilities />
				<LiturgiesSheetBlessings />
			</div>
		</div>
	);
};
