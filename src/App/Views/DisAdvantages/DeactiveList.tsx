import * as React from "react"
import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { EntryRating } from "../../Models/Hero/heroTypeHelpers"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { InactiveActivatable } from "../../Models/View/InactiveActivatable"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { ActivatableAddList } from "../Activatable/ActivatableAddList"

interface InactiveListProps {
  inactiveList: Maybe<List<
    Record<ActiveActivatable>
    | Record<InactiveActivatable>
  >>
  l10n: L10nRecord
  rating: Maybe<OrderedMap<string, EntryRating>>
  showRating: boolean
  selectedForInfo: Maybe<string>
  addToList (args: Record<ActivatableActivationOptions>): void
  selectForInfo (id: string): void
}

export const InactiveList: React.FC<InactiveListProps> = props => {
  const {
    inactiveList,
    l10n,
    rating,
    showRating,
    selectedForInfo,
    addToList,
    selectForInfo,
  } = props

  return (
    <ActivatableAddList
      inactiveList={inactiveList}
      l10n={l10n}
      rating={rating}
      showRating={showRating}
      selectedForInfo={selectedForInfo}
      addToList={addToList}
      selectForInfo={selectForInfo}
      hideGroup
      />
  )
}
