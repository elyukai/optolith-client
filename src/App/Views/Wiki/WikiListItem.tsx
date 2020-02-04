import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { ListItem } from "../Universal/ListItem";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";

interface Props {
  id: string
  name: string
  currentInfoId: Maybe<string>
  showInfo (id: string): void
}

const WikiListItem: React.FC<Props> = ({ id, name, currentInfoId, showInfo }) => {
  const handleShow = React.useCallback (
    () => showInfo (id),
    [ id, showInfo ]
  )

  return (
    <ListItem
      key={id}
      active={Maybe.elem (id) (currentInfoId)}
      onClick={handleShow}
      >
      <ListItemName name={name} />
      <ListItemSeparator />
    </ListItem>
  )
}

const MemoWikiListItem = React.memo (
  WikiListItem,
  (prevProps, nextProps) => Maybe.elem (nextProps.id) (nextProps.currentInfoId)
                            !== Maybe.elem (prevProps.id) (prevProps.currentInfoId)
)

export { MemoWikiListItem as WikiListItem };
