import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Profession, UIMessages } from '../../types/view.d';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface ProfessionsListItemProps {
	currentProfessionId?: string;
	currentProfessionVariantId?: string;
	locale: UIMessages;
	profession: Profession;
	sex: 'm' | 'f';
	selectProfession(id: string): void;
	selectProfessionVariant(id: string): void;
	showAddSlidein(): void;
}

export function ProfessionsListItem(props: ProfessionsListItemProps) {
	const { showAddSlidein, currentProfessionId, currentProfessionVariantId, locale, profession, selectProfession, selectProfessionVariant, sex } = props;

	const variants: { name: string; value: string | undefined }[] = [
		{ name: _translate(locale, 'professions.options.novariant'), value: undefined },
		...sortObjects(profession.variants.map(e => {
			const { ap, id } = e;
			let { name } = e;
			if (typeof name === 'object') {
				name = name[sex];
			}
			return {
				name: `${name} (${profession.ap + ap} AP)`,
				value: id,
			};
		}), locale.id)
	];

	let { name, subname } = profession;

	if (typeof name === 'object') {
		name = name[sex];
	}
	if (typeof subname === 'object') {
		subname = subname[sex];
	}

	return (
		<ListItem active={profession.id === currentProfessionId}>
			<ListItemName name={`${name} (${profession.ap} AP)`} large>
				{subname && <p className="profession-subtitle">{subname}</p>}
				{variants.length > 1 &&
					<RadioButtonGroup
						active={profession.id === currentProfessionId ? currentProfessionVariantId : ''}
						onClick={selectProfessionVariant}
						array={variants}
						disabled={profession.id !== currentProfessionId}
						/>
				}
			</ListItemName>
			<ListItemSeparator />
			<ListItemButtons>
				{
					profession.id === currentProfessionId ? (
						<BorderButton
							label={_translate(locale, 'rcp.actions.next')}
							onClick={showAddSlidein}
							primary
							/>
					) : (
						<BorderButton
							label={_translate(locale, 'rcp.actions.select')}
							onClick={() => selectProfession(profession.id)}
							/>
					)
				}
			</ListItemButtons>
		</ListItem>
	);
}
