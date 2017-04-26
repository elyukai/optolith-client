import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { LiturgiesStore } from '../../stores/LiturgiesStore';

export function LiturgiesSheetBlessings() {
	return (
		<TextBox label="Segnungen" className="blessings activatable-list">
			<div className="list">
				{
					LiturgiesStore.getAllBlessings().filter(e => e.active).map(e => e.name).join(', ')
				}
			</div>
		</TextBox>
	);
}
