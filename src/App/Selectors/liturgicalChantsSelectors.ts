import { notP } from "../../Data/Bool"
import { equals } from "../../Data/Eq"
import { flip, ident, thrush } from "../../Data/Function"
import { fmap, fmapF, mapReplace } from "../../Data/Functor"
import { over } from "../../Data/Lens"
import { any, append, consF, elem, filter, flength, foldr, List, map, notElem, notNull, partition } from "../../Data/List"
import { all, and, bind, bindF, ensure, fromJust, fromMaybe_, guard, isJust, liftM2, liftM3, mapMaybe, Maybe, Nothing, or } from "../../Data/Maybe"
import { lt, lte } from "../../Data/Num"
import { elems, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap"
import { insert, member, OrderedSet } from "../../Data/OrderedSet"
import { Record } from "../../Data/Record"
import { fst, snd } from "../../Data/Tuple"
import { uncurryN, uncurryN3, uncurryN4, uncurryN5, uncurryN6 } from "../../Data/Tuple/Curry"
import { Aspect, BlessedTradition, IC } from "../Constants/Groups"
import { AdvantageId, SpecialAbilityId } from "../Constants/Ids"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent, createInactiveActivatableSkillDependent } from "../Models/ActiveEntries/ActivatableSkillDependent"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { BlessingCombined, BlessingCombinedA_ } from "../Models/View/BlessingCombined"
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsL } from "../Models/View/LiturgicalChantWithRequirements"
import { Blessing } from "../Models/Wiki/Blessing"
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel"
import { LiturgicalChant, LiturgicalChantL } from "../Models/Wiki/LiturgicalChant"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { StaticData } from "../Models/Wiki/WikiModel"
import { isMaybeActive } from "../Utilities/Activatable/isActive"
import { getBlessedTradition, mapBlessedTradIdToNumId } from "../Utilities/Activatable/traditionUtils"
import { composeL } from "../Utilities/compose"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { getAspectsOfTradition, isLCDecreasable, isLCIncreasable, isOwnTradition } from "../Utilities/Increasable/liturgicalChantUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { filterByAvailability } from "../Utilities/RulesUtils"
import { mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils"
import { sortByMulti } from "../Utilities/sortBy"
import { getStartEl } from "./elSelectors"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getBlessingsSortOptions, getLiturgicalChantsCombinedSortOptions, getLiturgicalChantsSortOptions } from "./sortOptionsSelectors"
import { getAdvantages, getBlessings, getCurrentHeroPresent, getCurrentPhase, getInactiveLiturgicalChantsFilterText, getLiturgicalChants, getLiturgicalChantsFilterText, getMaybeSpecialAbilities, getSpecialAbilities, getWiki, getWikiBlessings, getWikiLiturgicalChants, getWikiSpecialAbilities } from "./stateSelectors"
import { getEnableActiveItemHints } from "./uisettingsSelectors"

const HA = HeroModel.A
const SDA = StaticData.A
const ELA = ExperienceLevel.A
const ADA = ActivatableDependent.A
const ASDA = ActivatableSkillDependent.A
const BA = Blessing.A
const BCA = BlessingCombined.A
const BCA_ = BlessingCombinedA_
const LCWRA = LiturgicalChantWithRequirements.A
const LCWRL = LiturgicalChantWithRequirementsL
const LCA = LiturgicalChant.A
const LCL = LiturgicalChantL

export const getBlessedTraditionFromState = createMaybeSelector (
  getSpecialAbilities,
  getBlessedTradition
)

const getMaybeBlessedTraditionFromState = createMaybeSelector (
  getMaybeSpecialAbilities,
  bindF (getBlessedTradition)
)

export const getBlessedTraditionFromWikiState = createMaybeSelector (
  getWikiSpecialAbilities,
  getBlessedTraditionFromState,
  uncurryN (
    wiki_special_abilities =>
      bindF (pipe (ActivatableDependent.A.id, lookupF (wiki_special_abilities)))
  )
)

export const getIsLiturgicalChantsTabAvailable = createMaybeSelector (
  getMaybeBlessedTraditionFromState,
  isJust
)

export const getBlessedTraditionNumericId = createMaybeSelector (
  getBlessedTraditionFromState,
  bindF (pipe (ADA.id, mapBlessedTradIdToNumId))
)

export const getActiveLiturgicalChants = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  getStartEl,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.ExceptionalSkill),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.AspectKnowledge),
  getWiki,
  getCurrentHeroPresent,
  (mblessed_trad, mstart_el, mexceptional_skill, maspect_knowledge, wiki, mhero) =>
    bind (mblessed_trad)
         (blessed_trad =>
           liftM2 ((hero: HeroModelRecord) => (start_el: Record<ExperienceLevel>) =>
                    thrush (elems (HA.liturgicalChants (hero)))
                           (mapMaybe (pipe (
                             ensure (ASDA.active),
                             bindF (hero_entry =>
                                     pipe_ (
                                       wiki,
                                       SDA.liturgicalChants,
                                       lookup (ASDA.id (hero_entry)),
                                       fmap (wiki_entry =>
                                         LiturgicalChantWithRequirements ({
                                           isIncreasable:
                                             isLCIncreasable (blessed_trad)
                                                             (start_el)
                                                             (HA.phase (hero))
                                                             (HA.attributes (hero))
                                                             (mexceptional_skill)
                                                             (maspect_knowledge)
                                                             (wiki_entry)
                                                             (hero_entry),
                                           isDecreasable:
                                             isLCDecreasable (wiki)
                                                             (hero)
                                                             (maspect_knowledge)
                                                             (wiki_entry)
                                                             (hero_entry),
                                           stateEntry: hero_entry,
                                           wikiEntry: wiki_entry,
                                         }))
                                     ))
                           ))))
                  (mhero)
                  (mstart_el))
)

export const getActiveAndInactiveBlessings = createMaybeSelector (
  getWikiBlessings,
  getBlessings,
  uncurryN (wiki_blessings => fmap (hero_blessings => pipe_ (
                                                              wiki_blessings,
                                                              elems,
                                                              map (wiki_entry => BlessingCombined ({
                                                                wikiEntry: wiki_entry,
                                                                active: member (BA.id (wiki_entry))
                                                                               (hero_blessings),
                                                              })),
                                                              partition (BCA.active)
                                                            )))
)

export const getActiveBlessings = createMaybeSelector (
  getActiveAndInactiveBlessings,
  fmap (fst)
)

const getInactiveBlessings = createMaybeSelector (
  getActiveAndInactiveBlessings,
  fmap (snd)
)

export const getAvailableInactiveBlessings = createMaybeSelector (
  getBlessedTraditionNumericId,
  getInactiveBlessings,
  uncurryN (liftM2 (id => filter (pipe (BCA_.tradition, any (equals (id))))))
)

export const getActiveLiturgicalChantsCounter = createMaybeSelector (
  getActiveLiturgicalChants,
  pipe (
    fmap (flength),
    Maybe.sum
  )
)

export const getIsMaximumOfLiturgicalChantsReached = createMaybeSelector (
  getActiveLiturgicalChantsCounter,
  getCurrentPhase,
  getStartEl,
  uncurryN3 (active =>
             liftM2 (phase =>
                     start_el => {
                       if (phase > 2) {
                         return false
                       }

                       return active >= ELA.maxSpellsLiturgicalChants (start_el)
                     }))
)

type Combined = Record<LiturgicalChantWithRequirements>

export const getInactiveLiturgicalChants = createMaybeSelector (
  getIsMaximumOfLiturgicalChantsReached,
  getWikiLiturgicalChants,
  getLiturgicalChants,
  uncurryN3 (
    is_max =>
    wiki_chants =>
      fmap (hero_chants =>
        and (is_max)
        ? List<Combined> ()
        : OrderedMap.foldrWithKey ((k: string) => (wiki_entry: Record<LiturgicalChant>) => {
                                    const mhero_entry = lookup (k) (hero_chants)

                                    if (all (notP (ASDA.active)) (mhero_entry)) {
                                      return consF (LiturgicalChantWithRequirements ({
                                        wikiEntry: wiki_entry,
                                        stateEntry:
                                         fromMaybe_ (() =>
                                                      createInactiveActivatableSkillDependent (k))
                                                    (mhero_entry),
                                        isDecreasable: Nothing,
                                        isIncreasable: Nothing,
                                      }))
                                    }

                                    return ident as ident<List<Combined>>
                                  })
                                  (List ())
                                  (wiki_chants))
  )
)

const additionalInactiveListFilter = (
  check: (e: Record<LiturgicalChantWithRequirements>) => boolean,
  activeTraditionId: number,
  inactives: List<Record<LiturgicalChantWithRequirements>>,
  actives: List<Record<LiturgicalChantWithRequirements>>
): List<string> => {
  const fullCheck = (x: Record<LiturgicalChantWithRequirements>) =>
    notElem (activeTraditionId) (LCA.tradition (LCWRA.wikiEntry (x)))
    && check (x)

  if (!any (fullCheck) (actives)) {
    return mapMaybe ((chant: Record<LiturgicalChantWithRequirements>) => {
                      const wiki_entry = LCWRA.wikiEntry (chant)

                      const isTraditionValid =
                        notElem (1) (LCA.tradition (wiki_entry))
                        && fullCheck (chant)

                      const isICValid = LCA.ic (wiki_entry) <= IC.C

                      return mapReplace (LCA.id (wiki_entry))
                                        (guard (isTraditionValid && isICValid))
                    })
                    (inactives)
  }

  return List ()
}

const isTrad =
  (trad_id: number) => pipe (LCWRA.wikiEntry, LCA.tradition, elem (trad_id))

const isGr =
  (gr_id: number) => pipe (LCWRA.wikiEntry, LCA.gr, equals (gr_id))

export const getAdditionalValidLiturgicalChants = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.Zugvoegel),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.JaegerinnenDerWeißenMaid),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.AnhaengerDesGueldenen),
  getInactiveLiturgicalChants,
  getActiveLiturgicalChants,
  uncurryN6 (
    mcurrent_trad =>
    zugvoegel =>
    jaegerinnen_der_weissen_maid =>
    anhaenger_des_gueldenen =>
    liftM2 (
      inactives =>
      actives => {
        if (isJust (mcurrent_trad)) {
          const tradition = fromJust (mcurrent_trad)
          const maybeTraditionId = mapBlessedTradIdToNumId (SpecialAbility.A.id (tradition))

          if (isJust (maybeTraditionId)) {
            const traditionId = fromJust (maybeTraditionId)

            if (isMaybeActive (zugvoegel)) {
              return append (additionalInactiveListFilter (
                                                            isTrad (BlessedTradition.ChurchOfPhex),
                                                            traditionId,
                                                            inactives,
                                                            actives
                                                          ))

                            (additionalInactiveListFilter (
                                                            isTrad (BlessedTradition.ChurchOfRahja),
                                                            traditionId,
                                                            inactives,
                                                            actives
                                                          ))
            }

            if (isMaybeActive (jaegerinnen_der_weissen_maid)) {
              const isFirun = isTrad (BlessedTradition.ChurchOfFirun)

                            // Firun Liturgical Chant
              return append (additionalInactiveListFilter (
                                                            e => isFirun (e) && isGr (1) (e),
                                                            traditionId,
                                                            inactives,
                                                            actives
                                                          ))

                            // Firun Ceremony
                            (additionalInactiveListFilter (
                                                            e => isFirun (e) && isGr (2) (e),
                                                            traditionId,
                                                            inactives,
                                                            actives
                                                          ))
            }
          }

          if (isMaybeActive (anhaenger_des_gueldenen)) {
            const unfamiliar_chants =
              filter ((active: Record<LiturgicalChantWithRequirements>) =>
                       !isOwnTradition (tradition)
                                       (LCWRA.wikiEntry (active)))
                     (actives)

            const inactive_with_valid_IC = filter (pipe (LCWRA.wikiEntry, LCA.ic, lte (2)))
                                                  (inactives)

            if (notNull (unfamiliar_chants)) {
              const other_trads =
                foldr (pipe (LCWRA.wikiEntry, LCA.tradition, flip (foldr (insert))))
                      (OrderedSet.empty)
                      (unfamiliar_chants)

              return pipe_ (
                inactive_with_valid_IC,
                filter (pipe (LCWRA.wikiEntry, LCA.tradition, any (flip (member) (other_trads)))),
                map (pipe (LCWRA.wikiEntry, LCA.id))
              )
            }

            return map (pipe (LCWRA.wikiEntry, LCA.id))
                       (inactive_with_valid_IC)
          }
        }

        return List.empty
      }
    )
  )
)

export const getAvailableInactiveLiturgicalChants = createMaybeSelector (
  getRuleBooksEnabled,
  getAdditionalValidLiturgicalChants,
  getBlessedTraditionFromWikiState,
  getInactiveLiturgicalChants,
  uncurryN4 (availability =>
             liftM3 (add_valid_chants =>
                     current_trad =>
                       pipe (
                         filter (e => {
                           const is_own_trad = isOwnTradition (current_trad)
                                                              (LCWRA.wikiEntry (e))

                           return is_own_trad || elem (pipe_ (e, LCWRA.wikiEntry, LCA.id))
                                                      (add_valid_chants)
                         }),
                         filterByAvailability (pipe (LCWRA.wikiEntry, LCA.src)) (availability)
                       )))
)

type ListCombined = List<Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>>

export const getActiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getActiveLiturgicalChants,
  getActiveBlessings,
  uncurryN (liftM2<ListCombined, ListCombined, ListCombined> (append))
)

export const getAvailableInactiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getAvailableInactiveLiturgicalChants,
  getAvailableInactiveBlessings,
  uncurryN (liftM2<ListCombined, ListCombined, ListCombined> (append))
)

type getNameFromChantOrBlessing =
  (x: Record<LiturgicalChantWithRequirements | BlessingCombined>) => string

const getNameFromChantOrBlessing =
  (x: Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>) =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (x, LCWRA.wikiEntry, LCA.name)
      : pipe_ (x, BCA.wikiEntry, BA.name)

export const getFilteredActiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getActiveLiturgicalChantsAndBlessings,
  getLiturgicalChantsCombinedSortOptions,
  getLiturgicalChantsFilterText,
  (mcombineds, sort_options, filter_text) =>
    fmapF (mcombineds)
          (filterAndSortRecordsBy (0)
                                  ([ getNameFromChantOrBlessing as getNameFromChantOrBlessing ])
                                  (sort_options)
                                  (filter_text)) as Maybe<ListCombined>
)

export const getFilteredInactiveLiturgicalChantsAndBlessings = createMaybeSelector (
  getLiturgicalChantsCombinedSortOptions,
  getInactiveLiturgicalChantsFilterText,
  getEnableActiveItemHints,
  getAvailableInactiveLiturgicalChantsAndBlessings,
  getActiveLiturgicalChantsAndBlessings,
  uncurryN5 (sort_options =>
             filter_text =>
             areActiveItemHintsEnabled =>
             liftM2 (inactive =>
                     active =>
                       filterAndSortRecordsBy (0)
                                              ([ getNameFromChantOrBlessing as
                                                 getNameFromChantOrBlessing ])
                                              (sort_options)
                                              (filter_text)
                                              (areActiveItemHintsEnabled
                                                ? append (active) (inactive)
                                                : inactive) as ListCombined))
)

export const isActivationDisabled = createMaybeSelector (
  getStartEl,
  getCurrentPhase,
  getActiveLiturgicalChantsCounter,
  (mstart_el, mphase, active_chants) =>
    or (fmap (lt (3)) (mphase))
    && or (fmap ((startEl: Record<ExperienceLevel>) =>
                   active_chants >= ExperienceLevel.A.maxSpellsLiturgicalChants (startEl))
                (mstart_el))
)

export const getBlessingsForSheet = createMaybeSelector (
  getBlessingsSortOptions,
  getActiveBlessings,
  uncurryN (sort_options => fmap (sortByMulti (sort_options)))
)

export const getLiturgicalChantsForSheet = createMaybeSelector (
  getLiturgicalChantsSortOptions,
  getActiveLiturgicalChants,
  getBlessedTraditionFromState,
  uncurryN3 (sort_options =>
             mchants => pipe (
                         bindF (pipe (ADA.id, mapBlessedTradIdToNumId)),
                         fmap (getAspectsOfTradition),
                         liftM2 (flip ((available_aspects: List<Aspect>) =>
                                        map (over (composeL (LCWRL.wikiEntry, LCL.aspects))
                                                  (filter (flip (elem) (available_aspects))))))
                                (mchants),
                         fmap (sortByMulti (sort_options))
                       ))
)
