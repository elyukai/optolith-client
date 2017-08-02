import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { LiturgiesStore } from '../../stores/LiturgiesStore';
import { _translate } from '../../utils/I18n';
import { sort } from '../../utils/FilterSortUtils';

export function LiturgiesSheetBlessings() {
	return (
		<TextBox label={_translate(locale, 'charactersheet.chants.blessings.title')} className="blessings activatable-list">
			<div className="list">
				{
					sort(LiturgiesStore.getAllBlessings().filter(e => e.active)).map(e => e.name).join(', ')
				}
			</div>
		</TextBox>
	);
}
