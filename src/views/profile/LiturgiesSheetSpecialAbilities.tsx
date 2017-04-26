import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import { ActivatableTextList } from './ActivatableTextList';

export function LiturgiesSheetSpecialAbilities() {
	const groups: (number | undefined)[] = [7];
	return (
		<TextBox label="Klerikale Sonderfertigkeiten" className="activatable-list">
			<ActivatableTextList
				list={ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES).filter(e => groups.includes(e.gr))}
				/>
		</TextBox>
	);
}
