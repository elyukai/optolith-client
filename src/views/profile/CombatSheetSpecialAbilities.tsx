import * as React from 'react';
import { ActivatableTextList } from '../../components/ActivatableTextList';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data.d';
import { _translate } from '../../utils/I18n';

export interface CombatSheetSpecialAbilitiesProps {
	combatSpecialAbilities: ActiveViewObject[];
	locale: UIMessages;
}

export function CombatSheetSpecialAbilities(props: CombatSheetSpecialAbilitiesProps) {
	const { combatSpecialAbilities, locale } = props;
	return (
		<TextBox label={_translate(locale, 'charactersheet.combat.combatspecialabilities.title')} className="activatable-list">
			<ActivatableTextList list={combatSpecialAbilities} locale={locale} />
		</TextBox>
	);
}
