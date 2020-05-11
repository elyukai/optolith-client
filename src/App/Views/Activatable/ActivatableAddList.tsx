import * as React from "react"
import { flip, thrush } from "../../../Data/Function"
import { fmapF } from "../../../Data/Functor"
import { fnull, List, map, toArray } from "../../../Data/List"
import { all, fromJust, Maybe, normalize, or } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { ActivatableAddListItemContainer } from "../../Containers/InactiveActivatableContainer"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { EntryRating } from "../../Models/Hero/heroTypeHelpers"
import { ActivatableNameCost } from "../../Models/View/ActivatableNameCost"
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable"
import { InactiveActivatable } from "../../Models/View/InactiveActivatable"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { getFullName } from "../../Utilities/Activatable/activatableNameUtils"
import { pipe_ } from "../../Utilities/pipe"
import { isInactiveRated } from "../../Utilities/ratingUtils"
import { ListView } from "../Universal/List"
import { ListItem } from "../Universal/ListItem"
import { ListItemName } from "../Universal/ListItemName"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { Scroll } from "../Universal/Scroll"

export interface ActivatableAddListProps {
  hideGroup?: boolean
  inactiveList: Maybe<List<Record<ActiveActivatable> | Record<InactiveActivatable>>>
  staticData: StaticDataRecord
  rating?: Maybe<StrMap<EntryRating>>
  showRating?: boolean
  selectedForInfo: Maybe<string>
  addToList (args: Record<ActivatableActivationOptions>): void
  selectForInfo (id: string): void
}

const AAA = ActiveActivatable.A
const AAA_ = ActiveActivatableA_
const IAA = InactiveActivatable.A
const ANCA = ActivatableNameCost.A
const AOWIA = ActiveObjectWithId.A

export function ActivatableAddList (props: ActivatableAddListProps) {
  const {
    hideGroup,
    inactiveList: minactives,
    staticData,
    rating,
    showRating: mshow_rating,
    selectedForInfo,
    addToList,
    selectForInfo,
  } = props

  if (all (fnull) (minactives)) {
    return <ListPlaceholder staticData={staticData} noResults type="inactiveSpecialAbilities" />
  }

  const normalizedRating = normalize (rating)

  const isRatedWithRating = fmapF (Maybe (mshow_rating)) (flip (isInactiveRated) (normalizedRating))

  return (
    <Scroll>
      <ListView>
        {pipe_ (
          minactives,
          fromJust,
          map (item => {
            if (ActiveActivatable.is (item)) {
              const name = getFullName (item)
              const id = AAA_.id (item)
              const index = pipe_ (item, AAA.nameAndCost, ANCA.active, AOWIA.index)

              return (
                <ListItem key={`${id}_${index}`} disabled>
                  <ListItemName name={name} />
                </ListItem>
              )
            }

            const isRatedForItem = fmapF (isRatedWithRating) (thrush (item))

            return (
              <ActivatableAddListItemContainer
                key={IAA.id (item)}
                hideGroup={hideGroup}
                item={item}
                isImportant={or (fmapF (isRatedForItem) (thrush (EntryRating.Essential)))}
                isTypical={or (fmapF (isRatedForItem) (thrush (EntryRating.Common)))}
                isUntypical={or (fmapF (isRatedForItem) (thrush (EntryRating.Uncommon)))}
                selectedForInfo={selectedForInfo}
                addToList={addToList}
                selectForInfo={selectForInfo}
                />
            )
          }),
          toArray
        )}
      </ListView>
    </Scroll>
  )
}
