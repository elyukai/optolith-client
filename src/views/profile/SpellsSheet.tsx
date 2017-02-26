import { getAE } from '../../utils/secondaryAttributes';
import * as React from 'react';
import AttributeMods from './AttributeMods';
import SheetHeader from './SheetHeader';
import SpellsSheetCantrips from './SpellsSheetCantrips';
import SpellsSheetSpecialAbilities from './SpellsSheetSpecialAbilities';
import SpellsSheetSpells from './SpellsSheetSpells';
import SpellsSheetTraditionsProperties from './SpellsSheetTraditionsProperties';

export default () => {
	const addHeader = [
		{ id: 'AE_MAX', short: 'AsP Max.', value: getAE().value },
		{ id: 'AE_CURRENT', short: 'Aktuell' }
	];

	return (
		<div className="sheet" id="spells">
			<SheetHeader title="Zauber &amp; Rituale" add={addHeader} />
			<div className="all">
				<SpellsSheetSpells />
				<AttributeMods />
				<SpellsSheetTraditionsProperties />
				<SpellsSheetSpecialAbilities />
				<SpellsSheetCantrips />
			</div>
		</div>
	);
};
