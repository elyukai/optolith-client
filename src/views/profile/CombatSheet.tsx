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
import Sheet from './Sheet';
import SheetOptions from './SheetOptions';
import SheetWrapper from './SheetWrapper';

export default () => {
	const addHeader = secondaryAttributes.getAll();

	addHeader.splice(1, 2);

	return (
		<SheetWrapper>
			<SheetOptions/>
			<Sheet id="combat-sheet" title="Kampf" addHeaderInfo={addHeader}>
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
			</Sheet>
		</SheetWrapper>
	);
};
