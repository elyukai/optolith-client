import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { SpecialAbilityInstance } from '../../types/data.d';
import { getSelectionName } from '../../utils/ActivatableUtils';
import { translate } from '../../utils/I18n';

export function SkillsSheetScripts() {
	const SA_28 = get('SA_28') as SpecialAbilityInstance;
	const scripts = SA_28.active.map(({ sid }) => getSelectionName(SA_28, sid)).sort();

	return (
		<TextBox label={translate('charactersheet.gamestats.knownscripts.title')}>
			<div className="scripts-list">
				{scripts.join(', ')}
			</div>
		</TextBox>
	);
}
