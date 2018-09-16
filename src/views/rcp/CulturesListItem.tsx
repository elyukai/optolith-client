import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Culture, UIMessages } from '../../types/view';

export interface CulturesListItemProps {
  currentId?: string;
  culture: Culture;
  locale: UIMessages;
  selectCulture(id: string): void;
  switchToProfessions(): void;
}

export function CulturesListItem(props: CulturesListItemProps) {
  const { currentId, culture, selectCulture, switchToProfessions } = props;

  return (
    <ListItem active={culture.id === currentId}>
      <ListItemName name={culture.name} />
      <ListItemSeparator />
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={() => selectCulture(culture.id)}
          disabled={culture.id === currentId}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={switchToProfessions}
          disabled={culture.id !== currentId}
          />
      </ListItemButtons>
    </ListItem>
  );
}
