import * as React from 'react';
import { ActivatableTextList } from '../../components/ActivatableTextList';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data.d';
import { _translate } from '../../utils/I18n';

export interface SpellsSheetSpecialAbilitiesProps {
	locale: UIMessages;
	magicalSpecialAbilities: ActiveViewObject[];
}

export function SpellsSheetSpecialAbilities(props: SpellsSheetSpecialAbilitiesProps) {
	const { locale, magicalSpecialAbilities } = props;
	return (
		<TextBox label={_translate(locale, 'charactersheet.spells.magicalspecialabilities.title')} className="activatable-list">
			<ActivatableTextList list={magicalSpecialAbilities} locale={locale} />
		</TextBox>
	);
}
