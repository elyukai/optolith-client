import * as React from "react";
import { List, map, notNull, toArray } from "../../../Data/List";
import { bindF, ensure, Just, Maybe, maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { SelectionsContainer } from "../../Containers/RCPSelectionsContainer";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Sex } from "../../Models/Hero/heroTypeHelpers";
import { ProfessionCombined, ProfessionCombinedA_ } from "../../Models/View/ProfessionCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { Aside } from "../Universal/Aside";
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
import { ProfessionsListItem } from "./ProfessionsListItem";
import { ProfessionVariants } from "./ProfessionVariants";

export interface ProfessionsOwnProps {
  hero: HeroModelRecord
  l10n: L10nRecord
}

export interface ProfessionsStateProps {
  wiki: WikiModelRecord
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
  setGroupVisibilityFilter (filter: number): void
  setSortOrder (sortOrder: SortNames): void
  setVisibilityFilter (filter: string): void
  switchExpansionVisibilityFilter (): void
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
    l10n,
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

  const [showAddSlidein, switchAddSlidein] = React.useState (false)

  const handleCloseSlidein = React.useCallback (() => switchAddSlidein (false), [switchAddSlidein])
  const handleShowSlidein = React.useCallback (() => switchAddSlidein (true), [switchAddSlidein])

  return (
    <Page id="professions">
      {showAddSlidein
        ? <SelectionsContainer close={handleCloseSlidein} l10n={l10n} hero={hero} />
        : null}
      <Options>
        <TextField
          hint={translate (l10n) ("search")}
          value={filterText}
          onChangeString={setFilterText}
          fullWidth
          />
        <Dropdown
          value={Just (visibilityFilter)}
          onChangeJust={setVisibilityFilter}
          options={List (
            DropdownOption ({
              id: Just ("all"),
              name: translate (l10n) ("allprofessions"),
            }),
            DropdownOption ({
              id: Just ("common"),
              name: translate (l10n) ("commonprofessions"),
            })
          )}
          fullWidth
          />
        <Dropdown
          value={Just (groupVisibilityFilter)}
          onChangeJust={setGroupVisibilityFilter}
          options={List (
            DropdownOption ({
              id: Just (0),
              name: translate (l10n) ("allprofessiongroups"),
            }),
            DropdownOption ({
              id: Just (1),
              name: translate (l10n) ("mundaneprofessions"),
            }),
            DropdownOption ({
              id: Just (2),
              name: translate (l10n) ("magicalprofessions"),
            }),
            DropdownOption ({
              id: Just (3),
              name: translate (l10n) ("blessedprofessions"),
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
          <ListHeaderTag className="cost" hint={translate (l10n) ("adventurepoints")}>
            {translate (l10n) ("adventurepoints.short")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder has-border" />
        </ListHeader>
        <Scroll>
          <ListView>
            {pipe_ (
              professions,
              bindF (ensure (notNull)),
              maybe<React.ReactNode> (<ListPlaceholder l10n={l10n} type="professions" noResults />)
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
          l10n={l10n}
          professions={professions}
          sex={sex}
          />
        <WikiInfoContainer
          l10n={l10n}
          currentId={currentProfessionId}
          noWrapper
          />
      </Aside>
    </Page>
  )
}
