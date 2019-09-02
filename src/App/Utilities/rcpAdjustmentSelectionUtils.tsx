import * as React from "react";
import { equals } from "../../Data/Eq";
import { flip } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { any, elemF, filter, List } from "../../Data/List";
import { bindF, elem, ensure, fromJust, fromMaybe, guard, isJust, join, Just, liftM2, liftM3, listToMaybe, mapMaybe, Maybe, maybe, maybeToNullable, Nothing } from "../../Data/Maybe";
import { elems, lookup, lookupF, OrderedMap, size, sum } from "../../Data/OrderedMap";
import { OrderedSet } from "../../Data/OrderedSet";
import { Record } from "../../Data/Record";
import { fst, Pair, snd } from "../../Data/Tuple";
import { LanguagesSelectionListItem } from "../Models/Hero/LanguagesSelectionListItem";
import { Rules } from "../Models/Hero/Rules";
import { ScriptsSelectionListItem } from "../Models/Hero/ScriptsSelectionListItem";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { CombatTechnique } from "../Models/Wiki/CombatTechnique";
import { Culture } from "../Models/Wiki/Culture";
import { L10nRecord } from "../Models/Wiki/L10n";
import { ProfessionRequireActivatable } from "../Models/Wiki/prerequisites/ActivatableRequirement";
import { Profession } from "../Models/Wiki/Profession";
import { CantripsSelection } from "../Models/Wiki/professionSelections/CantripsSelection";
import { CombatTechniquesSelection } from "../Models/Wiki/professionSelections/CombatTechniquesSelection";
import { CursesSelection } from "../Models/Wiki/professionSelections/CursesSelection";
import { LanguagesScriptsSelection } from "../Models/Wiki/professionSelections/LanguagesScriptsSelection";
import { ProfessionSelections } from "../Models/Wiki/professionSelections/ProfessionAdjustmentSelections";
import { CombatTechniquesSecondSelection } from "../Models/Wiki/professionSelections/SecondCombatTechniquesSelection";
import { SkillsSelection } from "../Models/Wiki/professionSelections/SkillsSelection";
import { SpecializationSelection } from "../Models/Wiki/professionSelections/SpecializationSelection";
import { TerrainKnowledgeSelection } from "../Models/Wiki/professionSelections/TerrainKnowledgeSelection";
import { Skill } from "../Models/Wiki/Skill";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell } from "../Models/Wiki/Spell";
import { SelectOption } from "../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { ProfessionPrerequisite, ProfessionSelectionIds } from "../Models/Wiki/wikiTypeHelpers";
import { SelectionsCantrips } from "../Views/RCPOptionSelections/SelectionsCantrips";
import { SelectionsCombatTechniques } from "../Views/RCPOptionSelections/SelectionsCombatTechniques";
import { SelectionsCurses } from "../Views/RCPOptionSelections/SelectionsCurses";
import { SelectionsLanguagesAndScripts } from "../Views/RCPOptionSelections/SelectionsLanguagesAndScripts";
import { SelectionsSkills } from "../Views/RCPOptionSelections/SelectionsSkills";
import { SelectionsSkillSpecialization } from "../Views/RCPOptionSelections/SelectionsSkillSpecialization";
import { TerrainKnowledge } from "../Views/RCPOptionSelections/SelectionsTerrainKnowledge";
import { Checkbox } from "../Views/Universal/Checkbox";
import { Dropdown, DropdownOption } from "../Views/Universal/Dropdown";
import { findSelectOption } from "./Activatable/selectionUtils";
import { translate } from "./I18n";
import { prefixSA } from "./IDUtils";
import { pipe, pipe_ } from "./pipe";
import { filterByAvailability, isAvailable } from "./RulesUtils";
import { sortRecordsByName } from "./sortBy";
import { getAllWikiEntriesByGroup } from "./WikiUtils";

const WA = WikiModel.A
const SAA = SpecialAbility.A
const CA = Culture.A
const PA = Profession.A
const SA = Spell.A
const SOA = SelectOption.A
const LSSA = LanguagesScriptsSelection.A
const CTSA = CombatTechniquesSelection.A
const CTSSA = CombatTechniquesSecondSelection.A
const CSA = CursesSelection.A
const CaSA = CantripsSelection.A
const SSA = SkillsSelection.A

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
                     WA.specialAbilities,
                     lookup ("SA_27"),
                     bindF (flip (findSelectOption)
                                 (listToMaybe (Culture.AL.scripts (culture))))
                   )
                   (wiki)

            const selectionItemName =
              fromMaybe ("") (fmap (SOA.name) (selectionItem))

            const selectionItemCost =
              fromMaybe (0) (bindF (SOA.cost) (selectionItem))

            return (
              <Checkbox
                checked={isBuyingMainScriptEnabled}
                onClick={switchIsBuyingMainScriptEnabled}
                disabled={isAnyLanguageOrScriptSelected}
                >
                {translate (l10n) ("buyscript")}
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
  (wiki: WikiModelRecord) =>
  (rules: Record<Rules>) =>
  (culture: Record<Culture>) =>
  (mainScript: number) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (wikiEntryScripts: Record<SpecialAbility>) => {
    const isSOAvailable = isAvailable (SOA.src) (Pair (WA.books (wiki), rules))

    return fmap (pipe (
                  mapMaybe (
                    pipe (
                      SOA.id,
                      Just,
                      findSelectOption (wikiEntryScripts),
                      bindF (option => {
                              const optionId = SOA.id (option)

                              if (typeof optionId === "number" && isSOAvailable (option)) {
                                const maybeCost = SOA.cost (option)

                                if (isJust (maybeCost)) {
                                  const native =
                                    isBuyingMainScriptEnabled
                                    && (
                                      !snd (isScriptSelectionNeeded)
                                      && pipe (CA.scripts, listToMaybe, elem (optionId))
                                              (culture)
                                      || optionId === mainScript
                                    )

                                  return Just (ScriptsSelectionListItem ({
                                    id: optionId,
                                    name: SOA.name (option),
                                    cost: fromJust (maybeCost),
                                    native,
                                  }))
                                }
                              }

                              return Nothing
                            })
                    )
                  ),
                  sortRecordsByName (l10n)
                ))
                (SAA.select (wikiEntryScripts))
  }

const getLanguages =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (rules: Record<Rules>) =>
  (culture: Record<Culture>) =>
  (motherTongue: number) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (wikiEntryLanguages: Record<SpecialAbility>) => {
    const isSOAvailable = isAvailable (SOA.src) (Pair (WA.books (wiki), rules))

    return fmapF (SAA.select (wikiEntryLanguages))
                 (pipe (
                   mapMaybe (option => {
                              const optionId = SOA.id (option)

                              if (typeof optionId === "number" && isSOAvailable (option)) {
                                const native =
                                  !isMotherTongueSelectionNeeded
                                  && pipe (CA.languages, listToMaybe, elem (optionId))
                                          (culture)
                                  || optionId === motherTongue

                                return Just (LanguagesSelectionListItem ({
                                  id: optionId,
                                  name: SOA.name (option),
                                  native,
                                }))
                              }

                              return Nothing
                            }),
                   sortRecordsByName (l10n)
                 ))
  }

export const getLanguagesAndScriptsElementAndValidation =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (rules: Record<Rules>) =>
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
                                              (wiki)
                                              (rules)
                                              (culture)
                                              (mainScript)
                                              (isBuyingMainScriptEnabled)
                                              (isScriptSelectionNeeded)
                                              (wikiEntryScripts)

          const maybeLanguagesList = getLanguages (l10n)
                                                  (wiki)
                                                  (rules)
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
                LSSA.value (selection) - sum (selected_languages) * 2 - sum (selected_scripts)

              return Pair (
                apLeft,
                (
                  <SelectionsLanguagesAndScripts
                    scripts={scriptsList}
                    languages={languagesList}
                    scriptsActive={selected_scripts}
                    languagesActive={selected_languages}
                    apTotal={LSSA.value (selection)}
                    apLeft={apLeft}
                    adjustScript={adjustScript}
                    adjustLanguage={adjustLanguage}
                    l10n={l10n}
                    />
                )
              )
            })
            (maybeScriptsList)
            (maybeLanguagesList)
        })
        (ProfessionSelections.AL[ProfessionSelectionIds.LANGUAGES_SCRIPTS] (professionSelections))
        (lookupF (WA.specialAbilities (wiki)) ("SA_27"))
        (lookupF (WA.specialAbilities (wiki)) ("SA_29"))
    )

export const getCursesElementAndValidation =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (rules: Record<Rules>) =>
  (cursesActive: OrderedMap<string, number>) =>
  (adjustCurse: (id: string) => (maybeOption: Maybe<"add" | "remove">) => void) =>
    pipe (
      ProfessionSelections.AL[ProfessionSelectionIds.CURSES],
      fmap (selection => {
             const list =
               pipe_ (
                 getAllWikiEntriesByGroup (WA.spells (wiki)) (List (3)),
                 filterByAvailability (SA.src) (Pair (WA.books (wiki), rules)),
                 sortRecordsByName (l10n)
               )

             const apLeft = CSA.value (selection) - (size (cursesActive) + sum (cursesActive)) * 2

             return Pair (
               apLeft,
               (
                 <SelectionsCurses
                   list={list}
                   active={cursesActive}
                   apTotal={CSA.value (selection)}
                   apLeft={apLeft}
                   change={adjustCurse}
                   l10n={l10n}
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
                      WA.combatTechniques,
                      elems,
                      filter (pipe (CombatTechnique.A.id, elemF (CTSA.sid (selection))))
                    )
                    (wiki)

             // fst: isValidSelection
             return Pair (
               OrderedSet.size (combatTechniquesActive) === CTSA.amount (selection),
               (
                 <SelectionsCombatTechniques
                   list={list}
                   active={combatTechniquesActive}
                   value={CTSA.value (selection)}
                   amount={CTSA.amount (selection)}
                   disabled={combatTechniquesSecondActive}
                   change={switchCombatTechnique}
                   l10n={l10n}
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
      ProfessionSelections.AL[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND],
      fmap (selection => {
            const list =
              pipe (
                     WA.combatTechniques,
                     elems,
                     filter (pipe (CombatTechnique.A.id, elemF (CTSSA.sid (selection))))
                   )
                   (wiki)

            // fst: isValidSelection
            return Pair (
              OrderedSet.size (combatTechniquesSecondActive) === CTSSA.amount (selection),
              (
                <SelectionsCombatTechniques
                  list={list}
                  active={combatTechniquesSecondActive}
                  value={CTSSA.value (selection)}
                  amount={CTSSA.amount (selection)}
                  disabled={combatTechniquesActive}
                  change={switchSecondCombatTechnique}
                  l10n={l10n}
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
              pipe_ (
                wiki,
                WA.cantrips,
                elems,
                filter (pipe (Cantrip.A.id, elemF (CaSA.sid (selection))))
              )

            // fst: isValidSelection
            return Pair (
              OrderedSet.size (cantripsActive) === CaSA.amount (selection),
              (
                <SelectionsCantrips
                  list={list}
                  active={cantripsActive}
                  num={CaSA.amount (selection)}
                  change={switchCantrip}
                  l10n={l10n}
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
      bindF (ensure (SpecializationSelection.is)),
      fmap (selection => (
             <SelectionsSkillSpecialization
               options={selection}
               active={specialization}
               activeId={specializationSkillId}
               change={setSpecialization}
               changeId={setSpecializationSkill}
               l10n={l10n}
               skills={WA.skills (wiki)}
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
      ProfessionSelections.AL[ProfessionSelectionIds.SKILLS],
      fmap (selection => {
            const list =
              maybe (elems (WA.skills (wiki)))
                    ((group: number) =>
                      pipe (
                        WA.skills,
                        elems,
                        filter<Record<Skill>>
                          (pipe (Skill.AL.gr, equals (group)))
                      )
                      (wiki))
                    (SSA.gr (selection))

            const apLeft = SSA.value (selection) - sum (skillsActive)

            return Pair (
              apLeft,
              (
                <SelectionsSkills
                  active={skillsActive}
                  add={addSkillPoint}
                  gr={SSA.gr (selection)}
                  left={apLeft}
                  list={list}
                  remove={removeSkillPoint}
                  value={SSA.value (selection)}
                  l10n={l10n}
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
      ProfessionSelections.AL[ProfessionSelectionIds.TERRAIN_KNOWLEDGE],
      Maybe.liftM2<Record<SpecialAbility>, Record<TerrainKnowledgeSelection>, JSX.Element>
        (wikiEntry => selection => (
          <TerrainKnowledge
            available={TerrainKnowledgeSelection.AL.sid (selection)}
            terrainKnowledge={wikiEntry}
            set={setTerrainKnowledge}
            active={terrainKnowledgeActive}
            />
        ))
        (lookupF (WA.specialAbilities (wiki)) ("SA_12"))
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
           bindF (() => lookupF (WA.specialAbilities (wiki)) ("SA_29")),
           fmap ((wikiEntry: Record<SpecialAbility>) => (
                  <Dropdown
                    hint={translate (locale) ("selectnativetongue")}
                    value={motherTongue}
                    onChangeJust={setMotherTongue}
                    options={
                      Maybe.mapMaybe<number, Record<DropdownOption>>
                        (pipe (
                          Just,
                          findSelectOption (wikiEntry),
                          fmap (option => DropdownOption ({
                                 id: Just (SOA.id (option)),
                                 name: SOA.name (option),
                               }))
                        ))
                        (CA.languages (culture))
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
           bindF (() => lookupF (WA.specialAbilities (wiki)) ("SA_27")),
           fmap ((wikiEntry: Record<SpecialAbility>) => (
                  <Dropdown
                    hint={translate (l10n) ("selectscript")}
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
                                               id: Just (SOA.id (option)),
                                               name: `${SOA.name (option)} (${_cost} AP)`,
                                             }))
                                           (SOA.cost (option))
                          )
                        ))
                        (CA.scripts (culture))
                    }
                    disabled={!isBuyingMainScriptEnabled || isAnyLanguageOrScriptSelected}
                    />
                 )),
           maybeToNullable
         )
         (guard (snd (isScriptSelectionNeeded)))

export const getGuildMageUnfamiliarSpellSelectionElement =
  (l10n: L10nRecord) =>
  (mspells: Maybe<List<Record<DropdownOption>>>) =>
  (selected: Maybe<string>) =>
  (setGuildMageUnfamiliarSpell: (id: string) => void) =>
  (profession: Record<Profession>) =>
    any ((x: ProfessionPrerequisite) => ProfessionRequireActivatable.is (x)
                                        && ProfessionRequireActivatable.A.id (x) === prefixSA (70))
        (PA.prerequisites (profession))
      ? fmapF (mspells)
              (spells => (
                <div className="unfamiliar-spell">
                  <h4>{translate (l10n) ("unfamiliarspellselectionfortraditionguildmage")}</h4>
                  <Dropdown<string | number>
                    hint={translate (l10n) ("selectaspell")}
                    value={selected}
                    onChangeJust={setGuildMageUnfamiliarSpell}
                    options={spells}
                    />
                </div>
              ))
      : Nothing
