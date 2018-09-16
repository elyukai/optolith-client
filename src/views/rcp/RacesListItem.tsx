import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { Race, UIMessages } from '../../types/view';

export interface RacesListItemProps {
  currentId?: string;
  locale: UIMessages;
  race: Race;
  selectRace(id: string, variantId?: string): void;
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
          icon="&#xE90a;"
          onClick={() => selectRace(race.id, race.variants.length > 0 ? race.variants[0].id : undefined)}
          disabled={race.id === currentId}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={switchToCultures}
          disabled={race.id !== currentId}
          />
      </ListItemButtons>
    </ListItem>
  );
}
