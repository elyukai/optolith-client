import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { VerticalList } from '../../components/VerticalList';
import { Race, UIMessages } from '../../types/view.d';
import { _translate } from '../../utils/I18n';

export interface RacesListItemProps {
	areValuesVisible: boolean;
	currentId?: string;
	locale: UIMessages;
	race: Race;
	selectRace(id: string): void;
	switchToCultures(): void;
}

export function RacesListItem(props: RacesListItemProps) {
	const { areValuesVisible, currentId, locale, race, selectRace, switchToCultures } = props;

	return (
		<ListItem active={race.id === currentId}>
			<ListItemName name={`${race.name} (${race.ap} AP)`} large>
				{
					areValuesVisible && (
						<VerticalList className="details">
							<span>{_translate(locale, 'secondaryattributes.lp.short')} {race.lp}</span>
							<span>{_translate(locale, 'secondaryattributes.spi.short')} {race.spi}</span>
							<span>{_translate(locale, 'secondaryattributes.tou.short')} {race.tou}</span>
							<span>{_translate(locale, 'secondaryattributes.mov.short')} {race.mov}</span>
						</VerticalList>
					)
				}
			</ListItemName>
			<ListItemSeparator />
			<ListItemButtons>
				{
					race.id === currentId ? (
						<BorderButton
							label={_translate(locale, 'rcp.actions.next')}
							onClick={switchToCultures}
							primary
							/>
					) : (
						<BorderButton
							label={_translate(locale, 'rcp.actions.select')}
							onClick={() => selectRace(race.id)}
							/>
					)
				}
			</ListItemButtons>
		</ListItem>
	);
}
