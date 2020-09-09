/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ItemInfo, ItemL10n } from "../../../../../app/Database/Schema/Equipment/Equipment.l10n"
import { Armor, CombinedWeapon, ItemUniv, MeleeWeapon, MundaneItem, RangedWeapon } from "../../../../../app/Database/Schema/Equipment/Equipment.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"
import { EquipmentGroup } from "../../../Constants/Groups"
import { AttrId } from "../../../Constants/Ids"
import { ItemTemplate } from "../../../Models/Wiki/ItemTemplate"
import { PrimaryAttributeDamageThreshold } from "../../../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { hasOwnProperty } from "../../Object"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdownM } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const concatTexts : (l10n : ItemL10n) => ItemInfo
                  = l10n => Array.isArray (l10n.versions)
                            ? l10n.versions.reduce<ItemInfo> (
                                (acc, x) => ({
                                  ...acc,
                                  ...x,
                                  src: [ ...acc.src, ...x.src ],
                                  errata: acc.errata === undefined && x.errata === undefined
                                          ? undefined
                                          : [ ...(acc.errata ?? []), ...(x.errata ?? []) ],
                                }),
                                { src: [] }
                              )
                            : l10n.versions


const isMeleeItem : (univ : NonNullable<ItemUniv["special"]>) => univ is MeleeWeapon
                  = (univ) : univ is MeleeWeapon => hasOwnProperty ("isParryingWeapon") (univ)
                                                    && hasOwnProperty ("isTwoHandedWeapon") (univ)


const toDamageThreshold : (damageThreshold : MeleeWeapon["damageThreshold"])
                        => Maybe<Record<PrimaryAttributeDamageThreshold>>
                        = dt => dt === undefined
                                ? Nothing
                                : Array.isArray (dt)
                                ? Just (PrimaryAttributeDamageThreshold ({
                                         primary: Just (Pair (AttrId.Agility, AttrId.Strength)),
                                         threshold: dt[0] === dt[1] ? dt[0] : Pair (dt[0], dt[1]),
                                       }))
                                : typeof dt === "object"
                                ? Just (PrimaryAttributeDamageThreshold ({
                                         primary: Maybe (dt.attribute),
                                         threshold: dt.threshold,
                                       }))
                                : Just (PrimaryAttributeDamageThreshold ({
                                         threshold: dt,
                                       }))


const toMeleeItem = (univ : MeleeWeapon) : Partial<ItemTemplate> => ({
                      combatTechnique: Just (univ.combatTechnique),
                      damageDiceNumber: Just (univ.damageDiceNumber),
                      damageDiceSides: Just (univ.damageDiceSides),
                      damageFlat: Maybe (univ.damageFlat),
                      damageBonus: toDamageThreshold (univ.damageThreshold),
                      at: Maybe (univ.at),
                      pa: Maybe (univ.pa),
                      reach: Maybe (univ.reach),
                      length: Maybe (univ.length),
                      stp: typeof univ.structurePoints === "object"
                           ? Just (fromArray (univ.structurePoints))
                           : Maybe (univ.structurePoints),
                      isParryingWeapon: univ.isParryingWeapon,
                      isTwoHandedWeapon: univ.isTwoHandedWeapon,
                      improvisedWeaponGroup: univ.isImprovisedWeapon
                                             ? Just (EquipmentGroup.MeleeWeapons)
                                             : Nothing,
                    })


const isRangedItem : (univ : NonNullable<ItemUniv["special"]>) => univ is RangedWeapon
                   = (univ) : univ is RangedWeapon => hasOwnProperty ("closeRange") (univ)
                                                      && hasOwnProperty ("mediumRange") (univ)
                                                      && hasOwnProperty ("farRange") (univ)


const toRangedItem = (univ : RangedWeapon) : Partial<ItemTemplate> => ({
                       combatTechnique: Just (univ.combatTechnique),
                       damageDiceNumber: Maybe (univ.damageDiceNumber),
                       damageDiceSides: Maybe (univ.damageDiceSides),
                       damageFlat: Maybe (univ.damageFlat),
                       length: Maybe (univ.length),
                       range: Just (List (
                         univ.closeRange,
                         univ.mediumRange,
                         univ.farRange
                       )),
                       reloadTime: Just (typeof univ.reloadTime === "object"
                                         ? fromArray (univ.reloadTime)
                                         : univ.reloadTime),
                       ammunition: Maybe (univ.ammunition),
                       improvisedWeaponGroup: univ.isImprovisedWeapon
                                              ? Just (EquipmentGroup.RangedWeapons)
                                              : Nothing,
                     })


const isCombinedItem : (univ : NonNullable<ItemUniv["special"]>) => univ is CombinedWeapon
                     = (univ) : univ is CombinedWeapon => hasOwnProperty ("melee") (univ)
                                                          && hasOwnProperty ("ranged") (univ)


const toCombinedItem = (univ : CombinedWeapon) : Partial<ItemTemplate> => toMeleeItem (univ.melee)


const isArmorItem : (univ : NonNullable<ItemUniv["special"]>) => univ is Armor
                  = (univ) : univ is Armor => hasOwnProperty ("protection") (univ)
                                              && hasOwnProperty ("encumbrance") (univ)


const toArmorItem = (univ : Armor) : Partial<ItemTemplate> => ({
                      pro: Just (univ.protection),
                      enc: Just (univ.encumbrance),
                      addPenalties: univ.hasAdditionalPenalties,
                      armorType: Just (univ.armorType),
                    })


const toMundaneItem = (univ : MundaneItem) : Partial<ItemTemplate> => ({
                        stp: typeof univ.structurePoints === "object"
                             ? Just (fromArray (univ.structurePoints))
                             : Maybe (univ.structurePoints),
                      })


// eslint-disable-next-line max-len
const toItemTemplate : YamlPairConverterE<ItemUniv, ItemL10n, string, ItemTemplate>
                     = ([ univ, l10n ]) => {
                         const texts = concatTexts (l10n)

                         const base = {
                           id: univ.id,
                           name: l10n.name,
                           note: toMarkdownM (Maybe (texts.note)),
                           rules: toMarkdownM (Maybe (texts.rules)),
                           advantage: toMarkdownM (Maybe (texts.advantage)),
                           disadvantage: toMarkdownM (Maybe (texts.disadvantage)),
                           price: Maybe (univ.price),
                           weight: Maybe (univ.weight),
                           gr: univ.gr,
                           isParryingWeapon: false,
                           isTwoHandedWeapon: false,
                           amount: 1,
                           addPenalties: false,
                           forArmorZoneOnly: false,
                           isTemplateLocked: true,
                           template: univ.id,
                           src: toSourceRefs (texts.src),
                           errata: toErrata (texts.errata),
                         }

                         return Right<[string, Record<ItemTemplate>]> ([
                           univ.id,
                           univ.special === undefined
                           ? ItemTemplate (base)
                           : isMeleeItem (univ.special)
                           ? ItemTemplate ({
                               ...base,
                               ...toMeleeItem (univ.special),
                             })
                           : isRangedItem (univ.special)
                           ? ItemTemplate ({
                               ...base,
                               ...toRangedItem (univ.special),
                             })
                           : isCombinedItem (univ.special)
                           ? ItemTemplate ({
                               ...base,
                               ...toCombinedItem (univ.special),
                             })
                           : isArmorItem (univ.special)
                           ? ItemTemplate ({
                               ...base,
                               ...toArmorItem (univ.special),
                             })
                           : ItemTemplate ({
                               ...base,
                               ...toMundaneItem (univ.special),
                             }),
                         ])
                       }


export const toItemTemplates : YamlFileConverter<string, Record<ItemTemplate>>
                             = pipe (
                                 (yaml_mp : YamlNameMap) =>
                                   zipBy ("id")
                                         (yaml_mp.EquipmentUniv)
                                         (yaml_mp.EquipmentL10nDefault)
                                         (yaml_mp.EquipmentL10nOverride),
                                 bindF (pipe (
                                   mapM (toItemTemplate),
                                   bindF (toMapIntegrity),
                                 )),
                                 second (fromMap)
                               )
