import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { SpecialAbilityInstance } from '../../types/data.d';
import { getSelectionItem } from '../../utils/ActivatableUtils';
import { translate } from '../../utils/I18n';

export function SkillsSheetLanguages() {
	const SA_30 = get('SA_30') as SpecialAbilityInstance;
	const languages = SA_30.active.map(({ sid, tier = 0 }) => {
		const { id, name } = getSelectionItem(SA_30, sid) || { id: 0, name: 'MISSING'};
		return ({ id, name, tier });
	}).sort((a, b) => a.tier < b.tier ? 1 : a.tier > b.tier ? -1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

	return (
		<TextBox label={translate('charactersheet.gamestats.languages.title')}>
			<table className="languages-list">
				<tbody>
					{languages.map(e => <tr key={`lang-${e.id}`}>
						<td>{e.name}</td>
						<td>{e.tier === 4 ? translate('charactersheet.gamestats.languages.native') : e.tier}</td>
					</tr>)}
				</tbody>
			</table>
		</TextBox>
	);
}
