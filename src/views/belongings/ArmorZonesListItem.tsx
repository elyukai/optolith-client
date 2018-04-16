import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { TooltipToggle } from '../../components/TooltipToggle';
import { ArmorZonesInstance, ItemInstance, UIMessages } from '../../types/data.d';

export interface ArmorZonesListItemProps {
	data: ArmorZonesInstance;
	locale: UIMessages;
	items: ItemInstance[];
	templates: ItemInstance[];
	editItem(id: string): void;
	deleteItem(id: string): void;
}

export function ArmorZonesListItem(props: ArmorZonesListItemProps) {
	const { data: item, editItem, deleteItem } = props;
	const { name } = item;

	return (
		<TooltipToggle content={
			<div className="inventory-item">
				<h4><span>{name}</span></h4>
			</div>
		} margin={11}>
			<ListItem>
				<ListItemName name={name} />
				<ListItemSeparator />
				<ListItemButtons>
					<IconButton
						icon="&#xE90c;"
						onClick={() => editItem(item.id)}
						flat
						/>
					<IconButton
						icon="&#xE90b;"
						onClick={() => deleteItem(item.id)}
						flat
						/>
				</ListItemButtons>
			</ListItem>
		</TooltipToggle>
	);
}
