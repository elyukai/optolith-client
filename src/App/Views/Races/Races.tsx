import * as React from "react"
import { List, map, notNull, toArray } from "../../../Data/List"
import { ensure, Maybe, maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { HeroModelRecord } from "../../Models/Hero/Hero"
import { RaceCombined, RaceCombinedA_ } from "../../Models/View/RaceCombined"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Aside } from "../Universal/Aside"
import { ListView } from "../Universal/List"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { SearchField } from "../Universal/SearchField"
import { SortNames, SortOptions } from "../Universal/SortOptions"
import { RacesListItem } from "./RacesListItem"
import { RaceVariants } from "./RaceVariants"

export interface RacesOwnProps {
  hero: HeroModelRecord
  staticData: StaticDataRecord
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

export const Races: React.FC<RacesProps> = props => {
  const {
    currentId,
    currentVariantId,
    filterText,
    staticData,
    races,
    sortOrder,
    setFilterText,
    setSortOrder,
  } = props

  return (
    <Page id="races">
      <Options>
        <SearchField
          staticData={staticData}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          options={List (SortNames.Name, SortNames.Cost)}
          staticData={staticData}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("race.header.name")}
          </ListHeaderTag>
          <ListHeaderTag
            className="cost"
            hint={translate (staticData) ("race.header.adventurepoints.tooltip")}
            >
            {translate (staticData) ("race.header.adventurepoints")}
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
                                         staticData={staticData}
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
          staticData={staticData}
          races={races}
          />
        <WikiInfoContainer
          currentId={currentId}
          noWrapper
          />
      </Aside>
    </Page>
  )
}
