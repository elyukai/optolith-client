import * as React from 'react';
import { ListItem } from '../../components/ListItem';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';

export interface WikiListItemProps {
  id: string;
  name: string;
  currentInfoId?: string;
  showInfo (id: string): void;
}

export class WikiListItem extends React.Component<WikiListItemProps> {
  shouldComponentUpdate (nextProps: WikiListItemProps) {
    const nextActive = nextProps.id === nextProps.currentInfoId;
    const active = this.props.id === this.props.currentInfoId;

    return nextActive !== active;
  }

  render () {
    const { id, name, currentInfoId, showInfo } = this.props;

    return (
      <ListItem
        key={id}
        active={id === currentInfoId}
        onClick={() => showInfo (id)}
        >
        <ListItemName name={name} />
        <ListItemSeparator />
      </ListItem>
    );
  }
}
