import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions";
import { EntryRating } from "../../Models/Hero/heroTypeHelpers";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { InactiveActivatable } from "../../Models/View/InactiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { ActivatableAddList } from "../Activatable/ActivatableAddList";

export interface InactiveListProps {
  inactiveList: Maybe<List<
    Record<ActiveActivatable>
    | Record<InactiveActivatable>
  >>
  l10n: L10nRecord
  rating: Maybe<OrderedMap<string, EntryRating>>
  showRating: boolean
  addToList (args: Record<ActivatableActivationOptions>): void
  selectForInfo (id: string): void
}

export function InactiveList (props: InactiveListProps) {
  return (
    <ActivatableAddList {...props} hideGroup />
  )
}
