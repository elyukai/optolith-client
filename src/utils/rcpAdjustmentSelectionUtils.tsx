import { pipe } from "ramda";
import * as React from "react";
import { Checkbox } from "../components/Checkbox";
import { Dropdown, DropdownOption } from "../components/Dropdown";
import { LanguagesSelectionListItem, ScriptsSelectionListItem } from "../types/data";
import { SelectionsCantrips } from "../views/rcp/SelectionsCantrips";
import { SelectionsCombatTechniques } from "../views/rcp/SelectionsCombatTechniques";
import { SelectionsCurses } from "../views/rcp/SelectionsCurses";
import { SelectionsLanguagesAndScripts } from "../views/rcp/SelectionsLanguagesAndScripts";
import { SelectionsSkills } from "../views/rcp/SelectionsSkills";
import { SelectionsSkillSpecialization } from "../views/rcp/SelectionsSkillSpecialization";
import { TerrainKnowledge } from "../views/rcp/SelectionsTerrainKnowledge";
import { findSelectOption } from "./activatable/selectionUtils";
import { translate } from "./I18n";
import { flip } from "./structures/Function";
import { List } from "./structures/List";
import { bind_, fmap, fromMaybe, Just, listToMaybe, Maybe, Nothing } from "./structures/Maybe";
import { lookup, OrderedMap } from "./structures/OrderedMap";
import { OrderedSet } from "./structures/OrderedSet";
import { fst, Pair, snd } from "./structures/Pair";
import { Record } from "./structures/Record";
import { Culture } from "./wikiData/Culture";
import { L10n, L10nRecord } from "./wikiData/L10n";
import { LanguagesScriptsSelection } from "./wikiData/professionSelections/LanguagesScriptsSelection";
import { ProfessionSelections } from "./wikiData/professionSelections/ProfessionAdjustmentSelections";
import { TerrainKnowledgeSelection } from "./wikiData/professionSelections/TerrainKnowledgeSelection";
import { SpecialAbility } from "./wikiData/SpecialAbility";
import { SelectOption } from "./wikiData/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "./wikiData/WikiModel";
import { ProfessionSelectionIds } from "./wikiData/wikiTypeHelpers";
import { getAllWikiEntriesByGroup } from "./WikiUtils";

const { specialAbilities } = WikiModel.A
const { name, cost } = SelectOption.A

export const getBuyScriptElement =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (culture: Record<Culture>) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (switchIsBuyingMainScriptEnabled: () => void) =>
    fst (isScriptSelectionNeeded)
      ? Just (
          (() => {
            const selectionItem =
              pipe (
                     specialAbilities,
                     lookup ("SA_27"),
                     bind_ (flip (findSelectOption)
                                 (listToMaybe (Culture.A.scripts (culture))))
                   )
                   (wiki)

            const selectionItemName =
              fromMaybe ("") (fmap (name) (selectionItem))

            const selectionItemCost =
              fromMaybe (0) (bind_ (cost) (selectionItem))

            return (
              <Checkbox
                checked={isBuyingMainScriptEnabled}
                onClick={switchIsBuyingMainScriptEnabled}
                disabled={isAnyLanguageOrScriptSelected}
                >
                {translate (locale) (L10n.A["rcpselections.labels.buyscript"])}
                {
                  !snd (isScriptSelectionNeeded)
                  && Maybe.isJust (selectionItem)
                  ? ` (${selectionItemName}, ${selectionItemCost} AP)`
                  : null
                }
              </Checkbox>
            )
          }) ()
        )
      : Nothing

const getScripts =
  (locale: L10nRecord) =>
  (culture: Record<Culture>) =>
  (mainScript: number) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (wikiEntryScripts: Record<SpecialAbility>) =>
    wikiEntryScripts
      .lookup ("select")
      .fmap (
        pipe (
          Maybe.mapMaybe (
            (e): Maybe<Record<ScriptsSelectionListItem>> => {
              const id = e .get ("id")

              const maybeOption = findSelectOption (wikiEntryScripts, Just (id))

              if (Maybe.isJust (maybeOption) && typeof id === "number") {
                const option = Maybe.fromJust (maybeOption)

                const maybeCost = option .lookup ("cost")

                if (Maybe.isJust (maybeCost)) {
                  const native =
                    isBuyingMainScriptEnabled
                    && (
                      !Tuple.snd (isScriptSelectionNeeded)
                      && Maybe.elem (id)
                                    (Maybe.listToMaybe (culture .get ("scripts")))
                      || id === mainScript
                    )

                  return Just (Record.of<ScriptsSelectionListItem> ({
                    id,
                    name: option .get ("name"),
                    cost: Maybe.fromJust (maybeCost),
                    native,
                  }))
                }
              }

              return Nothing ()
            }
          ),
          list => sortObjects (list, locale .get ("id"))
        )
      )

const getLanguages =
  (locale: L10nRecord) =>
  (culture: Record<Culture>) =>
  (motherTongue: number) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (wikiEntryLanguages: Record<SpecialAbility>) =>
    wikiEntryLanguages
      .lookup ("select")
      .fmap (
        pipe (
          Maybe.mapMaybe (
            (e): Maybe<Record<LanguagesSelectionListItem>> => {
              const id = e .get ("id")

              const maybeOption = findSelectOption (wikiEntryLanguages, Just (id))

              if (Maybe.isJust (maybeOption) && typeof id === "number") {
                const option = Maybe.fromJust (maybeOption)

                const native =
                  !isMotherTongueSelectionNeeded
                  && Maybe.elem (id)
                                (Maybe.listToMaybe (culture .get ("languages")))
                  || id === motherTongue

                return Just (Record.of<LanguagesSelectionListItem> ({
                  id,
                  name: option .get ("name"),
                  native,
                }))
              }

              return Nothing ()
            }
          ),
          list => sortObjects (list, locale .get ("id"))
        )
      )

export const getLanguagesAndScriptsElementAndValidation =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (culture: Record<Culture>) =>
  (languages: OrderedMap<number, number>) =>
  (scripts: OrderedMap<number, number>) =>
  (professionSelections: Record<ProfessionSelections>) =>
  (mainScript: number) =>
  (motherTongue: number) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (adjustLanguage: (id: number) => (level: Maybe<number>) => void) =>
  (adjustScript: (id: number) => (ap: number) => void) =>
    Maybe.join (
      Maybe.liftM3<
        Record<LanguagesScriptsSelection>,
        Record<SpecialAbility>,
        Record<SpecialAbility>,
        Maybe<Pair<number, JSX.Element>>
      >
        (selection => wikiEntryScripts => wikiEntryLanguages => {
          const maybeScriptsList = getScripts (locale)
                                              (culture)
                                              (mainScript)
                                              (isBuyingMainScriptEnabled)
                                              (isScriptSelectionNeeded)
                                              (wikiEntryScripts)

          const maybeLanguagesList = getLanguages (locale)
                                                  (culture)
                                                  (motherTongue)
                                                  (isMotherTongueSelectionNeeded)
                                                  (wikiEntryLanguages)

          return Maybe.liftM2<
            List<Record<ScriptsSelectionListItem>>,
            List<Record<LanguagesSelectionListItem>>,
            Pair<number, JSX.Element>
          >
            (scriptsList => languagesList => {
              const value = selection .get ("value")

              const apLeft =
                value - languages .sum () * 2 - scripts .sum ()

              return Pair.of<number, JSX.Element>
                (apLeft)
                (
                  <SelectionsLanguagesAndScripts
                    scripts={scriptsList}
                    languages={languagesList}
                    scriptsActive={scripts}
                    languagesActive={languages}
                    apTotal={value}
                    apLeft={apLeft}
                    adjustScript={adjustScript}
                    adjustLanguage={adjustLanguage}
                    locale={locale}
                    />
                )
            })
            (maybeScriptsList)
            (maybeLanguagesList)
        })
        (professionSelections .lookup (ProfessionSelectionIds.LANGUAGES_SCRIPTS))
        (wiki .get ("specialAbilities") .lookup ("SA_27"))
        (wiki .get ("specialAbilities") .lookup ("SA_29"))
    )

export const getCursesElementAndValidation =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (professionSelections: Record<ProfessionSelections>) =>
  (cursesActive: OrderedMap<string, number>) =>
  (adjustCurse: (id: string) => (maybeOption: Maybe<"add" | "remove">) => void) =>
    professionSelections
      .lookup (Wiki.ProfessionSelectionIds.CURSES)
      .fmap (
        selection => {
          const value = selection .get ("value")

          const list =
            sortObjects (
              getAllWikiEntriesByGroup (wiki .get ("spells"), 3),
              locale .get ("id")
            )

          const apLeft = value - cursesActive .size () - cursesActive .sum () * 2

          return Tuple.of<number, JSX.Element>
            (apLeft)
            (
              <SelectionsCurses
                list={list}
                active={cursesActive}
                apTotal={value}
                apLeft={apLeft}
                change={adjustCurse}
                locale={locale}
                />
            )
        }
      )

export const getCombatTechniquesElementAndValidation =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (professionSelections: Record<ProfessionSelections>) =>
  (combatTechniquesActive: OrderedSet<string>) =>
  (combatTechniquesSecondActive: OrderedSet<string>) =>
  (switchCombatTechnique: (id: string) => void) =>
    professionSelections
      .lookup (ProfessionSelectionIds.COMBAT_TECHNIQUES)
      .fmap (
        selection => {
          const amount = selection .get ("amount")
          const value = selection .get ("value")
          const sid = selection .get ("sid")

          const list =
            wiki .get ("combatTechniques")
              .elems ()
              .filter (e => sid .elem (e .get ("id")))

          // Tuple.fst: isValidSelection
          return Tuple.of<boolean, JSX.Element>
            (combatTechniquesActive .size () === amount)
            (
              <SelectionsCombatTechniques
                list={list}
                active={combatTechniquesActive}
                value={value}
                amount={amount}
                disabled={combatTechniquesSecondActive}
                change={switchCombatTechnique}
                locale={locale}
                />
            )
        }
      )

export const getCombatTechniquesSecondElementAndValidation =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (professionSelections: Record<ProfessionSelections>) =>
  (combatTechniquesActive: OrderedSet<string>) =>
  (combatTechniquesSecondActive: OrderedSet<string>) =>
  (switchSecondCombatTechnique: (id: string) => void) =>
    professionSelections
      .lookup (ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND)
      .fmap (
        selection => {
          const amount = selection .get ("amount")
          const value = selection .get ("value")
          const sid = selection .get ("sid")

          const list =
            wiki .get ("combatTechniques")
              .elems ()
              .filter (e => sid .elem (e .get ("id")))

          // Tuple.fst: isValidSelection
          return Tuple.of<boolean, JSX.Element>
            (combatTechniquesSecondActive .size () === amount)
            (
              <SelectionsCombatTechniques
                list={list}
                active={combatTechniquesSecondActive}
                value={value}
                amount={amount}
                disabled={combatTechniquesActive}
                change={switchSecondCombatTechnique}
                locale={locale}
                second
                />
            )
        }
      )

export const getCantripsElementAndValidation =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (professionSelections: Record<ProfessionAdjustmentSelections>) =>
  (cantripsActive: OrderedSet<string>) =>
  (switchCantrip: (id: string) => void) =>
    professionSelections
      .lookup (ProfessionSelectionIds.CANTRIPS)
      .fmap (
        selection => {
          const amount = selection .get ("amount")
          const sid = selection .get ("sid")

          const list =
            wiki .get ("cantrips")
              .elems ()
              .filter (e => sid .elem (e .get ("id")))

          // Tuple.fst: isValidSelection
          return Pair.of<boolean, JSX.Element>
            (cantripsActive .size () === amount)
            (
              <SelectionsCantrips
                list={list}
                active={cantripsActive}
                num={amount}
                change={switchCantrip}
                locale={locale}
                />
            )
        }
      )

export const getSkillSpecializationElement =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (professionSelections: Record<ProfessionSelections>) =>
  (specialization: Pair<Maybe<number>, string>) =>
  (specializationSkillId: Maybe<string>) =>
  (setSpecialization: (value: string | number) => void) =>
  (setSpecializationSkill: (id: string) => void) =>
    professionSelections
      .lookup (ProfessionSelectionIds.SPECIALIZATION)
      .fmap (
        selection => (
          <SelectionsSkillSpecialization
            options={selection}
            active={specialization}
            activeId={specializationSkillId}
            change={setSpecialization}
            changeId={setSpecializationSkill}
            locale={locale}
            skills={wiki .get ("skills")}
            />
        )
      )

export const getSkillsElementAndValidation =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (professionSelections: Record<ProfessionSelections>) =>
  (skillsActive: OrderedMap<string, number>) =>
  (addSkillPoint: (id: string) => void) =>
  (removeSkillPoint: (id: string) => void) =>
    professionSelections
      .lookup (ProfessionSelectionIds.SKILLS)
      .fmap (
        selection => {
          const value = selection .get ("value")
          const maybeGroup = selection .lookup ("gr")

          const list =
            Maybe.fromMaybe (wiki .get ("skills"))
                            (maybeGroup
                              .fmap (
                                gr => wiki .get ("skills")
                                  .filter (e => e .get ("gr") === gr)
                              ))
                              .elems ()

          const apLeft = value - skillsActive .sum ()

          return Pair.of<number, JSX.Element>
            (apLeft)
            (
              <SelectionsSkills
                active={skillsActive}
                add={addSkillPoint}
                gr={maybeGroup}
                left={apLeft}
                list={list}
                remove={removeSkillPoint}
                value={value}
                locale={locale}
                />
            )
        }
      )

export const getTerrainKnowledgeElement =
  (wiki: WikiModelRecord) =>
  (professionSelections: Record<ProfessionSelections>) =>
  (terrainKnowledgeActive: Maybe<number>) =>
  (setTerrainKnowledge: (terrainKnowledge: number) => void) =>
    Maybe.liftM2<Record<TerrainKnowledgeSelection>, Record<SpecialAbility>, JSX.Element>
      (selection => wikiEntry => (
        <TerrainKnowledge
          available={selection .get ("sid")}
          terrainKnowledge={wikiEntry}
          set={setTerrainKnowledge}
          active={terrainKnowledgeActive}
          />
      ))
      (professionSelections .lookup (ProfessionSelectionIds.TERRAIN_KNOWLEDGE))
      (wiki .get ("specialAbilities") .lookup ("SA_12"))

export const getMotherTongueSelectionElement =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (culture: Record<Culture>) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (motherTongue: number) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (setMotherTongue: (option: number) => void) =>
    Maybe.maybeToNullable (
      (isMotherTongueSelectionNeeded
        ? wiki .get ("specialAbilities") .lookup ("SA_29")
        : Nothing)
        .fmap (
          wikiEntry => (
            <Dropdown
              hint={translate (locale, "rcpselections.labels.selectnativetongue")}
              value={motherTongue}
              onChangeJust={setMotherTongue}
              options={
                Maybe.mapMaybe<number, Record<DropdownOption>>
                  (id => findSelectOption (wikiEntry) (Just (id)) as
                    Maybe<Record<DropdownOption>>)
                  (culture .get ("languages"))
              }
              disabled={isAnyLanguageOrScriptSelected}
              />
          )
        )
    )

export const getMainScriptSelectionElement =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (culture: Record<Culture>) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (mainScript: number) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (setMainCulturalLiteracy: (option: number) => void) =>
    Maybe.maybeToNullable (
      (snd (isScriptSelectionNeeded)
        ? wiki .get ("specialAbilities") .lookup ("SA_27")
        : Nothing)
        .fmap (
          wikiEntry => (
            <Dropdown
              hint={translate (locale, "rcpselections.labels.selectscript")}
              value={mainScript}
              onChangeJust={setMainCulturalLiteracy}
              options={
                Maybe.mapMaybe<number, Record<DropdownOption>>
                  (R.pipe (
                    id => findSelectOption (wikiEntry) (Just (id)),
                    Maybe.bind_<Record<Wiki.SelectionObject>, Record<DropdownOption>> (
                      option => option .lookup ("cost")
                        .fmap (
                          cost =>
                            option .modify<"name">
                              (name => `${name} (${cost} AP)`)
                              ("name") as Record<DropdownOption>
                        )
                    )
                  ))
                  (culture .get ("scripts"))
              }
              disabled={!isBuyingMainScriptEnabled || isAnyLanguageOrScriptSelected}
              />
          )
        )
    )
