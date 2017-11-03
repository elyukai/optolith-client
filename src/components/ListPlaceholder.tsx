import * as React from 'react';
import { _translate, UIMessages } from '../utils/I18n';
import { IconButton } from './IconButton';
import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemButtons } from './ListItemButtons';
import { ListItemName } from './ListItemName';
import { ListItemSeparator } from './ListItemSeparator';
import { ListItemValues } from './ListItemValues';

export interface ListPlaceholderProps {
	locale: UIMessages;
}

export function ListPlaceholder(props: ListPlaceholderProps) {
	const placeholder = (
		<ListItem className="placeholder">
			<ListItemName name="" />
			<ListItemSeparator/>
			<ListItemValues>
				<div className="cost"><div className="placeholder-text"></div></div>
			</ListItemValues>
			<ListItemButtons>
				<IconButton icon="&#xE90a;" flat disabled />
				<IconButton icon="&#xE912;" flat disabled />
			</ListItemButtons>
		</ListItem>
	);

	return (
		<List>
			{placeholder}
			{placeholder}
			{placeholder}
			{placeholder}
			{placeholder}
			<div className="placeholder-message">
				{_translate(props.locale, 'emptylist')}
			</div>
		</List>
	);
}
