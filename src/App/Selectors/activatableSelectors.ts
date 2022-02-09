import { flip, ident } from "../../Data/Function"
import { fmap, fmapF } from "../../Data/Functor"
import { consF, filter, filterMulti, foldr, intercalate, List, map, notElemF, toArray } from "../../Data/List"
import { bindF, elemF, fromMaybe, Just, liftM2, liftM3, listToMaybe, mapMaybe, Maybe, Nothing } from "../../Data/Maybe"
import { insert, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap"
import { member, OrderedSet } from "../../Data/OrderedSet"
import { Record } from "../../Data/Record"
import { uncurryN, uncurryN3 } from "../../Data/Tuple/Curry"
import { ActivatableCategory, Category } from "../Constants/Categories"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../Constants/Ids"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject"
import { ActiveObjectWithId } from "../Models/ActiveEntries/ActiveObjectWithId"
import { EntryRating } from "../Models/Hero/heroTypeHelpers"
import { ActivatableActivationValidation } from "../Models/View/ActivatableActivationValidationObject"
import { ActivatableCombinedName } from "../Models/View/ActivatableCombinedName"
import { ActivatableNameCost } from "../Models/View/ActivatableNameCost"
import { ActiveActivatable, ActiveActivatableA_ } from "../Models/View/ActiveActivatable"
import { Advantage } from "../Models/Wiki/Advantage"
import { Culture } from "../Models/Wiki/Culture"
import { Disadvantage } from "../Models/Wiki/Disadvantage"
import { Profession } from "../Models/Wiki/Profession"
import { Race } from "../Models/Wiki/Race"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { SelectOption } from "../Models/Wiki/sub/SelectOption"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"
import { heroReducer } from "../Reducers/heroReducer"
import { getAllActiveByCategory } from "../Utilities/Activatable/activatableActiveUtils"
import { modifyByLevel } from "../Utilities/Activatable/activatableModifierUtils"
import { getBracketedNameFromFullName } from "../Utilities/Activatable/activatableNameUtils"
import { isMaybeActive } from "../Utilities/Activatable/isActive"
import { getActiveSelections, getSelectOptionName } from "../Utilities/Activatable/selectionUtils"
import { createMapSelectorP } from "../Utilities/createMapSelector"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { compareLocale } from "../Utilities/I18n"
import { ensure, Nothing as NewNothing, Nullable, toNewMaybe } from "../Utilities/Maybe"
import { pipe, pipe_ } from "../Utilities/pipe"
import { mapCurrentHero, mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils"
import { blessedSpecialAbilityGroups, combatSpecialAbilityGroups, generalSpecialAbilityGroups, magicalSpecialAbilityGroups } from "../Utilities/sheetUtils"
import { comparingR, sortStrings } from "../Utilities/sortBy"
import { isNumber, misStringM } from "../Utilities/typeCheckUtils"
import { getCulture } from "./cultureSelectors"
import { getBlessedTraditionFromWikiState } from "./liturgicalChantsSelectors"
import { getProfession } from "./professionSelectors"
import { getAutomaticAdvantages, getRace } from "./raceSelectors"
import { getSpecialAbilitiesSortOptions } from "./sortOptionsSelectors"
import { getMagicalTraditionsFromWiki } from "./spellsSelectors"
import { getAdvantages, getAdvantagesFilterText, getCultureAreaKnowledge, getCurrentHeroPresent, getDisadvantages, getDisadvantagesFilterText, getHeroes, getSpecialAbilities, getSpecialAbilitiesFilterText, getWiki, getWikiSpecialAbilities } from "./stateSelectors"

const AAA_ = ActiveActivatableA_
const SAA = SpecialAbility.A
const ADA = ActivatableDependent.A
const AOA = ActiveObject.A
const SOA = SelectOption.A

const getSelectOptions = (specialAbilityOpt: Maybe<Record<SpecialAbility>>) =>
  toNewMaybe (specialAbilityOpt)
    .bind (specialAbility => toNewMaybe (SAA.select (specialAbility)))
    .maybe ([], toArray)

const mapActiveObjects = (
  selectOptions: readonly Record<SelectOption>[],
  characterEntry: Maybe<Record<ActivatableDependent>>,
  activeObjectPred: (activeObject: Record<ActiveObject>) => boolean
): readonly Record<SelectOption>[] =>
    toNewMaybe (characterEntry)
      .map (ADA.active)
      .maybe ([], toArray)
      .mapMaybe (activeObject => {
        const sid = AOA.sid (activeObject)

        if (activeObjectPred (activeObject)) {
          return Nullable (selectOptions.find (pipe (SOA.id, elemF (sid))))
        }
        else {
          return NewNothing
        }
      })

const getActiveObjectsAsSelectOptions = (
  staticEntry: Maybe<Record<SpecialAbility>>,
  characterEntry: Maybe<Record<ActivatableDependent>>,
  activeObjectPred: (activeObject: Record<ActiveObject>) => boolean
) => mapActiveObjects (getSelectOptions (staticEntry), characterEntry, activeObjectPred)

const getActiveScriptsAndLanguages = createMaybeSelector (
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.Literacy),
  mapGetToSlice (getWikiSpecialAbilities) (SpecialAbilityId.Literacy),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.Language),
  mapGetToSlice (getWikiSpecialAbilities) (SpecialAbilityId.Language),
  (mscripts_hero, scripts_wiki, mlanguages_hero, languages_wiki) =>
    ({
      scripts: getActiveObjectsAsSelectOptions (scripts_wiki, mscripts_hero, () => true),
      languages: getActiveObjectsAsSelectOptions (
        languages_wiki,
        mlanguages_hero,
        activeObject => toNewMaybe (AOA.tier (activeObject))
          .maybe (false, level => level >= 3)
      ),
    })
)

export const getScriptsWithMatchingLanguages = createMaybeSelector (
  getActiveScriptsAndLanguages,
  ({ scripts, languages }) => {
    const isMatchingLanguageActive = (script: Record<SelectOption>) =>
      toNewMaybe (SOA.languages (script))
        .maybe ([], toArray)
        .some (matchingLanguageId =>
          languages.some (language =>
            SOA.id (language) === matchingLanguageId))

    return scripts.mapMaybe (script =>
      ensure (script, isMatchingLanguageActive)
        .map (SOA.id)
        .bind (id => ensure (id, isNumber)))
  }
)

export const getLanguagesWithMatchingScripts = createMaybeSelector (
  getActiveScriptsAndLanguages,
  ({ scripts, languages }) =>
    scripts
      .bind (script =>
        toNewMaybe (SOA.languages (script))
          .maybe ([], toArray)
          .filter (matchingLanguageId =>
            languages.some (language =>
              SOA.id (language) === matchingLanguageId)))
      .nub ()
)

export const getLanguagesWithDependingScripts = createMaybeSelector (
  getActiveScriptsAndLanguages,
  ({ scripts }) =>
    scripts
      .map (script =>
        toNewMaybe (SOA.languages (script))
          .maybe ([], toArray))
)

const entriesRequiringMatchingScriptAndLanguage = [
  SpecialAbilityId.Writing,
  SpecialAbilityId.SpeedWriting,
  SpecialAbilityId.Kurzschrift,
  SpecialAbilityId.Kryptographie,
  SpecialAbilityId.WegDerSchreiberin,
]

export const getIsEntryRequiringMatchingScriptAndLangActive = createMaybeSelector (
  getSpecialAbilities,
  specialAbilities => entriesRequiringMatchingScriptAndLanguage.some (pipe (
    lookupF (specialAbilities),
    isMaybeActive
  ))
)

export type MatchingScriptAndLanguageRelated = Readonly<{
  isEntryRequiringMatchingScriptAndLangActive: boolean
  scriptsWithMatchingLanguages: readonly number[]
  languagesWithMatchingScripts: readonly number[]
  languagesWithDependingScripts: readonly (readonly number[])[]
}>

export const getMatchingScriptAndLanguageRelated = createMaybeSelector (
  getIsEntryRequiringMatchingScriptAndLangActive,
  getScriptsWithMatchingLanguages,
  getLanguagesWithMatchingScripts,
  getLanguagesWithDependingScripts,
  (
    isEntryRequiringMatchingScriptAndLangActive,
    scriptsWithMatchingLanguages,
    languagesWithMatchingScripts,
    languagesWithDependingScripts
  ): MatchingScriptAndLanguageRelated => ({
    isEntryRequiringMatchingScriptAndLangActive,
    scriptsWithMatchingLanguages,
    languagesWithMatchingScripts,
    languagesWithDependingScripts,
  })
)

export const getActive = <T extends ActivatableCategory>(category: T, addLevelToName: boolean) =>
  createMaybeSelector (
    getWiki,
    getCurrentHeroPresent,
    getAutomaticAdvantages,
    getMatchingScriptAndLanguageRelated,
    (
      staticData,
      mhero,
      automatic_advantages,
      matchingScriptAndLanguageRelated
    ) =>
      fmapF (mhero) (getAllActiveByCategory (category)
                                            (addLevelToName)
                                            (automatic_advantages)
                                            (matchingScriptAndLanguageRelated)
                                            (staticData))
  )

export const getActiveMap =
  (addLevelToName: boolean) =>
  <T extends ActivatableCategory>
  (category: T) =>
    createMapSelectorP (getHeroes)
                       (
                         getWiki,
                         getAutomaticAdvantages,
                         getMatchingScriptAndLanguageRelated
                       )
                       (heroReducer.A.present)
                       ((staticData, automatic_advantages, matchingScriptAndLanguageRelated) =>
                         getAllActiveByCategory (category)
                                                (addLevelToName)
                                                (automatic_advantages)
                                                (matchingScriptAndLanguageRelated)
                                                (staticData))

export const getActiveForView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, true)

export const getActiveForEditView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, false)

export const getActiveForViewMap = getActiveMap (true)

type RatingMap = OrderedMap<string, EntryRating>

const insertRating = flip (insert as insert<string, EntryRating>)

export const getAdvantagesRating = createMaybeSelector (
  getRace,
  getCulture,
  getProfession,
  (mrace, mculture, mprofession) =>
    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             pipe_ (
               OrderedMap.empty as RatingMap,

               flip (foldr (insertRating (EntryRating.Common)))
                    (Race.A.commonAdvantages (r)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Race.A.uncommonAdvantages (r)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Culture.A.commonAdvantages (c)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Culture.A.uncommonAdvantages (c)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Profession.A.suggestedAdvantages (p)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Profession.A.unsuitableAdvantages (p)),

               flip (foldr (insertRating (EntryRating.Essential)))
                    (Race.A.stronglyRecommendedAdvantages (r))
             ))
           (mrace)
           (mculture)
           (mprofession)
)

export const getDisadvantagesRating = createMaybeSelector (
  getRace,
  getCulture,
  getProfession,
  (mrace, mculture, mprofession) =>
    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             pipe_ (
               OrderedMap.empty as RatingMap,

               flip (foldr (insertRating (EntryRating.Common)))
                    (Race.A.commonDisadvantages (r)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Race.A.uncommonDisadvantages (r)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Culture.A.commonDisadvantages (c)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Culture.A.uncommonDisadvantages (c)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Profession.A.suggestedDisadvantages (p)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Profession.A.unsuitableDisadvantages (p)),

               flip (foldr (insertRating (EntryRating.Essential)))
                    (Race.A.stronglyRecommendedDisadvantages (r))
             ))
           (mrace)
           (mculture)
           (mprofession)
)

export const getAdvantagesForSheet = createMaybeSelector (
  getActiveForView (Category.ADVANTAGES),
  ident
)

export const getAdvantagesForEditMap = getActiveForViewMap (Category.ADVANTAGES)

export const getAdvantagesForEdit = mapCurrentHero (getAdvantagesForEditMap)

export const getFilteredActiveAdvantages = createMaybeSelector (
  getAdvantagesForEdit,
  getAdvantagesFilterText,
  getWiki,
  (madvantages, filterText, staticData) =>
    fmapF (madvantages)
          (filterAndSortRecordsBy (0)
                                  <Record<ActiveActivatable<Advantage>>>
                                  ([ ActiveActivatableA_.name ])
                                  ([ comparingR (ActiveActivatableA_.name)
                                                (compareLocale (staticData)) ])
                                  (filterText))
)

export const getDisadvantagesForSheet = createMaybeSelector (
  getActiveForView (Category.DISADVANTAGES),
  ident
)

export const getDisadvantagesForEditMap = getActiveForViewMap (Category.DISADVANTAGES)

export const getDisadvantagesForEdit = mapCurrentHero (getDisadvantagesForEditMap)

export const getFilteredActiveDisadvantages = createMaybeSelector (
  getDisadvantagesForEdit,
  getDisadvantagesFilterText,
  getWiki,
  (mdisadvantages, filterText, staticData) =>
    fmapF (mdisadvantages)
          (filterAndSortRecordsBy (0)
                                  <Record<ActiveActivatable<Disadvantage>>>
                                  ([ ActiveActivatableA_.name ])
                                  ([ comparingR (ActiveActivatableA_.name)
                                                (compareLocale (staticData)) ])
                                  (filterText))
)

export const getSpecialAbilitiesForSheet = createMaybeSelector (
  getActiveForView (Category.SPECIAL_ABILITIES),
  ident
)

export const getSpecialAbilitiesForEditMap = getActiveForViewMap (Category.SPECIAL_ABILITIES)

export const getSpecialAbilitiesForEdit = mapCurrentHero (getSpecialAbilitiesForEditMap)

export const getFilteredActiveSpecialAbilities = createMaybeSelector (
  getSpecialAbilitiesForEdit,
  getSpecialAbilitiesSortOptions,
  getSpecialAbilitiesFilterText,
  (mspecial_abilities, sortOptions, filterText) =>
    fmapF (mspecial_abilities)
          (filterAndSortRecordsBy (0)
                                  <Record<ActiveActivatable<SpecialAbility>>>
                                  ([ AAA_.name, pipe (AAA_.nameInWiki, fromMaybe ("")) ])
                                  (sortOptions)
                                  (filterText))
)

export const getGeneralSpecialAbilitiesForSheet = createMaybeSelector (
  getWikiSpecialAbilities,
  getSpecialAbilitiesForSheet,
  getCultureAreaKnowledge,
  (wiki_special_abilities, mspecial_abilities, culture_area_knowledge_text) =>
    liftM2 ((culture_area_knowledge: Record<SpecialAbility>) =>
            (special_abilities: List<Record<ActiveActivatable<SpecialAbility>>>) =>
              pipe_ (
                special_abilities,
                filterMulti<Record<ActiveActivatable<SpecialAbility>>>
                  (List (
                    pipe (
                      ActiveActivatable.A.wikiEntry,
                      SpecialAbility.AL.gr,
                      flip (member) (generalSpecialAbilityGroups)
                    ),
                    pipe (
                      ActiveActivatable.A.wikiEntry,
                      SpecialAbility.AL.id,
                      notElemF (List<string> (SpecialAbilityId.Literacy, SpecialAbilityId.Language))
                    )
                  )),
                consF (ActiveActivatable ({
                        nameAndCost: ActivatableNameCost ({
                          active: ActiveObjectWithId ({
                            id: SpecialAbility.A.id (culture_area_knowledge),
                            sid: Nothing,
                            sid2: Nothing,
                            tier: Nothing,
                            cost: Nothing,
                            index: Nothing,
                          }),
                          finalCost: 0,
                          naming: ActivatableCombinedName ({
                            name:
                              `${SpecialAbility.A.name (culture_area_knowledge)}`
                              + ` (${fromMaybe ("") (culture_area_knowledge_text)})`,
                            baseName: SpecialAbility.A.name (culture_area_knowledge),
                            addName: culture_area_knowledge_text,
                          }),
                          isAutomatic: false,
                        }),
                        validation: ActivatableActivationValidation ({
                          disabled: true,
                          maxLevel: Nothing,
                          minLevel: Nothing,
                        }),
                        heroEntry: ActivatableDependent.default,
                        wikiEntry: SpecialAbility.default,
                      }) as Record<ActiveActivatable<SpecialAbility>>)
              ))
           (lookup<string> (SpecialAbilityId.AreaKnowledge)
                           (wiki_special_abilities))
           (mspecial_abilities)
)

const getSpecialAbilitiesByGroups =
  (grs: OrderedSet<number>) =>
    fmap (filter (pipe (
      ActiveActivatable.A.wikiEntry,
      SpecialAbility.AL.gr,
      flip (member) (grs)
    ))) as ident<Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>>

export const getCombatSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (combatSpecialAbilityGroups)
)

export const getMagicalSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (magicalSpecialAbilityGroups)
)

export const getBlessedSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (blessedSpecialAbilityGroups)
)

export const getFatePointsModifier = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.Luck),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.BadLuck),
  uncurryN (modifyByLevel (0))
)

export const getMagicalTraditionForSheet = createMaybeSelector (
  getMagicalTraditionsFromWiki,
  pipe (
    map (pipe (SpecialAbility.A.name, getBracketedNameFromFullName)),
    intercalate (", ")
  )
)

export const getBlessedTraditionForSheet = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  fmap (pipe (SpecialAbility.A.name, getBracketedNameFromFullName))
)

const getPropertyOrAspectKnowledgesForSheet =
  uncurryN3 ((staticData: StaticDataRecord) => liftM2 ((wiki_entry: Record<SpecialAbility>) =>
                                                        pipe (
                                                          getActiveSelections,
                                                          mapMaybe (pipe (
                                                            Just,
                                                            getSelectOptionName (wiki_entry)
                                                          )),
                                                          sortStrings (staticData),
                                                          intercalate (", ")
                                                        )))

export const getPropertyKnowledgesForSheet = createMaybeSelector (
  getWiki,
  mapGetToSlice (getWikiSpecialAbilities) (SpecialAbilityId.PropertyKnowledge),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.PropertyKnowledge),
  getPropertyOrAspectKnowledgesForSheet
)

export const getAspectKnowledgesForSheet = createMaybeSelector (
  getWiki,
  mapGetToSlice (getWikiSpecialAbilities) (SpecialAbilityId.AspectKnowledge),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.AspectKnowledge),
  getPropertyOrAspectKnowledgesForSheet
)

export const getInitialStartingWealth = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.Rich),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.Poor),
  (rich, poor) => modifyByLevel (0) (rich) (poor) * 250 + 750
)

export const getGuildMageUnfamiliarSpellId = createMaybeSelector (
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.TraditionGuildMages),
  pipe (
    bindF (pipe (ActivatableDependent.A.active, listToMaybe)),
    fmap (pipe (ActiveObject.A.sid, misStringM))
  )
)
