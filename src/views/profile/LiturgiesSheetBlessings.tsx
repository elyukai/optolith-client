import * as React from 'react';
import LiturgiesStore from '../../stores/LiturgiesStore';
import TextBox from '../../components/TextBox';

export default () => (
	<TextBox label="Segnungen" className="blessings activatable-list">
		<div className="list">
			{
				LiturgiesStore.getAll().filter(e => e.active && e.gr === 3).map(e => e.name).join(', ')
			}
		</div>
	</TextBox>
);
