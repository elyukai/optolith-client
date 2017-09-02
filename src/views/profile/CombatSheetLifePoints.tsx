import * as React from 'react';
import { Box } from '../../components/Box';
import { LabelBox } from '../../components/LabelBox';
import { TextBox } from '../../components/TextBox';
import { SecondaryAttribute, UIMessages } from '../../types/data.d';
import { _translate } from '../../utils/I18n';

export interface CombatSheetLifePointsProps {
	derivedCharacteristics: SecondaryAttribute[];
	locale: UIMessages;
}

export function CombatSheetLifePoints(props: CombatSheetLifePointsProps) {
	const { derivedCharacteristics, locale } = props;

	const lpObj = derivedCharacteristics.find(e => e.id === 'LP');
	const lp = lpObj ? lpObj.value as number : 0;

	return (
		<TextBox label={_translate(locale, 'charactersheet.combat.lifepoints.title')} className="life-points">
			<div className="life-points-first">
				<LabelBox label={_translate(locale, 'charactersheet.combat.lifepoints.labels.max')} value={lp} />
				<LabelBox label={_translate(locale, 'charactersheet.combat.lifepoints.labels.current')} value="" />
			</div>
			<div className="life-points-second">
				<Box />
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.75)}</Box>
				{_translate(locale, 'charactersheet.combat.lifepoints.labels.pain1')}
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.5)}</Box>
				{_translate(locale, 'charactersheet.combat.lifepoints.labels.pain2')}
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.25)}</Box>
				{_translate(locale, 'charactersheet.combat.lifepoints.labels.pain3')}
			</div>
			<div className="tiers">
				<Box>5</Box>
				{_translate(locale, 'charactersheet.combat.lifepoints.labels.pain4')}
			</div>
			<div className="tiers">
				<Box>0</Box>
				{_translate(locale, 'charactersheet.combat.lifepoints.labels.dying')}
			</div>
		</TextBox>
	);
}
