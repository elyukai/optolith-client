import * as React from "react"
import { List, map, notNull, toArray } from "../../../Data/List"
import { bindF, ensure, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { CombatTechniquesSortOptions } from "../../Models/Config"
import { HeroModelRecord } from "../../Models/Hero/Hero"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../Models/View/CombatTechniqueWithRequirements"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
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
  staticData: StaticDataRecord
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
    staticData,
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
          staticData={staticData}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          staticData={staticData}
          options={List (SortNames.Name, SortNames.Group, SortNames.IC)}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("combattechniques.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate (staticData) ("combattechniques.header.group")}
          </ListHeaderTag>
          <ListHeaderTag
            className="value"
            hint={translate (staticData) ("combattechniques.header.combattechniquerating.tooltip")}
            >
            {translate (staticData) ("combattechniques.header.combattechniquerating")}
          </ListHeaderTag>
          <ListHeaderTag
            className="ic"
            hint={translate (staticData) ("combattechniques.header.improvementcost.tooltip")}
            >
            {translate (staticData) ("combattechniques.header.improvementcost")}
          </ListHeaderTag>
          <ListHeaderTag
            className="primary"
            hint={translate (staticData) ("combattechniques.header.primaryattribute.tooltip")}
            >
            {translate (staticData) ("combattechniques.header.primaryattribute")}
          </ListHeaderTag>
          <ListHeaderTag
            className="at"
            hint={translate (staticData) ("combattechniques.header.attack.tooltip")}
            >
            {translate (staticData) ("combattechniques.header.attack")}
          </ListHeaderTag>
          <ListHeaderTag
            className="pa"
            hint={translate (staticData) ("combattechniques.header.parry.tooltip")}
            >
            {translate (staticData) ("combattechniques.header.parry")}
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
                (<ListPlaceholder staticData={staticData} type="combatTechniques" noResults />)
                (pipe (
                  map (
                    (x: Record<CombatTechniqueWithRequirements>) => (
                      <CombatTechniqueListItem
                        key={CTWRA_.id (x)}
                        attributes={attributes}
                        combatTechnique={x}
                        currentInfoId={infoId}
                        selectForInfo={showInfo}
                        staticData={staticData}
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
      <WikiInfoContainer currentId={infoId} />
    </Page>
  )
}
