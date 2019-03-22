import * as R from 'ramda';
import { ActivatableCategory, Categories } from '../Constants/Categories';
import * as Data from '../Models/Hero/heroTypeHelpers';
import * as Wiki from '../Models/Wiki/wikiTypeHelpers';
import { getAllActiveByCategory } from '../utils/activatable/activatableActiveUtils';
import { getModifierByActiveLevel, getModifierByIsActive } from '../utils/activatable/activatableModifierUtils';
import { getBracketedNameFromFullName } from '../utils/activatable/activatableNameUtils';
import { getActiveSelections, getSelectOptionName } from '../utils/Activatable/selectionUtils';
import { getDisAdvantagesSubtypeMax } from '../utils/adventurePoints/adventurePointsUtils';
import { createMaybeSelector } from '../Utils/createMaybeSelector';
import { Just, List, Maybe, Nothing, OrderedMap, Record } from '../utils/dataUtils';
import { AllSortOptions, filterAndSortObjects } from '../utils/FilterSortUtils';
import { flip } from '../utils/flip';
import { translate } from '../Utils/I18n';
import { mapGetToMaybeSlice } from '../Utils/SelectorsUtils';
import { getBlessedTraditionFromWikiState } from './liturgicalChantsSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentRace } from './rcpSelectors';
import { getSpecialAbilitiesSortOptions } from './sortOptionsSelectors';
import { getMagicalTraditionsFromWikiState } from './spellsSelectors';
import { getAdvantages, getAdvantagesFilterText, getCultureAreaKnowledge, getCurrentHeroPresent, getDisadvantages, getDisadvantagesFilterText, getLocaleAsProp, getSpecialAbilities, getSpecialAbilitiesFilterText, getWiki, getWikiSpecialAbilities } from './stateSelectors';

export const getActive = <T extends ActivatableCategory>(category: T, addTierToName: boolean) =>
  createMaybeSelector (
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

export const getAdvantagesRating = createMaybeSelector (
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

export const getDisadvantagesRating = createMaybeSelector (
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

export const getAdvantagesForSheet = createMaybeSelector (
  getActiveForView (Categories.ADVANTAGES),
  R.identity
);

export const getAdvantagesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.ADVANTAGES),
  R.identity
);

export const getFilteredActiveAdvantages = createMaybeSelector (
  getAdvantagesForEdit,
  getAdvantagesFilterText,
  getLocaleAsProp,
  (maybeAdvantages, filterText, locale) => maybeAdvantages.fmap (
    advantages => filterAndSortObjects (advantages, locale.get ('id'), filterText)
  )
);

export const getDisadvantagesForSheet = createMaybeSelector (
  getActiveForView (Categories.DISADVANTAGES),
  R.identity
);

export const getDisadvantagesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.DISADVANTAGES),
  R.identity
);

export const getFilteredActiveDisadvantages = createMaybeSelector (
  getDisadvantagesForEdit,
  getDisadvantagesFilterText,
  getLocaleAsProp,
  (maybeDisadvantages, filterText, locale) => maybeDisadvantages.fmap (
    disadvantages => filterAndSortObjects (disadvantages, locale.get ('id'), filterText)
  )
);

export const getSpecialAbilitiesForSheet = createMaybeSelector (
  getActiveForView (Categories.SPECIAL_ABILITIES),
  R.identity
);

export const getSpecialAbilitiesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.SPECIAL_ABILITIES),
  R.identity
);

export const getFilteredActiveSpecialAbilities = createMaybeSelector (
  getSpecialAbilitiesForEdit,
  getSpecialAbilitiesSortOptions,
  getSpecialAbilitiesFilterText,
  getLocaleAsProp,
  (maybeSpecialAbilities, sortOptions, filterText, locale) => maybeSpecialAbilities.fmap (
    specialAbilities => filterAndSortObjects (
      specialAbilities,
      locale.get ('id'),
      filterText,
      sortOptions as AllSortOptions<Data.ActiveViewObject<Wiki.SpecialAbility>>
    )
  )
);

type ActiveSpecialAbilityView = Data.ActiveViewObject<Wiki.SpecialAbility>;

export const getGeneralSpecialAbilitiesForSheet = createMaybeSelector (
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

export const getCombatSpecialAbilitiesForSheet = createMaybeSelector (
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

export const getMagicalSpecialAbilitiesForSheet = createMaybeSelector (
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

export const getBlessedSpecialAbilitiesForSheet = createMaybeSelector (
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

export const getFatePointsModifier = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages, 'ADV_14'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_31'),
  (maybeIncrease, maybeDecrease) => getModifierByIsActive (maybeIncrease)
                                                          (maybeDecrease)
                                                          (Nothing ())
);

export const getMagicalTraditionForSheet = createMaybeSelector (
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

export const getPropertyKnowledgesForSheet = createMaybeSelector (
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_72'),
  getWikiSpecialAbilities,
  (propertyKnowledge, wikiSpecialAbilities) =>
    wikiSpecialAbilities.lookup ('SA_72').bind (
      wikiPropertyKnowledge => getActiveSelections (propertyKnowledge).fmap (
        Maybe.mapMaybe (R.pipe (
          Maybe.return,
          e => getSelectOptionName (wikiPropertyKnowledge, e)
        ))
      )
    )
);

export const getBlessedTraditionForSheet = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  maybeTradition => maybeTradition.fmap (R.pipe (
    Record.get<Wiki.SpecialAbility, 'name'> ('name'),
    getBracketedNameFromFullName
  ))
);

export const getAspectKnowledgesForSheet = createMaybeSelector (
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_87'),
  getWikiSpecialAbilities,
  (aspectKnowledge, wikiSpecialAbilities) =>
    wikiSpecialAbilities.lookup ('SA_87').bind (
      wikiAspectKnowledge => getActiveSelections (aspectKnowledge).fmap (
        Maybe.mapMaybe (R.pipe (
          Maybe.return,
          e => getSelectOptionName (wikiAspectKnowledge, e)
        ))
      )
    )
);

export const getInitialStartingWealth = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages, 'ADV_36'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_2'),
  (rich, poor) => getModifierByActiveLevel (rich) (poor) (Just (0)) * 250 + 750
);

export const isAlbino = createMaybeSelector (
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_45'),
  R.pipe (
    getActiveSelections,
    Maybe.fmap (List.elem<string | number> (1))
  )
);

export const getCurrentDisAdvantagesSubtypeMax = createMaybeSelector (
  getCurrentHeroPresent,
  Maybe.fmap (getDisAdvantagesSubtypeMax (true))
);
