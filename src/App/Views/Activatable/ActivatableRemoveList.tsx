import * as React from "react";
import { flip, thrush } from "../../../Data/Function";
import { fmapF } from "../../../Data/Functor";
import { fnull, List, map, toArray } from "../../../Data/List";
import { all, fromJust, Maybe, normalize, or } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions";
import { EntryRating } from "../../Models/Hero/heroTypeHelpers";
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { pipe_ } from "../../Utilities/pipe";
import { isActiveRated } from "../../Utilities/ratingUtils";
import { ListView } from "../Universal/List";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { Scroll } from "../Universal/Scroll";
import { ActivatableRemoveListItem } from "./ActivatableRemoveListItem";

export interface ActivatableRemoveListProps {
  filterText: string
  hideGroup?: boolean
  list: Maybe<List<Record<ActiveActivatable>>>
  l10n: L10nRecord
  isRemovingEnabled: boolean
  rating?: Maybe<OrderedMap<string, EntryRating>>
  showRating?: boolean
  setLevel (id: string, index: number, level: number): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  selectForInfo (id: string): void
}

const AAA_ = ActiveActivatableA_

export function ActivatableRemoveList (props: ActivatableRemoveListProps) {
  const { filterText, list: mactives, l10n, rating, showRating: mshow_rating } = props

  if (all (fnull) (mactives)) {
    return (
      <ListPlaceholder
        l10n={l10n}
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
                {...props}
                key={`${AAA_.id (item)}_${AAA_.index (item)}`}
                item={item}
                isImportant={or (fmapF (isRatedForItem) (thrush (EntryRating.Essential)))}
                isTypical={or (fmapF (isRatedForItem) (thrush (EntryRating.Common)))}
                isUntypical={or (fmapF (isRatedForItem) (thrush (EntryRating.Uncommon)))}
                />
            )
          }),
          toArray
        )}
      </ListView>
    </Scroll>
  )
}
