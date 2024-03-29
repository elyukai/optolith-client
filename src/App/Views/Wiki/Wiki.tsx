import * as React from "react"
import { fmapF } from "../../../Data/Functor"
import { cons, consF, List, map, notNull } from "../../../Data/List"
import { Just, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { elems } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { NumIdName } from "../../Models/NumIdName"
import { CultureCombined } from "../../Models/View/CultureCombined"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { ProfessionCombined } from "../../Models/View/ProfessionCombined"
import { RaceCombined } from "../../Models/View/RaceCombined"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Blessing } from "../../Models/Wiki/Blessing"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { Disadvantage } from "../../Models/Wiki/Disadvantage"
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../Models/Wiki/Skill"
import { skillGroupToMediumNumIdName } from "../../Models/Wiki/SkillGroup"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { Spell } from "../../Models/Wiki/Spell"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { InlineWikiEntry } from "../../Models/Wiki/wikiTypeHelpers"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { sortRecordsByName } from "../../Utilities/sortBy"
import { Dropdown } from "../Universal/Dropdown"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { SearchField } from "../Universal/SearchField"
import { WikiList } from "./WikiList"

const SDA = StaticData.A

const getSortedGroupsDef =
  (staticData: StaticDataRecord) =>
  (def: string) =>
    pipe (
      map ((n: Record<NumIdName>) => DropdownOption ({
                                       id: Just (NumIdName.A.id (n)),
                                       name: NumIdName.A.name (n),
                                     })),
      sortRecordsByName (staticData),
      consF (DropdownOption ({
              id: Nothing,
              name: def,
            }))
    )

export interface WikiOwnProps {
  staticData: StaticDataRecord
}

export interface WikiTabLists {
  races: List<Record<RaceCombined>>
  cultures: List<Record<CultureCombined>>
  professions: List<Record<ProfessionCombined>>
  advantages: List<Record<Advantage>>
  disadvantages: List<Record<Disadvantage>>
  skills: List<Record<Skill>>
  combatTechniques: List<Record<CombatTechnique>>
  specialAbilities: List<Record<SpecialAbility>>
  spells: List<Record<Spell>>
  cantrips: List<Record<Cantrip>>
  liturgicalChants: List<Record<LiturgicalChant>>
  blessings: List<Record<Blessing>>
  itemTemplates: List<Record<ItemTemplate>>
}

export interface WikiStateProps extends WikiTabLists {
  filterText: string
  category: Maybe<string>
  professionsGroup: Maybe<number>
  skillsGroup: Maybe<number>
  combatTechniquesGroup: Maybe<number>
  specialAbilitiesGroup: Maybe<number>
  spellsGroup: Maybe<number>
  liturgicalChantsGroup: Maybe<number>
  itemTemplatesGroup: Maybe<number>
  specialAbilityGroups: List<Record<DropdownOption<number>>>
}

export interface WikiDispatchProps {
  setCategory1 (category: Maybe<string>): void
  setFilter (filterText: string): void
  setProfessionsGroup (group: Maybe<number>): void
  setSkillsGroup (group: Maybe<number>): void
  setCombatTechniquesGroup (group: Maybe<number>): void
  setSpecialAbilitiesGroup (group: Maybe<number>): void
  setSpellsGroup (group: Maybe<number>): void
  setLiturgicalChantsGroup (group: Maybe<number>): void
  setItemTemplatesGroup (group: Maybe<number>): void
}

type Props = WikiStateProps & WikiDispatchProps & WikiOwnProps

export interface WikiState {
  infoId: Maybe<string>
}

export const Wiki: React.FC<Props> = props => {
  const {
    category: maybeCategory,
    filterText,
    staticData,
    setCategory1,
    setFilter,
    professionsGroup,
    skillsGroup,
    combatTechniquesGroup,
    specialAbilitiesGroup,
    spellsGroup,
    liturgicalChantsGroup,
    itemTemplatesGroup,
    setProfessionsGroup,
    setSkillsGroup,
    setCombatTechniquesGroup,
    setSpecialAbilitiesGroup,
    setSpellsGroup,
    setLiturgicalChantsGroup,
    setItemTemplatesGroup,
    specialAbilityGroups,
    ...other
  } = props

  const [ infoId, setInfoId ] = React.useState<Maybe<string>> (Nothing)

  const mxs: Maybe<List<InlineWikiEntry>> =
    fmapF (maybeCategory) (category => other[category as keyof WikiTabLists])

  const handleShowInfo =
    React.useCallback (
      (id: string) => setInfoId (Just (id)),
      [ setInfoId ]
    )

  return (
    <Page id="wiki">
      <Options>
        <SearchField
          staticData={staticData}
          onChange={setFilter}
          value={filterText}
          />
        <Dropdown
          value={maybeCategory}
          onChange={setCategory1}
          hint={translate (staticData) ("wiki.chooseacategory")}
          options={List (
            DropdownOption ({
              id: Just ("races"),
              name: translate (staticData) ("wiki.filters.races"),
            }),
            DropdownOption ({
              id: Just ("cultures"),
              name: translate (staticData) ("wiki.filters.cultures"),
            }),
            DropdownOption ({
              id: Just ("professions"),
              name: translate (staticData) ("wiki.filters.professions"),
            }),
            DropdownOption ({
              id: Just ("advantages"),
              name: translate (staticData) ("wiki.filters.advantages"),
            }),
            DropdownOption ({
              id: Just ("disadvantages"),
              name: translate (staticData) ("wiki.filters.disadvantages"),
            }),
            DropdownOption ({
              id: Just ("skills"),
              name: translate (staticData) ("wiki.filters.skills"),
            }),
            DropdownOption ({
              id: Just ("combatTechniques"),
              name: translate (staticData) ("wiki.filters.combattechniques"),
            }),
            DropdownOption ({
              id: Just ("specialAbilities"),
              name: translate (staticData) ("wiki.filters.specialabilities"),
            }),
            DropdownOption ({
              id: Just ("spells"),
              name: translate (staticData) ("wiki.filters.magic"),
            }),
            DropdownOption ({
              id: Just ("liturgicalChants"),
              name: translate (staticData) ("wiki.filters.liturgicalchants"),
            }),
            DropdownOption ({
              id: Just ("itemTemplates"),
              name: translate (staticData) ("wiki.filters.itemtemplates"),
            })
          )}
          />
        {Maybe.elem ("professions") (maybeCategory)
          ? (
              <Dropdown
                value={professionsGroup}
                onChange={setProfessionsGroup}
                options={List (
                  DropdownOption ({
                    id: Nothing,
                    name: translate (staticData) ("profession.filters.groups.allprofessiongroups"),
                  }),
                  DropdownOption ({
                    id: Just (1),
                    name: translate (staticData) ("profession.filters.groups.mundaneprofessions"),
                  }),
                  DropdownOption ({
                    id: Just (2),
                    name: translate (staticData) ("profession.filters.groups.magicalprofessions"),
                  }),
                  DropdownOption ({
                    id: Just (3),
                    name: translate (staticData) ("profession.filters.groups.blessedprofessions"),
                  })
                )}
                fullWidth
                />
            )
          : null}
        {Maybe.elem ("skills") (maybeCategory)
          ? (
            <Dropdown
              value={skillsGroup}
              onChange={setSkillsGroup}
              options={getSortedGroupsDef (staticData)
                                          (translate (staticData) ("wiki.filters.skills.all"))
                                          (pipe_ (
                                            staticData,
                                            SDA.skillGroups,
                                            elems,
                                            map (skillGroupToMediumNumIdName)
                                          ))}
              fullWidth
              />
          )
          : null}
        {Maybe.elem ("combatTechniques") (maybeCategory)
          ? (
              <Dropdown
                value={combatTechniquesGroup}
                onChange={setCombatTechniquesGroup}
                options={getSortedGroupsDef (staticData)
                                            (translate (staticData)
                                                       ("wiki.filters.combattechniques.all"))
                                            (elems (SDA.combatTechniqueGroups (staticData)))}
                fullWidth
                />
            )
          : null}
        {Maybe.elem ("specialAbilities") (maybeCategory)
          ? (
              <Dropdown
                value={specialAbilitiesGroup}
                onChange={setSpecialAbilitiesGroup}
                options={cons (specialAbilityGroups)
                              (DropdownOption ({
                                id: Nothing,
                                name: translate (staticData) ("wiki.filters.specialabilities.all"),
                              }))}
                fullWidth
                />
            )
          : null}
        {Maybe.elem ("spells") (maybeCategory)
          ? (
              <Dropdown
                value={spellsGroup}
                onChange={setSpellsGroup}
                options={getSortedGroupsDef (staticData)
                                            (translate (staticData) ("wiki.filters.magic.all"))
                                            (elems (SDA.spellGroups (staticData)))}
                fullWidth
                />
            )
          : null}
        {Maybe.elem ("liturgicalChants") (maybeCategory)
          ? (
              <Dropdown
                value={liturgicalChantsGroup}
                onChange={setLiturgicalChantsGroup}
                options={getSortedGroupsDef (staticData)
                                            (translate (staticData)
                                                       ("wiki.filters.liturgicalchants.all"))
                                            (elems (SDA.liturgicalChantGroups (staticData)))}
                fullWidth
                />
            )
          : null}
        {Maybe.elem ("itemTemplates") (maybeCategory)
          ? (
              <Dropdown
                value={itemTemplatesGroup}
                onChange={setItemTemplatesGroup}
                options={getSortedGroupsDef (staticData)
                                            (translate (staticData)
                                                       ("wiki.filters.itemtemplates.all"))
                                            (elems (SDA.equipmentGroups (staticData)))}
                fullWidth
                />
            )
          : null}
      </Options>
      <MainContent>
        <Scroll>
          {maybe (<ListPlaceholder wikiInitial staticData={staticData} type="wiki" />)
                  ((xs: List<InlineWikiEntry>) =>
                    notNull (xs)
                      ? <WikiList list={xs} showInfo={handleShowInfo} currentInfoId={infoId} />
                      : <ListPlaceholder noResults staticData={staticData} type="wiki" />)
                  (mxs)}
        </Scroll>
      </MainContent>
      <WikiInfoContainer currentId={infoId} />
    </Page>
  )
}
