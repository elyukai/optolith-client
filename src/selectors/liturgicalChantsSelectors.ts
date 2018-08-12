import { Categories } from '../constants/Categories';
import { LiturgicalChantCombined, LiturgicalChantWithRequirements } from '../types/view';
import { Blessing, LiturgicalChant } from '../types/wiki';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { List, Maybe, OrderedSet, Record } from '../utils/dataUtils';
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
import { getAdvantages, getBlessings, getCurrentHeroPresent, getInactiveLiturgicalChantsFilterText, getLiturgicalChants, getLiturgicalChantsFilterText, getLocaleMessages, getPhase, getSpecialAbilities, getWiki, getWikiBlessings, getWikiLiturgicalChants, getWikiSpecialAbilities } from './stateSelectors';
import { getEnableActiveItemHints } from './uisettingsSelectors';

export const getBlessedTraditionFromState = createMaybeSelector(
  getSpecialAbilities,
  specialAbilities => specialAbilities.bind(getBlessedTradition)
);

export const isLiturgicalChantsTabAvailable = createMaybeSelector(
  getBlessedTraditionFromState,
  Maybe.isJust
);

export const getBlessedTraditionNumericId = createMaybeSelector(
  getBlessedTraditionFromState,
  Maybe.fmap(x => getNumericBlessedTraditionIdByInstanceId(x.get('id')))
);

export const getLiturgicalChantsAndBlessings = createMaybeSelector(
  getLiturgicalChants,
  getBlessings,
  (liturgicalChants, blessings) => {
    return [...liturgicalChants.values(), ...blessings.values()];
  }
);

export const getActiveLiturgicalChants = createMaybeSelector(
  getBlessedTraditionFromState,
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
        .bind(e => wiki.get('specialAbilities').lookup(e.get('id')))
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

export const getActiveBlessings = createMaybeSelector(
  getBlessings,
  getWikiBlessings,
  (maybeBlessings, wikiBlessings) =>
    Maybe.fromMaybe<List<Record<Blessing>>>(
      List.of(),
      maybeBlessings
        .fmap(blessings => blessings.elems())
        .fmap(Maybe.mapMaybe(wikiBlessings.lookup))
    )
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
  getBlessedTraditionFromState,
  mapGetToSlice(getSpecialAbilities, 'SA_623'),
  mapGetToSlice(getSpecialAbilities, 'SA_625'),
  mapGetToSlice(getSpecialAbilities, 'SA_632'),
  getWikiSpecialAbilities,
  (
    inactiveList,
    activeList,
    tradition,
    zugvoegel,
    jaegerinnenDerWeissenMaid,
    anhaengerDesGueldenen,
    wikiSpecialAbilities
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
      const maybeTraditionFromWiki = tradition
        .fmap(x => x.get('id'))
        .bind(wikiSpecialAbilities.lookup);

      const unfamiliarChants = Maybe.fromMaybe(
        activeList,
        maybeTraditionFromWiki.fmap(
          traditionFromWiki => activeList.filter(
            e => !tradition || !isOwnTradition(
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
  (inactiveList, additionalValidLiturgicalChants, tradition, availablility) =>
    filterByAvailability(
      inactiveList.filter(e => {
        const ownTradition = tradition && isOwnTradition(tradition, e);
        return ownTradition || additionalValidLiturgicalChants.includes(e.id);
      }),
      availablility
    )
);

export const getFilteredActiveLiturgicalChantsAndBlessings = createMaybeSelector(
  getActiveLiturgicalChants,
  getLiturgicalChantsSortOptions,
  getLiturgicalChantsFilterText,
  getLocaleMessages,
  (liturgicalChants, sortOptions, filterText, locale) => {
    return filterAndSortObjects(liturgicalChants, locale!.id, filterText, sortOptions);
  }
);

export const getFilteredInactiveLiturgicalChantsAndBlessings = createMaybeSelector(
  getAvailableInactiveLiturgicalChants,
  getActiveLiturgicalChants,
  getLiturgicalChantsSortOptions,
  getInactiveLiturgicalChantsFilterText,
  getLocaleMessages,
  getEnableActiveItemHints,
  (inactive, active, sortOptions, filterText, locale, areActiveItemHintsEnabled) => {
    if (areActiveItemHintsEnabled) {
      return filterAndSortObjects([...inactive, ...active], locale!.id, filterText, sortOptions);
    }
    return filterAndSortObjects(inactive, locale!.id, filterText, sortOptions);
  }
);

export const getLiturgicalChantsAndBlessingsForSave = createMaybeSelector(
  getActiveLiturgicalChants,
  list => {
    const liturgies: ToListById<number> = {};
    const blessings: string[] = [];
    for (const entry of list) {
      if (entry.category === Categories.LITURGIES) {
        const { id, value } = entry;
        liturgies[id] = value;
      }
      else {
        blessings.push(entry.id);
      }
    }
    return {
      liturgies,
      blessings
    };
  }
);

export const isActivationDisabled = createMaybeSelector(
  getStartEl,
  getPhase,
  getLiturgicalChants,
  (startEl, phase, liturgicalChants) => {
    return phase < 3 && [...liturgicalChants.values()].filter(e => e.ic < 3 && e.active).length >= startEl.maxSpellsLiturgies;
  }
);

export const getBlessingsForSheet = createMaybeSelector(
  getBlessings,
  blessings => [...blessings.values()].filter(e => e.active)
);

export const getLiturgiesForSheet = createMaybeSelector(
  getLiturgicalChants,
  getBlessedTradition,
  (liturgies, tradition) => {
    const array: Liturgy[] = [];
    for (const [id, entry] of liturgies) {
      const { ic, name, active, value, check, checkmod, aspects, category } = entry;
      const availableAspects = tradition && getAspectsOfTradition(getNumericBlessedTraditionIdByInstanceId(tradition.id) + 1);
      if (active) {
        array.push({
          id,
          name,
          value,
          ic,
          check,
          checkmod,
          aspects: aspects.filter(e => availableAspects && availableAspects.includes(e)),
          category
        });
      }
    }
    return array;
  }
);
