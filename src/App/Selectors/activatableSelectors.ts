import { flip, ident } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { elem, foldr } from "../../Data/List";
import { Just, liftM3 } from "../../Data/Maybe";
import { insert, OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { ActivatableCategory, Categories } from "../Constants/Categories";
import { EntryRating } from "../Models/Hero/heroTypeHelpers";
import { Culture } from "../Models/Wiki/Culture";
import { L10n } from "../Models/Wiki/L10n";
import { Profession } from "../Models/Wiki/Profession";
import { Race } from "../Models/Wiki/Race";
import { getAllActiveByCategory } from "../Utilities/Activatable/activatableActiveUtils";
import { getModifierByActiveLevel } from "../Utilities/Activatable/activatableModifierUtils";
import { getActiveSelections } from "../Utilities/Activatable/selectionUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsByName } from "../Utilities/filterAndSortBy";
import { pipe, pipe_ } from "../Utilities/pipe";
import { mapGetToMaybeSlice } from "../Utilities/SelectorsUtils";
import { getBlessedTraditionFromWikiState } from "./liturgicalChantsSelectors";
import { getCurrentCulture, getCurrentProfession, getCurrentRace } from "./rcpSelectors";
import { getSpecialAbilitiesSortOptions } from "./sortOptionsSelectors";
import { getMagicalTraditionsFromWikiState } from "./spellsSelectors";
import { getAdvantages, getAdvantagesFilterText, getCultureAreaKnowledge, getCurrentHeroPresent, getDisadvantages, getDisadvantagesFilterText, getLocaleAsProp, getSpecialAbilities, getSpecialAbilitiesFilterText, getWiki, getWikiSpecialAbilities } from "./stateSelectors";

export const getActive = <T extends ActivatableCategory>(category: T, addLevelToName: boolean) =>
  createMaybeSelector (
    getLocaleAsProp,
    getWiki,
    getCurrentHeroPresent,
    (l10n, wiki, mhero) => fmapF (mhero) (getAllActiveByCategory (category)
                                                                 (addLevelToName)
                                                                 (l10n)
                                                                 (wiki))
  )

export const getActiveForView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, false)

export const getActiveForEditView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, true)

type RatingMap = OrderedMap<string, EntryRating>

const insertRating =
  flip (insert) as (value: EntryRating) => (key: string) => ident<OrderedMap<string, EntryRating>>

export const getAdvantagesRating = createMaybeSelector (
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (mrace, mculture, mprofession) =>
    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             pipe_ (
               OrderedMap.empty as RatingMap,

               flip (foldr (insertRating (EntryRating.Common)))
                    (Race.A_.commonAdvantages (r)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Race.A_.uncommonAdvantages (r)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Culture.A_.commonAdvantages (c)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Culture.A_.uncommonAdvantages (c)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Profession.A_.suggestedAdvantages (p)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Profession.A_.unsuitableAdvantages (p)),

               flip (foldr (insertRating (EntryRating.Essential)))
                    (Race.A_.stronglyRecommendedAdvantages (r))
             ))
           (mrace)
           (mculture)
           (mprofession)
)

export const getDisadvantagesRating = createMaybeSelector (
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (mrace, mculture, mprofession) =>
    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             pipe_ (
               OrderedMap.empty as RatingMap,

               flip (foldr (insertRating (EntryRating.Common)))
                    (Race.A_.commonDisadvantages (r)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Race.A_.uncommonDisadvantages (r)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Culture.A_.commonDisadvantages (c)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Culture.A_.uncommonDisadvantages (c)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Profession.A_.suggestedDisadvantages (p)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Profession.A_.unsuitableDisadvantages (p)),

               flip (foldr (insertRating (EntryRating.Essential)))
                    (Race.A_.stronglyRecommendedDisadvantages (r))
             ))
           (mrace)
           (mculture)
           (mprofession)
)

export const getAdvantagesForSheet = createMaybeSelector (
  getActiveForView (Categories.ADVANTAGES),
  ident
)

export const getAdvantagesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.ADVANTAGES),
  ident
)

export const getFilteredActiveAdvantages = createMaybeSelector (
  getAdvantagesForEdit,
  getAdvantagesFilterText,
  getLocaleAsProp,
  (madvantages, filterText, l10n) =>
    fmapF (madvantages) (filterAndSortRecordsByName (L10n.A_.id (l10n)) (filterText))
)

export const getDisadvantagesForSheet = createMaybeSelector (
  getActiveForView (Categories.DISADVANTAGES),
  ident
)

export const getDisadvantagesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.DISADVANTAGES),
  ident
)

export const getFilteredActiveDisadvantages = createMaybeSelector (
  getDisadvantagesForEdit,
  getDisadvantagesFilterText,
  getLocaleAsProp,
  (mdisadvantages, filterText, l10n) =>
    fmapF (mdisadvantages) (filterAndSortRecordsByName (L10n.A_.id (l10n)) (filterText))
)

export const getSpecialAbilitiesForSheet = createMaybeSelector (
  getActiveForView (Categories.SPECIAL_ABILITIES),
  ident
)

export const getSpecialAbilitiesForEdit = createMaybeSelector (
  getActiveForEditView (Categories.SPECIAL_ABILITIES),
  ident
)

export const getFilteredActiveSpecialAbilities = createMaybeSelector (
  getSpecialAbilitiesForEdit,
  getSpecialAbilitiesSortOptions,
  getSpecialAbilitiesFilterText,
  getLocaleAsProp,
  (maybeSpecialAbilities, sortOptions, filterText, locale) => maybeSpecialAbilities.fmap (
    specialAbilities => filterAndSortObjects (
      specialAbilities,
      locale.get ("id"),
      filterText,
      sortOptions as AllSortOptions<Data.ActiveViewObject<Wiki.SpecialAbility>>
    )
  )
)

type ActiveSpecialAbilityView = Data.ActiveViewObject<Wiki.SpecialAbility>

export const getGeneralSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getLocaleAsProp,
  getCultureAreaKnowledge,
  (maybeSpecialAbilities, locale, cultureAreaKnowledge) => maybeSpecialAbilities.fmap (
    specialAbilities => (
      specialAbilities
        .filter (R.pipe (
          Record.get<ActiveSpecialAbilityView, "wikiEntry"> ("wikiEntry"),
          Record.get<Wiki.SpecialAbility, "gr"> ("gr"),
          flip<number, List<number>, boolean> (List.elem) (List.return (1, 2, 22, 30))
        )) as List<Record<ActiveSpecialAbilityView> | string>
    )
      .cons (translate (
        locale,
        "charactersheet.main.generalspecialabilites.areaknowledge",
        Maybe.fromMaybe ("") (cultureAreaKnowledge)
      ))
  )
)

export const getCombatSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  maybeSpecialAbilities => maybeSpecialAbilities.fmap (
    specialAbilities => specialAbilities
      .filter (R.pipe (
        Record.get<ActiveSpecialAbilityView, "wikiEntry"> ("wikiEntry"),
        Record.get<Wiki.SpecialAbility, "gr"> ("gr"),
        flip<number, List<number>, boolean> (List.elem) (List.return (3, 9, 10, 11, 12, 21))
      ))
  )
)

export const getMagicalSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  maybeSpecialAbilities => maybeSpecialAbilities.fmap (
    specialAbilities => specialAbilities
      .filter (R.pipe (
        Record.get<ActiveSpecialAbilityView, "wikiEntry"> ("wikiEntry"),
        Record.get<Wiki.SpecialAbility, "gr"> ("gr"),
        flip<number, List<number>, boolean> (List.elem)
          (List.return (4, 5, 6, 13, 14, 15, 16, 17, 18, 19, 20, 28))
      ))
  )
)

export const getBlessedSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  maybeSpecialAbilities => maybeSpecialAbilities.fmap (
    specialAbilities => specialAbilities
      .filter (R.pipe (
        Record.get<ActiveSpecialAbilityView, "wikiEntry"> ("wikiEntry"),
        Record.get<Wiki.SpecialAbility, "gr"> ("gr"),
        flip<number, List<number>, boolean> (List.elem) (List.return (7, 8, 23, 24, 25, 26, 27, 29))
      ))
  )
)

export const getFatePointsModifier = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages, "ADV_14"),
  mapGetToMaybeSlice (getDisadvantages, "DISADV_31"),
  (maybeIncrease, maybeDecrease) => getModifierByIsActive (maybeIncrease)
                                                          (maybeDecrease)
                                                          (Nothing ())
)

export const getMagicalTraditionForSheet = createMaybeSelector (
  getMagicalTraditionsFromWikiState,
  maybeSpecialAbilities => maybeSpecialAbilities.fmap (
    specialAbilities => specialAbilities
      .map (R.pipe (
        Record.get<Wiki.SpecialAbility, "name"> ("name"),
        getBracketedNameFromFullName
      ))
      .intercalate (", ")
  )
)

export const getPropertyKnowledgesForSheet = createMaybeSelector (
  mapGetToMaybeSlice (getSpecialAbilities, "SA_72"),
  getWikiSpecialAbilities,
  (propertyKnowledge, wikiSpecialAbilities) =>
    wikiSpecialAbilities.lookup ("SA_72").bind (
      wikiPropertyKnowledge => getActiveSelections (propertyKnowledge).fmap (
        Maybe.mapMaybe (R.pipe (
          Maybe.return,
          e => getSelectOptionName (wikiPropertyKnowledge, e)
        ))
      )
    )
)

export const getBlessedTraditionForSheet = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  maybeTradition => maybeTradition.fmap (R.pipe (
    Record.get<Wiki.SpecialAbility, "name"> ("name"),
    getBracketedNameFromFullName
  ))
)

export const getAspectKnowledgesForSheet = createMaybeSelector (
  mapGetToMaybeSlice (getSpecialAbilities, "SA_87"),
  getWikiSpecialAbilities,
  (aspectKnowledge, wikiSpecialAbilities) =>
    wikiSpecialAbilities.lookup ("SA_87").bind (
      wikiAspectKnowledge => getActiveSelections (aspectKnowledge).fmap (
        Maybe.mapMaybe (R.pipe (
          Maybe.return,
          e => getSelectOptionName (wikiAspectKnowledge, e)
        ))
      )
    )
)

export const getInitialStartingWealth = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages) ("ADV_36"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_2"),
  (rich, poor) => getModifierByActiveLevel (rich) (poor) (Just (0)) * 250 + 750
)

export const isAlbino = createMaybeSelector (
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_45"),
  fmap (pipe (
    getActiveSelections,
    elem<string | number> (1)
  ))
)
