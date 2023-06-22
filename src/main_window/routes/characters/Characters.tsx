import { FC, useMemo } from "react"
import { List } from "../../../shared/components/list/List.tsx"
import { Page } from "../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../shared/components/scroll/Scroll.tsx"
import { compareAt } from "../../../shared/utils/sort.ts"
import { useLocaleCompare } from "../../hooks/localeCompare.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { useTranslate } from "../../hooks/translate.ts"
import { selectCharacters } from "../../slices/charactersSlice.ts"
import "./Characters.scss"
import { CharactersItem } from "./CharactersItem.tsx"

// export interface HerolistOwnProps {
//   staticData: StaticDataRecord
// }

// export interface HerolistStateProps {
//   experienceLevels: OrderedMap<string, Record<ExperienceLevel>>
//   filterText: string
//   list: List<HeroModelRecord>
//   visibilityFilter: string
//   sortOrder: SortNames
//   isCharacterCreatorOpen: boolean
//   sortedBooks: List<Record<Book>>
// }

// export interface HerolistDispatchProps {
//   createHero (
//     name: string,
//     sex: "m" | "f",
//     el: string,
//     enableAllRuleBooks: boolean,
//     enabledRuleBooks: OrderedSet<string>
//   ): void
//   importHero (): void
//   setFilterText (newValue: string): void
//   setSortOrder (id: SortNames): void
//   setVisibilityFilter (id: Maybe<string>): void
//   openCharacterCreator (): void
//   closeCharacterCreator (): void
// }

// export type HerolistProps = HerolistStateProps & HerolistDispatchProps & HerolistOwnProps

export interface HerolistState {
  showHeroCreation: boolean
}

export const Characters: FC = () => {
  const translate = useTranslate()
  const localeCompare = useLocaleCompare()

  const charactersMap = useAppSelector(selectCharacters)
  const characters = useMemo(
    () => Object.values(charactersMap)
      .sort(compareAt(c => c.name, localeCompare)),
    [ charactersMap, localeCompare ]
  )

  return (
    <Page id="characters">
      {/* <Options>
        <SearchField
          staticData={staticData}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <Dropdown
          value={visibilityFilter}
          onChange={setVisibilityFilter}
          options={[
            {
              id: HeroListVisibilityFilter.All,
              name: translate("heroes.filters.origin.allheroes"),
            },
            {
              id: HeroListVisibilityFilter.Own,
              name: translate("heroes.filters.origin.ownheroes"),
            },
            {
              id: HeroListVisibilityFilter.Shared,
              name: translate("heroes.filters.origin.sharedheroes"),
            },
          ]}
          fullWidth
          disabled
          />
        <SortOptions
          staticData={staticData}
          options={List(SortNames.Name, SortNames.DateModified)}
          sort={setSortOrder}
          sortOrder={sortOrder}
          />
        <Button onClick={openCharacterCreator} primary>
          {translate("heroes.createherobtn")}
        </Button>
        <Button onClick={importHero}>
          {translate("heroes.importherobtn")}
        </Button>
      </Options> */}
      <Scroll>
        <List>
          {characters.map(character => (
            <CharactersItem key={character.id} character={character} />
          ))}
        </List>
      </Scroll>
      {/* <HeroCreation
        close={closeCharacterCreator}
        isOpen={isCharacterCreatorOpen}
        createHero={createHero}
        experienceLevels={experienceLevels}
        staticData={staticData}
        sortedBooks={sortedBooks}
        /> */}
    </Page>
  )
}
