import { FC, useCallback, useMemo, useState } from "react"
import { Button } from "../../../shared/components/button/Button.tsx"
import { Grid } from "../../../shared/components/grid/Grid.tsx"
import { List } from "../../../shared/components/list/List.tsx"
import { Main } from "../../../shared/components/main/Main.tsx"
import { Options } from "../../../shared/components/options/Options.tsx"
import { Page } from "../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../shared/components/textField/TextField.tsx"
import { CharactersSortOrder } from "../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../shared/hooks/translate.ts"
import { compareAt, reduceCompare } from "../../../shared/utils/compare.ts"
import { assertExhaustive } from "../../../shared/utils/typeSafety.ts"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts"
import { selectCharacters } from "../../slices/charactersSlice.ts"
import { changeCharactersSortOrder, selectCharactersSortOrder } from "../../slices/settingsSlice.ts"
import "./Characters.scss"
import { CharactersItem } from "./CharactersItem.tsx"

/**
 * Returns a page for managing characters.
 */
export const Characters: FC = () => {
  const translate = useTranslate()
  const localeCompare = useLocaleCompare()
  const dispatch = useAppDispatch()

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectCharactersSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: CharactersSortOrder) => dispatch(changeCharactersSortOrder(id)),
    [dispatch],
  )

  const charactersMap = useAppSelector(selectCharacters)
  const characters = useMemo(
    () =>
      Object.values(charactersMap)
        .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
        .sort(
          (() => {
            switch (sortOrder) {
              case CharactersSortOrder.Name:
                return compareAt(c => c.name, localeCompare)
              case CharactersSortOrder.DateModified:
                return reduceCompare(
                  compareAt(c => c.dateLastModified, localeCompare),
                  compareAt(c => c.name, localeCompare),
                )
              case CharactersSortOrder.DateCreated:
                return reduceCompare(
                  compareAt(c => c.dateCreated, localeCompare),
                  compareAt(c => c.name, localeCompare),
                )
              default:
                return assertExhaustive(sortOrder)
            }
          })(),
        ),
    [charactersMap, filterText, localeCompare, sortOrder],
  )

  return (
    <Page id="characters">
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
        {/* <Dropdown
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
          /> */}
        <RadioButtonGroup
          active={sortOrder}
          label={translate("Sort By")}
          array={[
            {
              name: translate("Name"),
              value: CharactersSortOrder.Name,
            },
            {
              name: translate("Date Modified"),
              value: CharactersSortOrder.DateModified,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
        <Grid size="small">
          <Button
            /* TODO: onClick={openCharacterCreator} */
            primary
          >
            {translate("New Character")}
          </Button>
          <Button /* TODO: onClick={importHero} */>{translate("Import")}</Button>
        </Grid>
      </Options>
      <Main>
        <Scroll stable>
          <List>
            {characters.map(character => (
              <CharactersItem key={character.id} character={character} />
            ))}
          </List>
        </Scroll>
      </Main>
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
