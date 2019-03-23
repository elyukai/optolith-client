import * as React from 'react';
import { CultureCombined } from '../../App/Models/View/viewTypeHelpers';
import { UIMessagesObject } from '../../App/Utils/I18n';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Maybe, Record } from '../../Utilities/dataUtils';

export interface CulturesListItemProps {
  culture: Record<CultureCombined>;
  currentId: Maybe<string>;
  locale: UIMessagesObject;
  selectCulture (id: string): void;
  switchToProfessions (): void;
}

export function CulturesListItem (props: CulturesListItemProps) {
  const { currentId, culture, selectCulture, switchToProfessions } = props;

  return (
    <ListItem active={Maybe.elem (culture .get ('id')) (currentId)}>
      <ListItemName name={culture .get ('name')} />
      <ListItemSeparator />
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={() => selectCulture (culture .get ('id'))}
          disabled={Maybe.elem (culture .get ('id')) (currentId)}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={switchToProfessions}
          disabled={Maybe.notElem (culture .get ('id')) (currentId)}
          />
      </ListItemButtons>
    </ListItem>
  );
}
