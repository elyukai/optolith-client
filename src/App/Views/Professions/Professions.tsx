import * as React from "react"
import { List, map, notNull, toArray } from "../../../Data/List"
import { bindF, ensure, Just, Maybe, maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { SelectionsContainer } from "../../Containers/RCPSelectionsContainer"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { ProfessionsGroupVisibilityFilter, ProfessionsVisibilityFilter } from "../../Models/Config"
import { HeroModelRecord } from "../../Models/Hero/Hero"
import { Sex } from "../../Models/Hero/heroTypeHelpers"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { ProfessionCombined, ProfessionCombinedA_ } from "../../Models/View/ProfessionCombined"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Aside } from "../Universal/Aside"
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
import { ProfessionsListItem } from "./ProfessionsListItem"
import { ProfessionVariants } from "./ProfessionVariants"

export interface ProfessionsOwnProps {
  hero: HeroModelRecord
  staticData: StaticDataRecord
}

export interface ProfessionsStateProps {
  wiki: StaticDataRecord
  currentProfessionId: Maybe<string>
  currentProfessionVariantId: Maybe<string>
  groupVisibilityFilter: number
  professions: Maybe<List<Record<ProfessionCombined>>>
  sortOrder: SortNames
  sex: Maybe<Sex>
  visibilityFilter: string
  filterText: string
}

export interface ProfessionsDispatchProps {
  setGroupVisibilityFilter (filter: ProfessionsGroupVisibilityFilter): void
  setSortOrder (sortOrder: SortNames): void
  setVisibilityFilter (filter: ProfessionsVisibilityFilter): void
  setFilterText (filterText: string): void
}

export type ProfessionsProps =
  ProfessionsStateProps
  & ProfessionsDispatchProps
  & ProfessionsOwnProps

export interface ProfessionsState {
  showAddSlidein: boolean
}

export const Professions: React.FC<ProfessionsProps> = props => {
  const {
    currentProfessionId,
    groupVisibilityFilter,
    staticData,
    hero,
    professions,
    setGroupVisibilityFilter,
    setSortOrder,
    setVisibilityFilter,
    setFilterText,
    sortOrder,
    visibilityFilter,
    filterText,
    currentProfessionVariantId,
    sex,
    wiki,
  } = props

  const [ showAddSlidein, switchAddSlidein ] = React.useState (false)

  const handleCloseSlidein = React.useCallback (
    () => switchAddSlidein (false),
    [ switchAddSlidein ]
  )

  const handleShowSlidein = React.useCallback (
    () => switchAddSlidein (true),
    [ switchAddSlidein ]
  )

  return (
    <Page id="professions">
      {showAddSlidein
        ? <SelectionsContainer close={handleCloseSlidein} hero={hero} />
        : null}
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
              id: Just (ProfessionsVisibilityFilter.All),
              name: translate (staticData) ("profession.filters.common.allprofessions"),
            }),
            DropdownOption ({
              id: Just (ProfessionsVisibilityFilter.Common),
              name: translate (staticData) ("profession.filters.common.commonprofessions"),
            })
          )}
          fullWidth
          />
        <Dropdown
          value={Just (groupVisibilityFilter)}
          onChangeJust={setGroupVisibilityFilter}
          options={List (
            DropdownOption ({
              id: Just (ProfessionsGroupVisibilityFilter.All),
              name: translate (staticData) ("profession.filters.groups.allprofessiongroups"),
            }),
            DropdownOption ({
              id: Just (ProfessionsGroupVisibilityFilter.Mundane),
              name: translate (staticData) ("profession.filters.groups.mundaneprofessions"),
            }),
            DropdownOption ({
              id: Just (ProfessionsGroupVisibilityFilter.Magical),
              name: translate (staticData) ("profession.filters.groups.magicalprofessions"),
            }),
            DropdownOption ({
              id: Just (ProfessionsGroupVisibilityFilter.Blessed),
              name: translate (staticData) ("profession.filters.groups.blessedprofessions"),
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
            {translate (staticData) ("profession.header.name")}
          </ListHeaderTag>
          <ListHeaderTag
            className="cost"
            hint={translate (staticData) ("profession.header.adventurepoints.tooltip")}
            >
            {translate (staticData) ("profession.header.adventurepoints")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder has-border" />
        </ListHeader>
        <Scroll>
          <ListView>
            {pipe_ (
              professions,
              bindF (ensure (notNull)),
              maybe<React.ReactNode> (
                                       <ListPlaceholder
                                         staticData={staticData}
                                         type="professions"
                                         noResults
                                         />
                                     )
                                     (pipe (
                                       map ((profession: Record<ProfessionCombined>) => (
                                         <ProfessionsListItem
                                           key={ProfessionCombinedA_.id (profession)}
                                           showAddSlidein={handleShowSlidein}
                                           profession={profession}
                                           currentProfessionId={currentProfessionId}
                                           currentProfessionVariantId={currentProfessionVariantId}
                                           sex={sex}
                                           wiki={wiki}
                                           />
                                       )),
                                       toArray
                                     ))
            )}
          </ListView>
        </Scroll>
      </MainContent>
      <Aside>
        <ProfessionVariants
          currentProfessionId={currentProfessionId}
          currentProfessionVariantId={currentProfessionVariantId}
          staticData={staticData}
          professions={professions}
          sex={sex}
          />
        <WikiInfoContainer
          currentId={currentProfessionId}
          noWrapper
          />
      </Aside>
    </Page>
  )
}
