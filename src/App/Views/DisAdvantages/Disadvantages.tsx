import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions";
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { EntryRating } from "../../Models/Hero/heroTypeHelpers";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { InactiveActivatable } from "../../Models/View/InactiveActivatable";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { AdvantagesDisadvantages } from "./AdvantagesDisadvantages";

export interface DisadvantagesOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
}

export interface DisadvantagesStateProps {
  activeList: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>
  ap: Maybe<Record<AdventurePointsCategories>>
  deactiveList: Maybe<List<
    Record<ActiveActivatable<Disadvantage>>
    | Record<InactiveActivatable<Disadvantage>>
  >>
  enableActiveItemHints: boolean
  stateEntries: Maybe<OrderedMap<string, Record<ActivatableDependent>>>
  wikiEntries: OrderedMap<string, Record<Disadvantage>>
  magicalMax: Maybe<number>
  rating: Maybe<OrderedMap<string, EntryRating>>
  showRating: boolean
  isRemovingEnabled: boolean
  filterText: string
  inactiveFilterText: string
}

export interface DisadvantagesDispatchProps {
  switchActiveItemHints (): void
  switchRatingVisibility (): void
  addToList (args: Record<ActivatableActivationOptions>): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  setLevel (id: string, index: number, level: number): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

export type DisadvantagesProps =
  DisadvantagesStateProps
  & DisadvantagesDispatchProps
  & DisadvantagesOwnProps

export const Disadvantages: React.FC<DisadvantagesProps> = props => {
  const {
    l10n,
    activeList,
    ap,
    deactiveList,
    enableActiveItemHints,
    magicalMax,
    rating,
    showRating,
    isRemovingEnabled,
    filterText,
    inactiveFilterText,
    switchActiveItemHints,
    switchRatingVisibility,
    addToList,
    removeFromList,
    setLevel,
    setFilterText,
    setInactiveFilterText,
  } = props

  return (
    <AdvantagesDisadvantages
      l10n={l10n}
      activeList={activeList}
      ap={ap}
      deactiveList={deactiveList}
      enableActiveItemHints={enableActiveItemHints}
      magicalMax={magicalMax}
      rating={rating}
      showRating={showRating}
      isRemovingEnabled={isRemovingEnabled}
      filterText={filterText}
      inactiveFilterText={inactiveFilterText}
      switchActiveItemHints={switchActiveItemHints}
      switchRatingVisibility={switchRatingVisibility}
      addToList={addToList}
      removeFromList={removeFromList}
      setLevel={setLevel}
      setFilterText={setFilterText}
      setInactiveFilterText={setInactiveFilterText}
      />
  )
}
