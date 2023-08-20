import * as React from "react"
import { flip, thrush } from "../../../Data/Function"
import { fmapF } from "../../../Data/Functor"
import { fnull, List, map, toArray } from "../../../Data/List"
import { all, fromJust, Maybe, normalize, or } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions"
import { EntryRating } from "../../Models/Hero/heroTypeHelpers"
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { pipe_ } from "../../Utilities/pipe"
import { isActiveRated } from "../../Utilities/ratingUtils"
import { WikiInfoSelector } from "../InlineWiki/WikiInfo"
import { ListView } from "../Universal/List"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { Scroll } from "../Universal/Scroll"
import { ActivatableRemoveListItem } from "./ActivatableRemoveListItem"

export interface ActivatableRemoveListProps {
  filterText: string
  hideGroup?: boolean
  list: Maybe<List<Record<ActiveActivatable>>>
  staticData: StaticDataRecord
  isRemovingEnabled: boolean
  rating?: Maybe<OrderedMap<string, EntryRating>>
  showRating?: boolean
  selectedForInfo: Maybe<WikiInfoSelector>
  setLevel (id: string, index: number, level: number): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  selectForInfo (selector: WikiInfoSelector): void
}

const AAA_ = ActiveActivatableA_

export function ActivatableRemoveList (props: ActivatableRemoveListProps) {
  const {
    filterText,
    list: mactives,
    staticData,
    rating,
    showRating: mshow_rating,
    isRemovingEnabled,
    selectedForInfo,
    setLevel,
    removeFromList,
    selectForInfo,
    hideGroup,
  } = props

  if (all (fnull) (mactives)) {
    return (
      <ListPlaceholder
        staticData={staticData}
        noResults={filterText.length > 0}
        type="specialAbilities"
        />
    )
  }

  const normalizedRating = normalize (rating)

  const isRatedWithRating = fmapF (Maybe (mshow_rating)) (flip (isActiveRated) (normalizedRating))

  return (
    <Scroll>
      <ListView>
        {pipe_ (
          mactives,
          fromJust,
          map (item => {
            const isRatedForItem = fmapF (isRatedWithRating) (thrush (item))

            return (
              <ActivatableRemoveListItem
                key={`${AAA_.id (item)}_${AAA_.index (item)}`}
                staticData={staticData}
                item={item}
                isImportant={or (fmapF (isRatedForItem) (thrush (EntryRating.Essential)))}
                isTypical={or (fmapF (isRatedForItem) (thrush (EntryRating.Common)))}
                isUntypical={or (fmapF (isRatedForItem) (thrush (EntryRating.Uncommon)))}
                isRemovingEnabled={isRemovingEnabled}
                selectedForInfo={selectedForInfo}
                setLevel={setLevel}
                removeFromList={removeFromList}
                selectForInfo={selectForInfo}
                hideGroup={hideGroup}
                />
            )
          }),
          toArray
        )}
      </ListView>
    </Scroll>
  )
}
