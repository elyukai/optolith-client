import BelongingsSheet from './BelongingsSheet';
import ChantSheet from './ChantSheet';
import CombatSheet from './CombatSheet';
import MainSheet from './MainSheet';
import * as React from 'react';
import Scroll from '../../components/Scroll';
import SpellsSheet from './SpellsSheet';
import SkillsSheet from './SkillsSheet';

export default () => (
	<div className="page" id="sheets">
		<Scroll className="sheet-wrapper">
			<MainSheet />
			<SkillsSheet />
			<CombatSheet />
			<BelongingsSheet />
			<SpellsSheet />
			<ChantSheet />
		</Scroll>
	</div>
);
