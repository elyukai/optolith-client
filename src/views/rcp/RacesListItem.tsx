import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { Race, UIMessages } from '../../types/view.d';

export interface RacesListItemProps {
	areValuesVisible: boolean;
	currentId?: string;
	locale: UIMessages;
	race: Race;
	selectRace(id: string): void;
	switchToCultures(): void;
}

export function RacesListItem(props: RacesListItemProps) {
	const { currentId, race, selectRace, switchToCultures } = props;

	return (
		<ListItem active={race.id === currentId}>
			<ListItemName name={race.name} />
			<ListItemSeparator />
			<ListItemValues>
				<div className="cost">{race.ap}</div>
			</ListItemValues>
			<ListItemButtons>
				<IconButton
					icon="&#xE876;"
					onClick={() => selectRace(race.id)}
					disabled={race.id === currentId}
					/>
				<IconButton
					icon="&#xE5DD;"
					onClick={switchToCultures}
					disabled={race.id !== currentId}
					/>
			</ListItemButtons>
		</ListItem>
	);
}
