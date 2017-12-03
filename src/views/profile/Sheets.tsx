import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { AdventurePointsState } from '../../reducers/adventurePoints';
import { Purse } from '../../reducers/equipment';
import { ProfileState } from '../../reducers/profile';
import * as Data from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import * as View from '../../types/view.d';
import { BelongingsSheet } from './BelongingsSheet';
import { CombatSheet } from './CombatSheet';
import { CombatSheetZones } from './CombatSheetZones';
import { LiturgiesSheet } from './LiturgiesSheet';
import { MainSheet } from './MainSheet';
import { SkillsSheet } from './SkillsSheet';
import { SpellsSheet } from './SpellsSheet';

export interface SheetsOwnProps {
	locale: UIMessages;
}

export interface SheetsStateProps {
	advantagesActive: Data.ActiveViewObject[];
	ap: AdventurePointsState;
	armors: View.Armor[];
	armorZones: View.ArmorZone[];
	attributes: View.Attribute[];
	checkAttributeValueVisibility: boolean;
	combatSpecialAbilities: Data.ActiveViewObject[];
	combatTechniques: View.CombatTechnique[];
	culture: Data.CultureInstance | undefined;
	derivedCharacteristics: Data.SecondaryAttribute[];
	disadvantagesActive: Data.ActiveViewObject[];
	el: Data.ExperienceLevel;
	fatePointsModifier: number;
	generalsaActive: (string | Data.ActiveViewObject)[];
	meleeWeapons: View.MeleeWeapon[];
	profession: Data.ProfessionInstance | undefined;
	professionVariant: Data.ProfessionVariantInstance | undefined;
	profile: ProfileState;
	race: Data.RaceInstance | undefined;
	rangedWeapons: View.RangedWeapon[];
	shieldsAndParryingWeapons: View.ShieldOrParryingWeapon[];
	talents: Data.TalentInstance[];
	items: View.Item[];
	pet: Data.PetInstance;
	purse: Purse;
	totalPrice: number;
	totalWeight: number;
	languagesInstance: Data.SpecialAbilityInstance;
	scriptsInstance: Data.SpecialAbilityInstance;
	cantrips: Data.CantripInstance[];
	magicalPrimary: string | undefined;
	magicalSpecialAbilities: Data.ActiveViewObject[];
	magicalTradition: string;
	properties: string[];
	spells: View.Spell[];
	aspects: string[];
	blessedPrimary: string | undefined;
	blessedSpecialAbilities: Data.ActiveViewObject[];
	blessedTradition: string | undefined;
	blessings: Data.BlessingInstance[];
	liturgies: View.Liturgy[];
}

export interface SheetsDispatchProps {
	printToPDF(): void;
	switchAttributeValueVisibility(): void;
}

export type SheetsProps = SheetsStateProps & SheetsDispatchProps & SheetsOwnProps;

export function Sheets(props: SheetsProps) {
	const ae = props.derivedCharacteristics.find(e => e.id === 'AE');
	const kp = props.derivedCharacteristics.find(e => e.id === 'KP');
	return (
		<div className="page" id="sheets">
			<Scroll className="sheet-wrapper">
				<MainSheet {...props} />
				<SkillsSheet {...props} />
				<CombatSheet {...props} />
				{props.locale.id === 'de-DE' && <CombatSheetZones {...props} />}
				<BelongingsSheet {...props} />
				{ ae && typeof ae.value === 'number' && <SpellsSheet {...props} /> }
				{ kp && typeof kp.value === 'number' && <LiturgiesSheet {...props} /> }
			</Scroll>
		</div>
	);
}
