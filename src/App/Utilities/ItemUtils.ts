import { fmap } from "../../Data/Functor"
import { set } from "../../Data/Lens"
import { flength, fnull, head, intercalate, List, NonEmptyList, splitOn } from "../../Data/List"
import { bind, bindF, ensure, fromJust, fromMaybe, Just, liftM2, mapM, Maybe, maybe, Nothing, product, sum } from "../../Data/Maybe"
import { gt } from "../../Data/Num"
import { Record } from "../../Data/Record"
import { show } from "../../Data/Show"
import { bimap, fst, isTuple, Pair, snd } from "../../Data/Tuple"
import { EditHitZoneArmor, EditHitZoneArmorSafe } from "../Models/Hero/EditHitZoneArmor"
import { EditItem, EditItemL, EditItemSafe } from "../Models/Hero/EditItem"
import { EditPrimaryAttributeDamageThreshold } from "../Models/Hero/EditPrimaryAttributeDamageThreshold"
import { EditRange } from "../Models/Hero/heroTypeHelpers"
import { HitZoneArmor } from "../Models/Hero/HitZoneArmor"
import { fromItemTemplate, Item, Range } from "../Models/Hero/Item"
import { PrimaryAttributeDamageThreshold } from "../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"
import { ndash } from "./Chars"
import { translate } from "./I18n"
import { ifElse } from "./ifElse"
import { getLevelElementsWithZero } from "./levelUtils"
import { signZero, toFloat, toInt } from "./NumberUtils"
import { pipe, pipe_ } from "./pipe"

const IA = Item.A
const EIA = EditItem.A

const showMaybe = maybe ("") (show)

const intOrIntsMToEditable = maybe ("")
                                   ((x: number | List<number>) => typeof x === "object"
                                                                  ? intercalate ("/") (x)
                                                                  : show (x))

const intOrIntsMFromEditable = pipe (
                                 splitOn ("/"),
                                 mapM (toInt),
                                 bindF ((xs): Maybe<number | NonEmptyList<number>> =>
                                         fnull (xs)
                                         ? Nothing
                                         : flength (xs) === 1
                                         ? Just (head (xs))
                                         : Just (xs))
                               )

const primaryAttributeDamageThresholdToEditable =
  maybe
    (EditPrimaryAttributeDamageThreshold ({
      threshold: "",
    }))
    ((damageBonus: Record<PrimaryAttributeDamageThreshold>) =>
      EditPrimaryAttributeDamageThreshold ({
        primary: PrimaryAttributeDamageThreshold.A.primary (damageBonus),
        threshold: pipe_ (
          damageBonus,
          PrimaryAttributeDamageThreshold.A.threshold,
          x => typeof x === "object" ? bimap (show) (show) (x) : show (x)
        ),
      }))

export const itemToEditable =
  (item: Record<Item>): Record<EditItem> =>
    EditItem ({
      id: Just (IA.id (item)),
      name: IA.name (item),
      ammunition: IA.ammunition (item),
      combatTechnique: IA.combatTechnique (item),
      damageDiceSides: IA.damageDiceSides (item),
      gr: IA.gr (item),
      isParryingWeapon: IA.isParryingWeapon (item),
      isTemplateLocked: IA.isTemplateLocked (item),
      reach: IA.reach (item),
      template: IA.template (item),
      where: IA.where (item),
      isTwoHandedWeapon: IA.isTwoHandedWeapon (item),
      improvisedWeaponGroup: IA.improvisedWeaponGroup (item),
      loss: IA.loss (item),
      forArmorZoneOnly: IA.forArmorZoneOnly (item),
      addPenalties: IA.addPenalties (item),
      armorType: IA.armorType (item),
      at: showMaybe (IA.at (item)),
      iniMod: showMaybe (IA.iniMod (item)),
      movMod: showMaybe (IA.movMod (item)),
      damageBonus: primaryAttributeDamageThresholdToEditable (IA.damageBonus (item)),
      damageDiceNumber: showMaybe (IA.damageDiceNumber (item)),
      damageFlat: showMaybe (IA.damageFlat (item)),
      enc: showMaybe (IA.enc (item)),
      length: showMaybe (IA.length (item)),
      amount: show (IA.amount (item)),
      pa: showMaybe (IA.pa (item)),
      price: showMaybe (IA.price (item)),
      pro: showMaybe (IA.pro (item)),
      range: maybe<EditRange> ({ close: "", medium: "", far: "" })
                   (({ close, medium, far }: Range) => ({
                     close: close.toString (),
                     medium: medium.toString (),
                     far: far.toString (),
                   }))
                   (IA.range (item)),
      reloadTime: pipe_ (item, IA.reloadTime, intOrIntsMToEditable),
      stp: pipe_ (item, IA.stp, intOrIntsMToEditable),
      weight: showMaybe (IA.weight (item)),
      stabilityMod: showMaybe (IA.stabilityMod (item)),
    })

const toMaybeIntGreaterThan =
  (int: number) => pipe (toInt, bindF<number, number> (ensure (gt (int))))

const toMaybeIntGreaterThan0 = toMaybeIntGreaterThan (0)
const toMaybeIntGreaterThan1 = toMaybeIntGreaterThan (1)

const editableToPrimaryAttributeDamageThreshold =
  (damageBonus: Record<EditPrimaryAttributeDamageThreshold>) =>
    ifElse<string | Pair<string, string>, Pair<string, string>>
      (isTuple)
      (threshold => {
        const mfst_th = toInt (fst (threshold))
        const msnd_th = toInt (snd (threshold))

        return liftM2 ((fst_th: number) => (snd_th: number) =>
                        PrimaryAttributeDamageThreshold ({
                          primary: EditPrimaryAttributeDamageThreshold.AL.primary (damageBonus),
                          threshold: Pair (fst_th, snd_th),
                        }))
                      (mfst_th)
                      (msnd_th)
      })
      (threshold => threshold .length > 0
        ? fmap ((safeThreshold: number) => PrimaryAttributeDamageThreshold ({
                 primary: EditPrimaryAttributeDamageThreshold.AL.primary (damageBonus),
                 threshold: safeThreshold,
               }))
               (toInt (threshold))
        : Nothing)
      (EditPrimaryAttributeDamageThreshold.AL.threshold (damageBonus))

export const editableToItem =
  (item: Record<EditItemSafe>): Record<Item> =>
    Item ({
      id: fromJust (EIA.id (item) as Just<string>),
      name: EIA.name (item),
      ammunition: EIA.ammunition (item),
      combatTechnique: EIA.combatTechnique (item),
      damageDiceSides: EIA.damageDiceSides (item),
      gr: EIA.gr (item),
      isParryingWeapon: EIA.isParryingWeapon (item),
      isTemplateLocked: EIA.isTemplateLocked (item),
      reach: EIA.reach (item),
      template: EIA.template (item),
      where: EIA.where (item),
      isTwoHandedWeapon: EIA.isTwoHandedWeapon (item),
      improvisedWeaponGroup: EIA.improvisedWeaponGroup (item),
      loss: EIA.loss (item),
      forArmorZoneOnly: EIA.forArmorZoneOnly (item),
      addPenalties: EIA.addPenalties (item),
      armorType: EIA.armorType (item),
      at: toInt (EIA.at (item)),
      iniMod: toMaybeIntGreaterThan0 (EIA.iniMod (item)),
      movMod: toMaybeIntGreaterThan0 (EIA.movMod (item)),
      damageBonus: editableToPrimaryAttributeDamageThreshold (EIA.damageBonus (item)),
      damageDiceNumber: toInt (EIA.damageDiceNumber (item)),
      damageFlat: toInt (EIA.damageFlat (item)),
      enc: toInt (EIA.enc (item)),
      length: toFloat (EIA.length (item)),
      amount: product (toMaybeIntGreaterThan1 (EIA.amount (item))),
      pa: toInt (EIA.pa (item)),
      price: toFloat (EIA.price (item)),
      pro: toInt (EIA.pro (item)),
      range: bind (toInt (EIA.range (item).close))
                  (close => bind (toInt (EIA.range (item).medium))
                                 (medium => bind (toInt (EIA.range (item).far))
                                                 (far => Just ({ close, medium, far })))),
      reloadTime: pipe_ (item, EIA.reloadTime, intOrIntsMFromEditable),
      stp: pipe_ (item, EIA.stp, intOrIntsMFromEditable),
      weight: toFloat (EIA.weight (item)),
      stabilityMod: toInt (EIA.stabilityMod (item)),
    })

export const convertPrimaryAttributeToArray =
  (id: string | Pair<string, string>): List<string> =>
    typeof id === "object" ? List (fst (id), snd (id)) : List (id)

export const getLossLevelElements = () => getLevelElementsWithZero (4)

export const hitZoneArmorToEditable =
  (x: Record<HitZoneArmor>): Record<EditHitZoneArmor> =>
    EditHitZoneArmor ({
      id: Just (HitZoneArmor.AL.id (x)),
      name: HitZoneArmor.AL.name (x),
      head: HitZoneArmor.AL.head (x),
      headLoss: HitZoneArmor.AL.headLoss (x),
      leftArm: HitZoneArmor.AL.leftArm (x),
      leftArmLoss: HitZoneArmor.AL.leftArmLoss (x),
      leftLeg: HitZoneArmor.AL.leftLeg (x),
      leftLegLoss: HitZoneArmor.AL.leftLegLoss (x),
      rightArm: HitZoneArmor.AL.rightArm (x),
      rightArmLoss: HitZoneArmor.AL.rightArmLoss (x),
      rightLeg: HitZoneArmor.AL.rightLeg (x),
      rightLegLoss: HitZoneArmor.AL.rightLegLoss (x),
      torso: HitZoneArmor.AL.torso (x),
      torsoLoss: HitZoneArmor.AL.torsoLoss (x),
    })

export const editableToHitZoneArmor =
  (x: Record<EditHitZoneArmorSafe>): Record<HitZoneArmor> =>
    HitZoneArmor ({
      id: fromJust (EditHitZoneArmor.AL.id (x) as Just<string>),
      name: HitZoneArmor.AL.name (x),
      head: HitZoneArmor.AL.head (x),
      headLoss: HitZoneArmor.AL.headLoss (x),
      leftArm: HitZoneArmor.AL.leftArm (x),
      leftArmLoss: HitZoneArmor.AL.leftArmLoss (x),
      leftLeg: HitZoneArmor.AL.leftLeg (x),
      leftLegLoss: HitZoneArmor.AL.leftLegLoss (x),
      rightArm: HitZoneArmor.AL.rightArm (x),
      rightArmLoss: HitZoneArmor.AL.rightArmLoss (x),
      rightLeg: HitZoneArmor.AL.rightLeg (x),
      rightLegLoss: HitZoneArmor.AL.rightLegLoss (x),
      torso: HitZoneArmor.AL.torso (x),
      torsoLoss: HitZoneArmor.AL.torsoLoss (x),
    })

export const fromItemTemplateEdit =
  (new_id: Maybe<string>) =>
    pipe (
      fromItemTemplate (""),
      itemToEditable,
      set (EditItemL.id) (new_id)
    )

const getDice = (staticData: StaticDataRecord) => translate (staticData) ("general.dice")

const combinedDamageValues = (staticData: StaticDataRecord) =>
                             (flat: Maybe<number>) =>
                             (n: number) =>
                             (sides: number) =>
                               `${n}${getDice (staticData)}${sides}${signZero (sum (flat))}`

export const getDamageStr = (staticData: StaticDataRecord) =>
                            (flat: Maybe<number>) =>
                            (diceNumber: Maybe<number>) =>
                            (diceSides: Maybe<number>): string =>
                              fromMaybe (ndash)
                                        (liftM2 (combinedDamageValues (staticData)
                                                                      (flat))
                                                (diceNumber)
                                                (diceSides))
