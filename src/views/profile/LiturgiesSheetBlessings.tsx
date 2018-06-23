import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { BlessingInstance, UIMessages } from '../../types/data.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { translate } from '../../utils/I18n';

export interface LiturgiesSheetBlessingsProps {
	blessings: BlessingInstance[];
	locale: UIMessages;
}


export function LiturgiesSheetBlessings(props: LiturgiesSheetBlessingsProps) {
	const { blessings, locale } = props;
	return (
		<TextBox label={translate(locale, 'charactersheet.chants.blessings.title')} className="blessings activatable-list">
			<div className="list">
				{
					sortStrings(blessings.map(e => e.name), locale.id).intercalate(', ')
				}
			</div>
		</TextBox>
	);
}
