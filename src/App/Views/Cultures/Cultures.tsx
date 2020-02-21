import * as React from "react"
import { List, map, notNull, toArray } from "../../../Data/List"
import { ensure, Just, Maybe, maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { CulturesSortOptions, CulturesVisibilityFilter } from "../../Models/Config"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { CultureCombined, CultureCombinedA_ } from "../../Models/View/CultureCombined"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Dropdown } from "../Universal/Dropdown"
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
import { CulturesListItem } from "./CulturesListItem"

export interface CulturesOwnProps {
  hero: HeroModelRecord
  staticData: StaticDataRecord
}

export interface CulturesStateProps {
  cultures: List<Record<CultureCombined>>
  currentId: Maybe<string>
  sortOrder: CulturesSortOptions
  visibilityFilter: CulturesVisibilityFilter
  filterText: string
}

export interface CulturesDispatchProps {
  selectCulture (id: string): void
  setSortOrder (sortOrder: SortNames): void
  setVisibilityFilter (option: string): void
  switchValueVisibilityFilter (): void
  setFilterText (filterText: string): void
  switchToProfessions (): void
}

export type CulturesProps = CulturesStateProps & CulturesDispatchProps & CulturesOwnProps

export const Cultures: React.FC<CulturesProps> = props => {
  const {
    cultures: mcultures,
    staticData,
    setSortOrder,
    setVisibilityFilter,
    sortOrder,
    visibilityFilter,
    filterText,
    setFilterText,
    currentId,
    selectCulture,
    switchToProfessions,
  } = props

  return (
    <Page id="cultures">
      <Options>
        <SearchField
          staticData={staticData}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <Dropdown
          value={Just (visibilityFilter)}
          onChangeJust={setVisibilityFilter}
          options={List (
            DropdownOption ({
              id: Just (CulturesVisibilityFilter.All),
              name: translate (staticData) ("culture.filters.common.allcultures"),
            }),
            DropdownOption ({
              id: Just (CulturesVisibilityFilter.Common),
              name: translate (staticData) ("culture.filters.common.commoncultures"),
            })
          )}
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
            {translate (staticData) ("culture.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          <ListView>
            {pipe_ (
              mcultures,
              ensure (notNull),
              maybe<NonNullable<React.ReactNode>>
                (<ListPlaceholder staticData={staticData} type="cultures" noResults />)
                (pipe (
                  map (culture => (
                    <CulturesListItem
                      key={CultureCombinedA_.id (culture)}
                      culture={culture}
                      currentId={currentId}
                      selectCulture={selectCulture}
                      switchToProfessions={switchToProfessions}
                      />
                  )),
                  toArray
                ))
            )}
          </ListView>
        </Scroll>
      </MainContent>
      <WikiInfoContainer currentId={currentId} />
    </Page>
  )
}
