import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { getLocale } from '../../utils/I18n';
import { getAE, getKP } from '../../utils/secondaryAttributes';
import { BelongingsSheet } from './BelongingsSheet';
import { CombatSheet } from './CombatSheet';
import { CombatSheetZones } from './CombatSheetZones';
import { LiturgiesSheet } from './LiturgiesSheet';
import { MainSheet } from './MainSheet';
import { SkillsSheet } from './SkillsSheet';
import { SpellsSheet } from './SpellsSheet';

export function Sheets() {
	return (
		<div className="page" id="sheets">
			<Scroll className="sheet-wrapper">
				<MainSheet />
				<SkillsSheet />
				<CombatSheet />
				{getLocale() === 'de-DE' && <CombatSheetZones />}
				<BelongingsSheet />
				{ typeof getAE().value === 'number' ? <SpellsSheet /> : null }
				{ typeof getKP().value === 'number' ? <LiturgiesSheet /> : null }
			</Scroll>
		</div>
	);
}
