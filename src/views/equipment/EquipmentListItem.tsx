import * as R from 'ramda';
import * as React from 'react';
import { ItemInstance } from '../../App/Models/Hero/heroTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { Maybe, Record } from '../../utils/dataUtils';

export interface EquipmentListItemProps {
  add?: boolean;
  data: Record<ItemInstance>;
  locale: UIMessagesObject;
  addTemplateToList (id: string): void;
  deleteItem (id: string): void;
  editItem (id: string): void;
  selectForInfo? (id: string): void;
}

export function EquipmentListItem (props: EquipmentListItemProps) {
  const { add, addTemplateToList, data, deleteItem, editItem, locale, selectForInfo } = props;

  const numberValue = Maybe.ensure<number> (R.lt (1)) (data .get ('amount'));

  return add ? (
    <ListItem>
      <ListItemName name={data .get ('name')} />
      <ListItemSeparator />
      <ListItemButtons>
        <IconButton
          icon="&#xE916;"
          onClick={() => addTemplateToList (data .get ('id'))}
          flat
          />
        <IconButton
          icon="&#xE912;"
          onClick={selectForInfo && (() => selectForInfo (data .get ('id')))}
          disabled={!selectForInfo}
          flat
          />
      </ListItemButtons>
    </ListItem>
  ) : (
    <ListItem>
      <ListItemName
        name={
          `${Maybe.maybe<number, string> ('') (value => `${value}x `) (numberValue)}${data .get ('name')}`
        }
        />
      <ListItemSeparator />
      <ListItemGroup list={translate (locale, 'equipment.view.groups')} index={data .get ('gr')} />
      <ListItemButtons>
        <IconButton
          icon="&#xE90c;"
          onClick={() => editItem (data .get ('id'))}
          flat
          />
        <IconButton
          icon="&#xE90b;"
          onClick={() => deleteItem (data .get ('id'))}
          flat
          />
        <IconButton
          icon="&#xE912;"
          onClick={selectForInfo && (() => selectForInfo (data .get ('id')))}
          disabled={!selectForInfo}
          flat
          />
      </ListItemButtons>
    </ListItem>
  );
}
