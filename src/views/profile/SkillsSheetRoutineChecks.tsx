import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { translate } from '../../utils/I18n';

export function SkillsSheetRoutineChecks() {
	return (
		<TextBox className="routine-checks" label={translate('charactersheet.gamestats.routinechecks.title')}>
			<p>{translate('charactersheet.gamestats.routinechecks.texts.first')}</p>
			<p>{translate('charactersheet.gamestats.routinechecks.texts.second')}</p>
			<p>{translate('charactersheet.gamestats.routinechecks.texts.third')}</p>
			<p>{translate('charactersheet.gamestats.routinechecks.texts.fourth')}</p>
			<table>
				<thead>
					<tr>
						<th><div>{translate('charactersheet.gamestats.routinechecks.headers.checkmod')}</div></th>
						<th><div>{translate('charactersheet.gamestats.routinechecks.headers.neededsr')}</div></th>
						<th><div>{translate('charactersheet.gamestats.routinechecks.headers.checkmod')}</div></th>
						<th><div>{translate('charactersheet.gamestats.routinechecks.headers.neededsr')}</div></th>
					</tr>
				</thead>
				<tbody>
					<tr><td>{translate('charactersheet.gamestats.routinechecks.from')} +3</td><td>1</td><td>-1</td><td>13</td></tr>
					<tr><td>+2</td><td>4</td><td>-2</td><td>16</td></tr>
					<tr><td>+1</td><td>7</td><td>-3</td><td>19</td></tr>
					<tr><td>+/-0</td><td>10</td><td></td><td></td></tr>
				</tbody>
			</table>
		</TextBox>
	);
}
