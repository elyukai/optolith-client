import R from 'ramda';
import { LiturgicalChantCombined, LiturgicalChantWithRequirements } from '../types/view';
import { Blessing, LiturgicalChant } from '../types/wiki';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe, OrderedSet, Record, Tuple } from '../utils/dataUtils';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
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

export const getBlessedTraditionFromState = createMaybeSelector(
  getSpecialAbilities,
  specialAbilities => specialAbilities.bind(getBlessedTradition)
);

export const getBlessedTraditionFromWiki = createMaybeSelector(
  getBlessedTraditionFromState,
  getWikiSpecialAbilities,
  (maybeTradition, specialAbilities) => maybeTradition.bind(
    tradition => specialAbilities.lookup(tradition.get('id'))
  )
);

export const isLiturgicalChantsTabAvailable = createMaybeSelector(
  getBlessedTraditionFromState,
  Maybe.isJust
);

export const getBlessedTraditionNumericId = createMaybeSelector(
  getBlessedTraditionFromState,
  Maybe.fmap(x => getNumericBlessedTraditionIdByInstanceId(x.get('id')))
);

export const getActiveLiturgicalChants = createMaybeSelector(
  getBlessedTraditionFromWiki,
  getStartEl,
  mapGetToSlice(getAdvantages, 'ADV_16'),
  mapGetToSlice(getSpecialAbilities, 'SA_87'),
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
    Maybe.fromMaybe<List<Record<LiturgicalChantWithRequirements>>>(
      List.of(),
      maybeBlessedTradition
        .bind(
          blessedTradition => maybeHero.bind(
            hero => maybeStartEl.fmap(
              startEl => Maybe.mapMaybe(
                unsureLiturgicalChant => Maybe.ensure(
                  x => x.get('active'),
                  unsureLiturgicalChant
                )
                  .bind(
                    liturgicalChant => wiki.get('liturgicalChants')
                      .lookup(liturgicalChant.get('id'))
                      .fmap(
                        wikiLiturgicalChant => wikiLiturgicalChant
                          .merge(liturgicalChant)
                          .merge(Record.of({
                            isIncreasable: isIncreasable(
                              blessedTradition,
                              wikiLiturgicalChant,
                              liturgicalChant,
                              startEl,
                              hero.get('phase'),
                              hero.get('attributes'),
                              exceptionalSkill,
                              aspectKnowledge
                            ),
                            isDecreasable: isDecreasable(
                              wiki,
                              hero,
                              wikiLiturgicalChant,
                              liturgicalChant,
                              hero.get('liturgicalChants'),
                              aspectKnowledge
                            )
                          }))
                      )
                  ),
                hero.get('liturgicalChants').elems()
              )
            )
          )
        )
    )
);

export const getActiveAndInctiveBlessings = createMaybeSelector(
  getBlessings,
  getWikiBlessings,
  (maybeBlessings, wikiBlessings) =>
    Maybe.fromMaybe<Tuple<List<Record<Blessing>>, List<Record<Blessing>>>>(
      Tuple.of(List.of(), List.of()),
      maybeBlessings
        .fmap(
          blessings => wikiBlessings.elems().partition(
            e => blessings.member(e.get('id'))
          )
        )
    )
);

export const getActiveBlessings = createMaybeSelector(
  getActiveAndInctiveBlessings,
  Tuple.fst
);

export const getInactiveBlessings = createMaybeSelector(
  getActiveAndInctiveBlessings,
  Tuple.snd
);

export const getInactiveLiturgicalChants = createMaybeSelector(
  getLiturgicalChants,
  getWikiLiturgicalChants,
  (maybeLiturgicalChants, wikiLiturgicalChants) =>
    Maybe.fromMaybe<List<Record<LiturgicalChantCombined>>>(
      List.of(),
      maybeLiturgicalChants
        .fmap(liturgicalChants => liturgicalChants.elems())
        .fmap(
          Maybe.mapMaybe(
            liturgicalChant => Maybe.ensure(x => !x.get('active'), liturgicalChant)
              .bind(x => wikiLiturgicalChants.lookup(x.get('id')))
              .fmap(wikiLiturgicalChant => wikiLiturgicalChant.merge(liturgicalChant))
          )
        )
    )
);

const additionalInactiveListFilter = (
  inactiveList: List<Record<LiturgicalChantCombined>>,
  activeList: List<Record<LiturgicalChantWithRequirements>>,
  validate: (
    e: Record<LiturgicalChantWithRequirements> | Record<LiturgicalChantCombined>
  ) => boolean
): List<string> => {
  if (!activeList.any(validate)) {
    return Maybe.mapMaybe(
      e => Maybe.ensure(
        x => {
          const isTraditionValid = !x.get('tradition').elem(1) && validate(x);
          const isICValid = x.get('ic') <= 3;

          return isTraditionValid && isICValid;
        },
        e
      )
        .fmap(x => x.get('id')),
      inactiveList
    );
  }

  return List.of();
};

export const getAdditionalValidLiturgicalChants = createMaybeSelector(
  getInactiveLiturgicalChants,
  getActiveLiturgicalChants,
  getBlessedTraditionFromWiki,
  mapGetToSlice(getSpecialAbilities, 'SA_623'),
  mapGetToSlice(getSpecialAbilities, 'SA_625'),
  mapGetToSlice(getSpecialAbilities, 'SA_632'),
  (
    inactiveList,
    activeList,
    tradition,
    zugvoegel,
    jaegerinnenDerWeissenMaid,
    anhaengerDesGueldenen
  ): List<string> => {
    if (isActive(zugvoegel)) {
      // Phex
      return additionalInactiveListFilter(
        inactiveList,
        activeList,
        e => e.get('tradition').elem(6)
      )
        // Travia
        .concat(additionalInactiveListFilter(
          inactiveList,
          activeList,
          e => e.get('tradition').elem(9)
        ));
    }

    if (isActive(jaegerinnenDerWeissenMaid)) {
      // Firun Liturgical Chant
      return additionalInactiveListFilter(
        inactiveList,
        activeList,
        e => e.get('tradition').elem(10) && e.get('gr') === 1
      )
        // Firun Ceremony
        .concat(additionalInactiveListFilter(
          inactiveList,
          activeList,
          e => e.get('tradition').elem(10) && e.get('gr') === 2
        ));
    }

    if (isActive(anhaengerDesGueldenen)) {
      const unfamiliarChants = Maybe.fromMaybe(
        activeList,
        tradition.fmap(
          traditionFromWiki => activeList.filter(
            e => !isOwnTradition(
              traditionFromWiki,
              e as any as Record<LiturgicalChant>
            )
          )
        )
      );

      const inactiveWithValidIC = inactiveList.filter(e => e.get('ic') <= 2);

      if (!unfamiliarChants.null()) {
        const otherTraditions = unfamiliarChants.foldl(
          acc => obj => obj.get('tradition').foldl(
            acc1 => acc1.insert,
            acc
          ),
          OrderedSet.empty<number>()
        );

        return inactiveWithValidIC
          .filter(e => e.get('tradition').any(otherTraditions.member))
          .map(e => e.get('id'));
      }

      return inactiveWithValidIC.map(e => e.get('id'));
    }

    return List.of();
  }
);

export const getAvailableInactiveLiturgicalChants = createMaybeSelector(
  getInactiveLiturgicalChants,
  getAdditionalValidLiturgicalChants,
  getBlessedTraditionFromState,
  getRuleBooksEnabled,
  getWikiSpecialAbilities,
  (
    inactiveList,
    additionalValidLiturgicalChants,
    maybeTradition,
    maybeAvailablility,
    wikiSpecialAbilities
  ) =>
    maybeAvailablility.bind(
      availablility => maybeTradition
      .bind(
        traditionFromState => wikiSpecialAbilities.lookup(traditionFromState.get('id'))
      )
      .fmap(
        tradition => filterByAvailability(
          inactiveList.filter(e => {
            const ownTradition = isOwnTradition(tradition, e as any as Record<LiturgicalChant>);

            return ownTradition || additionalValidLiturgicalChants.elem(e.get('id'));
          }),
          availablility
        )
      )
    )
);

type ActiveListCombined = List<Record<LiturgicalChantWithRequirements> | Record<Blessing>>;
type InactiveListCombined = List<Record<LiturgicalChantCombined> | Record<Blessing>>;

export const getActiveLiturgicalChantsAndBlessings = createMaybeSelector(
  getActiveLiturgicalChants,
  getActiveBlessings,
  (liturgicalChants: ActiveListCombined, blessings) => liturgicalChants.concat(blessings)
);

export const getAvailableInactiveLiturgicalChantsAndBlessings = createMaybeSelector(
  getAvailableInactiveLiturgicalChants,
  getInactiveBlessings,
  (maybeLiturgicalChants: Maybe<InactiveListCombined>, blessings) => maybeLiturgicalChants.fmap(
    liturgicalChants => liturgicalChants.concat(blessings)
  )
);

export const getFilteredActiveLiturgicalChantsAndBlessings = createMaybeSelector(
  getActiveLiturgicalChantsAndBlessings,
  getLiturgicalChantsSortOptions,
  getLiturgicalChantsFilterText,
  getLocaleAsProp,
  (liturgicalChants, sortOptions, filterText, locale) => filterAndSortObjects(
    liturgicalChants,
    locale.get('id'),
    filterText,
    sortOptions
  )
);

export const getFilteredInactiveLiturgicalChantsAndBlessings = createMaybeSelector(
  getAvailableInactiveLiturgicalChantsAndBlessings,
  getActiveLiturgicalChantsAndBlessings,
  getLiturgicalChantsSortOptions,
  getInactiveLiturgicalChantsFilterText,
  getLocaleAsProp,
  getEnableActiveItemHints,
  (maybeInactive, active, sortOptions, filterText, locale, areActiveItemHintsEnabled) =>
  maybeInactive.fmap(
    inactive => areActiveItemHintsEnabled
      ? filterAndSortObjects(
          inactive.concat(active as InactiveListCombined),
          locale.get('id'),
          filterText,
          sortOptions
        )
      : filterAndSortObjects(inactive, locale.get('id'), filterText, sortOptions)
  )
);

export const isActivationDisabled = createMaybeSelector(
  getStartEl,
  getPhase,
  getActiveLiturgicalChants,
  (maybeStartEl, maybePhase, liturgicalChants) =>
    Maybe.fromMaybe(false, maybePhase.fmap(R.gt(3)))
    && maybeStartEl.fmap(
        startEl => liturgicalChants.length() >= startEl.get('maxSpellsLiturgies')
      )
);

export const getBlessingsForSheet = createMaybeSelector(
  getActiveBlessings,
  R.identity
);

export const getLiturgiesForSheet = createMaybeSelector(
  getActiveLiturgicalChants,
  getBlessedTraditionFromState,
  (liturgicalChants, maybeTradition) => Maybe.fromMaybe(
    liturgicalChants,
    maybeTradition.bind(
      tradition => getNumericBlessedTraditionIdByInstanceId(tradition.get('id'))
        .fmap(R.inc)
        .fmap(getAspectsOfTradition)
        .fmap(
          availableAspects => liturgicalChants.map(
            chant => chant.modify(
              aspects => aspects.filter(availableAspects.elem),
              'aspects'
            )
          )
        )
    )
  )
);
