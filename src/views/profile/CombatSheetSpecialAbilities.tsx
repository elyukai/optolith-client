import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data.d';
import { compressList } from '../../utils/ActivatableUtils';
import { translate } from '../../utils/I18n';

export interface CombatSheetSpecialAbilitiesProps {
	combatSpecialAbilities: ActiveViewObject[];
	locale: UIMessages;
}

export function CombatSheetSpecialAbilities(props: CombatSheetSpecialAbilitiesProps) {
	const { combatSpecialAbilities, locale } = props;
	return (
		<TextBox
			className="activatable-list"
			label={translate(locale, 'charactersheet.combat.combatspecialabilities.title')}
			value={compressList(combatSpecialAbilities, locale)}
			/>
	);
}
