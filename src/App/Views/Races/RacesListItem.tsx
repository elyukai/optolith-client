import * as React from "react";
import { useDispatch } from "react-redux";
import { listToMaybe, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { setTab } from "../../Actions/LocationActions";
import { selectRace } from "../../Actions/RaceActions";
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { TabId } from "../../Utilities/LocationUtils";
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
}

export function RacesListItem (props: RacesListItemProps) {
  const { currentId, race } = props

  const race_id = RaceCombinedA_.id (race)

  const dispatch = useDispatch ()

  const handleRaceSelect =
    React.useCallback (
      () => dispatch (selectRace (race_id) (listToMaybe (RaceCombinedA_.variants (race)))),
      [dispatch]
    )

  const switchToCultures =
    React.useCallback (
      () => dispatch (setTab (TabId.Cultures)),
      [dispatch]
    )

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
          onClick={handleRaceSelect}
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
