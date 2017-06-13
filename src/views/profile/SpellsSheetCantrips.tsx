import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { SpellsStore } from '../../stores/SpellsStore';
import { translate } from '../../utils/I18n';
import { sort } from '../../utils/ListUtils';

export function SpellsSheetCantrips() {
	return (
		<TextBox label={translate('charactersheet.spells.cantrips.title')} className="cantrips activatable-list">
			<div className="list">
				{
					sort(SpellsStore.getAllCantrips().filter(e => e.active)).map(e => e.name).join(', ')
				}
			</div>
		</TextBox>
	);
}
