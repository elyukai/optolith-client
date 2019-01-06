import { pipe } from "ramda";
import * as React from "react";
import { Checkbox } from "../../components/Checkbox";
import { Dropdown, DropdownOption } from "../../components/Dropdown";
import { equals } from "../../Data/Eq";
import { flip } from "../../Data/Function";
import { elemF, filter, List, pure } from "../../Data/List";
import { bindF, elem, fmap, fromJust, fromMaybe, guard, isJust, join, Just, liftM2, liftM3, listToMaybe, mapMaybe, Maybe, maybe, maybeToNullable, Nothing } from "../../Data/Maybe";
import { elems, lookup, lookupF, OrderedMap, size, sum } from "../../Data/OrderedMap";
import { OrderedSet } from "../../Data/OrderedSet";
import { fst, Pair, snd } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { SelectionsCantrips } from "../../views/rcp/SelectionsCantrips";
import { SelectionsCombatTechniques } from "../../views/rcp/SelectionsCombatTechniques";
import { SelectionsCurses } from "../../views/rcp/SelectionsCurses";
import { SelectionsLanguagesAndScripts } from "../../views/rcp/SelectionsLanguagesAndScripts";
import { SelectionsSkills } from "../../views/rcp/SelectionsSkills";
import { SelectionsSkillSpecialization } from "../../views/rcp/SelectionsSkillSpecialization";
import { TerrainKnowledge } from "../../views/rcp/SelectionsTerrainKnowledge";
import { LanguagesSelectionListItem } from "../Models/Hero/LanguagesSelectionListItem";
import { ScriptsSelectionListItem } from "../Models/Hero/ScriptsSelectionListItem";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Culture } from "../Models/Wiki/Culture";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { CombatTechniquesSelection } from "../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { LanguagesScriptsSelection } from "../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { ProfessionSelections } from "../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { SkillsSelection } from "../Models/Wiki/professionSelections/SkillsSelection";
import { TerrainKnowledgeSelection } from "../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { SelectOption } from "../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { ProfessionSelectionIds } from "../Models/Wiki/wikiTypeHelpers";
import { findSelectOption } from "./A/Activatable/selectionUtils";
import { translate } from "./I18n";
import { sortRecordsByName } from "./sortBy";
import { getAllWikiEntriesByGroup } from "./WikiUtils";

const { specialAbilities, spells, combatTechniques, cantrips, skills } = WikiModel.A
const { select } = SpecialAbility.A
const { scripts, languages } = Culture.A
const { id, name, cost } = SelectOption.A
const { value } = LanguagesScriptsSelection.A
const { amount, sid } = CombatTechniquesSelection.A
const { gr } = SkillsSelection.A

export const getBuyScriptElement =
  (l10n: L10nRecord) =>
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
                     bindF (flip (findSelectOption)
                                 (listToMaybe (Culture.A.scripts (culture))))
                   )
                   (wiki)

            const selectionItemName =
              fromMaybe ("") (fmap (name) (selectionItem))

            const selectionItemCost =
              fromMaybe (0) (bindF (cost) (selectionItem))

            return (
              <Checkbox
                checked={isBuyingMainScriptEnabled}
                onClick={switchIsBuyingMainScriptEnabled}
                disabled={isAnyLanguageOrScriptSelected}
                >
                {translate (l10n) (L10n.A["rcpselections.labels.buyscript"])}
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
  (l10n: L10nRecord) =>
  (culture: Record<Culture>) =>
  (mainScript: number) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (wikiEntryScripts: Record<SpecialAbility>) =>
    fmap (pipe (
           mapMaybe<Record<SelectOption>, Record<ScriptsSelectionListItem>> (
             pipe (
               id,
               Just,
               findSelectOption (wikiEntryScripts),
               bindF (option => {
                       const optionId = id (option)

                       if (typeof optionId === "number") {
                         const maybeCost = cost (option)

                         if (isJust (maybeCost)) {
                           const native =
                             isBuyingMainScriptEnabled
                             && (
                               !snd (isScriptSelectionNeeded)
                               && pipe (scripts, listToMaybe, elem (optionId))
                                       (culture)
                               || optionId === mainScript
                             )

                           return Just (ScriptsSelectionListItem ({
                             id: optionId,
                             name: name (option),
                             cost: fromJust (maybeCost),
                             native,
                           }))
                         }
                       }

                       return Nothing
                     })
             )
           ),
           sortRecordsByName (L10n.A.id (l10n))
         ))
         (select (wikiEntryScripts))

const getLanguages =
  (l10n: L10nRecord) =>
  (culture: Record<Culture>) =>
  (motherTongue: number) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (wikiEntryLanguages: Record<SpecialAbility>) =>
    fmap (pipe (
           mapMaybe<Record<SelectOption>, Record<LanguagesSelectionListItem>> (
             pipe (
               id,
               Just,
               findSelectOption (wikiEntryLanguages),
               bindF (option => {
                       const optionId = id (option)

                       if (typeof optionId === "number") {
                         const maybeCost = cost (option)

                         if (isJust (maybeCost)) {
                           const native =
                             !isMotherTongueSelectionNeeded
                             && pipe (languages, listToMaybe, elem (optionId))
                                     (culture)
                             || optionId === motherTongue

                           return Just (LanguagesSelectionListItem ({
                             id: optionId,
                             name: name (option),
                             native,
                           }))
                         }
                       }

                       return Nothing
                     })
             )
           ),
           sortRecordsByName (L10n.A.id (l10n))
         ))
         (select (wikiEntryLanguages))

export const getLanguagesAndScriptsElementAndValidation =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (culture: Record<Culture>) =>
  (selected_languages: OrderedMap<number, number>) =>
  (selected_scripts: OrderedMap<number, number>) =>
  (professionSelections: Record<ProfessionSelections>) =>
  (mainScript: number) =>
  (motherTongue: number) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (adjustLanguage: (id: number) => (level: Maybe<number>) => void) =>
  (adjustScript: (id: number) => (ap: number) => void) =>
    join (
      liftM3<
        Record<LanguagesScriptsSelection>,
        Record<SpecialAbility>,
        Record<SpecialAbility>,
        Maybe<Pair<number, JSX.Element>>
      >
        (selection => wikiEntryScripts => wikiEntryLanguages => {
          const maybeScriptsList = getScripts (l10n)
                                              (culture)
                                              (mainScript)
                                              (isBuyingMainScriptEnabled)
                                              (isScriptSelectionNeeded)
                                              (wikiEntryScripts)

          const maybeLanguagesList = getLanguages (l10n)
                                                  (culture)
                                                  (motherTongue)
                                                  (isMotherTongueSelectionNeeded)
                                                  (wikiEntryLanguages)

          return liftM2<
            List<Record<ScriptsSelectionListItem>>,
            List<Record<LanguagesSelectionListItem>>,
            Pair<number, JSX.Element>
          >
            (scriptsList => languagesList => {
              const apLeft =
                value (selection) - sum (selected_languages) * 2 - sum (selected_scripts)

              return Pair.fromBinary (
                apLeft,
                (
                  <SelectionsLanguagesAndScripts
                    scripts={scriptsList}
                    languages={languagesList}
                    scriptsActive={selected_scripts}
                    languagesActive={selected_languages}
                    apTotal={value (selection)}
                    apLeft={apLeft}
                    adjustScript={adjustScript}
                    adjustLanguage={adjustLanguage}
                    locale={l10n}
                    />
                )
              )
            })
            (maybeScriptsList)
            (maybeLanguagesList)
        })
        (ProfessionSelections.A[ProfessionSelectionIds.LANGUAGES_SCRIPTS] (professionSelections))
        (lookupF (specialAbilities (wiki)) ("SA_27"))
        (lookupF (specialAbilities (wiki)) ("SA_29"))
    )

export const getCursesElementAndValidation =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (cursesActive: OrderedMap<string, number>) =>
  (adjustCurse: (id: string) => (maybeOption: Maybe<"add" | "remove">) => void) =>
    pipe (
      ProfessionSelections.A[ProfessionSelectionIds.CURSES],
      fmap (selection => {
             const list =
               sortRecordsByName (L10n.A.id (l10n))
                                 (getAllWikiEntriesByGroup (spells (wiki)) (pure (3)))

             const apLeft = value (selection) - size (cursesActive) - sum (cursesActive) * 2

             return Pair.fromBinary (
               apLeft,
               (
                 <SelectionsCurses
                   list={list}
                   active={cursesActive}
                   apTotal={value (selection)}
                   apLeft={apLeft}
                   change={adjustCurse}
                   locale={l10n}
                   />
               )
             )
           })
    )

export const getCombatTechniquesElementAndValidation =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (combatTechniquesActive: OrderedSet<string>) =>
  (combatTechniquesSecondActive: OrderedSet<string>) =>
  (switchCombatTechnique: (id: string) => void) =>
    pipe (
      ProfessionSelections.A[ProfessionSelectionIds.COMBAT_TECHNIQUES],
      fmap (selection => {
             const list =
               pipe (
                      combatTechniques,
                      elems,
                      filter (pipe (CombatTechnique.A.id, elemF (sid (selection))))
                    )
                    (wiki)

             // fst: isValidSelection
             return Pair.fromBinary (
               OrderedSet.size (combatTechniquesActive) === amount (selection),
               (
                 <SelectionsCombatTechniques
                   list={list}
                   active={combatTechniquesActive}
                   value={value (selection)}
                   amount={amount (selection)}
                   disabled={combatTechniquesSecondActive}
                   change={switchCombatTechnique}
                   locale={l10n}
                   />
               )
             )
           })
    )

export const getCombatTechniquesSecondElementAndValidation =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (combatTechniquesActive: OrderedSet<string>) =>
  (combatTechniquesSecondActive: OrderedSet<string>) =>
  (switchSecondCombatTechnique: (id: string) => void) =>
    pipe (
      ProfessionSelections.A[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND],
      fmap (selection => {
            const list =
              pipe (
                     combatTechniques,
                     elems,
                     filter (pipe (CombatTechnique.A.id, elemF (sid (selection))))
                   )
                   (wiki)

            // fst: isValidSelection
            return Pair.fromBinary (
              OrderedSet.size (combatTechniquesSecondActive) === amount (selection),
              (
                <SelectionsCombatTechniques
                  list={list}
                  active={combatTechniquesSecondActive}
                  value={value (selection)}
                  amount={amount (selection)}
                  disabled={combatTechniquesActive}
                  change={switchSecondCombatTechnique}
                  locale={l10n}
                  />
              )
            )
          })
    )

export const getCantripsElementAndValidation =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (cantripsActive: OrderedSet<string>) =>
  (switchCantrip: (id: string) => void) =>
    pipe (
      ProfessionSelections.A[ProfessionSelectionIds.CANTRIPS],
      fmap (selection => {
            const list =
              pipe (
                    cantrips,
                    elems,
                    filter (pipe (CombatTechnique.A.id, elemF (sid (selection))))
                  )
                  (wiki)

            // fst: isValidSelection
            return Pair.fromBinary (
              OrderedSet.size (cantripsActive) === amount (selection),
              (
                <SelectionsCantrips
                  list={list}
                  active={cantripsActive}
                  num={amount (selection)}
                  change={switchCantrip}
                  locale={l10n}
                  />
              )
            )
          })
    )

export const getSkillSpecializationElement =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (specialization: Pair<Maybe<number>, string>) =>
  (specializationSkillId: Maybe<string>) =>
  (setSpecialization: (value: string | number) => void) =>
  (setSpecializationSkill: (id: string) => void) =>
    pipe (
      ProfessionSelections.A[ProfessionSelectionIds.SPECIALIZATION],
      fmap (selection => (
             <SelectionsSkillSpecialization
               options={selection}
               active={specialization}
               activeId={specializationSkillId}
               change={setSpecialization}
               changeId={setSpecializationSkill}
               locale={l10n}
               skills={skills (wiki)}
               />
           ))
    )

export const getSkillsElementAndValidation =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (skillsActive: OrderedMap<string, number>) =>
  (addSkillPoint: (id: string) => void) =>
  (removeSkillPoint: (id: string) => void) =>
    pipe (
      ProfessionSelections.A[ProfessionSelectionIds.SKILLS],
      fmap (selection => {
            const list =
              maybe<number, List<Record<Skill>>> (elems (skills (wiki)))
                                                 (group =>
                                                   pipe (
                                                     skills,
                                                     elems,
                                                     filter<Record<Skill>>
                                                       (pipe (Skill.A.gr, equals (group)))
                                                   )
                                                   (wiki))
                                                 (gr (selection))

            const apLeft = value (selection) - sum (skillsActive)

            return Pair.fromBinary (
              apLeft,
              (
                <SelectionsSkills
                  active={skillsActive}
                  add={addSkillPoint}
                  gr={gr (selection)}
                  left={apLeft}
                  list={list}
                  remove={removeSkillPoint}
                  value={value (selection)}
                  locale={l10n}
                  />
              )
            )
          })
    )

export const getTerrainKnowledgeElement =
  (wiki: WikiModelRecord) =>
  (terrainKnowledgeActive: Maybe<number>) =>
  (setTerrainKnowledge: (terrainKnowledge: number) => void) =>
    pipe (
      ProfessionSelections.A[ProfessionSelectionIds.TERRAIN_KNOWLEDGE],
      Maybe.liftM2<Record<SpecialAbility>, Record<TerrainKnowledgeSelection>, JSX.Element>
        (wikiEntry => selection => (
          <TerrainKnowledge
            available={TerrainKnowledgeSelection.A.sid (selection)}
            terrainKnowledge={wikiEntry}
            set={setTerrainKnowledge}
            active={terrainKnowledgeActive}
            />
        ))
        (lookupF (specialAbilities (wiki)) ("SA_12"))
    )

export const getMotherTongueSelectionElement =
  (locale: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (culture: Record<Culture>) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (motherTongue: number) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (setMotherTongue: (option: number) => void) =>
    pipe (
           bindF (() => lookupF (specialAbilities (wiki)) ("SA_29")),
           fmap ((wikiEntry: Record<SpecialAbility>) => (
                  <Dropdown
                    hint={translate (locale) (L10n.A["rcpselections.labels.selectnativetongue"])}
                    value={motherTongue}
                    onChangeJust={setMotherTongue}
                    options={
                      Maybe.mapMaybe<number, Record<DropdownOption>>
                        (pipe (
                          Just,
                          findSelectOption (wikiEntry),
                          fmap (option => DropdownOption ({
                                 id: Just (id (option)),
                                 name: name (option),
                               }))
                        ))
                        (languages (culture))
                    }
                    disabled={isAnyLanguageOrScriptSelected}
                    />
                )),
           maybeToNullable
         )
         (guard (isMotherTongueSelectionNeeded))

export const getMainScriptSelectionElement =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (culture: Record<Culture>) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (mainScript: number) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (setMainCulturalLiteracy: (option: number) => void) =>
    pipe (
           bindF (() => lookupF (specialAbilities (wiki)) ("SA_27")),
           fmap ((wikiEntry: Record<SpecialAbility>) => (
                  <Dropdown
                    hint={translate (l10n) (L10n.A["rcpselections.labels.selectscript"])}
                    value={mainScript}
                    onChangeJust={setMainCulturalLiteracy}
                    options={
                      mapMaybe<number, Record<DropdownOption>>
                        (pipe (
                          Just,
                          findSelectOption (wikiEntry),
                          bindF<Record<SelectOption>, Record<DropdownOption>> (
                            option => fmap ((_cost: number) =>
                                             DropdownOption ({
                                               id: Just (id (option)),
                                               name: `${name (option)} (${_cost} AP)`,
                                             }))
                                           (cost (option))
                          )
                        ))
                        (scripts (culture))
                    }
                    disabled={!isBuyingMainScriptEnabled || isAnyLanguageOrScriptSelected}
                    />
                 )),
           maybeToNullable
         )
         (guard (snd (isScriptSelectionNeeded)))
