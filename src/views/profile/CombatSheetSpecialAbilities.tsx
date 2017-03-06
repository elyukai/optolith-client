import * as React from 'react';
import TextBox from '../../components/TextBox';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import ActivatableTextList from './ActivatableTextList';

export default () => (
	<TextBox label="Kampfsonderfertigkeiten" className="activatable-list">
		<ActivatableTextList list={ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES).filter(e => e.gr === 3)} />
	</TextBox>
);
