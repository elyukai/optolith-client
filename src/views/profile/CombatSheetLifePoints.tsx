import * as React from 'react';
import { Box } from '../../components/Box';
import { LabelBox } from '../../components/LabelBox';
import { TextBox } from '../../components/TextBox';
import { translate } from '../../utils/I18n';
import { getLP } from '../../utils/secondaryAttributes';

export function CombatSheetLifePoints() {
	const lp = getLP().value as number;

	return (
		<TextBox label={translate('charactersheet.combat.lifepoints.title')} className="life-points">
			<div className="life-points-first">
				<LabelBox label={translate('charactersheet.combat.lifepoints.labels.max')} value={lp} />
				<LabelBox label={translate('charactersheet.combat.lifepoints.labels.current')} value="" />
			</div>
			<div className="life-points-second">
				<Box />
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.75)}</Box>
				{translate('charactersheet.combat.lifepoints.labels.pain1')}
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.5)}</Box>
				{translate('charactersheet.combat.lifepoints.labels.pain2')}
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.25)}</Box>
				{translate('charactersheet.combat.lifepoints.labels.pain3')}
			</div>
			<div className="tiers">
				<Box>5</Box>
				{translate('charactersheet.combat.lifepoints.labels.pain4')}
			</div>
			<div className="tiers">
				<Box>0</Box>
				{translate('charactersheet.combat.lifepoints.labels.dying')}
			</div>
		</TextBox>
	);
}
