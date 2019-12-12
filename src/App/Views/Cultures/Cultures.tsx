import * as React from "react";
import { List, map, notNull, toArray } from "../../../Data/List";
import { ensure, Just, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { CultureCombined, CultureCombinedA_ } from "../../Models/View/CultureCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { CulturesSortOptions, CulturesVisibilityFilter } from "../../Utilities/Raw/JSON/Config";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { ListView } from "../Universal/List";
import { ListHeader } from "../Universal/ListHeader";
import { ListHeaderTag } from "../Universal/ListHeaderTag";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { SearchField } from "../Universal/SearchField";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { CulturesListItem } from "./CulturesListItem";

export interface CulturesOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
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

export function Cultures (props: CulturesProps) {
  const {
    cultures: mcultures,
    l10n,
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
          l10n={l10n}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <Dropdown
          value={Just (visibilityFilter)}
          onChangeJust={setVisibilityFilter}
          options={List (
            DropdownOption ({
              id: Just ("all"),
              name: translate (l10n) ("allcultures"),
            }),
            DropdownOption ({
              id: Just ("common"),
              name: translate (l10n) ("commoncultures"),
            })
          )}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          options={List (SortNames.Name, SortNames.Cost)}
          l10n={l10n}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (l10n) ("name")}
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
                (<ListPlaceholder l10n={l10n} type="cultures" noResults />)
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
      <WikiInfoContainer currentId={currentId} l10n={l10n} />
    </Page>
  )
}
