import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { Profession } from '../../types/view.d';

export interface ProfessionsListItemProps {
	currentProfessionId?: string;
	currentProfessionVariantId?: string;
	profession: Profession;
	sex: 'm' | 'f';
	selectProfession(id: string): void;
	selectProfessionVariant(id: string): void;
	showAddSlidein(): void;
}

export function ProfessionsListItem(props: ProfessionsListItemProps) {
	const { showAddSlidein, currentProfessionId, profession, selectProfession, sex } = props;

	let { name, subname } = profession;

	if (typeof name === 'object') {
		name = name[sex];
	}
	if (typeof subname === 'object') {
		subname = subname[sex];
	}

	return (
		<ListItem active={profession.id === currentProfessionId}>
			<ListItemName name={subname ? `${name} (${subname})` : name} />
			<ListItemSeparator />
			<ListItemValues>
				<div className="cost">{profession.ap}</div>
			</ListItemValues>
			<ListItemButtons>
				<IconButton
					icon="&#xE876;"
					onClick={() => selectProfession(profession.id)}
					disabled={profession.id === currentProfessionId}
					/>
				<IconButton
					icon="&#xE5DD;"
					onClick={showAddSlidein}
					disabled={profession.id !== currentProfessionId}
					/>
			</ListItemButtons>
		</ListItem>
	);
}
