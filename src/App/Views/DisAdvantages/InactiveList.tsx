import * as React from "react"
import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { EntryRating } from "../../Models/Hero/heroTypeHelpers"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { InactiveActivatable } from "../../Models/View/InactiveActivatable"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { ActivatableAddList } from "../Activatable/ActivatableAddList"

interface InactiveListProps {
  inactiveList: Maybe<List<
    Record<ActiveActivatable>
    | Record<InactiveActivatable>
  >>
  staticData: StaticDataRecord
  rating: Maybe<StrMap<EntryRating>>
  showRating: boolean
  selectedForInfo: Maybe<string>
  addToList (args: Record<ActivatableActivationOptions>): void
  selectForInfo (id: string): void
}

export const InactiveList: React.FC<InactiveListProps> = props => {
  const {
    inactiveList,
    staticData,
    rating,
    showRating,
    selectedForInfo,
    addToList,
    selectForInfo,
  } = props

  return (
    <ActivatableAddList
      inactiveList={inactiveList}
      staticData={staticData}
      rating={rating}
      showRating={showRating}
      selectedForInfo={selectedForInfo}
      addToList={addToList}
      selectForInfo={selectForInfo}
      hideGroup
      />
  )
}
