import { equals } from "../../Data/Eq"
import { flip, ident, thrush } from "../../Data/Function"
import { fmap, fmapF } from "../../Data/Functor"
import { set } from "../../Data/Lens"
import { any, append, consF, filter, foldr, ifilter, imap, List, map, maximum, subscript, sum } from "../../Data/List"
import { altF_, bind, bindF, fromMaybe, guard, isJust, Just, liftM2, mapMaybe, Maybe, maybe, Nothing, thenF } from "../../Data/Maybe"
import { add, dec, multiply, subtractBy } from "../../Data/Num"
import { elems, lookup, lookupF } from "../../Data/OrderedMap"
import { OmitName, Record } from "../../Data/Record"
import { bimap, fst, isTuple, Pair, snd } from "../../Data/Tuple"
import { uncurryN } from "../../Data/Tuple/Curry"
import { CombatTechniqueId, SpecialAbilityId } from "../Constants/Ids"
import { AttributeDependent } from "../Models/ActiveEntries/AttributeDependent"
import { Belongings } from "../Models/Hero/Belongings"
import { HeroModel } from "../Models/Hero/HeroModel"
import { HitZoneArmor } from "../Models/Hero/HitZoneArmor"
import { fromItemTemplate, Item, ItemL } from "../Models/Hero/Item"
import { NumIdName } from "../Models/NumIdName"
import { Armor } from "../Models/View/Armor"
import { DropdownOption } from "../Models/View/DropdownOption"
import { HitZoneArmorForView } from "../Models/View/HitZoneArmorForView"
import { ItemForView, itemToItemForView } from "../Models/View/ItemForView"
import { MeleeWeapon } from "../Models/View/MeleeWeapon"
import { RangedWeapon } from "../Models/View/RangedWeapon"
import { ShieldOrParryingWeapon } from "../Models/View/ShieldOrParryingWeapon"
import { Attribute } from "../Models/Wiki/Attribute"
import { CombatTechnique } from "../Models/Wiki/CombatTechnique"
import { ItemTemplate } from "../Models/Wiki/ItemTemplate"
import { PrimaryAttributeDamageThreshold } from "../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { StaticData } from "../Models/Wiki/WikiModel"
import { isMaybeActive } from "../Utilities/Activatable/isActive"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy, filterAndSortRecordsByName } from "../Utilities/filterAndSortBy"
import { filterRecordsByName } from "../Utilities/filterBy"
import { getAttack, getParry } from "../Utilities/Increasable/combatTechniqueUtils"
import { convertPrimaryAttributeToArray } from "../Utilities/ItemUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { filterByAvailability } from "../Utilities/RulesUtils"
import { mapGetToSlice } from "../Utilities/SelectorsUtils"
import { sortRecordsByName } from "../Utilities/sortBy"
import { isNumber } from "../Utilities/typeCheckUtils"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getEquipmentSortOptions } from "./sortOptionsSelectors"
import { getCurrentHeroPresent, getEquipmentFilterText, getEquipmentState, getHigherParadeValues, getHitZoneArmorsState, getItemsState, getItemTemplatesFilterText, getSpecialAbilities, getWiki, getWikiItemTemplates, getZoneArmorFilterText } from "./stateSelectors"

const HA = HeroModel.A
const SDA = StaticData.A
const BA = Belongings.A
const IA = Item.A
const ITA = ItemTemplate.A
const HZAA = HitZoneArmor.A
const IFVA = ItemForView.A
const IL = ItemL
const CTA = CombatTechnique.A
const PADTA = PrimaryAttributeDamageThreshold.A
const ADA = AttributeDependent.A
const AA = Attribute.A
const NINA = NumIdName.A

export const getFullItem =
  (items: Belongings["items"]) =>
  (templates: StaticData["itemTemplates"]) =>
  (id: string) =>
    pipe_ (
      items,
      lookup (id),
      fmap (item => {
        const is_template_locked = IA.isTemplateLocked (item)
        const template = IA.template (item)
        const where = IA.where (item)
        const amount = IA.amount (item)
        const loss = IA.loss (item)

        const mactive_template = bind (template) (lookupF (templates))

        return fromMaybe (item)
                               (pipe_ (
                                 is_template_locked,
                                 guard,
                                 thenF (mactive_template),
                                 fmap (pipe (
                                   fromItemTemplate (id),
                                   set (IL.where) (where),
                                   set (IL.amount) (amount),
                                   set (IL.loss) (loss)
                                 ))
                               ))
      }),
      altF_ (() => fmap (fromItemTemplate (id)) (lookup (id) (templates)))
    )

export const getTemplates = createMaybeSelector (
  getWikiItemTemplates,
  elems
)

export const getSortedTemplates = createMaybeSelector (
  getWiki,
  getTemplates,
  uncurryN (staticData => tpls => sortRecordsByName (staticData) (tpls))
)

export const getAvailableItemTemplates = createMaybeSelector (
  getSortedTemplates,
  getRuleBooksEnabled,
  uncurryN (flip (filterByAvailability (ITA.src)))
)

export const getFilteredItemTemplates = createMaybeSelector (
  getItemTemplatesFilterText,
  getAvailableItemTemplates,
  uncurryN (filterText => xs => filterRecordsByName (filterText) (xs))
)

export const getItems = createMaybeSelector (
  getWikiItemTemplates,
  getItemsState,
  uncurryN (templates => fmap (items => pipe_ (
                                          items,
                                          elems,
                                          mapMaybe (pipe (IA.id, getFullItem (items) (templates)))
                                        )))
)

export const getFilteredItems = createMaybeSelector (
  getItems,
  getEquipmentFilterText,
  getEquipmentSortOptions,
  (mitems, filterText, sortOptions) =>
    fmapF (mitems)
          (filterAndSortRecordsBy (0)
                                  ([ IA.name ])
                                  (sortOptions)
                                  (filterText))
)

export const getHitZoneArmors = createMaybeSelector (
  getHitZoneArmorsState,
  fmap (elems)
)

export const getFilteredHitZoneArmors = createMaybeSelector (
  getHitZoneArmors,
  getZoneArmorFilterText,
  getWiki,
  (mhitZoneArmors, filterText, staticData) =>
    fmapF (mhitZoneArmors)
          (filterAndSortRecordsByName (staticData)
                                      (filterText))
)

const getProtection = pipe (bindF (IA.pro), Maybe.sum)

const getProtectionTotal =
  (head: Maybe<Record<Item>>) =>
  (leftArm: Maybe<Record<Item>>) =>
  (leftLeg: Maybe<Record<Item>>) =>
  (rightArm: Maybe<Record<Item>>) =>
  (rightLeg: Maybe<Record<Item>>) =>
  (torso: Maybe<Record<Item>>) => {
    const total =
      sum (List (
        getProtection (head),
        getProtection (torso) * 5,
        getProtection (leftArm) * 2,
        getProtection (rightArm) * 2,
        getProtection (leftLeg) * 2,
        getProtection (rightLeg) * 2
      ))

    return Math.ceil (total / 14)
  }

const getWeight = pipe (bindF (IA.weight), Maybe.sum)

const getWeightTotal =
  (head: Maybe<Record<Item>>) =>
  (leftArm: Maybe<Record<Item>>) =>
  (leftLeg: Maybe<Record<Item>>) =>
  (rightArm: Maybe<Record<Item>>) =>
  (rightLeg: Maybe<Record<Item>>) =>
  (torso: Maybe<Record<Item>>) => {
    const total =
      sum (List (
        getWeight (head) * 0.1,
        getWeight (torso) * 0.5,
        getWeight (leftArm) * 0.1,
        getWeight (rightArm) * 0.1,
        getWeight (leftLeg) * 0.1,
        getWeight (rightLeg) * 0.1
      ))

    return Math.floor (total * 100) / 100
  }

const getPrice = pipe (bindF (IA.price), Maybe.sum)

const getPriceTotal =
  (head: Maybe<Record<Item>>) =>
  (leftArm: Maybe<Record<Item>>) =>
  (leftLeg: Maybe<Record<Item>>) =>
  (rightArm: Maybe<Record<Item>>) =>
  (rightLeg: Maybe<Record<Item>>) =>
  (torso: Maybe<Record<Item>>) => {
    const total =
      sum (List (
        getPrice (head) * 0.5,
        getPrice (torso) * 0.1,
        getPrice (leftArm) * 0.1,
        getPrice (rightArm) * 0.1,
        getPrice (leftLeg) * 0.1,
        getPrice (rightLeg) * 0.1
      ))

    return Math.floor (total * 100) / 100
  }

type HitZoneKeys =
  Exclude<
    keyof OmitName<HitZoneArmor>,
    "id"
    | "name"
    | "headLoss"
    | "leftArmLoss"
    | "rightArmLoss"
    | "torsoLoss"
    | "leftLegLoss"
    | "rightLegLoss"
  >

const getFullHitZoneItem =
  (items: Belongings["items"]) =>
  (templates: StaticData["itemTemplates"]) =>
  (hitZone: HitZoneKeys) =>
    pipe (HitZoneArmor.A[hitZone], bindF (getFullItem (items) (templates)))

export const getAllItems = createMaybeSelector (
  getItemsState,
  getHitZoneArmorsState,
  getWikiItemTemplates,
  getWiki,
  (mitems, mhitZoneArmors, templates, staticData) =>
    liftM2 ((items: Belongings["items"]) => (hitZoneArmors: Belongings["hitZoneArmors"]) => {
             const itemsList = elems (items)
             const hitZoneArmorsList = elems (hitZoneArmors)

             const mappedItems = pipe_ (
               itemsList,
               filter (pipe (IA.forArmorZoneOnly, equals<boolean> (false))),
               mapMaybe (pipe (IA.id, getFullItem (items) (templates), fmap (itemToItemForView)))
             )

             const mappedArmorZones =
               thrush (hitZoneArmorsList)
                      (map (hitZoneArmor => {
                        const headArmor = getFullHitZoneItem (items)
                                                             (templates)
                                                             ("head")
                                                             (hitZoneArmor)

                        const torsoArmor = getFullHitZoneItem (items)
                                                              (templates)
                                                              ("torso")
                                                              (hitZoneArmor)

                        const leftArmArmor = getFullHitZoneItem (items)
                                                                (templates)
                                                                ("leftArm")
                                                                (hitZoneArmor)

                        const rightArmArmor = getFullHitZoneItem (items)
                                                                 (templates)
                                                                 ("rightArm")
                                                                 (hitZoneArmor)

                        const leftLegArmor = getFullHitZoneItem (items)
                                                                (templates)
                                                                ("leftLeg")
                                                                (hitZoneArmor)

                        const rightLegArmor = getFullHitZoneItem (items)
                                                                 (templates)
                                                                 ("rightLeg")
                                                                 (hitZoneArmor)

                        const priceTotal = getPriceTotal (headArmor)
                                                         (leftArmArmor)
                                                         (leftLegArmor)
                                                         (rightArmArmor)
                                                         (rightLegArmor)
                                                         (torsoArmor)

                        const weightTotal = getWeightTotal (headArmor)
                                                           (leftArmArmor)
                                                           (leftLegArmor)
                                                           (rightArmArmor)
                                                           (rightLegArmor)
                                                           (torsoArmor)

                        return ItemForView ({
                          id: HZAA.id (hitZoneArmor),
                          name: HZAA.name (hitZoneArmor),
                          amount: 1,
                          price: Just (priceTotal),
                          weight: Just (weightTotal),
                          gr: 4,
                        })
                      }))

             return sortRecordsByName (staticData)
                                      (append (mappedArmorZones) (mappedItems))
           })
           (mitems)
           (mhitZoneArmors)
)

export const getTotalPrice = createMaybeSelector (
  getAllItems,
  fmap (foldr ((item: Record<ItemForView>) => maybe (ident as ident<number>)
                                                    (pipe (multiply (IFVA.amount (item)), add))
                                                    (IFVA.price (item)))
              (0))
)

export const getTotalWeight = createMaybeSelector (
  getAllItems,
  fmap (foldr ((item: Record<ItemForView>) => maybe (ident as ident<number>)
                                                    (pipe (multiply (IFVA.amount (item)), add))
                                                    (IFVA.weight (item)))
              (0))
)

export const getMeleeWeapons = createMaybeSelector (
  getCurrentHeroPresent,
  getHigherParadeValues,
  getWiki,
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.GaretherGossenStil),
  (mhero, higherParadeValues, wiki, garether_gossen_stil) =>
    fmapF (mhero)
          (hero => {
            const items = pipe_ (hero, HA.belongings, BA.items)
            const rawItems = elems (items)

            const filteredItems =
              thrush (rawItems)
                     (filter (item => IA.gr (item) === 1
                                      || Maybe.elem (1) (IA.improvisedWeaponGroup (item))))

            const is_garether_gossen_stil_active = isMaybeActive (garether_gossen_stil)

            const mapper = pipe (
              IA.id,
              getFullItem (items) (SDA.itemTemplates (wiki)),
              bindF (
                full_item =>
                  pipe_ (
                    full_item,
                    IA.combatTechnique,
                    bindF (lookupF (SDA.combatTechniques (wiki))),
                    bindF (
                      wiki_entry => {
                        const hero_entry = lookup (CTA.id (wiki_entry)) (HA.combatTechniques (hero))

                        const atBase = getAttack (hero) (wiki_entry) (hero_entry)
                        const at = atBase + Maybe.sum (IA.at (full_item))

                        const doublePAIfShield: (pa: number) => number =
                          pa => CTA.id (wiki_entry) === CombatTechniqueId.Shields ? pa * 2 : pa

                        const paBase = getParry (hero) (wiki_entry) (hero_entry)
                        const pa =
                          fmapF (paBase)
                                (pipe (
                                  add (doublePAIfShield (Maybe.sum (IA.pa (full_item)))),
                                  add (Maybe.sum (higherParadeValues))
                                ))

                        const mprimary_attr_ids =
                          fmapF (IA.damageBonus (full_item))
                                (damageBonus => fromMaybe (CTA.primary (wiki_entry))
                                                          (fmapF (PADTA.primary (damageBonus))
                                                                 (convertPrimaryAttributeToArray)))

                        const mprimary_attrs =
                          fmapF (mprimary_attr_ids)
                                (mapMaybe (lookupF (SDA.attributes (wiki))))

                        const mprimary_attr_values =
                          fmapF (mprimary_attr_ids)
                                (map (pipe (
                                  lookupF (HA.attributes (hero)),
                                  maybe (8)
                                        (ADA.value)
                                )))

                        type Thresholds = number | Pair<number, number>

                        const dec_dt =
                          is_garether_gossen_stil_active
                          && CTA.id (wiki_entry) === CombatTechniqueId.Brawling

                        const damage_thresholds =
                          pipe_ (
                            full_item,
                            IA.damageBonus,
                            maybe<Thresholds> (0) (PADTA.threshold),
                            dec_dt

                            // Decrement damage threshold if Garether Gossen-Stil
                            // is active and the item has combat technique
                            // Brawling.
                            ? x => isNumber (x)
                                   ? dec (x)
                                   : bimap (dec) (dec) (x)

                            // Otherwise just keep the value
                            : ident
                          )

                        const damage_flat_bonus =
                          fmapF (mprimary_attr_values)
                                (primary_attr_values =>
                                  isTuple (damage_thresholds)

                                    // P/T looks like "AGI 14/STR 15" and combat
                                    // technique has both attributes as primary
                                    // => maps them and look up the greatest
                                    // bonus
                                    ? pipe_ (
                                        primary_attr_values,
                                        imap (i => subtractBy (i === 0
                                                                ? fst (damage_thresholds)
                                                                : snd (damage_thresholds))),
                                        consF (0),
                                        maximum
                                      )
                                    : pipe_ (
                                        primary_attr_values,
                                        map (subtractBy (damage_thresholds)),
                                        consF (0),
                                        maximum
                                      ))

                        const damageFlat =
                          pipe_ (
                            full_item,
                            IA.damageFlat,
                            Maybe.sum,
                            add (Maybe.sum (damage_flat_bonus))
                          )

                        return isJust (mprimary_attrs)
                          || CTA.id (wiki_entry) === CombatTechniqueId.Lances
                          ? Just (MeleeWeapon ({
                              id: IA.id (full_item),
                              name: IA.name (full_item),
                              combatTechnique: CTA.name (wiki_entry),
                              primary: maybe (List<string> ())
                                             (map (AA.short))
                                             (mprimary_attrs),
                              primaryBonus: damage_thresholds,
                              damageDiceNumber: IA.damageDiceNumber (full_item),
                              damageDiceSides: IA.damageDiceSides (full_item),
                              damageFlat,
                              atMod: IA.at (full_item),
                              at,
                              paMod: IA.pa (full_item),
                              pa,
                              reach: IA.reach (full_item),
                              bf: CTA.bpr (wiki_entry)
                                + Maybe.sum (IA.stabilityMod (full_item)),
                              loss: IA.loss (full_item),
                              weight: IA.weight (full_item),
                              isImprovisedWeapon:
                                isJust (IA.improvisedWeaponGroup (full_item)),
                              isTwoHandedWeapon: IA.isTwoHandedWeapon (full_item),
                            }))
                          : Nothing
                      }
                    )
                  )
              )
            )

            return mapMaybe (mapper) (filteredItems)
          })
)

export const getRangedWeapons = createMaybeSelector (
  getCurrentHeroPresent,
  getWiki,
  (mhero, staticData) =>
    fmapF (mhero)
          (hero => {
            const items = pipe_ (hero, HA.belongings, BA.items)
            const rawItems = elems (items)

            const filteredItems =
              thrush (rawItems)
                     (filter (item => IA.gr (item) === 2
                                      || Maybe.elem (2) (IA.improvisedWeaponGroup (item))))

            const mapper = pipe (
              IA.id,
              getFullItem (items) (SDA.itemTemplates (staticData)),
              bindF (
                full_item =>
                  pipe_ (
                    full_item,
                    IA.combatTechnique,
                    bindF (lookupF (SDA.combatTechniques (staticData))),
                    fmap (
                      wiki_entry => {
                        const hero_entry = lookup (CTA.id (wiki_entry)) (HA.combatTechniques (hero))

                        const atBase = getAttack (hero) (wiki_entry) (hero_entry)
                        const at = atBase + Maybe.sum (IA.at (full_item))

                        const ammunition =
                          pipe_ (
                            full_item,
                            IA.ammunition,
                            bindF (getFullItem (items) (SDA.itemTemplates (staticData))),
                            fmap (IA.name)
                          )

                        return RangedWeapon ({
                          id: IA.id (full_item),
                          name: IA.name (full_item),
                          combatTechnique: CTA.name (wiki_entry),
                          reloadTime: IA.reloadTime (full_item),
                          damageDiceNumber: IA.damageDiceNumber (full_item),
                          damageDiceSides: IA.damageDiceSides (full_item),
                          damageFlat: IA.damageFlat (full_item),
                          at,
                          range: IA.range (full_item),
                          bf: CTA.bpr (wiki_entry)
                            + Maybe.sum (IA.stabilityMod (full_item)),
                          loss: IA.loss (full_item),
                          weight: IA.weight (full_item),
                          ammunition,
                        })
                      }
                    )
                  )
              )
            )

            return mapMaybe (mapper) (filteredItems)
          })
)

export const getStabilityByArmorTypeId = pipe (
  dec,
  subscript (List (4, 5, 6, 8, 9, 13, 12, 11, 10))
)

export const getEncumbranceHitZoneLevel = subscript (List (0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8))

export const getArmors = createMaybeSelector (
  getItemsState,
  getWiki,
  (mitems, wiki) =>
    fmapF (mitems)
          (items => {
            const rawItems = elems (items)

            const filteredItems =
              thrush (rawItems)
                     (filter (item => IA.gr (item) === 4))

            const mapper = pipe (
              IA.id,
              getFullItem (items) (SDA.itemTemplates (wiki)),
              fmap (
                full_item => {
                  const addPenaltiesMod = IA.addPenalties (full_item) ? -1 : 0

                  return Armor ({
                    id: IA.id (full_item),
                    name: IA.name (full_item),
                    st: pipe_ (
                          full_item,
                          IA.armorType,
                          bindF (getStabilityByArmorTypeId),
                          fmap (add (Maybe.sum (IA.stabilityMod (full_item))))
                        ),
                    loss: IA.loss (full_item),
                    pro: IA.pro (full_item),
                    enc: IA.enc (full_item),
                    mov: addPenaltiesMod + Maybe.sum (IA.movMod (full_item)),
                    ini: addPenaltiesMod + Maybe.sum (IA.iniMod (full_item)),
                    weight: IA.weight (full_item),
                    where: IA.where (full_item),
                  })
                }
              )
            )

            return mapMaybe (mapper) (filteredItems)
          })
)

export const getArmorZones = createMaybeSelector (
  getWikiItemTemplates,
  getEquipmentState,
  uncurryN (templates =>
             fmap (belongings => {
                    const items = BA.items (belongings)
                    const rawHitZoneArmors = elems (BA.hitZoneArmors (belongings))

                    return thrush (rawHitZoneArmors)
                                  (map (hitZoneArmor => {
                                    const headArmor = getFullHitZoneItem (items)
                                                                         (templates)
                                                                         ("head")
                                                                         (hitZoneArmor)

                                    const torsoArmor = getFullHitZoneItem (items)
                                                                          (templates)
                                                                          ("torso")
                                                                          (hitZoneArmor)

                                    const leftArmArmor = getFullHitZoneItem (items)
                                                                            (templates)
                                                                            ("leftArm")
                                                                            (hitZoneArmor)

                                    const rightArmArmor = getFullHitZoneItem (items)
                                                                             (templates)
                                                                             ("rightArm")
                                                                             (hitZoneArmor)

                                    const leftLegArmor = getFullHitZoneItem (items)
                                                                            (templates)
                                                                            ("leftLeg")
                                                                            (hitZoneArmor)

                                    const rightLegArmor = getFullHitZoneItem (items)
                                                                             (templates)
                                                                             ("rightLeg")
                                                                             (hitZoneArmor)

                                    const proTotal = getProtectionTotal (headArmor)
                                                                        (leftArmArmor)
                                                                        (leftLegArmor)
                                                                        (rightArmArmor)
                                                                        (rightLegArmor)
                                                                        (torsoArmor)

                                    const weightTotal = getWeightTotal (headArmor)
                                                                       (leftArmArmor)
                                                                       (leftLegArmor)
                                                                       (rightArmArmor)
                                                                       (rightLegArmor)
                                                                       (torsoArmor)

                                    return HitZoneArmorForView ({
                                      id: HZAA.id (hitZoneArmor),
                                      name: HZAA.name (hitZoneArmor),
                                      head: bind (headArmor) (IA.pro),
                                      leftArm: bind (leftArmArmor) (IA.pro),
                                      leftLeg: bind (leftLegArmor) (IA.pro),
                                      rightArm: bind (rightArmArmor) (IA.pro),
                                      rightLeg: bind (rightLegArmor) (IA.pro),
                                      torso: bind (torsoArmor) (IA.pro),
                                      enc: Maybe.sum (getEncumbranceHitZoneLevel (proTotal)),
                                      addPenalties: [ 1, 3, 5 ] .includes (proTotal),
                                      weight: weightTotal,
                                    })
                                  }))
                  }))
)

export const getShieldsAndParryingWeapons = createMaybeSelector (
  getCurrentHeroPresent,
  getWiki,
  (mhero, staticData) =>
    fmapF (mhero)
          (hero => {
            const items = pipe_ (hero, HA.belongings, BA.items)
            const rawItems = elems (items)

            const filteredItems =
              thrush (rawItems)
                     (filter (item => IA.gr (item) === 1
                                      && (
                                        Maybe.elem<string> (CombatTechniqueId.Shields)
                                                           (IA.combatTechnique (item))
                                        || IA.isParryingWeapon (item)
                                      )))

            const mapper = pipe (
              IA.id,
              getFullItem (items) (SDA.itemTemplates (staticData)),
              bindF (
                full_item =>
                  pipe_ (
                    full_item,
                    IA.combatTechnique,
                    bindF (lookupF (SDA.combatTechniques (staticData))),
                    fmap (
                      wiki_entry =>
                        ShieldOrParryingWeapon ({
                          id: IA.id (full_item),
                          name: IA.name (full_item),
                          stp: IA.stp (full_item),
                          bf: CTA.bpr (wiki_entry)
                            + Maybe.sum (IA.stabilityMod (full_item)),
                          loss: IA.loss (full_item),
                          atMod: IA.at (full_item),
                          paMod: IA.pa (full_item),
                          weight: IA.weight (full_item),
                        })
                    )
                  )
              )
            )

            return mapMaybe (mapper) (filteredItems)
          })
)

export const getProtectionAndWeight =
  (getZoneArmor: (id: Maybe<string>) => Maybe<Record<Item>>) =>
  (hitZoneArmor: Record<HitZoneArmor>) => {
    const headArmor = getZoneArmor (HZAA.head (hitZoneArmor))
    const torsoArmor = getZoneArmor (HZAA.torso (hitZoneArmor))
    const leftArmArmor = getZoneArmor (HZAA.leftArm (hitZoneArmor))
    const rightArmArmor = getZoneArmor (HZAA.rightArm (hitZoneArmor))
    const leftLegArmor = getZoneArmor (HZAA.leftLeg (hitZoneArmor))
    const rightLegArmor = getZoneArmor (HZAA.rightLeg (hitZoneArmor))

    const protectionSum =
      sum (List (
        getProtection (headArmor),
        getProtection (torsoArmor) * 5,
        getProtection (leftArmArmor) * 2,
        getProtection (rightArmArmor) * 2,
        getProtection (leftLegArmor) * 2,
        getProtection (rightLegArmor) * 2
      ))

    const weightSum =
      sum (List (
        getWeight (headArmor) * 0.5,
        getWeight (torsoArmor) * 0.1,
        getWeight (leftArmArmor) * 0.1,
        getWeight (rightArmArmor) * 0.1,
        getWeight (leftLegArmor) * 0.1,
        getWeight (rightLegArmor) * 0.1
      ))

    return {
      pro: protectionSum,
      weight: weightSum,
    }
  }

const getItemGroupsAsDropdowns = pipe (
                                   SDA.equipmentGroups,
                                   elems,
                                   map (nin => DropdownOption ({
                                                 id: Just (NINA.id (nin)),
                                                 name: NINA.name (nin),
                                               }))
                                 )

const isAnyTplOfGr = (gr_name_index: number) => any (pipe (ITA.gr, equals (gr_name_index + 1)))

const filterGrsIfAnyTplAvailable =
  (tpls: List<Record<ItemTemplate>>) =>
    pipe (
      getItemGroupsAsDropdowns,
      ifilter (i => () => isAnyTplOfGr (i) (tpls))
    )

export const getAvailableSortedEquipmentGroups = createMaybeSelector (
  getWiki,
  getAvailableItemTemplates,
  uncurryN (staticData => pipe (
                            flip (filterGrsIfAnyTplAvailable) (staticData),
                            sortRecordsByName (staticData)
                          ))
)
