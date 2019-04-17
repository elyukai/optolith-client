import * as React from "react";
import { RaceCombined } from "../../Models/View/viewTypeHelpers";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { ListItemValues } from "../Universal/ListItemValues";

export interface RacesListItemProps {
  currentId: Maybe<string>
  locale: UIMessagesObject
  race: Record<RaceCombined>
  selectRace (id: string): (variantId: Maybe<string>) => void
  switchToCultures (): void
}

export function RacesListItem (props: RacesListItemProps) {
  const { currentId, race, selectRace, switchToCultures } = props

  return (
    <ListItem active={Maybe.elem (race .get ("id")) (currentId)}>
      <ListItemName name={race .get ("name")} />
      <ListItemSeparator />
      <ListItemValues>
        <div className="cost">{race .get ("ap")}</div>
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={
            () => selectRace (race .get ("id")) (Maybe.listToMaybe (race .get ("variants")))
          }
          disabled={Maybe.elem (race .get ("id")) (currentId)}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={switchToCultures}
          disabled={Maybe.notElem (race .get ("id")) (currentId)}
          />
      </ListItemButtons>
    </ListItem>
  )
}
