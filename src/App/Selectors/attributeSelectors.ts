import { equals } from "../../Data/Eq";
import { blackbirdF, flip } from "../../Data/Function";
import { fmap, fmapF, mapReplace } from "../../Data/Functor";
import { cons, consF, elem, filter, find, List, maximum } from "../../Data/List";
import { and, any, bind, bindF, ensure, fromJust, fromMaybe, isJust, isNothing, join, Just, liftM2, mapMaybe, maybe, Maybe, Nothing, or } from "../../Data/Maybe";
import { foldr, keys, lookup, lookup2, lookupF, OrderedMap } from "../../Data/OrderedMap";
import { fst, snd, uncurryN } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { AttributeDependent, createPlainAttributeDependent } from "../Models/ActiveEntries/AttributeDependent";
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel";
import { AttributeCombined, newAttributeCombined } from "../Models/View/AttributeCombined";
import { AttributeWithRequirements } from "../Models/View/AttributeWithRequirements";
import { Attribute } from "../Models/Wiki/Attribute";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { Race } from "../Models/Wiki/Race";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { flattenDependencies } from "../Utilities/Dependencies/flattenDependencies";
import { getNumericMagicalTraditionIdByInstanceId, prefixId } from "../Utilities/IDUtils";
import { add, gte, lt, multiply, subtractBy } from "../Utilities/mathUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { getCurrentEl, getStartEl } from "./elSelectors";
import { getBlessedTraditionFromState } from "./liturgicalChantsSelectors";
import { getCurrentRace } from "./rcpSelectors";
import { getMagicalTraditionsFromHero } from "./spellsSelectors";
import { getAttributes, getAttributeValueLimit, getCurrentAttributeAdjustmentId, getCurrentHeroPresent, getPhase, getWiki, getWikiAttributes } from "./stateSelectors";

const ACA = AttributeCombined.A
const AA = Attribute.A
const ADA = AttributeDependent.A
const AWRA = AttributeWithRequirements.A

export const getAttributeSum = createMaybeSelector (
  getAttributes,
  maybe (0) (foldr (pipe (ADA.value, add)) (0))
)

/**
 * Returns the modifier if the attribute specified by `id` is a member of the
 * race `race`
 */
const getModIfSelectedAdjustment =
  (id: string) =>
  (race: Record<Race>) =>
    pipe_ (
      race,
      Race.A.attributeAdjustmentsSelection,
      snd,
      ensure (elem (id)),
      mapReplace (fst (Race.A.attributeAdjustmentsSelection (race))),
      Maybe.sum
    )

const getModIfStaticAdjustment =
  (id: string) =>
    pipe (
      Race.A.attributeAdjustments,
      List.lookup (id),
      Maybe.sum
    )

const getAttributeMaximum =
  (id: string) =>
  (mrace: Maybe<Record<Race>>) =>
  (adjustmentId: string) =>
  (startEl: Maybe<Record<ExperienceLevel>>) =>
  (currentEl: Maybe<Record<ExperienceLevel>>) =>
  (phase: Maybe<number>) =>
  (attributeValueLimit: Maybe<boolean>): Maybe<number> => {
    if (any (lt (3)) (phase)) {
      if (isJust (mrace)) {
        const race = fromJust (mrace)
        const selectedAdjustment = adjustmentId === id ? getModIfSelectedAdjustment (id) (race) : 0
        const staticAdjustment = getModIfStaticAdjustment (id) (race)

        return fmapF (startEl)
                     (pipe (
                       ExperienceLevel.A.maxAttributeValue,
                       add (selectedAdjustment + staticAdjustment)
                     ))
      }

      return Just (0)
    }

    if (or (attributeValueLimit)) {
      return fmapF (currentEl) (pipe (ExperienceLevel.A.maxAttributeValue, add (2)))
    }

    return Nothing
  }

const getAttributeMinimum =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (dependencies: AttributeDependent["dependencies"]): number =>
    maximum (cons (flattenDependencies (wiki) (hero) (dependencies))
                  (8))

/**
 * Returns a `List` of attributes including state, full wiki infos and a
 * minimum and optional maximum value.
 */
export const getAttributesForView = createMaybeSelector (
  getCurrentHeroPresent,
  getStartEl,
  getCurrentEl,
  getPhase,
  getAttributeValueLimit,
  getWiki,
  getCurrentRace,
  (mhero, startEl, currentEl, mphase, attributeValueLimit, wiki, mrace) =>
    fmapF (mhero)
          (hero => foldr ((wiki_entry: Record<Attribute>) => {
                           const current_id = AA.id (wiki_entry)

                           const hero_entry = fromMaybe (createPlainAttributeDependent (current_id))
                                                        (pipe_ (
                                                          hero,
                                                          HeroModel.A.attributes,
                                                          lookup (current_id)
                                                        ))

                           const max =
                            getAttributeMaximum (current_id)
                                                (mrace)
                                                (HeroModel.A.attributeAdjustmentSelected (hero))
                                                (startEl)
                                                (currentEl)
                                                (mphase)
                                                (attributeValueLimit)

                           const min =
                             getAttributeMinimum (wiki)
                                                 (hero)
                                                 (ADA.dependencies (hero_entry))

                           return consF (AttributeWithRequirements ({
                                          max,
                                          min,
                                          stateEntry: hero_entry,
                                          wikiEntry: wiki_entry,
                                        }))
                         })
                         (List.empty)
                         (WikiModel.A.attributes (wiki)))
)

/**
 * Returns a `List` of attributes containing the current state and full wiki
 * info.
 */
export const getAttributesForSheet = createMaybeSelector (
  getAttributes,
  getWikiAttributes,
  (mhero_attributes, wiki_attributes) =>
    fmapF (mhero_attributes)
          (hero_attributes =>
            mapMaybe (flip (flip (lookup2 (newAttributeCombined))
                                          (wiki_attributes))
                           (hero_attributes))
                     (keys (wiki_attributes)))
)

/**
 * Returns the maximum attribute value of the list of given attribute ids.
 */
export const getMaxAttributeValueByID =
  (attributes: HeroModel["attributes"]) =>
    pipe (
      mapMaybe (pipe (lookupF (attributes), fmap (ADA.value))),
      consF (8),
      maximum
    )

const getAttributeCombined =
  (wiki_attributes: OrderedMap<string, Record<Attribute>>) =>
  (mhero_attributes: Maybe<OrderedMap<string, Record<AttributeDependent>>>) =>
  (id: string) =>
    bind (mhero_attributes)
         (lookup2 (newAttributeCombined)
                  (id)
                  (wiki_attributes))

const getPrimaryMagicalAttributeByTrad =
  (wiki_attributes: WikiModel["attributes"]) =>
  (mhero_attributes: Maybe<HeroModel["attributes"]>) =>
  (tradition: Record<ActivatableDependent>): Maybe<Record<AttributeCombined>> =>
    pipe_ (
      tradition,
      ActivatableDependent.A.id,
      getNumericMagicalTraditionIdByInstanceId,
      bindF (numericId => {
        switch (numericId) {
          case 1:
          case 4:
          case 10:
            return getAttributeCombined (wiki_attributes)
                                        (mhero_attributes)
                                        (prefixId (IdPrefixes.ATTRIBUTES) (2))

          case 3:
            return getAttributeCombined (wiki_attributes)
                                        (mhero_attributes)
                                        (prefixId (IdPrefixes.ATTRIBUTES) (3))

          case 2:
          case 5:
          case 6:
          case 7:
            return getAttributeCombined (wiki_attributes)
                                        (mhero_attributes)
                                        (prefixId (IdPrefixes.ATTRIBUTES) (4))

          default:
            return Nothing
        }
      })
    )

const mgetValueFromAttrCombined = fmap (pipe (ACA.stateEntry, ADA.value))

export const getPrimaryMagicalAttribute = createMaybeSelector (
  getMagicalTraditionsFromHero,
  getAttributes,
  getWikiAttributes,
  (mtraditions, mhero_attributes, wiki_attributes) =>
    bind (mtraditions)
         (List.foldr ((trad: Record<ActivatableDependent>) =>
                       (mhighest: Maybe<Record<AttributeCombined>>) => {
                         const mattr = getPrimaryMagicalAttributeByTrad (wiki_attributes)
                                                                        (mhero_attributes)
                                                                        (trad)

                         const attrVal = mgetValueFromAttrCombined (mattr)

                         return and (liftM2 (lt) (attrVal) (mgetValueFromAttrCombined (mhighest)))
                           ? mattr
                           : mhighest
                       })
                     (Nothing))
)

export const getPrimaryMagicalAttributeForSheet = createMaybeSelector (
  getPrimaryMagicalAttribute,
  fmap (pipe (ACA.wikiEntry, AA.short))
)

const getPrimaryBlessedAttributeByTrad =
  (wiki_attributes: WikiModel["attributes"]) =>
  (mhero_attributes: Maybe<HeroModel["attributes"]>) =>
  (tradition: Record<ActivatableDependent>): Maybe<Record<AttributeCombined>> =>
    pipe_ (
      tradition,
      ActivatableDependent.A.id,
      getNumericMagicalTraditionIdByInstanceId,
      bindF (numericId => {
        switch (numericId) {
          case 2:
          case 3:
          case 9:
          case 13:
          case 16:
          case 18:
            return getAttributeCombined (wiki_attributes)
                                        (mhero_attributes)
                                        (prefixId (IdPrefixes.ATTRIBUTES) (1))

          case 1:
          case 4:
          case 8:
          case 17:
            return getAttributeCombined (wiki_attributes)
                                        (mhero_attributes)
                                        (prefixId (IdPrefixes.ATTRIBUTES) (2))

          case 5:
          case 6:
          case 11:
          case 14:
            return getAttributeCombined (wiki_attributes)
                                        (mhero_attributes)
                                        (prefixId (IdPrefixes.ATTRIBUTES) (3))

          case 7:
          case 10:
          case 12:
          case 15:
            return getAttributeCombined (wiki_attributes)
                                        (mhero_attributes)
                                        (prefixId (IdPrefixes.ATTRIBUTES) (4))

          default:
            return Nothing
        }
      })
    )

export const getPrimaryBlessedAttribute = createMaybeSelector (
  getBlessedTraditionFromState,
  getAttributes,
  getWikiAttributes,
  (mtradition, mhero_attributes, wiki_attributes) =>
    bind (mtradition)
        (getPrimaryBlessedAttributeByTrad (wiki_attributes)
                                          (mhero_attributes))
)

export const getPrimaryBlessedAttributeForSheet = createMaybeSelector (
  getPrimaryBlessedAttribute,
  fmap (pipe (ACA.wikiEntry, AA.short))
)

export const getCarryingCapacity = createMaybeSelector (
  getAttributes,
  pipe (bindF (lookup ("ATTR_8")), fmap (pipe (ADA.value, multiply (2))))
)

export const getAdjustmentValue = createMaybeSelector (
  getCurrentRace,
  fmap (pipe (Race.A.attributeAdjustmentsSelection, fst))
)

export const getCurrentAttributeAdjustment = createMaybeSelector (
  getCurrentAttributeAdjustmentId,
  getAttributesForView,
  uncurryN (blackbirdF (liftM2 ((id: string) => find (pipe (AWRA.wikiEntry, AA.id, equals (id)))))
                       (join as join<Record<AttributeWithRequirements>>))
)

export const getAvailableAdjustmentIds = createMaybeSelector (
  getCurrentRace,
  getAdjustmentValue,
  getAttributesForView,
  getCurrentAttributeAdjustment,
  (mrace, madjustmentValue, mattrsCalculated, mcurr_attr) =>
    fmapF (mrace)
          (pipe (
            Race.A.attributeAdjustmentsSelection,
            snd,
            adjustmentIds => {
              if (isJust (mcurr_attr)) {
                const curr_attr = fromJust (mcurr_attr)

                const curr_attr_val = pipe_ (curr_attr, AWRA.stateEntry, ADA.value)

                if (or (pipe_ (curr_attr, AWRA.max, liftM2 (blackbirdF (subtractBy)
                                                                       (lt (curr_attr_val)))
                                                           (madjustmentValue)))) {
                  const curr_attr_id = pipe_ (curr_attr, AWRA.stateEntry, ADA.id)

                  return List (curr_attr_id)
                }
              }

              return filter ((id: string) => {
                              const mattr = bind (mattrsCalculated)
                                                 (find (pipe (AWRA.wikiEntry, AA.id, equals (id))))

                              if (isJust (mattr)) {
                                const attr = fromJust (mattr)

                                const mmax = AWRA.max (attr)

                                const mcurr_attr_id = fmapF (mcurr_attr)
                                                            (pipe (AWRA.stateEntry, ADA.id))

                                if (isNothing (mmax) || Maybe.elem (id) (mcurr_attr_id)) {
                                  return true
                                }

                                if (isJust (madjustmentValue)) {
                                  const attr_val = pipe_ (attr, AWRA.stateEntry, ADA.value)

                                  return maybe (true)
                                               (pipe (
                                                 add (fromJust (madjustmentValue)),
                                                 gte (attr_val)
                                               ))
                                               (mmax)
                                }
                              }

                              return false
                            })
                            (adjustmentIds)
            }
          ))
)
