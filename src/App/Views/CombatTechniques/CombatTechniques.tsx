import * as React from "react"
import { List, map, notNull, toArray } from "../../../Data/List"
import { bindF, ensure, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../Models/View/CombatTechniqueWithRequirements"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { CombatTechniquesSortOptions } from "../../Utilities/Raw/JSON/Config"
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
import { CombatTechniqueListItem } from "./CombatTechniquesListItem"

export interface CombatTechniquesOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface CombatTechniquesStateProps {
  attributes: List<Record<AttributeCombined>>
  list: Maybe<List<Record<CombatTechniqueWithRequirements>>>
  isRemovingEnabled: boolean
  sortOrder: CombatTechniquesSortOptions
  filterText: string
}

export interface CombatTechniquesDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  addPoint (id: string): void
  removePoint (id: string): void
  setFilterText (filterText: string): void
}

export type CombatTechniquesProps =
  CombatTechniquesStateProps
  & CombatTechniquesDispatchProps
  & CombatTechniquesOwnProps

export interface CombatTechniquesState {
  infoId: Maybe<string>
}

const CTWRA_ = CombatTechniqueWithRequirementsA_

export const CombatTechniques: React.FC<CombatTechniquesProps> = props => {
  const {
    addPoint,
    attributes,
    list,
    l10n,
    isRemovingEnabled,
    removePoint,
    setSortOrder,
    sortOrder,
    filterText,
    setFilterText,
  } = props

  const [ infoId, setInfoId ] = React.useState<Maybe<string>> (Nothing)

  const showInfo = React.useCallback (
    (id: string) => setInfoId (Just (id)),
    [ setInfoId ]
  )

  return (
    <Page id="combattechniques">
      <Options>
        <SearchField
          l10n={l10n}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          l10n={l10n}
          options={List (SortNames.Name, SortNames.Group, SortNames.IC)}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (l10n) ("name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate (l10n) ("group")}
          </ListHeaderTag>
          <ListHeaderTag className="value" hint={translate (l10n) ("skillrating")}>
            {translate (l10n) ("skillrating.short")}
          </ListHeaderTag>
          <ListHeaderTag className="ic" hint={translate (l10n) ("improvementcost")}>
            {translate (l10n) ("improvementcost.short")}
          </ListHeaderTag>
          <ListHeaderTag className="primary" hint={translate (l10n) ("primaryattribute")}>
            {translate (l10n) ("primaryattribute.short")}
          </ListHeaderTag>
          <ListHeaderTag className="at" hint={translate (l10n) ("attack")}>
            {translate (l10n) ("attack.short")}
          </ListHeaderTag>
          <ListHeaderTag className="pa" hint={translate (l10n) ("parry")}>
            {translate (l10n) ("parry.short")}
          </ListHeaderTag>
          {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          <ListView>
            {pipe_ (
              list,
              bindF (ensure (notNull)),
              maybe<JSX.Element | JSX.Element[]>
                (<ListPlaceholder l10n={l10n} type="combatTechniques" noResults />)
                (pipe (
                  map (
                    (x: Record<CombatTechniqueWithRequirements>) => (
                      <CombatTechniqueListItem
                        key={CTWRA_.id (x)}
                        attributes={attributes}
                        combatTechnique={x}
                        currentInfoId={infoId}
                        selectForInfo={showInfo}
                        l10n={l10n}
                        addPoint={addPoint}
                        removePoint={removePoint}
                        isRemovingEnabled={isRemovingEnabled}
                        />
                    )
                  ),
                  toArray
                ))
            )}
          </ListView>
        </Scroll>
      </MainContent>
      <WikiInfoContainer
        l10n={l10n}
        currentId={infoId}
        />
    </Page>
  )
}
