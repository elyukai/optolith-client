import * as R from 'ramda';
import { ActivatableSkillDependent } from '../App/Models/Hero/heroTypeHelpers';
import { BlessingCombined, LiturgicalChantIsActive, LiturgicalChantWithRequirements } from '../App/Models/View/viewTypeHelpers';
import { ExperienceLevel, LiturgicalChant } from '../App/Models/Wiki/wikiTypeHelpers';
import { createMaybeSelector } from '../App/Utils/createMaybeSelector';
import { getNumericBlessedTraditionIdByInstanceId } from '../App/Utils/IDUtils';
import { getAspectsOfTradition, isDecreasable, isIncreasable, isOwnTradition } from '../App/Utils/Increasable/liturgicalChantUtils';
import { filterByAvailability } from '../App/Utils/RulesUtils';
import { mapGetToMaybeSlice } from '../App/Utils/SelectorsUtils';
import { isActive } from '../utils/activatable/isActive';
import { getBlessedTradition } from '../utils/activatable/traditionUtils';
import { List, Maybe, OrderedMap, OrderedSet, Record, Tuple } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects, sortObjects } from '../utils/FilterSortUtils';
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
  Maybe.bind_ (x => getNumericBlessedTraditionIdByInstanceId (x.get ('id')))
);

export const getActiveLiturgicalChants = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  getStartEl,
  mapGetToMaybeSlice (getAdvantages, 'ADV_16'),
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_87'),
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
);

export const getActiveAndInactiveBlessings = createMaybeSelector (
  getBlessings,
  getWikiBlessings,
  (maybeBlessings, wikiBlessings) => maybeBlessings .fmap (
    blessings => wikiBlessings
      .elems ()
      .map<Record<BlessingCombined>> (
        e => e .merge (Record.of ({ active: blessings .member (e .get ('id')) }))
      )
      .partition (Record.get<BlessingCombined, 'active'> ('active'))
  )
);

export const getActiveBlessings = createMaybeSelector (
  getActiveAndInactiveBlessings,
  Maybe.fmap (Tuple.fst)
);

export const getInactiveBlessings = createMaybeSelector (
  getActiveAndInactiveBlessings,
  Maybe.fmap (Tuple.snd)
);

export const getInactiveLiturgicalChants = createMaybeSelector (
  getLiturgicalChants,
  getWikiLiturgicalChants,
  (maybeLiturgicalChants, wikiLiturgicalChants) => maybeLiturgicalChants
    .fmap (R.pipe (
      OrderedMap.elems,
      liturgicalChants => OrderedMap.mapMaybe<
        string,
        Record<LiturgicalChant>,
        Record<LiturgicalChantIsActive>
      >
        (R.pipe (
          Maybe.ensure (
            wikiLiturgicalChant => liturgicalChants.all (
              liturgicalChant => liturgicalChant.get ('id') !== wikiLiturgicalChant.get ('id')
            )
          ),
          Maybe.fmap (Record.merge (Record.of ({ active: false })))
        ))
        (wikiLiturgicalChants)
    ))
);

const additionalInactiveListFilter = (
  inactiveList: OrderedMap<string, Record<LiturgicalChantIsActive>>,
  activeList: List<Record<LiturgicalChantWithRequirements>>,
  validate: (
    e: Record<LiturgicalChantWithRequirements> | Record<LiturgicalChantIsActive>
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
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_623'),
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_625'),
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_632'),
  (
    maybeInactiveList,
    maybeActiveList,
    tradition,
    zugvoegel,
    jaegerinnenDerWeissenMaid,
    anhaengerDesGueldenen
  ): Maybe<List<string>> => Maybe.liftM2<
      OrderedMap<string, Record<LiturgicalChantIsActive>>,
      List<Record<LiturgicalChantWithRequirements>>,
      List<string>
    >
    (inactiveList => activeList => {
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
    })
    (maybeInactiveList)
    (maybeActiveList)
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

type ActiveListCombined = List<Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>>;
type InactiveListCombined = List<Record<LiturgicalChantIsActive> | Record<BlessingCombined>>;

export const getActiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getActiveLiturgicalChants,
  getActiveBlessings,
  (liturgicalChants: Maybe<ActiveListCombined>, blessings) =>
    liturgicalChants .mappend (blessings)
);

export const getAvailableInactiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getAvailableInactiveLiturgicalChants,
  getInactiveBlessings,
  (liturgicalChants: Maybe<InactiveListCombined>, blessings) =>
    liturgicalChants .mappend (blessings)
);

export const getFilteredActiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getActiveLiturgicalChantsAndBlessings,
  getLiturgicalChantsSortOptions,
  getLiturgicalChantsFilterText,
  getLocaleAsProp,
  (maybeLiturgicalChants, sortOptions, filterText, locale) => maybeLiturgicalChants .fmap (
    liturgicalChants => filterAndSortObjects (
      liturgicalChants as List<Record<BlessingCombined | LiturgicalChantWithRequirements>>,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<BlessingCombined | LiturgicalChantWithRequirements>
    ) as ActiveListCombined
  )
);

export const getFilteredInactiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getAvailableInactiveLiturgicalChantsAndBlessings,
  getActiveLiturgicalChantsAndBlessings,
  getLiturgicalChantsSortOptions,
  getInactiveLiturgicalChantsFilterText,
  getLocaleAsProp,
  getEnableActiveItemHints,
  (maybeInactive, maybeActive, sortOptions, filterText, locale, areActiveItemHintsEnabled) =>
    Maybe.liftM2<InactiveListCombined, InactiveListCombined, InactiveListCombined>
      (active => inactive => areActiveItemHintsEnabled
        ? filterAndSortObjects (
          List.mappend (inactive) (active) as List<Record<BlessingCombined | LiturgicalChant>>,
          locale.get ('id'),
          filterText,
          sortOptions as AllSortOptions<BlessingCombined | LiturgicalChant>
        ) as InactiveListCombined
        : filterAndSortObjects (
          inactive as List<Record<BlessingCombined | LiturgicalChant>>,
          locale.get ('id'),
          filterText,
          sortOptions as AllSortOptions<BlessingCombined | LiturgicalChant>
        ) as InactiveListCombined)
      (maybeActive as Maybe<InactiveListCombined>)
      (maybeInactive)
);

export const isActivationDisabled = createMaybeSelector (
  getStartEl,
  getPhase,
  getActiveLiturgicalChants,
  (maybeStartEl, maybePhase, maybeLiturgicalChants) =>
    Maybe.elem (true) (maybePhase.fmap (R.gt (3)))
    && Maybe.elem
      (true)
      (Maybe.liftM2<List<Record<LiturgicalChantWithRequirements>>, Record<ExperienceLevel>, boolean>
        (liturgicalChants => startEl =>
          liturgicalChants.length () >= startEl.get ('maxSpellsLiturgies'))
        (maybeLiturgicalChants)
        (maybeStartEl))
);

export const getBlessingsForSheet = createMaybeSelector (
  getActiveBlessings,
  R.identity
);

export const getLiturgicalChantsForSheet = createMaybeSelector (
  getActiveLiturgicalChants,
  getBlessedTraditionFromState,
  getLocaleAsProp,
  (maybeLiturgicalChants, maybeTradition, locale) => maybeTradition.bind (
    tradition => getNumericBlessedTraditionIdByInstanceId (tradition.get ('id'))
      .fmap (R.inc)
      .fmap (getAspectsOfTradition)
      .bind (
        availableAspects => maybeLiturgicalChants .fmap (
          List.map (
            chant => chant.modify<'aspects'> (List.filter (availableAspects.elem)) ('aspects')
          )
        )
      )
      .fmap (list => sortObjects (list, locale .get ('id')))
  )
);
