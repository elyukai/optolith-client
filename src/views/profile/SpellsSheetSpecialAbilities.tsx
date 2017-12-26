import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data.d';
import { compressList } from '../../utils/ActivatableUtils';
import { _translate } from '../../utils/I18n';

export interface SpellsSheetSpecialAbilitiesProps {
	locale: UIMessages;
	magicalSpecialAbilities: ActiveViewObject[];
}

export function SpellsSheetSpecialAbilities(props: SpellsSheetSpecialAbilitiesProps) {
	const { locale, magicalSpecialAbilities } = props;
	return (
		<TextBox
			className="activatable-list"
			label={_translate(locale, 'charactersheet.spells.magicalspecialabilities.title')}
			value={compressList(magicalSpecialAbilities, locale)}
			/>
	);
}
