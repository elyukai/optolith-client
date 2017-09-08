import * as React from 'react';
import { Options } from '../../components/Options';
import { ActiveViewObject, SecondaryAttribute } from '../../types/data.d';
import { ArmorZone, Attribute, CombatTechnique, MeleeWeapon, RangedWeapon, ShieldOrParryingWeapon, UIMessages } from '../../types/view.d';
import { _translate } from '../../utils/I18n';
import { CombatSheetArmorZones } from './CombatSheetArmorZones';
import { CombatSheetLifePoints } from './CombatSheetLifePoints';
import { CombatSheetMeleeWeapons } from './CombatSheetMeleeWeapons';
import { CombatSheetRangedWeapons } from './CombatSheetRangedWeapons';
import { CombatSheetShields } from './CombatSheetShields';
import { CombatSheetSpecialAbilities } from './CombatSheetSpecialAbilities';
import { CombatSheetStates } from './CombatSheetStates';
import { CombatSheetTechniques } from './CombatSheetTechniques';
import { Sheet } from './Sheet';
import { SheetWrapper } from './SheetWrapper';

export interface CombatSheetZonesProps {
	armorZones: ArmorZone[];
	attributes: Attribute[];
	combatSpecialAbilities: ActiveViewObject[];
	combatTechniques: CombatTechnique[];
	derivedCharacteristics: SecondaryAttribute[];
	locale: UIMessages;
	meleeWeapons: MeleeWeapon[];
	rangedWeapons: RangedWeapon[];
	shieldsAndParryingWeapons: ShieldOrParryingWeapon[];
}

export function CombatSheetZones(props: CombatSheetZonesProps) {
	const { armorZones, attributes, combatSpecialAbilities, combatTechniques, derivedCharacteristics, locale, meleeWeapons, rangedWeapons, shieldsAndParryingWeapons } = props;
	const addHeader = [
		derivedCharacteristics[0],
		...derivedCharacteristics.slice(3)
	];

	return (
		<SheetWrapper>
			<Options/>
			<Sheet
				id="combat-sheet-zones"
				title={_translate(locale, 'charactersheet.combat.title')}
				addHeaderInfo={addHeader}
				attributes={attributes}
				locale={locale}
				>
				<div className="upper">
					<CombatSheetTechniques
						attributes={attributes}
						combatTechniques={combatTechniques}
						locale={locale}
						/>
					<CombatSheetLifePoints
						derivedCharacteristics={derivedCharacteristics}
						locale={locale}
						/>
				</div>
				<div className="lower">
					<CombatSheetMeleeWeapons
						locale={locale}
						meleeWeapons={meleeWeapons}
						/>
					<CombatSheetRangedWeapons
						locale={locale}
						rangedWeapons={rangedWeapons}
						/>
					<CombatSheetArmorZones
						armorZones={armorZones}
						locale={locale}
						/>
					<CombatSheetShields
						locale={locale}
						shieldsAndParryingWeapons={shieldsAndParryingWeapons}
						/>
					<CombatSheetSpecialAbilities
						locale={locale}
						combatSpecialAbilities={combatSpecialAbilities}
						/>
					<CombatSheetStates locale={locale} />
				</div>
			</Sheet>
		</SheetWrapper>
	);
}
