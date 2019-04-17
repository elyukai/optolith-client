import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { CultureCombined, CultureCombinedA_ } from "../../Models/View/CultureCombined";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";

export interface CulturesListItemProps {
  culture: Record<CultureCombined>
  currentId: Maybe<string>
  selectCulture (id: string): void
  switchToProfessions (): void
}

const CCA_ = CultureCombinedA_

export function CulturesListItem (props: CulturesListItemProps) {
  const { currentId, culture, selectCulture, switchToProfessions } = props

  return (
    <ListItem active={Maybe.elem (CCA_.id (culture)) (currentId)}>
      <ListItemName name={CCA_.name (culture)} />
      <ListItemSeparator />
      <ListItemButtons>
        <IconButton
          icon="&#xE90a"
          onClick={selectCulture .bind (null, CCA_.id (culture))}
          disabled={Maybe.elem (CCA_.id (culture)) (currentId)}
          />
        <IconButton
          icon="&#xE90e"
          onClick={switchToProfessions}
          disabled={Maybe.notElem (CCA_.id (culture)) (currentId)}
          />
      </ListItemButtons>
    </ListItem>
  )
}
