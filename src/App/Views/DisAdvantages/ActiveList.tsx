import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions";
import { EntryRating } from "../../Models/Hero/heroTypeHelpers";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { ActivatableRemoveList } from "../Activatable/ActivatableRemoveList";

export interface ActiveListProps {
  filterText: string
  list: Maybe<List<Record<ActiveActivatable>>>
  l10n: L10nRecord
  rating: Maybe<OrderedMap<string, EntryRating>>
  showRating: boolean
  isRemovingEnabled: boolean
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  setLevel (id: string, index: number, level: number): void
  selectForInfo (id: string): void
}

export function ActiveList (props: ActiveListProps) {
  return (
    <ActivatableRemoveList {...props} hideGroup />
  )
}
