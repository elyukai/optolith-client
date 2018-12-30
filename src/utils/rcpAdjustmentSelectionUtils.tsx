import { pipe } from 'ramda';
import * as React from 'react';
import { Checkbox } from '../components/Checkbox';
import { Dropdown, DropdownOption } from '../components/Dropdown';
import { LanguagesSelectionListItem, ScriptsSelectionListItem } from '../types/data';
import { SelectionsCantrips } from '../views/rcp/SelectionsCantrips';
import { SelectionsCombatTechniques } from '../views/rcp/SelectionsCombatTechniques';
import { SelectionsCurses } from '../views/rcp/SelectionsCurses';
import { SelectionsLanguagesAndScripts } from '../views/rcp/SelectionsLanguagesAndScripts';
import { SelectionsSkills } from '../views/rcp/SelectionsSkills';
import { SelectionsSkillSpecialization } from '../views/rcp/SelectionsSkillSpecialization';
import { TerrainKnowledge } from '../views/rcp/SelectionsTerrainKnowledge';
import { findSelectOption } from './activatable/selectionUtils';
import { sortObjects } from './FilterSortUtils';
import { translate } from './I18n';
import { flip, ident } from './structures/Function';
import { set } from './structures/Lens';
import { foldl, List } from './structures/List';
import { Just, Maybe, maybe, Nothing } from './structures/Maybe';
import { OrderedMap } from './structures/OrderedMap';
import { OrderedSet } from './structures/OrderedSet';
import { Record } from './structures/Record';
import { Profession } from './wikiData/Profession';
import { isCantripsSelection } from './wikiData/professionSelections/CantripsSelection';
import { isCombatTechniquesSelection } from './wikiData/professionSelections/CombatTechniquesSelection';
import { isCursesSelection } from './wikiData/professionSelections/CursesSelection';
import { isLanguagesScriptsSelection } from './wikiData/professionSelections/LanguagesScriptsSelection';
import { ProfessionSelections, ProfessionSelectionsL } from './wikiData/professionSelections/ProfessionAdjustmentSelections';
import { isRemoveCombatTechniquesSelection } from './wikiData/professionSelections/RemoveCombatTechniquesSelection';
import { isRemoveCombatTechniquesSecondSelection } from './wikiData/professionSelections/RemoveSecondCombatTechniquesSelection';
import { isRemoveSpecializationSelection } from './wikiData/professionSelections/RemoveSpecializationSelection';
import { isSecondCombatTechniquesSelection } from './wikiData/professionSelections/SecondCombatTechniquesSelection';
import { isSkillsSelection } from './wikiData/professionSelections/SkillsSelection';
import { isSpecializationSelection } from './wikiData/professionSelections/SpecializationSelection';
import { ProfessionVariant } from './wikiData/ProfessionVariant';
import { ProfessionSelection, ProfessionSelectionIds, ProfessionVariantSelection } from './wikiData/wikiTypeHelpers';
import { getAllWikiEntriesByGroup } from './WikiUtils';

/**
 * Collects all available RCP adjustment selections in one record
 */
export const getAllAdjustmentSelections =
  (profession: Record<Profession>) =>
  (maybeProfessionVariant: Maybe<Record<ProfessionVariant>>): Record<ProfessionSelections> => {
    const buildRecord = pipe (
      putProfessionSelectionsIntoRecord,
      putProfessionVariantSelectionsIntoRecord (maybeProfessionVariant)
    )

    return buildRecord (profession)
  }

const putProfessionSelectionIntoRecord =
  (acc: Record<ProfessionSelections>) => (current: ProfessionSelection) => {
    if (isSpecializationSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.SPECIALIZATION])
                  (Just (current))
                  (acc)
    }

    if (isLanguagesScriptsSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.LANGUAGES_SCRIPTS])
                  (Just (current))
                  (acc)
    }

    if (isCombatTechniquesSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.COMBAT_TECHNIQUES])
                  (Just (current))
                  (acc)
    }

    if (isSecondCombatTechniquesSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])
                  (Just (current))
                  (acc)
    }

    if (isCantripsSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.CANTRIPS])
                  (Just (current))
                  (acc)
    }

    if (isCursesSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.CURSES])
                  (Just (current))
                  (acc)
    }

    if (isSkillsSelection (current)) {
      return set (ProfessionSelectionsL[ProfessionSelectionIds.SKILLS])
                  (Just (current))
                  (acc)
    }

    return set (ProfessionSelectionsL[ProfessionSelectionIds.TERRAIN_KNOWLEDGE])
                (Just (current))
                (acc)
  }

const putProfessionSelectionsIntoRecord =
  pipe (
    Profession.A.selections,
    foldl<ProfessionSelection, Record<ProfessionSelections>> (putProfessionSelectionIntoRecord)
                                                             (ProfessionSelections ({ }))
  )

const putProfessionVariantSelectionsIntoRecord =
  maybe<
    Record<ProfessionVariant>,
    (x: Record<ProfessionSelections>) => Record<ProfessionSelections>
  >
    (ident)
    (pipe (
      ProfessionVariant.A.selections,
      flip (
        foldl<ProfessionVariantSelection, Record<ProfessionSelections>>
          (
            acc => current => {
              if (isRemoveSpecializationSelection (current)) {
                return set (ProfessionSelectionsL[ProfessionSelectionIds.SPECIALIZATION])
                          (Nothing)
                          (acc)
              }

              if (isRemoveCombatTechniquesSelection (current)) {
                return set (ProfessionSelectionsL[ProfessionSelectionIds.COMBAT_TECHNIQUES])
                          (Nothing)
                          (acc)
              }

              if (isRemoveCombatTechniquesSecondSelection (current)) {
                return set (ProfessionSelectionsL[ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND])
                          (Nothing)
                          (acc)
              }

              return putProfessionSelectionIntoRecord (acc) (current)
            }
          )
      )
    ))


export const getBuyScriptElement =
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (culture: Record<Wiki.Culture>) =>
  (isScriptSelectionNeeded: Tuple<boolean, boolean>) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (switchIsBuyingMainScriptEnabled: () => void) =>
    Tuple.fst (isScriptSelectionNeeded)
      ? Just (
          (() => {
            const selectionItem =
              wiki .get ('specialAbilities')
                .lookup ('SA_27')
                .bind (
                  wikiEntry => findSelectOption (
                    wikiEntry,
                    Just (culture .get ('scripts') .head ())
                  )
                )

            const selectionItemName =
              Maybe.fromMaybe ('')
                              (selectionItem
                                .fmap (Record.get<Wiki.SelectionObject, 'name'> ('name')))

            const selectionItemCost =
              Maybe.fromMaybe (0)
                              (selectionItem
                                .bind (Record.lookup<Wiki.SelectionObject, 'cost'> ('cost')))

            return (
              <Checkbox
                checked={isBuyingMainScriptEnabled}
                onClick={switchIsBuyingMainScriptEnabled}
                disabled={isAnyLanguageOrScriptSelected}
                >
                {translate (locale, 'rcpselections.labels.buyscript')}
                {
                  !Tuple.snd (isScriptSelectionNeeded)
                  && Maybe.isJust (selectionItem)
                  && ` (${selectionItemName}, ${selectionItemCost} AP)`
                }
              </Checkbox>
            )
          }) ()
        )
      : Nothing ()

const getScripts = (locale: UIMessagesObject) =>
  (culture: Record<Wiki.Culture>) =>
    (mainScript: number) =>
      (isBuyingMainScriptEnabled: boolean) =>
        (isScriptSelectionNeeded: Tuple<boolean, boolean>) =>
          (wikiEntryScripts: Record<Wiki.SpecialAbility>) =>
            wikiEntryScripts
              .lookup ('select')
              .fmap (
                pipe (
                  Maybe.mapMaybe (
                    (e): Maybe<Record<ScriptsSelectionListItem>> => {
                      const id = e .get ('id')

                      const maybeOption = findSelectOption (wikiEntryScripts, Just (id))

                      if (Maybe.isJust (maybeOption) && typeof id === 'number') {
                        const option = Maybe.fromJust (maybeOption)

                        const maybeCost = option .lookup ('cost')

                        if (Maybe.isJust (maybeCost)) {
                          const native =
                            isBuyingMainScriptEnabled
                            && (
                              !Tuple.snd (isScriptSelectionNeeded)
                              && Maybe.elem (id)
                                            (Maybe.listToMaybe (culture .get ('scripts')))
                              || id === mainScript
                            )

                          return Just (Record.of<ScriptsSelectionListItem> ({
                            id,
                            name: option .get ('name'),
                            cost: Maybe.fromJust (maybeCost),
                            native,
                          }))
                        }
                      }

                      return Nothing ()
                    }
                  ),
                  list => sortObjects (list, locale .get ('id'))
                )
              )

const getLanguages = (locale: UIMessagesObject) =>
  (culture: Record<Wiki.Culture>) =>
    (motherTongue: number) =>
      (isMotherTongueSelectionNeeded: boolean) =>
        (wikiEntryLanguages: Record<Wiki.SpecialAbility>) =>
          wikiEntryLanguages
            .lookup ('select')
            .fmap (
              pipe (
                Maybe.mapMaybe (
                  (e): Maybe<Record<LanguagesSelectionListItem>> => {
                    const id = e .get ('id')

                    const maybeOption = findSelectOption (wikiEntryLanguages, Just (id))

                    if (Maybe.isJust (maybeOption) && typeof id === 'number') {
                      const option = Maybe.fromJust (maybeOption)

                      const native =
                        !isMotherTongueSelectionNeeded
                        && Maybe.elem (id)
                                      (Maybe.listToMaybe (culture .get ('languages')))
                        || id === motherTongue

                      return Just (Record.of<LanguagesSelectionListItem> ({
                        id,
                        name: option .get ('name'),
                        native,
                      }))
                    }

                    return Nothing ()
                  }
                ),
                list => sortObjects (list, locale .get ('id'))
              )
            )

export const getLanguagesAndScriptsElementAndValidation =
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (culture: Record<Wiki.Culture>) =>
  (languages: OrderedMap<number, number>) =>
  (scripts: OrderedMap<number, number>) =>
  (professionSelections: Record<Wiki.ProfessionAdjustmentSelections>) =>
  (mainScript: number) =>
  (motherTongue: number) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (isScriptSelectionNeeded: Tuple<boolean, boolean>) =>
  (adjustLanguage: (id: number) => (level: Maybe<number>) => void) =>
  (adjustScript: (id: number) => (ap: number) => void) =>
    Maybe.join (
      Maybe.liftM3<
        Record<Wiki.LanguagesScriptsSelection>,
        Record<Wiki.SpecialAbility>,
        Record<Wiki.SpecialAbility>,
        Maybe<Tuple<number, JSX.Element>>
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
            Tuple<number, JSX.Element>
          >
            (scriptsList => languagesList => {
              const value = selection .get ('value')

              const apLeft =
                value - languages .sum () * 2 - scripts .sum ()

              return Tuple.of<number, JSX.Element>
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
        (professionSelections .lookup (Wiki.ProfessionSelectionIds.LANGUAGES_SCRIPTS))
        (wiki .get ('specialAbilities') .lookup ('SA_27'))
        (wiki .get ('specialAbilities') .lookup ('SA_29'))
    )

export const getCursesElementAndValidation =
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (professionSelections: Record<Wiki.ProfessionAdjustmentSelections>) =>
  (cursesActive: OrderedMap<string, number>) =>
  (adjustCurse: (id: string) => (maybeOption: Maybe<'add' | 'remove'>) => void) =>
    professionSelections
      .lookup (Wiki.ProfessionSelectionIds.CURSES)
      .fmap (
        selection => {
          const value = selection .get ('value')

          const list =
            sortObjects (
              getAllWikiEntriesByGroup (wiki .get ('spells'), 3),
              locale .get ('id')
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
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (professionSelections: Record<Wiki.ProfessionAdjustmentSelections>) =>
  (combatTechniquesActive: OrderedSet<string>) =>
  (combatTechniquesSecondActive: OrderedSet<string>) =>
  (switchCombatTechnique: (id: string) => void) =>
    professionSelections
      .lookup (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES)
      .fmap (
        selection => {
          const amount = selection .get ('amount')
          const value = selection .get ('value')
          const sid = selection .get ('sid')

          const list =
            wiki .get ('combatTechniques')
              .elems ()
              .filter (e => sid .elem (e .get ('id')))

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
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (professionSelections: Record<Wiki.ProfessionAdjustmentSelections>) =>
  (combatTechniquesActive: OrderedSet<string>) =>
  (combatTechniquesSecondActive: OrderedSet<string>) =>
  (switchSecondCombatTechnique: (id: string) => void) =>
    professionSelections
      .lookup (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND)
      .fmap (
        selection => {
          const amount = selection .get ('amount')
          const value = selection .get ('value')
          const sid = selection .get ('sid')

          const list =
            wiki .get ('combatTechniques')
              .elems ()
              .filter (e => sid .elem (e .get ('id')))

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
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (professionSelections: Record<Wiki.ProfessionAdjustmentSelections>) =>
  (cantripsActive: OrderedSet<string>) =>
  (switchCantrip: (id: string) => void) =>
    professionSelections
      .lookup (Wiki.ProfessionSelectionIds.CANTRIPS)
      .fmap (
        selection => {
          const amount = selection .get ('amount')
          const sid = selection .get ('sid')

          const list =
            wiki .get ('cantrips')
              .elems ()
              .filter (e => sid .elem (e .get ('id')))

          // Tuple.fst: isValidSelection
          return Tuple.of<boolean, JSX.Element>
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
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (professionSelections: Record<Wiki.ProfessionAdjustmentSelections>) =>
  (specialization: Tuple<Maybe<number>, string>) =>
  (specializationSkillId: Maybe<string>) =>
  (setSpecialization: (value: string | number) => void) =>
  (setSpecializationSkill: (id: string) => void) =>
    professionSelections
      .lookup (Wiki.ProfessionSelectionIds.SPECIALIZATION)
      .fmap (
        selection => (
          <SelectionsSkillSpecialization
            options={selection}
            active={specialization}
            activeId={specializationSkillId}
            change={setSpecialization}
            changeId={setSpecializationSkill}
            locale={locale}
            skills={wiki .get ('skills')}
            />
        )
      )

export const getSkillsElementAndValidation =
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (professionSelections: Record<Wiki.ProfessionAdjustmentSelections>) =>
  (skillsActive: OrderedMap<string, number>) =>
  (addSkillPoint: (id: string) => void) =>
  (removeSkillPoint: (id: string) => void) =>
    professionSelections
      .lookup (Wiki.ProfessionSelectionIds.SKILLS)
      .fmap (
        selection => {
          const value = selection .get ('value')
          const maybeGroup = selection .lookup ('gr')

          const list =
            Maybe.fromMaybe (wiki .get ('skills'))
                            (maybeGroup
                              .fmap (
                                gr => wiki .get ('skills')
                                  .filter (e => e .get ('gr') === gr)
                              ))
                              .elems ()

          const apLeft = value - skillsActive .sum ()

          return Tuple.of<number, JSX.Element>
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
  (wiki: Record<Wiki.WikiAll>) =>
  (professionSelections: Record<Wiki.ProfessionAdjustmentSelections>) =>
  (terrainKnowledgeActive: Maybe<number>) =>
  (setTerrainKnowledge: (terrainKnowledge: number) => void) =>
    Maybe.liftM2<Record<Wiki.TerrainKnowledgeSelection>, Record<Wiki.SpecialAbility>, JSX.Element>
      (selection => wikiEntry => (
        <TerrainKnowledge
          available={selection .get ('sid')}
          terrainKnowledge={wikiEntry}
          set={setTerrainKnowledge}
          active={terrainKnowledgeActive}
          />
      ))
      (professionSelections .lookup (Wiki.ProfessionSelectionIds.TERRAIN_KNOWLEDGE))
      (wiki .get ('specialAbilities') .lookup ('SA_12'))

export const getMotherTongueSelectionElement =
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (culture: Record<Wiki.Culture>) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (motherTongue: number) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (setMotherTongue: (option: number) => void) =>
    Maybe.maybeToReactNode (
      (isMotherTongueSelectionNeeded
        ? wiki .get ('specialAbilities') .lookup ('SA_29')
        : Nothing ())
        .fmap (
          wikiEntry => (
            <Dropdown
              hint={translate (locale, 'rcpselections.labels.selectnativetongue')}
              value={motherTongue}
              onChangeJust={setMotherTongue}
              options={
                Maybe.mapMaybe<number, Record<DropdownOption>>
                  (id => findSelectOption (wikiEntry, Just (id)) as
                    Maybe<Record<DropdownOption>>)
                  (culture .get ('languages'))
              }
              disabled={isAnyLanguageOrScriptSelected}
              />
          )
        )
    )

export const getMainScriptSelectionElement =
  (locale: UIMessagesObject) =>
  (wiki: Record<Wiki.WikiAll>) =>
  (culture: Record<Wiki.Culture>) =>
  (isScriptSelectionNeeded: Tuple<boolean, boolean>) =>
  (mainScript: number) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (setMainCulturalLiteracy: (option: number) => void) =>
    Maybe.maybeToReactNode (
      (Tuple.snd (isScriptSelectionNeeded)
        ? wiki .get ('specialAbilities') .lookup ('SA_27')
        : Nothing ())
        .fmap (
          wikiEntry => (
            <Dropdown
              hint={translate (locale, 'rcpselections.labels.selectscript')}
              value={mainScript}
              onChangeJust={setMainCulturalLiteracy}
              options={
                Maybe.mapMaybe<number, Record<DropdownOption>>
                  (R.pipe (
                    id => findSelectOption (wikiEntry, Just (id)),
                    Maybe.bind_<Record<Wiki.SelectionObject>, Record<DropdownOption>> (
                      option => option .lookup ('cost')
                        .fmap (
                          cost =>
                            option .modify<'name'>
                              (name => `${name} (${cost} AP)`)
                              ('name') as Record<DropdownOption>
                        )
                    )
                  ))
                  (culture .get ('scripts'))
              }
              disabled={!isBuyingMainScriptEnabled || isAnyLanguageOrScriptSelected}
              />
          )
        )
    )
