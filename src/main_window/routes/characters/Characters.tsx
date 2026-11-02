import { observer } from "mobx-react-lite"
import { type FC, useCallback, useState } from "react"
import { Button } from "../../../shared/components/button/Button.tsx"
import { Grid } from "../../../shared/components/grid/Grid.tsx"
import { Main } from "../../../shared/components/main/Main.tsx"
import { Options } from "../../../shared/components/options/Options.tsx"
import { Page } from "../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../shared/components/textField/TextField.tsx"
import { CharactersSortOrder } from "../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../shared/hooks/translate.ts"
import { CharacterStateAndActionsContext } from "../../context/CharacterStateAndActions.ts"
import { NewCharacterActions, SharedGlobalState } from "../../external.ts"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.ts"
import { changeCharactersSortOrder, selectCharactersSortOrder } from "../../slices/settingsSlice.ts"
import { CharacterList } from "./CharacterList.tsx"
import "./Characters.scss"
import { HeroCreationDialog } from "./HeroCreation.tsx"

/**
 * Returns a page for managing characters.
 */
export const Characters: FC = observer(() => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectCharactersSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: CharactersSortOrder) => dispatch(changeCharactersSortOrder(id)),
    [dispatch],
  )
  const [isCharacterCreatorOpen, setIsCharacterCreatorOpen] = useState(false)

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
          options={[
            {
              name: translate("Name"),
              value: CharactersSortOrder.Name,
            },
            {
              name: translate("Date Modified"),
              value: CharactersSortOrder.DateModified,
            },
            {
              name: translate("Date Created"),
              value: CharactersSortOrder.DateCreated,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
        <Grid size="small">
          <Button onClick={() => setIsCharacterCreatorOpen(true)} primary>
            {translate("New Character")}
          </Button>
          <Button /* TODO: onClick={importHero} */>{translate("Import")}</Button>
        </Grid>
      </Options>
      <Main>
        <Scroll stable>
          <CharacterList filterText={filterText} sortOrder={sortOrder} />
        </Scroll>
      </Main>
      <CharacterStateAndActionsContext.Provider
        value={{ state: SharedGlobalState, actions: NewCharacterActions }}
      >
        <HeroCreationDialog
          close={() => setIsCharacterCreatorOpen(false)}
          isOpen={isCharacterCreatorOpen}
        />
      </CharacterStateAndActionsContext.Provider>
    </Page>
  )
})
