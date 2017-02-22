import * as ActivatableStore from '../../stores/ActivatableStore';
import * as Categories from '../../constants/Categories';
import * as React from 'react';
import ActivatableTextList from './ActivatableTextList';
import TextBox from '../../components/TextBox';

export default () => (
	<TextBox label="Klerikale Sonderfertigkeiten" className="activatable-list">
		<ActivatableTextList list={ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES).filter(e => [7].includes(e.gr!))} />
	</TextBox>
);
