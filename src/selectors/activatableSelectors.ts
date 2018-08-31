import R from 'ramda';
import { createSelector } from 'reselect';
import { ActivatableCategory, Categories } from '../constants/Categories';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { getAllActiveByCategory } from '../utils/activatableActiveUtils';
import { getModifierByActiveLevel, getModifierByIsActive } from '../utils/activatableModifierUtils';
import { getBracketedNameFromFullName } from '../utils/activatableNameUtils';
import { Just, List, Maybe, OrderedMap, Record } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects } from '../utils/FilterSortUtils';
import { flip } from '../utils/flip';
import { translate } from '../utils/I18n';
import { getActiveSelections, getSelectOptionName } from '../utils/selectionUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getBlessedTraditionFromWikiState } from './liturgicalChantsSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentRace } from './rcpSelectors';
import { getSpecialAbilitiesSortOptions } from './sortOptionsSelectors';
import { getMagicalTraditionsFromWikiState } from './spellsSelectors';
import { getAdvantages, getAdvantagesFilterText, getCultureAreaKnowledge, getCurrentHeroPresent, getDisadvantages, getDisadvantagesFilterText, getLocaleAsProp, getSpecialAbilities, getSpecialAbilitiesFilterText, getWiki, getWikiSpecialAbilities } from './stateSelectors';

export const getActive = <T extends ActivatableCategory>(category: T, addTierToName: boolean) =>
  createSelector (
    getCurrentHeroPresent,
    getLocaleAsProp,
    getWiki,
    (maybeHero, locale, wiki) => getAllActiveByCategory (category)
                                                        (addTierToName)
                                                        (maybeHero)
                                                        (locale)
                                                        (wiki)
  );

export const getActiveForView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, false);

export const getActiveForEditView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, true);

export const getAdvantagesRating = createSelector (
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (maybeRace, maybeCulture, maybeProfession) =>
    maybeRace.bind (
      race => maybeCulture.bind (
        culture => maybeProfession.fmap (
          profession => R.pipe (
            race.get ('commonAdvantages').foldl<OrderedMap<string, Data.EntryRating>> (
              map => e => map.insert (e) (Data.EntryRating.Common)
            ),
            race.get ('uncommonAdvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Uncommon)
            ),
            culture.get ('commonAdvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Common)
            ),
            culture.get ('uncommonAdvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Uncommon)
            ),
            profession.get ('suggestedAdvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Common)
            ),
            profession.get ('unsuitableAdvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Uncommon)
            ),
            race.get ('stronglyRecommendedAdvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Essential)
            )
          ) (OrderedMap.empty ())
        )
      )
    )
);

export const getDisadvantagesRating = createSelector (
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (maybeRace, maybeCulture, maybeProfession) =>
    maybeRace.bind (
      race => maybeCulture.bind (
        culture => maybeProfession.fmap (
          profession => R.pipe (
            race.get ('commonDisadvantages').foldl<OrderedMap<string, Data.EntryRating>> (
              map => e => map.insert (e) (Data.EntryRating.Common)
            ),
            race.get ('uncommonDisadvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Uncommon)
            ),
            culture.get ('commonDisadvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Common)
            ),
            culture.get ('uncommonDisadvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Uncommon)
            ),
            profession.get ('suggestedDisadvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Common)
            ),
            profession.get ('unsuitableDisadvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Uncommon)
            ),
            race.get ('stronglyRecommendedDisadvantages').foldl (
              map => e => map.insert (e) (Data.EntryRating.Essential)
            )
          ) (OrderedMap.empty ())
        )
      )
    )
);

export const getAdvantagesForSheet = createSelector (
  getActiveForView (Categories.ADVANTAGES),
  R.identity
);

export const getAdvantagesForEdit = createSelector (
  getActiveForEditView (Categories.ADVANTAGES),
  R.identity
);

export const getFilteredActiveAdvantages = createSelector (
  getAdvantagesForEdit,
  getAdvantagesFilterText,
  getLocaleAsProp,
  (maybeAdvantages, filterText, locale) => maybeAdvantages.fmap (
    advantages => filterAndSortObjects (advantages, locale.get ('id'), filterText)
  )
);

export const getDisadvantagesForSheet = createSelector (
  getActiveForView (Categories.DISADVANTAGES),
  R.identity
);

export const getDisadvantagesForEdit = createSelector (
  getActiveForEditView (Categories.DISADVANTAGES),
  R.identity
);

export const getFilteredActiveDisadvantages = createSelector (
  getDisadvantagesForEdit,
  getDisadvantagesFilterText,
  getLocaleAsProp,
  (maybeDisadvantages, filterText, locale) => maybeDisadvantages.fmap (
    disadvantages => filterAndSortObjects (disadvantages, locale.get ('id'), filterText)
  )
);

export const getSpecialAbilitiesForSheet = createSelector (
  getActiveForView (Categories.SPECIAL_ABILITIES),
  R.identity
);

export const getSpecialAbilitiesForEdit = createSelector (
  getActiveForEditView (Categories.SPECIAL_ABILITIES),
  R.identity
);

export const getFilteredActiveSpecialAbilities = createSelector (
  getSpecialAbilitiesForEdit,
  getSpecialAbilitiesSortOptions,
  getSpecialAbilitiesFilterText,
  getLocaleAsProp,
  (maybeSpecialAbilities, sortOptions, filterText, locale) => maybeSpecialAbilities.fmap (
    specialAbilities => filterAndSortObjects<Data.ActiveViewObject<Wiki.SpecialAbility>> (
      specialAbilities,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<Targets>
    )
  )
);

type ActiveSpecialAbilityView = Data.ActiveViewObject<Wiki.SpecialAbility>;

export const getGeneralSpecialAbilitiesForSheet = createSelector (
  getSpecialAbilitiesForSheet,
  getLocaleAsProp,
  getCultureAreaKnowledge,
  (maybeSpecialAbilities, locale, cultureAreaKnowledge) => maybeSpecialAbilities.fmap (
    specialAbilities => (
      specialAbilities
        .filter (R.pipe (
          Record.get<ActiveSpecialAbilityView, 'wikiEntry'> ('wikiEntry'),
          Record.get<Wiki.SpecialAbility, 'gr'> ('gr'),
          flip<number, List<number>, boolean> (List.elem) (List.return (1, 2, 22, 30))
        )) as List<Record<ActiveSpecialAbilityView> | string>
    )
      .cons (translate (
        locale,
        'charactersheet.main.generalspecialabilites.areaknowledge',
        Maybe.fromMaybe ('') (cultureAreaKnowledge)
      ))
  )
);

export const getCombatSpecialAbilitiesForSheet = createSelector (
  getSpecialAbilitiesForSheet,
  maybeSpecialAbilities => maybeSpecialAbilities.fmap (
    specialAbilities => specialAbilities
      .filter (R.pipe (
        Record.get<ActiveSpecialAbilityView, 'wikiEntry'> ('wikiEntry'),
        Record.get<Wiki.SpecialAbility, 'gr'> ('gr'),
        flip<number, List<number>, boolean> (List.elem) (List.return (3, 9, 10, 11, 12, 21))
      ))
  )
);

export const getMagicalSpecialAbilitiesForSheet = createSelector (
  getSpecialAbilitiesForSheet,
  maybeSpecialAbilities => maybeSpecialAbilities.fmap (
    specialAbilities => specialAbilities
      .filter (R.pipe (
        Record.get<ActiveSpecialAbilityView, 'wikiEntry'> ('wikiEntry'),
        Record.get<Wiki.SpecialAbility, 'gr'> ('gr'),
        flip<number, List<number>, boolean> (List.elem)
          (List.return (4, 5, 6, 13, 14, 15, 16, 17, 18, 19, 20, 28))
      ))
  )
);

export const getBlessedSpecialAbilitiesForSheet = createSelector (
  getSpecialAbilitiesForSheet,
  maybeSpecialAbilities => maybeSpecialAbilities.fmap (
    specialAbilities => specialAbilities
      .filter (R.pipe (
        Record.get<ActiveSpecialAbilityView, 'wikiEntry'> ('wikiEntry'),
        Record.get<Wiki.SpecialAbility, 'gr'> ('gr'),
        flip<number, List<number>, boolean> (List.elem) (List.return (7, 8, 23, 24, 25, 26, 27, 29))
      ))
  )
);

export const getFatePointsModifier = createSelector (
  mapGetToSlice (getAdvantages, 'ADV_14'),
  mapGetToSlice (getDisadvantages, 'DISADV_31'),
  getModifierByIsActive
);

export const getMagicalTraditionForSheet = createSelector (
  getMagicalTraditionsFromWikiState,
  maybeSpecialAbilities => maybeSpecialAbilities.fmap (
    specialAbilities => specialAbilities
      .map (R.pipe (
        Record.get<Wiki.SpecialAbility, 'name'> ('name'),
        getBracketedNameFromFullName
      ))
      .intercalate (', ')
  )
);

export const getPropertyKnowledgesForSheet = createSelector (
  mapGetToSlice (getSpecialAbilities, 'SA_72'),
  getWikiSpecialAbilities,
  (propertyKnowledge, wikiSpecialAbilities) =>
    wikiSpecialAbilities.lookup ('SA_72').fmap (
      wikiPropertyKnowledge => getActiveSelections (propertyKnowledge).fmap (
        Maybe.mapMaybe (R.pipe (
          Maybe.return,
          e => getSelectOptionName (wikiPropertyKnowledge, e)
        ))
      )
    )
);

export const getBlessedTraditionForSheet = createSelector (
  getBlessedTraditionFromWikiState,
  maybeTradition => maybeTradition.fmap (R.pipe (
    Record.get<Wiki.SpecialAbility, 'name'> ('name'),
    getBracketedNameFromFullName
  ))
);

export const getAspectKnowledgesForSheet = createSelector (
  mapGetToSlice (getSpecialAbilities, 'SA_87'),
  getWikiSpecialAbilities,
  (aspectKnowledge, wikiSpecialAbilities) =>
    wikiSpecialAbilities.lookup ('SA_87').fmap (
      wikiAspectKnowledge => getActiveSelections (aspectKnowledge).fmap (
        Maybe.mapMaybe (R.pipe (
          Maybe.return,
          e => getSelectOptionName (wikiAspectKnowledge, e)
        ))
      )
    )
);

export const getInitialStartingWealth = createSelector (
  mapGetToSlice (getAdvantages, 'ADV_36'),
  mapGetToSlice (getDisadvantages, 'DISADV_2'),
  (rich, poor) => getModifierByActiveLevel (rich) (poor) (Just (0)) * 250 + 750
);

export const isAlbino = createSelector (
  mapGetToSlice (getDisadvantages, 'DISADV_45'),
  R.pipe (
    getActiveSelections,
    Maybe.fmap (List.elem<string | number> (1))
  )
);
