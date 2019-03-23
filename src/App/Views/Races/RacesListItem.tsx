import * as React from 'react';
import { RaceCombined } from '../../App/Models/View/viewTypeHelpers';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { UIMessagesObject } from '../../types/ui';
import { Maybe, Record } from '../../Utilities/dataUtils';

export interface RacesListItemProps {
  currentId: Maybe<string>;
  locale: UIMessagesObject;
  race: Record<RaceCombined>;
  selectRace (id: string): (variantId: Maybe<string>) => void;
  switchToCultures (): void;
}

export function RacesListItem (props: RacesListItemProps) {
  const { currentId, race, selectRace, switchToCultures } = props;

  return (
    <ListItem active={Maybe.elem (race .get ('id')) (currentId)}>
      <ListItemName name={race .get ('name')} />
      <ListItemSeparator />
      <ListItemValues>
        <div className="cost">{race .get ('ap')}</div>
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={
            () => selectRace (race .get ('id')) (Maybe.listToMaybe (race .get ('variants')))
          }
          disabled={Maybe.elem (race .get ('id')) (currentId)}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={switchToCultures}
          disabled={Maybe.notElem (race .get ('id')) (currentId)}
          />
      </ListItemButtons>
    </ListItem>
  );
}
