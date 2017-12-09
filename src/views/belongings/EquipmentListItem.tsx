import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ItemInstance, UIMessages } from '../../types/data.d';
import { _translate } from '../../utils/I18n';

export interface EquipmentListItemProps {
	add?: boolean;
	data: ItemInstance;
	locale: UIMessages;
	addTemplateToList(id: string): void;
	deleteItem(id: string): void;
	editItem(id: string): void;
	selectForInfo?(id: string): void;
}

export function EquipmentListItem(props: EquipmentListItemProps) {
	const { add, addTemplateToList, data, deleteItem, editItem, locale, selectForInfo } = props;
	const { id, gr, name, amount } = data;

	const numberValue = amount > 1 ? amount : undefined;

	return add ? (
		<ListItem>
			<ListItemName name={name} />
			<ListItemSeparator />
			<ListItemButtons>
				<IconButton
					icon="&#xE916;"
					onClick={() => addTemplateToList(data.id)}
					flat
					/>
				<IconButton icon="&#xE912;" flat onClick={selectForInfo && (() => selectForInfo(id))} disabled={!selectForInfo} />
			</ListItemButtons>
		</ListItem>
	) : (
		<ListItem>
			<ListItemName name={`${numberValue ? numberValue + 'x ' : ''}${name}`} />
			<ListItemSeparator />
			<ListItemGroup list={_translate(locale, 'equipment.view.groups')} index={gr} />
			<ListItemButtons>
				<IconButton
					icon="&#xE90c;"
					onClick={() => editItem(data.id)}
					flat
					/>
				<IconButton
					icon="&#xE90b;"
					onClick={() => deleteItem(data.id)}
					flat
					/>
				<IconButton icon="&#xE912;" flat onClick={selectForInfo && (() => selectForInfo(id))} disabled={!selectForInfo} />
			</ListItemButtons>
		</ListItem>
	);
}
