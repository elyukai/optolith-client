import { fmap } from "../../../../Data/Functor";
import { Cons, flength, head, List } from "../../../../Data/List";
import { ensure, Nothing } from "../../../../Data/Maybe";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { ItemTemplate } from "../../../Models/Wiki/ItemTemplate";
import { PrimaryAttributeDamageThreshold } from "../../../Models/Wiki/sub/PrimaryAttributeDamageThreshold";
import { prefixId } from "../../IDUtils";
import { toNatural } from "../../NumberUtils";
import { pipe } from "../../pipe";
import { naturalNumber } from "../../RegexUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapBoolean, mensureMapListBindAfterOptional, mensureMapNaturalFixedListOptional, mensureMapNaturalInRange, mensureMapNaturalInRangeOptional, mensureMapNaturalOptional, mensureMapNonEmptyString, mensureMapStringPredOptional } from "../validateMapValueUtils";
import { Expect, lookupKeyValid, mapMNamed } from "../validateValueUtils";
import { toSourceLinks } from "./Sub/toSourceLinks";

const primaryAttributeRx =
  new RegExp (`${IdPrefixes.ATTRIBUTES}_[1-8]|${IdPrefixes.ATTRIBUTES}_6_8`)

const isPrimaryAttributeString = (x: string) => primaryAttributeRx .test (x)

const itemTemplateIdRx =
  new RegExp (`${IdPrefixes.ITEM_TEMPLATE}_${naturalNumber.source}`)

const isItemTemplateIdString = (x: string) => itemTemplateIdRx .test (x)

export const toItemTemplate =
  mergeRowsById
    ("toItemTemplate")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

      const checkUnivNaturalNumberOptional =
        lookupKeyValid (mensureMapNaturalOptional) (lookup_univ)

      const checkUnivBoolean =
        lookupKeyValid (mensureMapBoolean) (lookup_univ)

      // Check fields

      const ename = checkL10nNonEmptyString ("name")

      const note = lookup_l10n ("note")

      const rules = lookup_l10n ("rules")

      const advantage = lookup_l10n ("advantage")

      const disadvantage = lookup_l10n ("disadvantage")

      const eprice = checkUnivNaturalNumberOptional ("price")

      const eweight = checkUnivNaturalNumberOptional ("weight")

      const egr =
        lookupKeyValid (mensureMapNaturalInRange (1) (27))
                       (lookup_univ)
                       ("improvisedWeaponGroup")

      const ecombatTechniques = checkUnivNaturalNumberOptional ("combatTechniques")

      const edamageDiceNumber = checkUnivNaturalNumberOptional ("damageDiceNumber")

      const edamageDiceSides = checkUnivNaturalNumberOptional ("damageDiceSides")

      const edamageFlat = checkUnivNaturalNumberOptional ("damageFlat")

      const edamageThresholdAttribute =
        lookupKeyValid (mensureMapStringPredOptional (isPrimaryAttributeString)
                                                     ("PrimaryAttribute"))
                       (lookup_univ)
                       ("damageThresholdAttribute")

      const edamageThreshold =
        lookupKeyValid (mensureMapListBindAfterOptional<number> (ensure (pipe (
                                                                  flength,
                                                                  len => len === 1 || len === 2
                                                                )))
                                                                ("&")
                                                                (Expect.NaturalNumber)
                                                                (toNatural))
                       (lookup_univ)
                       ("damageThreshold")

      const eat = checkUnivNaturalNumberOptional ("at")

      const epa = checkUnivNaturalNumberOptional ("pa")

      const ereach =
        lookupKeyValid (mensureMapNaturalInRangeOptional (1) (4))
                       (lookup_univ)
                       ("reach")

      const elength = checkUnivNaturalNumberOptional ("length")

      const estructurePoints = checkUnivNaturalNumberOptional ("structurePoints")

      const eisParryingWeapon = checkUnivBoolean ("isParryingWeapon")

      const eisTwoHandedWeapon = checkUnivBoolean ("isTwoHandedWeapon")

      const erange =
        lookupKeyValid (mensureMapNaturalFixedListOptional (3) ("&"))
                       (lookup_univ)
                       ("range")

      const ereloadTime = checkUnivNaturalNumberOptional ("reloadTime")

      const eammunition =
        lookupKeyValid (mensureMapStringPredOptional (isItemTemplateIdString)
                                                     ("ItemTemplateId"))
                       (lookup_univ)
                       ("ammunition")

      const eimprovisedWeaponGroup =
        lookupKeyValid (mensureMapNaturalInRangeOptional (1) (2))
                       (lookup_univ)
                       ("improvisedWeaponGroup")

      const eprotection = checkUnivNaturalNumberOptional ("protection")

      const eencumbrance = checkUnivNaturalNumberOptional ("encumbrance")

      const eadditionalPenalties = checkUnivBoolean ("additionalPenalties")

      const earmorType =
        lookupKeyValid (mensureMapNaturalInRangeOptional (1) (10))
                       (lookup_univ)
                       ("armorType")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          ename,
          eprice,
          eweight,
          egr,
          ecombatTechniques,
          edamageDiceNumber,
          edamageDiceSides,
          edamageFlat,
          edamageThresholdAttribute,
          edamageThreshold,
          eat,
          epa,
          ereach,
          elength,
          estructurePoints,
          eisParryingWeapon,
          eisTwoHandedWeapon,
          erange,
          ereloadTime,
          eammunition,
          eimprovisedWeaponGroup,
          eprotection,
          eencumbrance,
          eadditionalPenalties,
          earmorType,
          esrc,
        })
        (rs => ItemTemplate ({
          id: prefixId (IdPrefixes.ITEM_TEMPLATE) (id),
          name: rs.ename,
          template: prefixId (IdPrefixes.ITEM_TEMPLATE) (id),
          amount: Nothing,
          note,
          rules,
          advantage,
          disadvantage,
          price: rs.eprice,
          weight: rs.eweight,
          gr: rs.egr,
          combatTechnique: fmap (prefixId (IdPrefixes.COMBAT_TECHNIQUES))
                                (rs.ecombatTechniques),
          damageDiceNumber: rs.edamageDiceNumber,
          damageDiceSides: rs.edamageDiceSides,
          damageFlat: rs.edamageFlat,
          damageBonus:
            fmap ((threshold: List<number>) => PrimaryAttributeDamageThreshold ({
                   primary: rs.edamageThresholdAttribute,
                   threshold:
                    flength (threshold) === 1
                      ? head (threshold as Cons<number>)
                      : threshold,
                 }))
                 (rs.edamageThreshold),
          at: rs.eat,
          pa: rs.epa,
          reach: rs.ereach,
          length: rs.elength,
          stp: rs.estructurePoints,
          isParryingWeapon: rs.eisParryingWeapon,
          isTwoHandedWeapon: rs.eisTwoHandedWeapon,
          range: rs.erange,
          reloadTime: rs.ereloadTime,
          ammunition: rs.eammunition,
          improvisedWeaponGroup: rs.eimprovisedWeaponGroup,
          pro: rs.eprotection,
          enc: rs.eencumbrance,
          addPenalties: rs.eadditionalPenalties,
          armorType: rs.earmorType,
          isTemplateLocked: Nothing,
          src: rs.esrc,
        }))
    })
