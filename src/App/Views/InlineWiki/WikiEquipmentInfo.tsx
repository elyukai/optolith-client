import * as React from "react";
import { fmap, fmapF } from "../../../Data/Functor";
import { elemF, intercalate, List, notElem, notNull, subscript } from "../../../Data/List";
import { alt_, bind, bindF, ensure, fromMaybe, imapMaybe, Just, liftM2, mapMaybe, Maybe, maybe, maybeRNullF, Nothing } from "../../../Data/Maybe";
import { dec, gt } from "../../../Data/Num";
import { lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, Record } from "../../../Data/Record";
import { fst, isTuple, snd } from "../../../Data/Tuple";
import { CombatTechniqueId } from "../../Constants/Ids";
import { Item } from "../../Models/Hero/Item";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Book } from "../../Models/Wiki/Book";
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique";
import { ItemTemplate } from "../../Models/Wiki/ItemTemplate";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { PrimaryAttributeDamageThreshold } from "../../Models/Wiki/sub/PrimaryAttributeDamageThreshold";
import { SourceLink } from "../../Models/Wiki/sub/SourceLink";
import { minus, ndash } from "../../Utilities/Chars";
import { localizeNumber, localizeSize, localizeWeight, translate } from "../../Utilities/I18n";
import { convertPrimaryAttributeToArray } from "../../Utilities/ItemUtils";
import { sign, signZero } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe, renderMaybeWith } from "../../Utilities/ReactUtils";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";

export interface WikiEquipmentInfoProps {
  attributes: OrderedMap<string, Record<Attribute>>
  books: OrderedMap<string, Record<Book>>
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  x: Record<ItemTemplate> | Record<Item>
  l10n: L10nRecord
  itemTemplates: OrderedMap<string, Record<ItemTemplate>>
}

const ITAL = ItemTemplate.AL
const ITA = ItemTemplate.A
const IA = Item.A
const PADTA = PrimaryAttributeDamageThreshold.A
const CTA = CombatTechnique.A
const AA = Attribute.A

// tslint:disable-next-line: cyclomatic-complexity
export function WikiEquipmentInfo (props: WikiEquipmentInfoProps) {
  const { attributes, x, l10n, combatTechniques, itemTemplates, books } = props
  const locale = L10n.A.id (l10n)
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
          `${minus}${Maybe.sum (movMod) + 1} ${translate (l10n) ("movement.short")}`,
          `${minus}${Maybe.sum (iniMod) + 1} ${translate (l10n) ("initiative.short")}`
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
              <td>{translate (l10n) ("weight")}</td>
              <td>
                {pipe_ (weight, localizeWeight (locale), localizeNumber (locale))}
                {" "}
                {translate (l10n) ("weightunit.short")}
              </td>
            </tr>
          ))
          (ensureNatural (mweight))

  const priceElement =
    maybe (null as React.ReactNode)
          ((price: number) => (
            <tr>
              <td>{translate (l10n) ("price")}</td>
              <td>
                {localizeNumber (locale) (price)}
                {" "}
                {translate (l10n) ("priceunit")}
              </td>
            </tr>
          ))
          (ensureNatural (mprice))

  return (
    <WikiBoxTemplate
      className="item"
      title={name}
      subtitle={gr === 3
                  ? <p className="title">{translate (l10n) ("ammunition")}</p>
                  : null}
      >
      {gr === 3
        ? <p className="ammunition">{translate (l10n) ("ammunition")}</p>
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
                <td>{translate (l10n) ("combattechnique")}</td>
                <td>{renderMaybeWith (CTA.name) (mcombat_technique)}</td>
              </tr>
              <tr>
                <td>{translate (l10n) ("damage")}</td>
                <td>
                  {renderMaybe (damageDiceNumber)}
                  {translate (l10n) ("dice.short")}
                  {renderMaybe (damageDiceSides)}
                  {renderMaybeWith (signZero) (damageFlat)}
                </td>
              </tr>
              <tr>
                <td>{translate (l10n) ("primaryattributeanddamagethreshold.short")}</td>
                <td>{isLancesCT ? ndash : renderMaybe (mpadt)}</td>
              </tr>
              <tr>
                <td>{translate (l10n) ("attackparrymodifier.short")}</td>
                <td>
                  {isLancesCT ? ndash : `${renderMaybeWith (sign) (at)}/${maybe (ndash) (sign) (pa)}`}
                </td>
              </tr>
              <tr>
                <td>{translate (l10n) ("reach")}</td>
                <td>
                  {isLancesCT
                  ? ndash
                  : pipe_ (
                      reach,
                      bindF (pipe (dec, subscript (translate (l10n) ("reachlabels")))),
                      renderMaybe
                    )}
                </td>
              </tr>
              {weightElement}
              {isShieldsCT
                ? null
                : (
                  <tr>
                    <td>{translate (l10n) ("length")}</td>
                    <td>
                      {renderMaybeWith (pipe (localizeSize (locale), localizeNumber (locale)))
                                      (mlength)}
                      {" "}
                      {translate (l10n) ("lengthunit")}
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
                <td>{translate (l10n) ("combattechnique")}</td>
                <td>
                  {renderMaybeWith (CTA.name) (mcombat_technique)}
                </td>
              </tr>
              <tr>
                <td>{translate (l10n) ("damage")}</td>
                <td>
                  {renderMaybe (damageDiceNumber)}
                  {translate (l10n) ("dice.short")}
                  {renderMaybe (damageDiceSides)}
                  {renderMaybeWith (signZero) (damageFlat)}
                </td>
              </tr>
              <tr>
                <td>{translate (l10n) ("reloadtime")}</td>
                <td>
                  {renderMaybe (reloadTime)}
                  {" "}
                  {translate (l10n) ("actions.short")}
                </td>
              </tr>
              <tr>
                <td>{translate (l10n) ("range")}</td>
                <td>{renderMaybeWith (intercalate ("/")) (range)}</td>
              </tr>
              <tr>
                <td>{translate (l10n) ("ammunition")}</td>
                <td>{maybe (translate (l10n) ("none")) (ITAL.name) (ammunitionTemplate)}</td>
              </tr>
              {weightElement}
              <tr>
                <td>{translate (l10n) ("length")}</td>
                <td>
                  {renderMaybeWith (pipe (localizeSize (locale), localizeNumber (locale)))
                                   (mlength)}
                  {" "}
                  {translate (l10n) ("lengthunit")}
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
                <td>{translate (l10n) ("protection.short")}</td>
                <td>{renderMaybe (pro)}</td>
              </tr>
              <tr>
                <td>{translate (l10n) ("encumbrance.short")}</td>
                <td>{renderMaybe (enc)}</td>
              </tr>
              {weightElement}
              {priceElement}
              <tr>
                <td>{translate (l10n) ("additionalpenalties")}</td>
                <td>{maybe (ndash) (intercalate (", ")) (ensure (notNull) (addPenaltiesArr))}</td>
              </tr>
            </tbody>
          </table>
        )
        : null}
      {maybeRNullF (mnote)
                   (str => (
                     <Markdown source={`**${translate (l10n) ("notes")}:** ${str}`} />
                   ))}
      {maybeRNullF (mrules)
                   (str => (
                     <Markdown source={`**${translate (l10n) ("rules")}:** ${str}`} />
                   ))}
      {maybeRNullF (madvantage)
                   (str => {
                     const tag =
                       ITAL.gr (x) === 4
                         ? translate (l10n) ("armoradvantage")
                         : translate (l10n) ("weaponadvantage")

                     const val = fromMaybe (translate (l10n) ("none")) (str)

                     return (
                       <Markdown source={`**${tag}:** ${val}`} />
                     )
                   })}
      {maybeRNullF (mdisadvantage)
                   (str => {
                     const tag =
                       ITAL.gr (x) === 4
                         ? translate (l10n) ("armordisadvantage")
                         : translate (l10n) ("weapondisadvantage")

                     const val = fromMaybe (translate (l10n) ("none")) (str)

                     return (
                       <Markdown source={`**${tag}:** ${val}`} />
                     )
                   })}
      {maybeRNullF (msrc)
                   (src => (
                     <WikiSource
                       books={books}
                       l10n={l10n}
                       x={SrcObj ({ src })}
                       acc={SrcObj.A}
                       />
                   ))}
    </WikiBoxTemplate>
  )
}

interface SrcObj {
  "@@name": "SrcObj"
  src: List<Record<SourceLink>>
}

const SrcObj = fromDefault ("SrcObj")
                           <SrcObj> ({
                             src: List<Record<SourceLink>> (),
                           })

const ensureNatural = bindF (ensure (gt (0)))
