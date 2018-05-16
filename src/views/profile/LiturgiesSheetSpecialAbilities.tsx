import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { ActiveViewObject, UIMessages } from '../../types/data.d';
import { compressList } from '../../utils/ActivatableUtils';
import { translate } from '../../utils/I18n';

export interface LiturgiesSheetSpecialAbilitiesProps {
	blessedSpecialAbilities: ActiveViewObject[];
	locale: UIMessages;
}

export function LiturgiesSheetSpecialAbilities(props: LiturgiesSheetSpecialAbilitiesProps) {
	const { blessedSpecialAbilities, locale } = props;
	return (
		<TextBox
			className="activatable-list"
			label={translate(locale, 'charactersheet.chants.blessedspecialabilities.title')}
			value={compressList(blessedSpecialAbilities, locale)}
			/>
	);
}
