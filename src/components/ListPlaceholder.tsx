import * as classNames from 'classnames';
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
	noResults?: boolean;
	wikiInitial?: boolean;
	type?: 'advantages' | 'disadvantages' | 'wiki';
}

export function ListPlaceholder(props: ListPlaceholderProps) {
	let placeholder = (
		<ListItem className="placeholder">
			<ListItemName name="" />
			<ListItemSeparator/>
			<ListItemValues>
				<div className="cost"><div className="placeholder-text"></div></div>
			</ListItemValues>
			<ListItemButtons>
				<IconButton icon="&#xE90b;" flat disabled />
				<IconButton icon="&#xE912;" flat disabled />
			</ListItemButtons>
		</ListItem>
	);

	switch (props.type) {
		case 'wiki':
			placeholder = (
				<ListItem className="placeholder">
					<ListItemName name="" />
					<ListItemSeparator/>
				</ListItem>
			);
			break;
	}

	return (
		<List>
			{placeholder}
			{placeholder}
			{placeholder}
			{placeholder}
			{placeholder}
			<div className={classNames('placeholder-message', props.wikiInitial && 'wiki-initial')}>
				{props.wikiInitial ? _translate(props.locale, 'wiki.initialmessage') : props.noResults ? _translate(props.locale, 'emptylistnoresults') : _translate(props.locale, 'emptylist')}
			</div>
		</List>
	);
}
