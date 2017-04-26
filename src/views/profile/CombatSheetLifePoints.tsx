import * as React from 'react';
import { Box } from '../../components/Box';
import { LabelBox } from '../../components/LabelBox';
import { TextBox } from '../../components/TextBox';
import { getLP } from '../../utils/secondaryAttributes';

export function CombatSheetLifePoints() {
	const lp = getLP().value as number;

	return (
		<TextBox label="Lebensenergie" className="life-points">
			<div className="life-points-first">
				<LabelBox label="Max" value={lp} />
				<LabelBox label="Aktuell" value="" />
			</div>
			<div className="life-points-second">
				<Box />
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.75)}</Box>
				1/4 verloren (+1 Schmerz)
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.5)}</Box>
				1/2 verloren (+1 Schmerz)
			</div>
			<div className="tiers">
				<Box>{Math.round(lp * 0.25)}</Box>
				3/4 verloren (+1 Schmerz)
			</div>
			<div className="tiers">
				<Box>5</Box>
				5 oder niedriger (+1 Schmerz)
			</div>
			<div className="tiers">
				<Box>0</Box>
				0 oder weniger (Held liegt im Sterben)
			</div>
		</TextBox>
	);
}
