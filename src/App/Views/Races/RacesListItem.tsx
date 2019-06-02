import * as React from "react";
import { listToMaybe, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { ListItemValues } from "../Universal/ListItemValues";

export interface RacesListItemProps {
  currentId: Maybe<string>
  l10n: L10nRecord
  race: Record<RaceCombined>
  selectRace (id: string): (variantId: Maybe<string>) => void
  switchToCultures (): void
}

export function RacesListItem (props: RacesListItemProps) {
  const { currentId, race, selectRace, switchToCultures } = props

  const race_id = RaceCombinedA_.id (race)

  return (
    <ListItem active={Maybe.elem (race_id) (currentId)}>
      <ListItemName name={RaceCombinedA_.name (race)} />
      <ListItemSeparator />
      <ListItemValues>
        <div className="cost">{RaceCombinedA_.ap (race)}</div>
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={
            () => selectRace (race_id) (listToMaybe (RaceCombinedA_.variants (race)))
          }
          disabled={Maybe.elem (race_id) (currentId)}
          />
        <IconButton
          icon="&#xE90e;"
          onClick={switchToCultures}
          disabled={Maybe.notElem (race_id) (currentId)}
          />
      </ListItemButtons>
    </ListItem>
  )
}
