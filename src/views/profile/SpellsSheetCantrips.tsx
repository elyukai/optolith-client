import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { SpellsStore } from '../../stores/SpellsStore';

export function SpellsSheetCantrips() {
	return (
		<TextBox label="Zaubertricks" className="cantrips activatable-list">
			<div className="list">
				{
					SpellsStore.getAllCantrips().filter(e => e.active).map(e => e.name).join(', ')
				}
			</div>
		</TextBox>
	);
}
