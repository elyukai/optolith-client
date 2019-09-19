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
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
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
import { CulturesListItem } from "./CulturesListItem";

export interface CulturesOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
}

export interface CulturesStateProps {
  cultures: List<Record<CultureCombined>>
  currentId: Maybe<string>
  sortOrder: SortNames
  visibilityFilter: string
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
  } = props

  return (
    <Page id="cultures">
      <Options>
        <TextField
          hint={translate (l10n) ("search")}
          value={filterText}
          onChange={props.setFilterText}
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
          options={List<SortNames> ("name", "cost")}
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
                      {...props}
                      key={CultureCombinedA_.id (culture)}
                      culture={culture}
                      />
                  )),
                  toArray
                ))
            )}
          </ListView>
        </Scroll>
      </MainContent>
      <WikiInfoContainer {...props} />
    </Page>
  )
}
