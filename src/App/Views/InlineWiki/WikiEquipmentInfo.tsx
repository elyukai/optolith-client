import * as React from "react"
import { fmap, fmapF } from "../../../Data/Functor"
import { elemF, intercalate, List, notElem, notNull } from "../../../Data/List"
import { alt_, bind, bindF, ensure, fromMaybe, imapMaybe, Just, liftM2, mapMaybe, Maybe, maybe, maybeRNullF, Nothing } from "../../../Data/Maybe"
import { gt } from "../../../Data/Num"
import { lookup, lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { show } from "../../../Data/Show"
import { fst, isTuple, snd } from "../../../Data/Tuple"
import { CombatTechniqueId } from "../../Constants/Ids"
import { Item } from "../../Models/Hero/Item"
import { NumIdName } from "../../Models/NumIdName"
import { SrcOnly } from "../../Models/View/SrcOnly"
import { Attribute } from "../../Models/Wiki/Attribute"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { DerivedCharacteristic } from "../../Models/Wiki/DerivedCharacteristic"
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate"
import { PrimaryAttributeDamageThreshold } from "../../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { minus, ndash } from "../../Utilities/Chars"
import { localizeNumber, localizeSize, localizeWeight, translate, translateP } from "../../Utilities/I18n"
import { convertPrimaryAttributeToArray } from "../../Utilities/ItemUtils"
import { sign, signZero } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { renderMaybe, renderMaybeWith } from "../../Utilities/ReactUtils"
import { Markdown } from "../Universal/Markdown"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"

const SDA = StaticData.A
const ITAL = ItemTemplate.AL
const ITA = ItemTemplate.A
const IA = Item.A
const PADTA = PrimaryAttributeDamageThreshold.A
const CTA = CombatTechnique.A
const AA = Attribute.A
const DCA = DerivedCharacteristic.A

const ensureNatural = bindF (ensure (gt (0)))
const getIniName = pipe (SDA.derivedCharacteristics, lookup ("INI"), maybe ("") (DCA.name))
const getMovName = pipe (SDA.derivedCharacteristics, lookup ("MOV"), maybe ("") (DCA.name))

export interface WikiEquipmentInfoProps {
  x: Record<ItemTemplate> | Record<Item>
  staticData: StaticDataRecord
}

export const WikiEquipmentInfo: React.FC<WikiEquipmentInfoProps> = props => {
  const { x, staticData } = props

  const attributes = SDA.attributes (staticData)
  const combatTechniques = SDA.combatTechniques (staticData)
  const itemTemplates = SDA.itemTemplates (staticData)

  const gr = ITAL.gr (x)
  const name = ITAL.name (x)
  const mprice = ITAL.price (x)
  const mweight = ITAL.weight (x)
  const combatTechniqueId = ITAL.combatTechnique (x)
  const damageDiceNumber = ITAL.damageDiceNumber (x)
  const damageDiceSides = ITAL.damageDiceSides (x)
  const damageFlat = ITAL.damageFlat (x)
  const mpadt_obj = ITAL.damageBonus (x)
  const at = ITAL.at (x)
  const pa = ITAL.pa (x)
  const reach = ITAL.reach (x)
  const mlength = ITAL.length (x)
  const reloadTime = ITAL.reloadTime (x)
  const range = ITAL.range (x)
  const ammunition = ITAL.ammunition (x)
  const pro = ITAL.pro (x)
  const enc = ITAL.enc (x)
  const movMod = ITAL.movMod (x)
  const iniMod = ITAL.iniMod (x)
  const addPenalties = ITAL.addPenalties (x)
  const mtpl =
    ITAL.isTemplateLocked (x)
      ? bind (ItemTemplate.is (x) ? Just (ITA.template (x)) : IA.template (x))
             (lookupF (itemTemplates))
      : Nothing
  const msrc = fmap (ITA.src) (mtpl)
  const mnote = bindF (ITA.note) (mtpl)
  const mrules = bindF (ITA.rules) (mtpl)
  const madvantage =
    pipe (bindF (ensure (pipe (ITA.gr, elemF (List (1, 2, 4))))), fmap (ITA.advantage)) (mtpl)
  const mdisadvantage =
    pipe (bindF (ensure (pipe (ITA.gr, elemF (List (1, 2, 4))))), fmap (ITA.disadvantage)) (mtpl)

  const ammunitionTemplate = bind (ammunition) (lookupF (itemTemplates))

  const addPenaltiesArr =
    addPenalties
      ? List (
          `${minus}${Maybe.sum (movMod) + 1} ${getMovName (staticData)}`,
          `${minus}${Maybe.sum (iniMod) + 1} ${getIniName (staticData)}`
        )
      : List<string> ()

  const mcombat_technique = bind (combatTechniqueId) (lookupF (combatTechniques))

  const mprimary_attr_id_list =
    alt_ (pipe_ (mpadt_obj, bindF (PADTA.primary), fmap (convertPrimaryAttributeToArray)))
         (() => fmapF (mcombat_technique) (CTA.primary))

  const mpadt =
    liftM2 ((primary_attr_id_list: List<string>) =>
            (padt_obj: Record<PrimaryAttributeDamageThreshold>) => {
              const th = PADTA.threshold (padt_obj)

              return isTuple (th)
                ? pipe_ (
                    primary_attr_id_list,
                    imapMaybe (i => pipe (
                                           lookupF (attributes),
                                           fmap (pipe (
                                             AA.short,
                                             s => `${s} ${i === 0 ? fst (th) : snd (th)}`
                                           ))
                                         )),
                    intercalate ("/")
                  )
                : pipe_ (
                    primary_attr_id_list,
                    mapMaybe (pipe (lookupF (attributes), fmap (AA.short))),
                    intercalate ("/"),
                    attr => `${attr} ${th}`
                  )
            })
           (mprimary_attr_id_list)
           (mpadt_obj)

  const isLancesCT = Maybe.elem<string> (CombatTechniqueId.Lances) (combatTechniqueId)
  const isShieldsCT = Maybe.elem<string> (CombatTechniqueId.Shields) (combatTechniqueId)

  const weightElement =
    maybe (null as React.ReactNode)
          ((weight: number) => (
            <tr>
              <td>{translate (staticData) ("inlinewiki.equipment.weight")}</td>
              <td>
                {translateP (staticData)
                            ("general.weightvalue")
                            (List (
                              pipe_ (
                                weight,
                                localizeWeight (staticData),
                                localizeNumber (staticData)
                              )
                            ))}
              </td>
            </tr>
          ))
          (ensureNatural (mweight))

  const priceElement =
    maybe (null as React.ReactNode)
          ((price: number) => (
            <tr>
              <td>{translate (staticData) ("inlinewiki.equipment.price")}</td>
              <td>
                {translateP (staticData)
                            ("general.pricevalue")
                            (List (localizeNumber (staticData) (price)))}
              </td>
            </tr>
          ))
          (ensureNatural (mprice))

  return (
    <WikiBoxTemplate
      className="item"
      title={name}
      subtitle={gr === 3
                ? (
                    <p className="title">
                      {translate (staticData) ("inlinewiki.equipment.ammunition")}
                    </p>
                  )
                : null}
      >
      {gr === 3
        ? <p className="ammunition">{translate (staticData) ("inlinewiki.equipment.ammunition")}</p>
        : null}
      {notElem (gr) (List (1, 2, 4))
        ? (
            <table className="melee">
              <tbody>
                {weightElement}
                {priceElement}
              </tbody>
            </table>
          )
        : null}
      {gr === 1
        ? (
          <table className="melee">
            <tbody>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.combattechnique")}</td>
                <td>{renderMaybeWith (CTA.name) (mcombat_technique)}</td>
              </tr>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.damage")}</td>
                <td>
                  {renderMaybe (damageDiceNumber)}
                  {translate (staticData) ("general.dice")}
                  {renderMaybe (damageDiceSides)}
                  {renderMaybeWith (signZero) (damageFlat)}
                </td>
              </tr>
              <tr>
                <td>
                  {translate (staticData)
                             ("inlinewiki.equipment.primaryattributeanddamagethreshold")}
                </td>
                <td>{isLancesCT ? ndash : renderMaybe (mpadt)}</td>
              </tr>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.attackparrymodifier")}</td>
                <td>
                  {isLancesCT
                    ? ndash
                    : `${renderMaybeWith (sign) (at)}/${maybe (ndash) (sign) (pa)}`}
                </td>
              </tr>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.reach")}</td>
                <td>
                  {isLancesCT
                  ? ndash
                  : pipe_ (
                      reach,
                      bindF (lookupF (SDA.reaches (staticData))),
                      renderMaybeWith (NumIdName.A.name)
                    )}
                </td>
              </tr>
              {weightElement}
              {isShieldsCT
                ? null
                : (
                  <tr>
                    <td>{translate (staticData) ("inlinewiki.equipment.length")}</td>
                    <td>
                      {translateP (staticData)
                                  ("general.lengthvalue")
                                  (List (
                                    renderMaybeWith (pipe (
                                                      localizeSize (staticData),
                                                      localizeNumber (staticData)
                                                    ))
                                                    (mlength)
                                  ))}
                    </td>
                  </tr>
                )}
              {priceElement}
            </tbody>
          </table>
        )
        : null}
      {gr === 2
        ? (
          <table className="ranged">
            <tbody>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.combattechnique")}</td>
                <td>
                  {renderMaybeWith (CTA.name) (mcombat_technique)}
                </td>
              </tr>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.damage")}</td>
                <td>
                  {renderMaybe (damageDiceNumber)}
                  {translate (staticData) ("general.dice")}
                  {renderMaybe (damageDiceSides)}
                  {renderMaybeWith (signZero) (damageFlat)}
                </td>
              </tr>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.reloadtime")}</td>
                <td>
                  {translateP (staticData)
                              ("inlinewiki.equipment.actionsvalue")
                              (List (renderMaybeWith ((rt: number | List<number>) =>
                                                       typeof rt === "object"
                                                       ? intercalate ("/") (rt)
                                                       : show (rt))
                                                     (reloadTime)))}
                </td>
              </tr>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.range")}</td>
                <td>{renderMaybeWith (intercalate ("/")) (range)}</td>
              </tr>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.ammunition")}</td>
                <td>
                  {maybe (translate (staticData) ("general.none"))
                         (ITAL.name)
                         (ammunitionTemplate)}
                </td>
              </tr>
              {weightElement}
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.length")}</td>
                <td>
                  {translateP (staticData)
                              ("general.lengthvalue")
                              (List (
                                renderMaybeWith (pipe (
                                                  localizeSize (staticData),
                                                  localizeNumber (staticData)
                                                ))
                                                (mlength)
                              ))}
                </td>
              </tr>
              {priceElement}
            </tbody>
          </table>
        )
        : null}
      {gr === 4
        ? (
          <table className="armor">
            <tbody>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.protection")}</td>
                <td>{renderMaybe (pro)}</td>
              </tr>
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.encumbrance")}</td>
                <td>{renderMaybe (enc)}</td>
              </tr>
              {weightElement}
              {priceElement}
              <tr>
                <td>{translate (staticData) ("inlinewiki.equipment.additionalpenalties")}</td>
                <td>{maybe (ndash) (intercalate (", ")) (ensure (notNull) (addPenaltiesArr))}</td>
              </tr>
            </tbody>
          </table>
        )
        : null}
      {maybeRNullF (mnote)
                   (str => (
                     <Markdown
                       source={`**${translate (staticData) ("inlinewiki.equipment.note")}:** ${str}`}
                       />
                   ))}
      {maybeRNullF (mrules)
                   (str => (
                     <Markdown
                       source={`**${translate (staticData) ("inlinewiki.equipment.rules")}:** ${str}`}
                       />
                   ))}
      {maybeRNullF (madvantage)
                   (str => {
                     const tag =
                       ITAL.gr (x) === 4
                         ? translate (staticData) ("inlinewiki.equipment.armoradvantage")
                         : translate (staticData) ("inlinewiki.equipment.weaponadvantage")

                     const val = fromMaybe (translate (staticData) ("general.none")) (str)

                     return (
                       <Markdown source={`**${tag}:** ${val}`} />
                     )
                   })}
      {maybeRNullF (mdisadvantage)
                   (str => {
                     const tag =
                       ITAL.gr (x) === 4
                         ? translate (staticData) ("inlinewiki.equipment.armordisadvantage")
                         : translate (staticData) ("inlinewiki.equipment.weapondisadvantage")

                     const val = fromMaybe (translate (staticData) ("general.none")) (str)

                     return (
                       <Markdown source={`**${tag}:** ${val}`} />
                     )
                   })}
      {maybeRNullF (msrc)
                   (src => (
                     <WikiSource
                       staticData={staticData}
                       x={SrcOnly ({ src })}
                       acc={SrcOnly.A}
                       />
                   ))}
    </WikiBoxTemplate>
  )
}
