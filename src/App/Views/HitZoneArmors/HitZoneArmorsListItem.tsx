import * as React from 'react';
import { ArmorZonesInstance, ItemInstance, UIMessagesObject } from '../../App/Models/Hero/heroTypeHelpers';
import { ItemTemplate } from '../../App/Models/Wiki/wikiTypeHelpers';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { TooltipToggle } from '../../components/TooltipToggle';
import { List, Maybe, Record } from '../../Utilities/dataUtils';

export interface HitZoneArmorsListItemProps {
  data: Record<ArmorZonesInstance>;
  locale: UIMessagesObject;
  items: Maybe<List<Record<ItemInstance>>>;
  templates: List<Record<ItemTemplate>>;
  editItem (id: string): void;
  deleteItem (id: string): void;
}

export function HitZoneArmorsListItem (props: HitZoneArmorsListItemProps) {
  const { data: item, editItem, deleteItem } = props;

  return (
    <TooltipToggle content={
      <div className="inventory-item">
        <h4><span>{item .get ('name')}</span></h4>
      </div>
    } margin={11}>
      <ListItem>
        <ListItemName name={item .get ('name')} />
        <ListItemSeparator />
        <ListItemButtons>
          <IconButton
            icon="&#xE90c;"
            onClick={() => editItem (item .get ('id'))}
            flat
            />
          <IconButton
            icon="&#xE90b;"
            onClick={() => deleteItem (item .get ('id'))}
            flat
            />
        </ListItemButtons>
      </ListItem>
    </TooltipToggle>
  );
}
