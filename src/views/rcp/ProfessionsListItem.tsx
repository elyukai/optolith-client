import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { Book, Profession } from '../../types/view.d';

export interface ProfessionsListItemProps {
	books: Map<string, Book>;
	currentProfessionId?: string;
	currentProfessionVariantId?: string;
	profession: Profession;
	sex: 'm' | 'f';
	selectProfession(id: string): void;
	selectProfessionVariant(id: string): void;
	showAddSlidein(): void;
}

export function ProfessionsListItem(props: ProfessionsListItemProps) {
	const { books, showAddSlidein, currentProfessionId, profession, selectProfession, sex } = props;

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
			{profession.src.length > 0 && (
				<ListItemGroup small>
					{
						profession.src
							.filter(e => books.has(e.id))
							.map(e => {
								return <span key={e.id}>{books.get(e.id)!.short}</span>;
							})
					}
				</ListItemGroup>
			)}
			<ListItemValues>
				<div className="cost">{profession.ap}</div>
			</ListItemValues>
			<ListItemButtons>
				<IconButton
					icon="&#xE90a;"
					onClick={() => selectProfession(profession.id)}
					disabled={profession.id === currentProfessionId}
					/>
				<IconButton
					icon="&#xE90e;"
					onClick={showAddSlidein}
					disabled={profession.id !== currentProfessionId}
					/>
			</ListItemButtons>
		</ListItem>
	);
}
