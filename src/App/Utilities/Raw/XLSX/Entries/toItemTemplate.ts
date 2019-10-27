import { fmap, fmapF } from "../../../../../Data/Functor";
import { Cons, flength, head, last, List } from "../../../../../Data/List";
import { ensure, Nothing } from "../../../../../Data/Maybe";
import { Pair } from "../../../../../Data/Tuple";
import { IdPrefixes } from "../../../../Constants/IdPrefixes";
import { ItemTemplate } from "../../../../Models/Wiki/ItemTemplate";
import { PrimaryAttributeDamageThreshold } from "../../../../Models/Wiki/sub/PrimaryAttributeDamageThreshold";
import { prefixAttr, prefixId, prefixItemTpl } from "../../../IDUtils";
import { toNatural } from "../../../NumberUtils";
import { pipe } from "../../../pipe";
import { exactR } from "../../../RegexUtils";
import { Expect } from "../../Expect";
import { mergeRowsById } from "../MergeRows";
import { modifyNegIntNoBreak } from "../SourceHelpers";
import { lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic";
import { mensureMapBoolean, mensureMapFloatOptional, mensureMapIntegerOptional, mensureMapListBindAfterOptional, mensureMapNaturalFixedListOptional, mensureMapNaturalInRange, mensureMapNaturalInRangeOptional, mensureMapNaturalOptional, mensureMapNonEmptyString, mensureMapStringPredOptional } from "../Validators/ToValue";
import { toSourceLinks } from "./Sub/toSourceLinks";

const primaryAttributeRx =
  new RegExp (exactR (`${prefixAttr ("[1-8]")}|${prefixAttr ("6_8")}`))

const isPrimaryAttributeString = (x: string) => primaryAttributeRx .test (x)

export const toItemTemplate =
  mergeRowsById
    ("toItemTemplate")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkUnivNaturalNumberOptional =
        lookupKeyValid (mensureMapNaturalOptional) (TableType.Univ) (lookup_univ)

      const checkUnivIntegerOptional =
        lookupKeyValid (mensureMapIntegerOptional) (TableType.Univ) (lookup_univ)

      const checkUnivFloatOptional =
        lookupKeyValid (mensureMapFloatOptional) (TableType.Univ) (lookup_univ)

      const checkUnivBoolean =
        lookupKeyValid (mensureMapBoolean) (TableType.Univ) (lookup_univ)

      // Check fields

      const ename = checkL10nNonEmptyString ("name")

      const note = lookup_l10n ("note")

      const rules = lookup_l10n ("rules")

      const advantage = lookup_l10n ("advantage")

      const disadvantage = lookup_l10n ("disadvantage")

      const eprice = checkUnivFloatOptional ("price")

      const eweight = checkUnivFloatOptional ("weight")

      const egr =
        lookupKeyValid (mensureMapNaturalInRange (1) (30))
                       (TableType.Univ)
                       (lookup_univ)
                       ("gr")

      const ecombatTechniques = checkUnivNaturalNumberOptional ("combatTechniques")

      const edamageDiceNumber = checkUnivNaturalNumberOptional ("damageDiceNumber")

      const edamageDiceSides = checkUnivNaturalNumberOptional ("damageDiceSides")

      const edamageFlat = checkUnivNaturalNumberOptional ("damageFlat")

      const edamageThresholdAttribute =
        lookupKeyValid (mensureMapStringPredOptional (isPrimaryAttributeString)
                                                     ("PrimaryAttribute"))
                       (TableType.Univ)
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
                       (TableType.Univ)
                       (lookup_univ)
                       ("damageThreshold")

      const eat = checkUnivIntegerOptional ("at")

      const epa = checkUnivIntegerOptional ("pa")

      const ereach =
        lookupKeyValid (mensureMapNaturalInRangeOptional (1) (4))
                       (TableType.Univ)
                       (lookup_univ)
                       ("reach")

      const elength = checkUnivNaturalNumberOptional ("length")

      const structurePoints = lookup_univ ("structurePoints")

      const eisParryingWeapon = checkUnivBoolean ("isParryingWeapon")

      const eisTwoHandedWeapon = checkUnivBoolean ("isTwoHandedWeapon")

      const erange =
        lookupKeyValid (mensureMapNaturalFixedListOptional (3) ("&"))
                       (TableType.Univ)
                       (lookup_univ)
                       ("range")

      const reloadTime = lookup_univ ("reloadTime")

      const eammunition = checkUnivNaturalNumberOptional ("ammunition")

      const eimprovisedWeaponGroup =
        lookupKeyValid (mensureMapNaturalInRangeOptional (1) (2))
                       (TableType.Univ)
                       (lookup_univ)
                       ("improvisedWeaponGroup")

      const eprotection = checkUnivNaturalNumberOptional ("protection")

      const eencumbrance = checkUnivNaturalNumberOptional ("encumbrance")

      const eadditionalPenalties = checkUnivBoolean ("additionalPenalties")

      const earmorType =
        lookupKeyValid (mensureMapNaturalInRangeOptional (1) (10))
                       (TableType.Univ)
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
          eisParryingWeapon,
          eisTwoHandedWeapon,
          erange,
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
          note: fmap (modifyNegIntNoBreak) (note),
          rules: fmap (modifyNegIntNoBreak) (rules),
          advantage: fmap (modifyNegIntNoBreak) (advantage),
          disadvantage: fmap (modifyNegIntNoBreak) (disadvantage),
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
                      : Pair (head (threshold as Cons<number>), last (threshold as Cons<number>)),
                 }))
                 (rs.edamageThreshold),
          at: rs.eat,
          pa: rs.epa,
          reach: rs.ereach,
          length: rs.elength,
          stp: structurePoints,
          isParryingWeapon: rs.eisParryingWeapon,
          isTwoHandedWeapon: rs.eisTwoHandedWeapon,
          range: rs.erange,
          reloadTime,
          ammunition: fmapF (rs.eammunition) (prefixItemTpl),
          improvisedWeaponGroup: rs.eimprovisedWeaponGroup,
          pro: rs.eprotection,
          enc: rs.eencumbrance,
          addPenalties: rs.eadditionalPenalties,
          armorType: rs.earmorType,
          isTemplateLocked: Nothing,
          src: rs.esrc,
          forArmorZoneOnly: Nothing,
        }))
    })
