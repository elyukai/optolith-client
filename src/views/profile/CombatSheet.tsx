import * as React from 'react';
import * as secondaryAttributes from '../../utils/secondaryAttributes';
import CombatSheetArmor from './CombatSheetArmor';
import CombatSheetLifePoints from './CombatSheetLifePoints';
import CombatSheetMeleeWeapons from './CombatSheetMeleeWeapons';
import CombatSheetRangedWeapons from './CombatSheetRangedWeapons';
import CombatSheetShields from './CombatSheetShields';
import CombatSheetSpecialAbilities from './CombatSheetSpecialAbilities';
import CombatSheetStates from './CombatSheetStates';
import CombatSheetTechniques from './CombatSheetTechniques';
import SheetHeader from './SheetHeader';

export default () => {
	const addHeader = secondaryAttributes.getAll();

	addHeader.splice(1, 2);

	return (
		<div className="sheet" id="combat-sheet">
			<SheetHeader title="Kampf" add={addHeader} />
			<div className="upper">
				<CombatSheetTechniques />
				<CombatSheetLifePoints />
			</div>
			<div className="lower">
				<CombatSheetMeleeWeapons />
				<CombatSheetRangedWeapons />
				<CombatSheetArmor />
				<CombatSheetShields />
				<CombatSheetSpecialAbilities />
				<CombatSheetStates />
			</div>
		</div>
	);
};
