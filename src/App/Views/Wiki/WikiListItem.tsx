import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { ListItem } from "../Universal/ListItem";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";

export interface WikiListItemProps {
  id: string
  name: string
  currentInfoId: Maybe<string>
  showInfo (id: string): void
}

export class WikiListItem extends React.Component<WikiListItemProps> {
  shouldComponentUpdate (nextProps: WikiListItemProps) {
    const nextActive = Maybe.elem (nextProps.id) (nextProps.currentInfoId)
    const active = Maybe.elem (this.props.id) (this.props.currentInfoId)

    return nextActive !== active
  }

  render () {
    const { id, name, currentInfoId, showInfo } = this.props

    return (
      <ListItem
        key={id}
        active={Maybe.elem (id) (currentInfoId)}
        onClick={() => showInfo (id)}
        >
        <ListItemName name={name} />
        <ListItemSeparator />
      </ListItem>
    )
  }
}
