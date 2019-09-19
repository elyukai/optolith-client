import * as React from "react";
import { fmapF } from "../../../Data/Functor";
import { cons, consF, imap, List, notNull } from "../../../Data/List";
import { Just, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer";
import { CultureCombined } from "../../Models/View/CultureCombined";
import { ProfessionCombined } from "../../Models/View/ProfessionCombined";
import { RaceCombined } from "../../Models/View/RaceCombined";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Blessing } from "../../Models/Wiki/Blessing";
import { Cantrip } from "../../Models/Wiki/Cantrip";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Spell } from "../../Models/Wiki/Spell";
import { InlineWikiEntry } from "../../Models/Wiki/wikiTypeHelpers";
import { translate } from "../../Utilities/I18n";
import { pipe } from "../../Utilities/pipe";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { ListPlaceholder } from "../Universal/ListPlaceholder";
import { MainContent } from "../Universal/MainContent";
import { Options } from "../Universal/Options";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";
import { TextField } from "../Universal/TextField";
import { WikiList } from "./WikiList";

export interface WikiOwnProps {
  l10n: L10nRecord
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
  setCategory2 (category: Maybe<string>): void
  setFilter (filterText: string): void
  setProfessionsGroup (group: Maybe<number>): void
  setSkillsGroup (group: Maybe<number>): void
  setCombatTechniquesGroup (group: Maybe<number>): void
  setSpecialAbilitiesGroup (group: Maybe<number>): void
  setSpellsGroup (group: Maybe<number>): void
  setLiturgicalChantsGroup (group: Maybe<number>): void
  setItemTemplatesGroup (group: Maybe<number>): void
}

export type WikiProps = WikiStateProps & WikiDispatchProps & WikiOwnProps

export interface WikiState {
  infoId: Maybe<string>
}

export const Wiki: React.FC<WikiProps> = props => {
  const {
    category: maybeCategory,
    filterText,
    l10n,
    setCategory1,
    setCategory2,
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

  const [infoId, setInfoId] = React.useState<Maybe<string>> (Nothing)

  const mxs: Maybe<List<InlineWikiEntry>> =
    fmapF (maybeCategory) (category => other[category as keyof WikiTabLists])

  const handleShowInfo =
    React.useCallback (
      (id: string) => setInfoId (Just (id)),
      [setInfoId]
    )

  return (
    <Page id="wiki">
      <Options>
        <TextField
          hint={translate (l10n) ("search")}
          onChange={setFilter}
          value={filterText}
          />
        <Dropdown
          value={maybeCategory}
          onChange={setCategory1}
          hint={translate (l10n) ("chooseacategory")}
          options={List (
            DropdownOption ({
              id: Just ("races"),
              name: translate (l10n) ("races"),
            }),
            DropdownOption ({
              id: Just ("cultures"),
              name: translate (l10n) ("cultures"),
            }),
            DropdownOption ({
              id: Just ("professions"),
              name: translate (l10n) ("professions"),
            }),
            DropdownOption ({
              id: Just ("advantages"),
              name: translate (l10n) ("advantages"),
            }),
            DropdownOption ({
              id: Just ("disadvantages"),
              name: translate (l10n) ("disadvantages"),
            }),
            DropdownOption ({
              id: Just ("skills"),
              name: translate (l10n) ("skills"),
            }),
            DropdownOption ({
              id: Just ("combatTechniques"),
              name: translate (l10n) ("combattechniques"),
            }),
            DropdownOption ({
              id: Just ("specialAbilities"),
              name: translate (l10n) ("specialabilities"),
            }),
            DropdownOption ({
              id: Just ("spells"),
              name: translate (l10n) ("spells"),
            }),
            DropdownOption ({
              id: Just ("cantrips"),
              name: translate (l10n) ("cantrips"),
            }),
            DropdownOption ({
              id: Just ("liturgicalChants"),
              name: translate (l10n) ("liturgicalchants"),
            }),
            DropdownOption ({
              id: Just ("blessings"),
              name: translate (l10n) ("blessings"),
            }),
            DropdownOption ({
              id: Just ("itemTemplates"),
              name: translate (l10n) ("items"),
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
            )
          : null}
        {Maybe.elem ("skills") (maybeCategory)
          ? (
            <Dropdown
              value={skillsGroup}
              onChange={setSkillsGroup}
              options={getSortedGroupsDef (l10n)
                                          (translate (l10n) ("allskills"))
                                          (translate (l10n) ("skillgroups"))}
              fullWidth
              />
          )
          : null}
        {Maybe.elem ("combatTechniques") (maybeCategory)
          ? (
              <Dropdown
                value={combatTechniquesGroup}
                onChange={setCombatTechniquesGroup}
                options={getSortedGroupsDef (l10n)
                                            (translate (l10n) ("allcombattechniques"))
                                            (translate (l10n) ("combattechniquegroups"))}
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
                                name: translate (l10n) ("allspecialabilities"),
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
                options={getSortedGroupsDef (l10n)
                                            (translate (l10n) ("allspells"))
                                            (translate (l10n) ("spellgroups"))}
                fullWidth
                />
            )
          : null}
        {Maybe.elem ("liturgicalChants") (maybeCategory)
          ? (
              <Dropdown
                value={liturgicalChantsGroup}
                onChange={setLiturgicalChantsGroup}
                options={getSortedGroupsDef (l10n)
                                            (translate (l10n) ("allliturgicalchants"))
                                            (translate (l10n) ("liturgicalchantgroups"))}
                fullWidth
                />
            )
          : null}
        {Maybe.elem ("itemTemplates") (maybeCategory)
          ? (
              <Dropdown
                value={itemTemplatesGroup}
                onChange={setItemTemplatesGroup}
                options={getSortedGroupsDef (l10n)
                                            (translate (l10n) ("allitemtemplates"))
                                            (translate (l10n) ("itemgroups"))}
                fullWidth
                />
            )
          : null}
      </Options>
      <MainContent>
        <Scroll>
          {maybe (<ListPlaceholder wikiInitial l10n={l10n} type="wiki" />)
                  ((xs: List<InlineWikiEntry>) =>
                    notNull (xs)
                      ? <WikiList list={xs} showInfo={handleShowInfo} currentInfoId={infoId} />
                      : <ListPlaceholder noResults l10n={l10n} type="wiki" />)
                  (mxs)}
        </Scroll>
      </MainContent>
      <WikiInfoContainer
        l10n={l10n}
        currentId={infoId}
        />
    </Page>
  )
}

const getSortedGroupsDef =
  (l10n: L10nRecord) =>
  (def: string) =>
    pipe (
      imap (i => (n: string) => DropdownOption ({ id: Just (i + 1), name: n })),
      sortRecordsByName (l10n),
      consF (DropdownOption ({
              id: Nothing,
              name: def,
            }))
    )
