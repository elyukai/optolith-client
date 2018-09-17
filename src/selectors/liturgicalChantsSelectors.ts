import * as R from 'ramda';
import { ActivatableSkillDependent } from '../types/data';
import { LiturgicalChantWithRequirements } from '../types/view';
import { Blessing, LiturgicalChant } from '../types/wiki';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe, OrderedMap, OrderedSet, Record, Tuple } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects } from '../utils/FilterSortUtils';
import { getNumericBlessedTraditionIdByInstanceId } from '../utils/IDUtils';
import { isActive } from '../utils/isActive';
import { getAspectsOfTradition, isDecreasable, isIncreasable, isOwnTradition } from '../utils/liturgicalChantUtils';
import { filterByAvailability } from '../utils/RulesUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getBlessedTradition } from '../utils/traditionUtils';
import { getStartEl } from './elSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getLiturgicalChantsSortOptions } from './sortOptionsSelectors';
import { getAdvantages, getBlessings, getCurrentHeroPresent, getInactiveLiturgicalChantsFilterText, getLiturgicalChants, getLiturgicalChantsFilterText, getLocaleAsProp, getPhase, getSpecialAbilities, getWiki, getWikiBlessings, getWikiLiturgicalChants, getWikiSpecialAbilities } from './stateSelectors';
import { getEnableActiveItemHints } from './uisettingsSelectors';

export const getBlessedTraditionFromState = createMaybeSelector (
  getSpecialAbilities,
  Maybe.bind_ (getBlessedTradition)
);

export const getBlessedTraditionFromWikiState = createMaybeSelector (
  getBlessedTraditionFromState,
  getWikiSpecialAbilities,
  (maybeTradition, specialAbilities) => maybeTradition.bind (
    tradition => specialAbilities.lookup (tradition.get ('id'))
  )
);

export const getIsLiturgicalChantsTabAvailable = createMaybeSelector (
  getBlessedTraditionFromState,
  Maybe.isJust
);

export const getBlessedTraditionNumericId = createMaybeSelector (
  getBlessedTraditionFromState,
  Maybe.fmap (x => getNumericBlessedTraditionIdByInstanceId (x.get ('id')))
);

export const getActiveLiturgicalChants = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  getStartEl,
  mapGetToSlice (getAdvantages, 'ADV_16'),
  mapGetToSlice (getSpecialAbilities, 'SA_87'),
  getWiki,
  getCurrentHeroPresent,
  (
    maybeBlessedTradition,
    maybeStartEl,
    exceptionalSkill,
    aspectKnowledge,
    wiki,
    maybeHero
  ) =>
    Maybe.fromMaybe<List<Record<LiturgicalChantWithRequirements>>> (List.of ()) (
      maybeBlessedTradition
        .bind (
          blessedTradition => maybeHero.bind (
            hero => maybeStartEl.fmap (
              startEl => Maybe.mapMaybe<
                Record<ActivatableSkillDependent>,
                Record<LiturgicalChantWithRequirements>
              >(
                R.pipe (
                  Maybe.ensure (x => x.get ('active')),
                  Maybe.bind_ (
                    liturgicalChant => wiki.get ('liturgicalChants')
                      .lookup (liturgicalChant.get ('id'))
                      .fmap (
                        wikiLiturgicalChant => wikiLiturgicalChant
                          .merge (liturgicalChant)
                          .merge (Record.of ({
                            isIncreasable: isIncreasable (
                              blessedTradition,
                              wikiLiturgicalChant,
                              liturgicalChant,
                              startEl,
                              hero.get ('phase'),
                              hero.get ('attributes'),
                              exceptionalSkill,
                              aspectKnowledge
                            ),
                            isDecreasable: isDecreasable (
                              wiki,
                              hero,
                              wikiLiturgicalChant,
                              liturgicalChant,
                              hero.get ('liturgicalChants'),
                              aspectKnowledge
                            ),
                          }))
                      )
                  )
                )
              ) (hero.get ('liturgicalChants').elems ())
            )
          )
        )
    )
);

export const getActiveAndInctiveBlessings = createMaybeSelector (
  getBlessings,
  getWikiBlessings,
  (maybeBlessings, wikiBlessings) =>
    Maybe.fromMaybe (Tuple.of<List<Record<Blessing>>, List<Record<Blessing>>> (List.of ())
                                                                             (List.of ()))
                    (
                      maybeBlessings
                        .fmap (
                          blessings => wikiBlessings.elems ().partition (
                            e => blessings.member (e.get ('id'))
                          )
                        )
                    )
);

export const getActiveBlessings = createMaybeSelector (
  getActiveAndInctiveBlessings,
  Tuple.fst
);

export const getInactiveBlessings = createMaybeSelector (
  getActiveAndInctiveBlessings,
  Tuple.snd
);

export const getInactiveLiturgicalChants = createMaybeSelector (
  getLiturgicalChants,
  getWikiLiturgicalChants,
  (maybeLiturgicalChants, wikiLiturgicalChants) => maybeLiturgicalChants
    .fmap (liturgicalChants => liturgicalChants.elems ())
    .fmap (
      liturgicalChants => wikiLiturgicalChants.filter (
        wikiLiturgicalChant => liturgicalChants.all (
          liturgicalChant => liturgicalChant.get ('id') !== wikiLiturgicalChant.get ('id')
        )
      )
    )
);

const additionalInactiveListFilter = (
  inactiveList: OrderedMap<string, Record<LiturgicalChant>>,
  activeList: List<Record<LiturgicalChantWithRequirements>>,
  validate: (
    e: Record<LiturgicalChantWithRequirements> | Record<LiturgicalChant>
  ) => boolean
): List<string> => {
  if (!activeList.any (validate)) {
    return inactiveList
      .filter (
        e => {
          const isTraditionValid = !e.get ('tradition').elem (1) && validate (e);
          const isICValid = e.get ('ic') <= 3;

          return isTraditionValid && isICValid;
        }
      )
      .elems ()
      .map (x => x.get ('id'));
  }

  return List.of ();
};

export const getAdditionalValidLiturgicalChants = createMaybeSelector (
  getInactiveLiturgicalChants,
  getActiveLiturgicalChants,
  getBlessedTraditionFromWikiState,
  mapGetToSlice (getSpecialAbilities, 'SA_623'),
  mapGetToSlice (getSpecialAbilities, 'SA_625'),
  mapGetToSlice (getSpecialAbilities, 'SA_632'),
  (
    maybeInactiveList,
    activeList,
    tradition,
    zugvoegel,
    jaegerinnenDerWeissenMaid,
    anhaengerDesGueldenen
  ): Maybe<List<string>> => maybeInactiveList.fmap (
    inactiveList => {
      if (isActive (zugvoegel)) {
        // Phex
        return additionalInactiveListFilter (
          inactiveList,
          activeList,
          e => e.get ('tradition').elem (6)
        )
          // Travia
          .mappend (additionalInactiveListFilter (
            inactiveList,
            activeList,
            e => e.get ('tradition').elem (9)
          ));
      }

      if (isActive (jaegerinnenDerWeissenMaid)) {
        // Firun Liturgical Chant
        return additionalInactiveListFilter (
          inactiveList,
          activeList,
          e => e.get ('tradition').elem (10) && e.get ('gr') === 1
        )
          // Firun Ceremony
          .mappend (additionalInactiveListFilter (
            inactiveList,
            activeList,
            e => e.get ('tradition').elem (10) && e.get ('gr') === 2
          ));
      }

      if (isActive (anhaengerDesGueldenen)) {
        const unfamiliarChants = Maybe.fromMaybe (activeList) (
          tradition.fmap (
            traditionFromWiki => activeList.filter (
              e => !isOwnTradition (
                traditionFromWiki,
                e as any as Record<LiturgicalChant>
              )
            )
          )
        );

        const inactiveWithValidIC = inactiveList.filter (e => e.get ('ic') <= 2);

        if (!unfamiliarChants.null ()) {
          const otherTraditions = unfamiliarChants.foldl<OrderedSet<number>> (
            acc => obj => obj.get ('tradition').foldl<OrderedSet<number>> (
              acc1 => acc1.insert
            ) (acc)
          ) (OrderedSet.empty ());

          return inactiveWithValidIC
            .filter (e => e.get ('tradition').any (otherTraditions.member))
            .elems ()
            .map (e => e.get ('id'));
        }

        return inactiveWithValidIC.elems ().map (e => e.get ('id'));
      }

      return List.of ();
    }
  )
);

export const getAvailableInactiveLiturgicalChants = createMaybeSelector (
  getInactiveLiturgicalChants,
  getAdditionalValidLiturgicalChants,
  getBlessedTraditionFromWikiState,
  getRuleBooksEnabled,
  getWikiSpecialAbilities,
  (
    maybeInactiveList,
    maybeAdditionalValidLiturgicalChants,
    maybeTradition,
    maybeAvailablility
  ) =>
    maybeInactiveList.bind (
      inactiveList => maybeAdditionalValidLiturgicalChants.bind (
        additionalValidLiturgicalChants => maybeAvailablility.bind (
          availablility => maybeTradition.fmap (
            tradition => filterByAvailability (
              inactiveList
                .elems ()
                .filter (e => {
                  const ownTradition = isOwnTradition (
                    tradition,
                    e as any as Record<LiturgicalChant>
                  );

                  return ownTradition || additionalValidLiturgicalChants.elem (e.get ('id'));
                }),
              availablility
            )
          )
        )
      )
    )
);

type ActiveListCombined = List<Record<LiturgicalChantWithRequirements> | Record<Blessing>>;
type InactiveListCombined = List<Record<LiturgicalChant> | Record<Blessing>>;

export const getActiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getActiveLiturgicalChants,
  getActiveBlessings,
  (liturgicalChants: ActiveListCombined, blessings) => liturgicalChants.mappend (blessings)
);

export const getAvailableInactiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getAvailableInactiveLiturgicalChants,
  getInactiveBlessings,
  (maybeLiturgicalChants: Maybe<InactiveListCombined>, blessings) => maybeLiturgicalChants.fmap (
    liturgicalChants => liturgicalChants.mappend (blessings)
  )
);

export const getFilteredActiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getActiveLiturgicalChantsAndBlessings,
  getLiturgicalChantsSortOptions,
  getLiturgicalChantsFilterText,
  getLocaleAsProp,
  (liturgicalChants, sortOptions, filterText, locale) => filterAndSortObjects (
    liturgicalChants as List<Record<Blessing | LiturgicalChantWithRequirements>>,
    locale.get ('id'),
    filterText,
    sortOptions as AllSortOptions<Blessing | LiturgicalChantWithRequirements>
  )
);

export const getFilteredInactiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getAvailableInactiveLiturgicalChantsAndBlessings,
  getActiveLiturgicalChantsAndBlessings,
  getLiturgicalChantsSortOptions,
  getInactiveLiturgicalChantsFilterText,
  getLocaleAsProp,
  getEnableActiveItemHints,
  (maybeInactive, active, sortOptions, filterText, locale, areActiveItemHintsEnabled) =>
  maybeInactive.fmap (
    inactive => areActiveItemHintsEnabled
      ? filterAndSortObjects (
        List.mappend (inactive) (active as InactiveListCombined) as List<Record<
          Blessing | LiturgicalChant
        >>,
        locale.get ('id'),
        filterText,
        sortOptions as AllSortOptions<Blessing | LiturgicalChant>
      )
      : filterAndSortObjects (
        inactive as List<Record<Blessing | LiturgicalChant>>,
        locale.get ('id'),
        filterText,
        sortOptions as AllSortOptions<Blessing | LiturgicalChant>
      )
  )
);

export const isActivationDisabled = createMaybeSelector (
  getStartEl,
  getPhase,
  getActiveLiturgicalChants,
  (maybeStartEl, maybePhase, liturgicalChants) =>
    Maybe.fromMaybe (false) (maybePhase.fmap (R.gt (3)))
    && maybeStartEl.fmap (
        startEl => liturgicalChants.length () >= startEl.get ('maxSpellsLiturgies')
      )
);

export const getBlessingsForSheet = createMaybeSelector (
  getActiveBlessings,
  R.identity
);

export const getLiturgicalChantsForSheet = createMaybeSelector (
  getActiveLiturgicalChants,
  getBlessedTraditionFromState,
  (liturgicalChants, maybeTradition) => Maybe.fromMaybe (liturgicalChants) (
    maybeTradition.bind (
      tradition => getNumericBlessedTraditionIdByInstanceId (tradition.get ('id'))
        .fmap (R.inc)
        .fmap (getAspectsOfTradition)
        .fmap (
          availableAspects => liturgicalChants.map (
            chant => chant.modify<'aspects'> (List.filter (availableAspects.elem)) ('aspects')
          )
        )
    )
  )
);
