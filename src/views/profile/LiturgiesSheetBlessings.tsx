import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { LiturgiesStore } from '../../stores/LiturgiesStore';
import { translate } from '../../utils/I18n';

export function LiturgiesSheetBlessings() {
	return (
		<TextBox label={translate('charactersheet.chants.blessings.title')} className="blessings activatable-list">
			<div className="list">
				{
					LiturgiesStore.getAllBlessings().filter(e => e.active).map(e => e.name).join(', ')
				}
			</div>
		</TextBox>
	);
}
