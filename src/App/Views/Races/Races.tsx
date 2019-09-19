import * as React from "react";
import { List, map, notNull, toArray } from "../../../Data/List";
import { ensure, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { Aside } from "../Universal/Aside";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";
import { RacesListItem } from "./RacesListItem";
import { RaceVariants } from "./RaceVariants";

export interface RacesOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
}

export interface RacesStateProps {
  currentId: Maybe<string>
  currentVariantId: Maybe<string>
  races: List<Record<RaceCombined>>
  sortOrder: SortNames
  filterText: string
}

export interface RacesDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  switchValueVisibilityFilter (): void
  setFilterText (filterText: string): void
}

export type RacesProps = RacesStateProps & RacesDispatchProps & RacesOwnProps

export function Races (props: RacesProps) {
  const {
    currentId,
    currentVariantId,
    filterText,
    l10n,
    races,
    sortOrder,
    setFilterText,
    setSortOrder,
  } = props

  return (
    <Page id="races">
      <Options>
        <TextField
          hint={translate (l10n) ("search")}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          options={List<SortNames> ("name", "cost")}
          l10n={l10n}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (l10n) ("name")}
          </ListHeaderTag>
          <ListHeaderTag className="cost" hint={translate (l10n) ("adventurepoints")}>
            {translate (l10n) ("adventurepoints.short")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder has-border" />
        </ListHeader>
        <Scroll>
          <ListView>
            {pipe_ (
              races,
              ensure (notNull),
              maybe<React.ReactNode> (
                                       <ListPlaceholder
                                         l10n={l10n}
                                         type="races"
                                         noResults={filterText.length > 0}
                                         />
                                     )
                                     (pipe (
                                       map (race => (
                                         <RacesListItem
                                           key={RaceCombinedA_.id (race)}
                                           race={race}
                                           currentId={currentId}
                                           l10n={l10n}
                                           />
                                       )),
                                       toArray
                                     ))
            )}
          </ListView>
        </Scroll>
      </MainContent>
      <Aside>
        <RaceVariants
          currentId={currentId}
          currentVariantId={currentVariantId}
          l10n={l10n}
          races={races}
          />
        <WikiInfoContainer
          currentId={currentId}
          l10n={l10n}
          noWrapper
          />
      </Aside>
    </Page>
  )
}
