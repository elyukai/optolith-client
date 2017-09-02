import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { _translate, UIMessages } from '../../utils/I18n';

export interface SkillsSheetQualityLevelsProps {
	locale: UIMessages;
}

export function SkillsSheetQualityLevels({ locale }: SkillsSheetQualityLevelsProps) {
	return (
		<TextBox className="quality-levels" label={_translate(locale, 'charactersheet.gamestats.qualitylevels.title')}>
			<table>
				<thead>
					<tr>
						<th><div>{_translate(locale, 'charactersheet.gamestats.qualitylevels.headers.skillpoints')}</div></th>
						<th><div>{_translate(locale, 'charactersheet.gamestats.qualitylevels.headers.qualitylevel')}</div></th>
					</tr>
				</thead>
				<tbody>
					<tr><td>0-3</td><td>1</td></tr>
					<tr><td>4-6</td><td>2</td></tr>
					<tr><td>7-9</td><td>3</td></tr>
					<tr><td>10-12</td><td>4</td></tr>
					<tr><td>13-15</td><td>5</td></tr>
					<tr><td>16+</td><td>6</td></tr>
				</tbody>
			</table>
		</TextBox>
	);
}
