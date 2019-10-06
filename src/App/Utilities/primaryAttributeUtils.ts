import { fmapF } from "../../Data/Functor";
import { bind, bindF, fromMaybe, Just, listToMaybe, Maybe, Nothing } from "../../Data/Maybe";
import { lookup, OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { AttrId, SpecialAbilityId } from "../Constants/Ids";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { AttributeDependent, createPlainAttributeDependent } from "../Models/ActiveEntries/AttributeDependent";
import { AttributeCombined } from "../Models/View/AttributeCombined";
import { Attribute } from "../Models/Wiki/Attribute";
import { PrimaryAttributeType } from "../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { getBlessedTradition, getMagicalTraditionsHeroEntries } from "./Activatable/traditionUtils";
import { pipe } from "./pipe";

const ADA = ActivatableDependent.A

/**
 * Map a tradition's hero entry to an `AttributeCombined` entry of the
 * corresponding primary attribute.
 */
export const mapTradHeroEntryToAttrCombined =
  (wiki_attributes: OrderedMap<string, Record<Attribute>>) =>
  (hero_attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    pipe (
      ADA.id,
      getPrimAttrIdByTradId,
      bindF (getAttributeCombined (wiki_attributes)
                                  (hero_attributes))
    )

/**
 * Returns the primaty attribute id based on given type.
 * @param state Special abilities
 * @param type 1 = magical, 2 = blessed
 */
export const getPrimaryAttributeId =
  (state: OrderedMap<string, Record<ActivatableDependent>>) =>
  (type: PrimaryAttributeType): Maybe<AttrId> => {
    switch (type) {
      case PrimaryAttributeType.Magical:
        return bind (listToMaybe (getMagicalTraditionsHeroEntries (state)))
                    (pipe (ADA.id, getPrimAttrIdByTradId))

      case PrimaryAttributeType.Blessed:
        return bind (getBlessedTradition (state))
                    (pipe (ADA.id, getPrimAttrIdByTradId))

      default:
        return Nothing
    }
  }

/**
 * Pass a tradition ID (both magical or blessed) and get a `Just` of the
 * corresponding attribute ID. Returns a `Nothing` if the ID is not an ID of a
 * tradition.
 */
const getPrimAttrIdByTradId =
  (tradition_id: string): Maybe<AttrId> => {
    switch (tradition_id) {
      case SpecialAbilityId.TraditionChurchOfRondra:
      case SpecialAbilityId.TraditionChurchOfBoron:
      case SpecialAbilityId.TraditionChurchOfFirun:
      case SpecialAbilityId.TraditionCultOfTheNamelessOne:
      case SpecialAbilityId.TraditionChurchOfKor:
      case SpecialAbilityId.TraditionChurchOfSwafnir:
        return Just (AttrId.Courage)

      case SpecialAbilityId.TraditionGuildMages:
      case SpecialAbilityId.TraditionDruids:
      case SpecialAbilityId.TraditionQabalyamagier:
      case SpecialAbilityId.TraditionZauberalchimisten:
      case SpecialAbilityId.TraditionChurchOfPraios:
      case SpecialAbilityId.TraditionChurchOfHesinde:
      case SpecialAbilityId.TraditionChurchOfTravia:
      case SpecialAbilityId.TraditionChurchOfNandus:
      case SpecialAbilityId.TraditionCultOfNuminoru:
        return Just (AttrId.Sagacity)

      case SpecialAbilityId.TraditionElves:
      case SpecialAbilityId.TraditionSchelme:
      case SpecialAbilityId.TraditionAnimisten:
      case SpecialAbilityId.TraditionZibilijas:
      case SpecialAbilityId.TraditionChurchOfPhex:
      case SpecialAbilityId.TraditionChurchOfPeraine:
      case SpecialAbilityId.TraditionChurchOfIngerimm:
      case SpecialAbilityId.TraditionChurchOfAves:
        return Just (AttrId.Intuition)

      case SpecialAbilityId.TraditionWitches:
      case SpecialAbilityId.TraditionScharlatane:
      case SpecialAbilityId.TraditionZauberbarden:
      case SpecialAbilityId.TraditionZaubertaenzer:
      case SpecialAbilityId.TraditionGeoden:
      case SpecialAbilityId.TraditionBrobimGeoden:
      case SpecialAbilityId.TraditionChurchOfEfferd:
      case SpecialAbilityId.TraditionChurchOfTsa:
      case SpecialAbilityId.TraditionChurchOfRahja:
      case SpecialAbilityId.TraditionChurchOfIfirn:
        return Just (AttrId.Charisma)

      default:
        return Nothing
    }
  }

const getAttributeCombined =
  (wiki_attributes: OrderedMap<string, Record<Attribute>>) =>
  (hero_attributes: OrderedMap<string, Record<AttributeDependent>>) =>
  (id: AttrId) =>
    fmapF (lookup<string> (id) (wiki_attributes))
          (wiki_entry => AttributeCombined ({
                           stateEntry: fromMaybe (createPlainAttributeDependent (id))
                                                 (lookup<string> (id) (hero_attributes)),
                           wikiEntry: wiki_entry,
                         }))
