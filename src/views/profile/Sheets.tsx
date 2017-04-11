import * as React from 'react';
import BorderButton from '../../components/BorderButton';
import Scroll from '../../components/Scroll';
import { printToPDF } from '../../utils/FileAPIUtils';
import { getAE, getKP } from '../../utils/secondaryAttributes';
import BelongingsSheet from './BelongingsSheet';
import CombatSheet from './CombatSheet';
import LiturgiesSheet from './LiturgiesSheet';
import MainSheet from './MainSheet';
import SkillsSheet from './SkillsSheet';
import SpellsSheet from './SpellsSheet';

export default () => (
	<div className="page" id="sheets">
		<Scroll className="sheet-wrapper">
			<BorderButton
				className="print-document"
				label="Dokument drucken"
				onClick={printToPDF}
				/>
			<MainSheet />
			<SkillsSheet />
			<CombatSheet />
			<BelongingsSheet />
			{ typeof getAE().value === 'number' ? <SpellsSheet /> : null }
			{ typeof getKP().value === 'number' ? <LiturgiesSheet /> : null }
		</Scroll>
	</div>
);
