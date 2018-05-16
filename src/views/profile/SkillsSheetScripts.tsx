import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { SpecialAbilityInstance } from '../../types/data.d';
import { getSelectionName } from '../../utils/ActivatableUtils';
import { sortStrings } from '../../utils/FilterSortUtils';
import { translate, UIMessages } from '../../utils/I18n';

export interface SkillsSheetScriptsProps {
	locale: UIMessages;
	scriptsInstance: SpecialAbilityInstance;
}

export function SkillsSheetScripts(props: SkillsSheetScriptsProps) {
	const { locale, scriptsInstance } = props;
	const scripts = sortStrings(scriptsInstance.active.map(({ sid }) => getSelectionName(scriptsInstance, sid)!), locale.id);

	return (
		<TextBox label={translate(locale, 'charactersheet.gamestats.knownscripts.title')}>
			<div className="scripts-list">
				{scripts.join(', ')}
			</div>
		</TextBox>
	);
}
