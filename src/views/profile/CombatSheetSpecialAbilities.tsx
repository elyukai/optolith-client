import * as ActivatableStore from '../../stores/ActivatableStore';
import * as Categories from '../../constants/Categories';
import * as React from 'react';
import ActivatableTextList from './ActivatableTextList';
import TextBox from '../../components/TextBox';

export default () => (
	<TextBox label="Kampfsonderfertigkeiten" className="activatable-list">
		<ActivatableTextList list={ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES).filter(e => e.gr === 3)} />
	</TextBox>
);
