import * as React from "react";
import { ListItem } from "../Universal/ListItem";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";

export interface WikiListItemProps {
  id: string
  name: string
  currentInfoId?: string
  showInfo (id: string): void
}

export class WikiListItem extends React.Component<WikiListItemProps> {
  shouldComponentUpdate (nextProps: WikiListItemProps) {
    const nextActive = nextProps.id === nextProps.currentInfoId
    const active = this.props.id === this.props.currentInfoId

    return nextActive !== active
  }

  render () {
    const { id, name, currentInfoId, showInfo } = this.props

    return (
      <ListItem
        key={id}
        active={id === currentInfoId}
        onClick={() => showInfo (id)}
        >
        <ListItemName name={name} />
        <ListItemSeparator />
      </ListItem>
    )
  }
}
