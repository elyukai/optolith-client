import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data.d';
import { _translate } from '../../utils/I18n';
import { ActivatableTextList } from './ActivatableTextList';

export interface LiturgiesSheetSpecialAbilitiesProps {
	blessedSpecialAbilities: ActiveViewObject[];
	locale: UIMessages;
}

export function LiturgiesSheetSpecialAbilities(props: LiturgiesSheetSpecialAbilitiesProps) {
	const { blessedSpecialAbilities, locale } = props;
	return (
		<TextBox label={_translate(locale, 'charactersheet.chants.blessedspecialabilities.title')} className="activatable-list">
			<ActivatableTextList list={blessedSpecialAbilities} locale={locale} />
		</TextBox>
	);
}
