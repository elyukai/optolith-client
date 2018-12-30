import * as R from 'ramda';
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
import { IdentityFn, List, Maybe, OrderedMap, OrderedSet, Record, Tuple } from './dataUtils';
import { sortObjects } from './FilterSortUtils';
import { translate, UIMessagesObject } from './I18n';
import { Just, Nothing } from './structures/Maybe.new';
import * as Wiki from './wikiData/wikiTypeHelpers';
import { getAllWikiEntriesByGroup } from './WikiUtils';

const isProfessionSpecializationSelection =
  (obj: Wiki.ProfessionSelection): obj is Record<Wiki.SpecializationSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.SPECIALIZATION;

const isProfessionVariantRemoveSpecializationSelection =
  (obj: Wiki.ProfessionVariantSelection): obj is Record<Wiki.RemoveSpecializationSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.SPECIALIZATION
      // `false` explicitly necessary!!! (SpecializationSelection[`active`] === undefined)
      && (obj as Record<Wiki.RemoveSpecializationSelection>) .get ('active') === false;

const isProfessionLanguagesScriptsSelection =
  (obj: Wiki.ProfessionSelection): obj is Record<Wiki.LanguagesScriptsSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.LANGUAGES_SCRIPTS;

const isProfessionCombatTechniquesSelection =
  (obj: Wiki.ProfessionSelection): obj is Record<Wiki.CombatTechniquesSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES;

const isProfessionVariantRemoveCombatTechniquesSelection =
  (obj: Wiki.ProfessionVariantSelection): obj is Record<Wiki.RemoveCombatTechniquesSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES
      // `false` explicitly necessary!!! (CombatTechniquesSelection[`active`] === undefined)
      && (obj as Record<Wiki.RemoveCombatTechniquesSelection>) .get ('active') === false;

const isProfessionSecondCombatTechniquesSelection =
  (obj: Wiki.ProfessionSelection): obj is Record<Wiki.CombatTechniquesSecondSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND;

const isProfessionVariantRemoveSecondCombatTechniquesSelection =
  (obj: Wiki.ProfessionVariantSelection):
    obj is Record<Wiki.RemoveCombatTechniquesSecondSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND
      // `false` explicitly necessary!!! (CombatTechniquesSecondSelection[`active`] === undefined)
      && (obj as Record<Wiki.RemoveCombatTechniquesSecondSelection>) .get ('active') === false;

const isProfessionCantripsSelection =
  (obj: Wiki.ProfessionSelection): obj is Record<Wiki.CantripsSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.CANTRIPS;

const isProfessionCursesSelection =
  (obj: Wiki.ProfessionSelection): obj is Record<Wiki.CursesSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.CURSES;

const isProfessionSkillsSelection =
  (obj: Wiki.ProfessionSelection): obj is Record<Wiki.SkillsSelection> =>
    (obj .get ('id') as Wiki.ProfessionSelectionIds)
      === Wiki.ProfessionSelectionIds.SKILLS;

/**
 * Collects all available RCP adjustment selections in one record
 */
export const getAllAdjustmentSelections =
  (profession: Record<Wiki.Profession>) =>
    (maybeProfessionVariant: Maybe<Record<Wiki.ProfessionVariant>>):
      Record<Wiki.ProfessionAdjustmentSelections> => {
      const base = Record.empty<Wiki.ProfessionAdjustmentSelections> ();

      const buildRecord = R.pipe (
        profession .get ('selections') .foldl<Record<Wiki.ProfessionAdjustmentSelections>> (
          acc => current => {
            if (isProfessionSpecializationSelection (current)) {
              return acc .insert (Wiki.ProfessionSelectionIds.SPECIALIZATION) (current);
            }

            if (isProfessionLanguagesScriptsSelection (current)) {
              return acc .insert (Wiki.ProfessionSelectionIds.LANGUAGES_SCRIPTS) (current);
            }

            if (isProfessionCombatTechniquesSelection (current)) {
              return acc .insert (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES) (current);
            }

            if (isProfessionSecondCombatTechniquesSelection (current)) {
              return acc .insert (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND) (current);
            }

            if (isProfessionCantripsSelection (current)) {
              return acc .insert (Wiki.ProfessionSelectionIds.CANTRIPS) (current);
            }

            if (isProfessionCursesSelection (current)) {
              return acc .insert (Wiki.ProfessionSelectionIds.CURSES) (current);
            }

            if (isProfessionSkillsSelection (current)) {
              return acc .insert (Wiki.ProfessionSelectionIds.SKILLS) (current);
            }

            return acc .insert (Wiki.ProfessionSelectionIds.TERRAIN_KNOWLEDGE) (current);
          }
        ),
        Maybe.maybe<
          Record<Wiki.ProfessionVariant>,
          IdentityFn<Record<Wiki.ProfessionAdjustmentSelections>>
        >
          (R.identity)
          (professionVariant => professionVariant .get ('selections') .foldl (
            acc => current => {
              if (isProfessionVariantRemoveSpecializationSelection (current)) {
                return acc .insertMaybe (Wiki.ProfessionSelectionIds.SPECIALIZATION) (Nothing ());
              }

              if (isProfessionVariantRemoveCombatTechniquesSelection (current)) {
                return acc .insertMaybe (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES)
                                        (Nothing ());
              }

              if (isProfessionVariantRemoveSecondCombatTechniquesSelection (current)) {
                return acc .insertMaybe (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND)
                                        (Nothing ());
              }

              if (isProfessionSpecializationSelection (current)) {
                return acc .insert (Wiki.ProfessionSelectionIds.SPECIALIZATION) (current);
              }

              if (isProfessionLanguagesScriptsSelection (current)) {
                return acc .insert (Wiki.ProfessionSelectionIds.LANGUAGES_SCRIPTS) (current);
              }

              if (isProfessionCombatTechniquesSelection (current)) {
                return acc .insert (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES) (current);
              }

              if (isProfessionSecondCombatTechniquesSelection (current)) {
                return acc .insert (Wiki.ProfessionSelectionIds.COMBAT_TECHNIQUES_SECOND) (current);
              }

              if (isProfessionCantripsSelection (current)) {
                return acc .insert (Wiki.ProfessionSelectionIds.CANTRIPS) (current);
              }

              if (isProfessionCursesSelection (current)) {
                return acc .insert (Wiki.ProfessionSelectionIds.CURSES) (current);
              }

              if (isProfessionSkillsSelection (current)) {
                return acc .insert (Wiki.ProfessionSelectionIds.SKILLS) (current);
              }

              return acc .insert (Wiki.ProfessionSelectionIds.TERRAIN_KNOWLEDGE) (current);
            }
          ))
          (maybeProfessionVariant)
      );

      return buildRecord (base);
    };

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
                );

            const selectionItemName =
              Maybe.fromMaybe ('')
                              (selectionItem
                                .fmap (Record.get<Wiki.SelectionObject, 'name'> ('name')));

            const selectionItemCost =
              Maybe.fromMaybe (0)
                              (selectionItem
                                .bind (Record.lookup<Wiki.SelectionObject, 'cost'> ('cost')));

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
            );
          }) ()
        )
      : Nothing ();

const getScripts = (locale: UIMessagesObject) =>
  (culture: Record<Wiki.Culture>) =>
    (mainScript: number) =>
      (isBuyingMainScriptEnabled: boolean) =>
        (isScriptSelectionNeeded: Tuple<boolean, boolean>) =>
          (wikiEntryScripts: Record<Wiki.SpecialAbility>) =>
            wikiEntryScripts
              .lookup ('select')
              .fmap (
                R.pipe (
                  Maybe.mapMaybe (
                    (e): Maybe<Record<ScriptsSelectionListItem>> => {
                      const id = e .get ('id');

                      const maybeOption = findSelectOption (wikiEntryScripts, Just (id));

                      if (Maybe.isJust (maybeOption) && typeof id === 'number') {
                        const option = Maybe.fromJust (maybeOption);

                        const maybeCost = option .lookup ('cost');

                        if (Maybe.isJust (maybeCost)) {
                          const native =
                            isBuyingMainScriptEnabled
                            && (
                              !Tuple.snd (isScriptSelectionNeeded)
                              && Maybe.elem (id)
                                            (Maybe.listToMaybe (culture .get ('scripts')))
                              || id === mainScript
                            );

                          return Just (Record.of<ScriptsSelectionListItem> ({
                            id,
                            name: option .get ('name'),
                            cost: Maybe.fromJust (maybeCost),
                            native,
                          }));
                        }
                      }

                      return Nothing ();
                    }
                  ),
                  list => sortObjects (list, locale .get ('id'))
                )
              );

const getLanguages = (locale: UIMessagesObject) =>
  (culture: Record<Wiki.Culture>) =>
    (motherTongue: number) =>
      (isMotherTongueSelectionNeeded: boolean) =>
        (wikiEntryLanguages: Record<Wiki.SpecialAbility>) =>
          wikiEntryLanguages
            .lookup ('select')
            .fmap (
              R.pipe (
                Maybe.mapMaybe (
                  (e): Maybe<Record<LanguagesSelectionListItem>> => {
                    const id = e .get ('id');

                    const maybeOption = findSelectOption (wikiEntryLanguages, Just (id));

                    if (Maybe.isJust (maybeOption) && typeof id === 'number') {
                      const option = Maybe.fromJust (maybeOption);

                      const native =
                        !isMotherTongueSelectionNeeded
                        && Maybe.elem (id)
                                      (Maybe.listToMaybe (culture .get ('languages')))
                        || id === motherTongue;

                      return Just (Record.of<LanguagesSelectionListItem> ({
                        id,
                        name: option .get ('name'),
                        native,
                      }));
                    }

                    return Nothing ();
                  }
                ),
                list => sortObjects (list, locale .get ('id'))
              )
            );

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
                                              (wikiEntryScripts);

          const maybeLanguagesList = getLanguages (locale)
                                                  (culture)
                                                  (motherTongue)
                                                  (isMotherTongueSelectionNeeded)
                                                  (wikiEntryLanguages);

          return Maybe.liftM2<
            List<Record<ScriptsSelectionListItem>>,
            List<Record<LanguagesSelectionListItem>>,
            Tuple<number, JSX.Element>
          >
            (scriptsList => languagesList => {
              const value = selection .get ('value');

              const apLeft =
                value - languages .sum () * 2 - scripts .sum ();

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
                );
            })
            (maybeScriptsList)
            (maybeLanguagesList);
        })
        (professionSelections .lookup (Wiki.ProfessionSelectionIds.LANGUAGES_SCRIPTS))
        (wiki .get ('specialAbilities') .lookup ('SA_27'))
        (wiki .get ('specialAbilities') .lookup ('SA_29'))
    );

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
          const value = selection .get ('value');

          const list =
            sortObjects (
              getAllWikiEntriesByGroup (wiki .get ('spells'), 3),
              locale .get ('id')
            );

          const apLeft = value - cursesActive .size () - cursesActive .sum () * 2;

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
            );
        }
      );

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
          const amount = selection .get ('amount');
          const value = selection .get ('value');
          const sid = selection .get ('sid');

          const list =
            wiki .get ('combatTechniques')
              .elems ()
              .filter (e => sid .elem (e .get ('id')));

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
            );
        }
      );

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
          const amount = selection .get ('amount');
          const value = selection .get ('value');
          const sid = selection .get ('sid');

          const list =
            wiki .get ('combatTechniques')
              .elems ()
              .filter (e => sid .elem (e .get ('id')));

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
            );
        }
      );

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
          const amount = selection .get ('amount');
          const sid = selection .get ('sid');

          const list =
            wiki .get ('cantrips')
              .elems ()
              .filter (e => sid .elem (e .get ('id')));

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
            );
        }
      );

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
      );

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
          const value = selection .get ('value');
          const maybeGroup = selection .lookup ('gr');

          const list =
            Maybe.fromMaybe (wiki .get ('skills'))
                            (maybeGroup
                              .fmap (
                                gr => wiki .get ('skills')
                                  .filter (e => e .get ('gr') === gr)
                              ))
                              .elems ();

          const apLeft = value - skillsActive .sum ();

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
            );
        }
      );

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
      (wiki .get ('specialAbilities') .lookup ('SA_12'));

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
    );

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
    );
