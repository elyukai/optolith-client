import * as React from "react";
import { List, map, toArray } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { HerolistItemContainer } from "../../Containers/HerolistItemContainer";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Book } from "../../Models/Wiki/Book";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { pipe_ } from "../../Utilities/pipe";
import { BorderButton } from "../Universal/BorderButton";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { ListView } from "../Universal/List";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { SortNames, SortOptions } from "../Universal/SortOptions";
import { TextField } from "../Universal/TextField";
import { HeroCreation } from "./HeroCreation";

export interface HerolistOwnProps {
  l10n: L10nRecord
}

export interface HerolistStateProps {
  experienceLevels: OrderedMap<string, Record<ExperienceLevel>>
  filterText: string
  list: List<HeroModelRecord>
  visibilityFilter: string
  sortOrder: SortNames
  isCharacterCreatorOpen: boolean
  sortedBooks: List<Record<Book>>
}

export interface HerolistDispatchProps {
  createHero (
    name: string,
    sex: "m" | "f",
    el: string,
    enableAllRuleBooks: boolean,
    enabledRuleBooks: OrderedSet<string>
  ): void
  importHero (): void
  setFilterText (newValue: string): void
  setSortOrder (id: SortNames): void
  setVisibilityFilter (id: Maybe<string>): void
  openCharacterCreator (): void
  closeCharacterCreator (): void
}

export type HerolistProps = HerolistStateProps & HerolistDispatchProps & HerolistOwnProps

export interface HerolistState {
  showHeroCreation: boolean
}

export const Herolist: React.FC<HerolistProps> = props => {
  const {
    importHero,
    list: rawList,
    l10n,
    setFilterText,
    setSortOrder,
    setVisibilityFilter,
    sortOrder,
    visibilityFilter,
    isCharacterCreatorOpen,
    openCharacterCreator,
    closeCharacterCreator,
    filterText,
    createHero,
    experienceLevels,
    sortedBooks,
  } = props

  const xs = pipe_ (
    rawList,
    map (hero => (
      <HerolistItemContainer
        key={HeroModel.A.id (hero)}
        hero={hero}
        l10n={l10n}
        />
    )),
    toArray
  )

  return (
    <Page id="herolist">
      <Options>
        <TextField
          hint={translate (l10n) ("search")}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <Dropdown
          value={Just (visibilityFilter)}
          onChange={setVisibilityFilter}
          options={List (
            DropdownOption ({
              id: Just ("all"),
              name: translate (l10n) ("allheroes"),
            }),
            DropdownOption ({
              id: Just ("own"),
              name: translate (l10n) ("ownheroes"),
            }),
            DropdownOption ({
              id: Just ("shared"),
              name: translate (l10n) ("sharedheroes"),
            })
          )}
          fullWidth
          disabled
          />
        <SortOptions
          l10n={l10n}
          options={List<SortNames> ("name", "dateModified")}
          sort={setSortOrder}
          sortOrder={sortOrder}
          />
        <BorderButton
          label={translate (l10n) ("create")}
          onClick={openCharacterCreator}
          primary
          />
        <BorderButton
          label={translate (l10n) ("import")}
          onClick={importHero}
          />
      </Options>
      <Scroll>
        <ListView>
          {xs}
        </ListView>
      </Scroll>
      <HeroCreation
        close={closeCharacterCreator}
        isOpen={isCharacterCreatorOpen}
        createHero={createHero}
        experienceLevels={experienceLevels}
        l10n={l10n}
        sortedBooks={sortedBooks}
        />
    </Page>
  )
}
