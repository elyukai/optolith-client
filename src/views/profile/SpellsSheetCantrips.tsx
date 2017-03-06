import * as React from 'react';
import TextBox from '../../components/TextBox';
import SpellsStore from '../../stores/SpellsStore';

export default () => (
	<TextBox label="Zaubertricks" className="cantrips activatable-list">
		<div className="list">
			{
				SpellsStore.getAll().filter(e => e.active && e.gr === 5).map(e => e.name).join(', ')
			}
		</div>
	</TextBox>
);
