import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import { ActivatableTextList } from './ActivatableTextList';

export function CombatSheetSpecialAbilities() {
	const groups: (number | undefined)[] = [3, 9, 10, 11, 12];
	return (
		<TextBox label="Kampfsonderfertigkeiten" className="activatable-list">
			<ActivatableTextList
				list={ActivatableStore.getActiveForView(Categories.SPECIAL_ABILITIES).filter(e => groups.includes(e.gr))}
				/>
		</TextBox>
	);
}
