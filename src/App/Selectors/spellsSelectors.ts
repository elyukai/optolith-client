import * as R from 'ramda';
import { ActivatableDependent, ActivatableSkillDependent } from '../App/Models/Hero/heroTypeHelpers';
import { CantripCombined, SpellIsActive, SpellWithRequirements } from '../App/Models/View/viewTypeHelpers';
import { ExperienceLevel, Spell } from '../App/Models/Wiki/wikiTypeHelpers';
import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { isDecreasable, isIncreasable, isOwnTradition } from '../App/Utils/Increasable/spellUtils';
import { filterByAvailability } from '../App/Utils/RulesUtils';
import { mapGetToMaybeSlice } from '../App/Utils/SelectorsUtils';
import { getModifierByActiveLevel } from '../utils/activatable/activatableModifierUtils';
import { getMagicalTraditions } from '../utils/activatable/traditionUtils';
import { Just, List, Maybe, OrderedMap, Record, Tuple } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects, sortObjects } from '../utils/FilterSortUtils';
import { validatePrerequisites } from '../utils/prerequisites/validatePrerequisitesUtils';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getSpellsSortOptions } from './sortOptionsSelectors';
import { getAdvantages, getCantrips, getCurrentHeroPresent, getDisadvantages, getInactiveSpellsFilterText, getLocaleAsProp, getPhase, getSpecialAbilities, getSpells, getSpellsFilterText, getWiki, getWikiCantrips, getWikiSpecialAbilities, getWikiSpells } from './stateSelectors';
import { getEnableActiveItemHints } from './uisettingsSelectors';

export const getMagicalTraditionsFromState = createMaybeSelector (
  getSpecialAbilities,
  Maybe.fmap (getMagicalTraditions)
);

export const getMagicalTraditionsFromWikiState = createMaybeSelector (
  getMagicalTraditionsFromState,
  getWikiSpecialAbilities,
  (maybeTraditions, specialAbilities) => maybeTraditions.fmap (
    Maybe.mapMaybe (
      tradition => specialAbilities.lookup (tradition.get ('id'))
    )
  )
);

export const getIsSpellsTabAvailable = createMaybeSelector (
  getMagicalTraditionsFromState,
  R.pipe (
    Maybe.fmap (R.pipe (List.null, R.not)),
    Maybe.elem (true)
  )
);

const getActiveSpellsCombined = createMaybeSelector (
  getSpells,
  getWikiSpells,
  (maybeSpells, wikiSpells) => maybeSpells
    .fmap (OrderedMap.elems)
    .fmap (
      Maybe.mapMaybe (
        e => R.pipe (
          Maybe.ensure<Record<ActivatableSkillDependent>> (
            Record.get<ActivatableSkillDependent, 'active'> ('active')
          ),
          Maybe.then_ (wikiSpells.lookup (e.get ('id'))),
          Maybe.fmap (Record.merge (e))
        ) (e)
      )
    )
);

const getUnfilteredInactiveSpells = createMaybeSelector (
  getActiveSpellsCombined,
  getWikiSpells,
  (maybeActiveSpells, wikiSpells) => maybeActiveSpells.fmap (
    activeSpells => OrderedMap.mapMaybe<string, Record<Spell>, Record<SpellIsActive>>
      (R.pipe (
        Maybe.ensure (
          wikiSpell => activeSpells.all (
            spell => spell.get ('id') !== wikiSpell.get ('id')
          )
        ),
        Maybe.fmap (Record.merge (Record.of ({ active: false })))
      ))
      (wikiSpells)
  )
);

export const getAreMaxUnfamiliar = createMaybeSelector (
  getPhase,
  getStartEl,
  getActiveSpellsCombined,
  getMagicalTraditionsFromWikiState,
  (phase, maybeStartEl, maybeSpells, maybeTraditions) => {
    if (phase.gt (Just (2))) {
      return false;
    }

    return Maybe.fromMaybe (true) (
      maybeTraditions.bind (
        traditions => maybeStartEl.bind (
          startEl => maybeSpells.fmap (
            spells => {
              const max = startEl.get ('maxUnfamiliarSpells');

              const unfamiliarSpells = spells
                .filter (
                  spell => spell.get ('gr') < 3
                    && spell.get ('active')
                    && !isOwnTradition (traditions, spell as any as Record<Spell>)
                )
                .length ();

              return unfamiliarSpells >= max;
            }
          )
        )
      )
    );
  }
);

export const getActiveSpellsCounter = createMaybeSelector (
  getActiveSpellsCombined,
  maybeSpells =>
    maybeSpells.fmap (
      spells => spells
        .filter (entry => entry.get ('active') && [1, 2].includes (entry.get ('gr')))
        .length ()
    )
);

export const getIsMaximumOfSpellsReached = createMaybeSelector (
  getPhase,
  getStartEl,
  getActiveSpellsCounter,
  (phase, maybeStartEl, maybeActiveSpellsCounter) => {
    if (phase.gt (Just (3))) {
      return false;
    }

    return Maybe.fromMaybe (true) (
      maybeActiveSpellsCounter.bind (
        counter => maybeStartEl.fmap (
          startEl => counter >= startEl.get ('maxSpellsLiturgies')
        )
      )
    );
  }
);

export const getActiveAndInctiveCantrips = createMaybeSelector (
  getCantrips,
  getWikiCantrips,
  (maybeCantrips, wikiCantrips) => maybeCantrips .fmap (
    cantrips => wikiCantrips
      .elems ()
      .map<Record<CantripCombined>> (
        e => e .merge (Record.of ({ active: cantrips .member (e .get ('id')) }))
      )
      .partition (Record.get<CantripCombined, 'active'> ('active'))
  )
);

export const getActiveCantrips = createMaybeSelector (
  getActiveAndInctiveCantrips,
  Maybe.fmap (Tuple.fst)
);

export const getInactiveCantrips = createMaybeSelector (
  getActiveAndInctiveCantrips,
  Maybe.fmap (Tuple.snd)
);

/**
 * `Tuple.fst InactiveSpells` are valid spells, `Tuple.snd InactiveSpells` are
 * invalid spells concerning the current tradition(s) and general state.
 */
export type InactiveSpells = Tuple<List<Record<SpellIsActive>>, List<Record<SpellIsActive>>>;

const emptyInactiveSpells: InactiveSpells = (
  Tuple.of<List<Record<SpellIsActive>>, List<Record<SpellIsActive>>> (List.of ()) (List.of ())
);

export const getInactiveSpells = createMaybeSelector (
  getUnfilteredInactiveSpells,
  getAreMaxUnfamiliar,
  getIsMaximumOfSpellsReached,
  getCurrentHeroPresent,
  getMagicalTraditionsFromState,
  getMagicalTraditionsFromWikiState,
  getWiki,
  (
    maybeUnfilteredInactiveSpells,
    areMaxUnfamiliar,
    isMaximumOfSpellsReached,
    maybeHero,
    maybeStateTraditions,
    maybeTraditions,
    wiki
  ) => maybeHero.bind (
    hero => maybeTraditions.bind (
      traditions => maybeStateTraditions.bind (
        stateTraditions =>
          maybeUnfilteredInactiveSpells.fmap<InactiveSpells> (
            unfilteredInactiveSpells => {
              if (traditions.null ()) {
                return emptyInactiveSpells;
              }

              const lastTraditionId = Maybe.listToMaybe (traditions)
                .fmap (tradition => tradition.get ('id'));

              const validateSpellPrerequisites = (entry: Record<SpellIsActive>) =>
                validatePrerequisites (wiki, hero, entry.get ('prerequisites'), entry.get ('id'));

              if (Maybe.elem ('SA_679') (lastTraditionId)) {
                return unfilteredInactiveSpells.elems ()
                  .partition (
                    entry => entry.get ('gr') < 3
                      && !isMaximumOfSpellsReached
                      && validateSpellPrerequisites (entry)
                      && (
                        isOwnTradition (traditions, entry as unknown as Record<Spell>)
                        || !areMaxUnfamiliar
                      )
                  );
              }

              if (
                Maybe.elem ('SA_677') (lastTraditionId)
                || Maybe.elem ('SA_678') (lastTraditionId)
              ) {
                return Maybe.fromMaybe (emptyInactiveSpells) (
                  Maybe.listToMaybe (stateTraditions)
                    .fmap (tradition => tradition.get ('active'))
                    .bind (Maybe.listToMaybe)
                    .bind (active => active.lookup ('sid'))
                    .fmap (
                      subTradition => unfilteredInactiveSpells.elems ()
                        .partition (
                          entry => entry.get ('subtradition').elem (subTradition as number)
                        )
                    )
                );
              }

              return unfilteredInactiveSpells.elems ()
                .partition (
                  entry => (!isMaximumOfSpellsReached || entry.get ('gr') > 2)
                    && validateSpellPrerequisites (entry)
                    && (
                      isOwnTradition (traditions, entry as unknown as Record<Spell>)
                      || (entry.get ('gr') < 3 && !areMaxUnfamiliar)
                    )
                );
            }
          )
      )
    )
  )
);

export const getActiveSpells = createMaybeSelector (
  getActiveSpellsCombined,
  getStartEl,
  getCurrentHeroPresent,
  mapGetToMaybeSlice (getAdvantages, 'ADV_16'),
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_72'),
  getWiki,
  (
    maybeActiveSpellsCombined,
    maybeStartEl,
    maybeHero,
    maybeExceptionalSkill,
    maybePropertyKnowledge,
    wiki
  ) => maybeHero.bind (
    hero => maybeStartEl.bind (
      startEl => maybeActiveSpellsCombined.fmap (
        activeSpellsCombined => activeSpellsCombined.map<Record<SpellWithRequirements>> (
          spell => spell.merge (
            Record.of ({
              isIncreasable: isIncreasable (
                spell,
                startEl,
                hero.get ('phase'),
                hero.get ('attributes'),
                maybeExceptionalSkill,
                maybePropertyKnowledge
              ),
              isDecreasable: isDecreasable (
                wiki,
                hero,
                spell,
                maybePropertyKnowledge
              ),
            })
          )
        )
      )
    )
  )
);

export const getAvailableInactiveSpells = createMaybeSelector (
  getInactiveSpells,
  getRuleBooksEnabled,
  (maybeList, maybeAvailablility) => maybeList.bind (
    list => maybeAvailablility.fmap (
      availablility => filterByAvailability (Tuple.fst (list), availablility)
    )
  )
);

type ActiveListCombined = List<Record<SpellWithRequirements> | Record<CantripCombined>>;
type InactiveListCombined = List<Record<SpellIsActive> | Record<CantripCombined>>;

export const getActiveSpellsAndCantrips = createMaybeSelector (
  getActiveSpells,
  getActiveCantrips,
  (spells: Maybe<ActiveListCombined>, cantrips) => spells .mappend (cantrips)
);

export const getAvailableInactiveSpellsAndCantrips = createMaybeSelector (
  getAvailableInactiveSpells,
  getInactiveCantrips,
  (spells: Maybe<InactiveListCombined>, cantrips) => spells .mappend (cantrips)
);

export const getFilteredActiveSpellsAndCantrips = createMaybeSelector (
  getActiveSpellsAndCantrips,
  getSpellsSortOptions,
  getSpellsFilterText,
  getLocaleAsProp,
  (maybeSpells, sortOptions, filterText, locale) => maybeSpells.fmap (
    spells => filterAndSortObjects (
      spells as List<Record<CantripCombined | SpellWithRequirements>>,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<CantripCombined | SpellWithRequirements>
    ) as ActiveListCombined
  )
);

export const getFilteredInactiveSpellsAndCantrips = createMaybeSelector (
  getAvailableInactiveSpellsAndCantrips,
  getActiveSpellsAndCantrips,
  getSpellsSortOptions,
  getInactiveSpellsFilterText,
  getLocaleAsProp,
  getEnableActiveItemHints,
  (maybeInactive, maybeActive, sortOptions, filterText, locale, areActiveItemHintsEnabled) =>
    Maybe.liftM2<InactiveListCombined, InactiveListCombined, InactiveListCombined>
      (active => inactive => areActiveItemHintsEnabled
        ? filterAndSortObjects (
          List.mappend (inactive) (active) as List<Record<CantripCombined | Spell>>,
          locale.get ('id'),
          filterText,
          sortOptions as AllSortOptions<CantripCombined | Spell>
        ) as InactiveListCombined
        : filterAndSortObjects (
          inactive as List<Record<CantripCombined | Spell>>,
          locale.get ('id'),
          filterText,
          sortOptions as AllSortOptions<CantripCombined | Spell>
        ) as InactiveListCombined)
      (maybeActive as Maybe<InactiveListCombined>)
      (maybeInactive)
);

const getMaxSpellsModifier = (
  maybeIncrease: Maybe<Record<ActivatableDependent>>,
  maybeDecrease: Maybe<Record<ActivatableDependent>>
) => getModifierByActiveLevel (maybeIncrease) (maybeDecrease) (Just (3));

export const isActivationDisabled = createMaybeSelector (
  getStartEl,
  getPhase,
  getActiveSpellsCounter,
  getMagicalTraditionsFromState,
  mapGetToMaybeSlice (getAdvantages, 'ADV_58'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_59'),
  (
    maybeStartEl,
    maybePhase,
    maybeActiveSpellsCounter,
    maybeTraditions,
    maybeBonus,
    maybePenalty
  ) =>
    Maybe.fromMaybe (true) (
      Maybe.liftM4 ((traditions: List<Record<ActivatableDependent>>) =>
                      (startEl: Record<ExperienceLevel>) =>
                        (phase: number) =>
                          (activeSpellsCounter: number) =>
                            Maybe.fromMaybe (true) (
                              List.uncons (traditions).fmap (
                                unconsTraditions => {
                                  const lastTraditionId = Tuple.fst (unconsTraditions).get ('id');

                                  if (lastTraditionId === 'SA_679') {
                                    const maxSpells = getMaxSpellsModifier (
                                      maybeBonus,
                                      maybePenalty
                                    );

                                    if (activeSpellsCounter >= maxSpells) {
                                      return true;
                                    }
                                  }

                                  const maxSpellsLiturgies = startEl.get ('maxSpellsLiturgies');

                                  return phase < 3 && activeSpellsCounter >= maxSpellsLiturgies;
                                }
                              )
                            )
                   )
                   (maybeTraditions)
                   (maybeStartEl)
                   (maybePhase)
                   (maybeActiveSpellsCounter)
    )
);

export const getCantripsForSheet = createMaybeSelector (
  getActiveCantrips,
  R.identity
);

export const getSpellsForSheet = createMaybeSelector (
  getActiveSpellsCombined,
  getMagicalTraditionsFromWikiState,
  getLocaleAsProp,
  (maybeSpells, maybeTraditions, locale) =>
    maybeSpells
      .bind (
        spells => maybeTraditions.fmap (
          traditions => spells.map (
            spell => spell.modify<'tradition'> (
              x => isOwnTradition (traditions, spell as any as Record<Spell>) ? List.of () : x
            ) ('tradition')
          )
        )
      )
      .fmap (list => sortObjects (list, locale .get ('id')))
);
