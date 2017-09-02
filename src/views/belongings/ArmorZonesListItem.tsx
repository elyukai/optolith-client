import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { TooltipToggle } from '../../components/TooltipToggle';
import { ArmorZonesInstance, ItemInstance, UIMessages } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { ArmorZonesEditor } from './ArmorZonesEditor';

export interface ArmorZonesListItemProps {
	data: ArmorZonesInstance;
	locale: UIMessages;
	items: ItemInstance[];
	templates: ItemInstance[];
	addToList(item: ItemInstance): void;
	deleteItem(id: string): void;
	set(id: string, item: ItemInstance): void;
}

export function ArmorZonesListItem(props: ArmorZonesListItemProps) {
	const { data: item, deleteItem } = props;
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
						icon="&#xE254;"
						onClick={function showItemCreation() {
							createOverlay(
								<ArmorZonesEditor {...props} item={item} />
							);
						}}
						flat
						/>
					<IconButton
						icon="&#xE872;"
						onClick={() => deleteItem(item.id)}
						flat
						/>
				</ListItemButtons>
			</ListItem>
		</TooltipToggle>
	);
}
