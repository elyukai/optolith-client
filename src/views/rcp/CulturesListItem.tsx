import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Culture, UIMessages } from '../../types/view.d';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface CulturesListItemProps {
	areValuesVisible: boolean;
	currentId?: string;
	culture: Culture;
	locale: UIMessages;
	selectCulture(id: string): void;
	switchToProfessions(): void;
}

export function CulturesListItem(props: CulturesListItemProps) {
	const { areValuesVisible, currentId, culture, locale, selectCulture, switchToProfessions } = props;

	return (
		<ListItem active={culture.id === currentId}>
			<ListItemName name={`${culture.name}${areValuesVisible ? ` (${culture.culturalPackageAp} AP)` : ''}`} large>
				{
					areValuesVisible && (
						<div className="details">
							{
								sortObjects(culture.culturalPackageSkills, locale.id).map(skill => {
									return `${skill.name} +${skill.value}`;
								}).join(', ')
							}
						</div>
					)
				}
			</ListItemName>
			<ListItemSeparator />
			<ListItemButtons>
				{
					culture.id === currentId ? (
						<BorderButton
							label={_translate(locale, 'rcp.actions.next')}
							onClick={switchToProfessions}
							primary
							/>
					) : (
						<BorderButton
							label={_translate(locale, 'rcp.actions.select')}
							onClick={() => selectCulture(culture.id)}
							/>
					)
				}
			</ListItemButtons>
		</ListItem>
	);
}
