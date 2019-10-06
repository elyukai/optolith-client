import { filter, List } from "../../../Data/List";
import { bindF, Just, mapMaybe, Maybe, Nothing } from "../../../Data/Maybe";
import { elems, find, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { BlessedTradition, MagicalTradition } from "../../Constants/Groups";
import { SpecialAbilityId } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { pipe } from "../pipe";
import { isActive } from "./isActive";

const ADA = ActivatableDependent.A

const isActiveMagicalTradition =
  (e: Record<ActivatableDependent>) => isMagicalTradId (ADA.id (e)) && isActive (e)

const isActiveBlessedTradition =
  (e: Record<ActivatableDependent>) => isBlessedTradId (ADA.id (e)) && isActive (e)

/**
 * Get magical traditions' dependent entries.
 * @param list
 */
export const getMagicalTraditionsHeroEntries =
  pipe (
    elems as
      (list: OrderedMap<any, Record<ActivatableDependent>>) => List<Record<ActivatableDependent>>,
    filter (isActiveMagicalTradition)
  )

/**
 * Get magical traditions' wiki entries.
 * @param wiki
 * @param list
 */
export const getMagicalTraditionsFromWiki =
  (wiki: OrderedMap<string, Record<SpecialAbility>>) =>
    pipe (getMagicalTraditionsHeroEntries, mapMaybe (pipe (ADA.id, lookupF (wiki))))

/**
 * Get blessed traditions' dependent entry.
 * @param list
 */
export const getBlessedTradition = find (isActiveBlessedTradition)

/**
 * Get blessed tradition's' wiki entry.
 * @param wiki
 * @param list
 */
export const getBlessedTraditionFromWiki =
  (wiki: OrderedMap<string, Record<SpecialAbility>>) =>
    pipe (getBlessedTradition, bindF (pipe (ADA.id, lookupF (wiki))))

/**
 * Checks if an ID is a magical tradition's id.
 */
export const isMagicalTradId =
  (tradition_id: string): boolean => {
    switch (tradition_id) {
      case SpecialAbilityId.TraditionGuildMages:
      case SpecialAbilityId.TraditionWitches:
      case SpecialAbilityId.TraditionElves:
      case SpecialAbilityId.TraditionDruids:
      case SpecialAbilityId.TraditionScharlatane:
      case SpecialAbilityId.TraditionZauberbarden:
      case SpecialAbilityId.TraditionZaubertaenzer:
      case SpecialAbilityId.TraditionIntuitiveZauberer:
      case SpecialAbilityId.TraditionMeistertalentierte:
      case SpecialAbilityId.TraditionQabalyamagier:
      case SpecialAbilityId.TraditionZauberalchimisten:
      case SpecialAbilityId.TraditionKristallomanten:
      case SpecialAbilityId.TraditionGeoden:
      case SpecialAbilityId.TraditionSchelme:
      case SpecialAbilityId.TraditionAnimisten:
      case SpecialAbilityId.TraditionZibilijas:
      case SpecialAbilityId.TraditionBrobimGeoden:
        return true

      default:
        return false
    }
  }

/**
 * Map a magical tradition's ID to a numeric magical tradition ID used by
 * spells.
 *
 * *Note: Zauberalchimisten do not get spells and thus do not have a numeric
 * magical tradition ID.*
 */
export const mapMagicalTradIdToNumId =
  (tradition_id: string): Maybe<MagicalTradition> => {
    switch (tradition_id) {
      case SpecialAbilityId.TraditionGuildMages:
        return Just (MagicalTradition.GuildMages)

      case SpecialAbilityId.TraditionWitches:
        return Just (MagicalTradition.Witches)

      case SpecialAbilityId.TraditionElves:
        return Just (MagicalTradition.Elves)

      case SpecialAbilityId.TraditionDruids:
        return Just (MagicalTradition.Druids)

      case SpecialAbilityId.TraditionScharlatane:
        return Just (MagicalTradition.Scharlatane)

      case SpecialAbilityId.TraditionZauberbarden:
        return Just (MagicalTradition.Zauberbarden)

      case SpecialAbilityId.TraditionZaubertaenzer:
        return Just (MagicalTradition.Zaubertaenzer)

      case SpecialAbilityId.TraditionIntuitiveZauberer:
        return Just (MagicalTradition.IntuitiveZauberer)

      case SpecialAbilityId.TraditionMeistertalentierte:
        return Just (MagicalTradition.Meistertalentierte)

      case SpecialAbilityId.TraditionQabalyamagier:
        return Just (MagicalTradition.Qabalyamagier)

      case SpecialAbilityId.TraditionKristallomanten:
        return Just (MagicalTradition.Kristallomanten)

      case SpecialAbilityId.TraditionGeoden:
        return Just (MagicalTradition.Geoden)

      case SpecialAbilityId.TraditionSchelme:
        return Just (MagicalTradition.Schelme)

      case SpecialAbilityId.TraditionAnimisten:
        return Just (MagicalTradition.Animisten)

      case SpecialAbilityId.TraditionZibilijas:
        return Just (MagicalTradition.Zibilijas)

      case SpecialAbilityId.TraditionBrobimGeoden:
        return Just (MagicalTradition.BrobimGeoden)

      default:
        return Nothing
    }
  }

/**
 * Map a numeric magical tradition ID used by spells to a magical tradition's
 * ID.
 */
export const mapMagicalNumIdToTradId =
  (tradition_id: MagicalTradition): Maybe<SpecialAbilityId> => {
    switch (tradition_id) {
      case MagicalTradition.GuildMages:
        return Just (SpecialAbilityId.TraditionGuildMages)

      case MagicalTradition.Witches:
        return Just (SpecialAbilityId.TraditionWitches)

      case MagicalTradition.Elves:
        return Just (SpecialAbilityId.TraditionElves)

      case MagicalTradition.Druids:
        return Just (SpecialAbilityId.TraditionDruids)

      case MagicalTradition.Scharlatane:
        return Just (SpecialAbilityId.TraditionScharlatane)

      case MagicalTradition.Zauberbarden:
        return Just (SpecialAbilityId.TraditionZauberbarden)

      case MagicalTradition.Zaubertaenzer:
        return Just (SpecialAbilityId.TraditionZaubertaenzer)

      case MagicalTradition.IntuitiveZauberer:
        return Just (SpecialAbilityId.TraditionIntuitiveZauberer)

      case MagicalTradition.Meistertalentierte:
        return Just (SpecialAbilityId.TraditionMeistertalentierte)

      case MagicalTradition.Qabalyamagier:
        return Just (SpecialAbilityId.TraditionQabalyamagier)

      case MagicalTradition.Kristallomanten:
        return Just (SpecialAbilityId.TraditionKristallomanten)

      case MagicalTradition.Geoden:
        return Just (SpecialAbilityId.TraditionGeoden)

      case MagicalTradition.Schelme:
        return Just (SpecialAbilityId.TraditionSchelme)

      case MagicalTradition.Animisten:
        return Just (SpecialAbilityId.TraditionAnimisten)

      case MagicalTradition.Zibilijas:
        return Just (SpecialAbilityId.TraditionZibilijas)

      case MagicalTradition.BrobimGeoden:
        return Just (SpecialAbilityId.TraditionBrobimGeoden)

      default:
        return Nothing
    }
  }

/**
 * Checks if an ID is a blessed tradition's id.
 */
export const isBlessedTradId =
  (tradition_id: string): boolean => {
    switch (tradition_id) {
      case SpecialAbilityId.TraditionChurchOfPraios:
      case SpecialAbilityId.TraditionChurchOfRondra:
      case SpecialAbilityId.TraditionChurchOfBoron:
      case SpecialAbilityId.TraditionChurchOfHesinde:
      case SpecialAbilityId.TraditionChurchOfPhex:
      case SpecialAbilityId.TraditionChurchOfPeraine:
      case SpecialAbilityId.TraditionChurchOfEfferd:
      case SpecialAbilityId.TraditionChurchOfTravia:
      case SpecialAbilityId.TraditionChurchOfFirun:
      case SpecialAbilityId.TraditionChurchOfTsa:
      case SpecialAbilityId.TraditionChurchOfIngerimm:
      case SpecialAbilityId.TraditionChurchOfRahja:
      case SpecialAbilityId.TraditionCultOfTheNamelessOne:
      case SpecialAbilityId.TraditionChurchOfAves:
      case SpecialAbilityId.TraditionChurchOfIfirn:
      case SpecialAbilityId.TraditionChurchOfKor:
      case SpecialAbilityId.TraditionChurchOfNandus:
      case SpecialAbilityId.TraditionChurchOfSwafnir:
      case SpecialAbilityId.TraditionCultOfNuminoru:
        return true

      default:
        return false
    }
  }

/**
 * Map a blessed tradition's ID to a numeric blessed tradition ID used by
 * chants.
 */
export const mapBlessedTradIdToNumId =
  (tradition_id: string): Maybe<BlessedTradition> => {
    switch (tradition_id) {
      case SpecialAbilityId.TraditionChurchOfPraios:
        return Just (BlessedTradition.ChurchOfPraios)

      case SpecialAbilityId.TraditionChurchOfRondra:
        return Just (BlessedTradition.ChurchOfRondra)

      case SpecialAbilityId.TraditionChurchOfBoron:
        return Just (BlessedTradition.ChurchOfBoron)

      case SpecialAbilityId.TraditionChurchOfHesinde:
        return Just (BlessedTradition.ChurchOfHesinde)

      case SpecialAbilityId.TraditionChurchOfPhex:
        return Just (BlessedTradition.ChurchOfPhex)

      case SpecialAbilityId.TraditionChurchOfPeraine:
        return Just (BlessedTradition.ChurchOfPeraine)

      case SpecialAbilityId.TraditionChurchOfEfferd:
        return Just (BlessedTradition.ChurchOfEfferd)

      case SpecialAbilityId.TraditionChurchOfTravia:
        return Just (BlessedTradition.ChurchOfTravia)

      case SpecialAbilityId.TraditionChurchOfFirun:
        return Just (BlessedTradition.ChurchOfFirun)

      case SpecialAbilityId.TraditionChurchOfTsa:
        return Just (BlessedTradition.ChurchOfTsa)

      case SpecialAbilityId.TraditionChurchOfIngerimm:
        return Just (BlessedTradition.ChurchOfIngerimm)

      case SpecialAbilityId.TraditionChurchOfRahja:
        return Just (BlessedTradition.ChurchOfRahja)

      case SpecialAbilityId.TraditionCultOfTheNamelessOne:
        return Just (BlessedTradition.CultOfTheNamelessOne)

      case SpecialAbilityId.TraditionChurchOfAves:
        return Just (BlessedTradition.ChurchOfAves)

      case SpecialAbilityId.TraditionChurchOfIfirn:
        return Just (BlessedTradition.ChurchOfIfirn)

      case SpecialAbilityId.TraditionChurchOfKor:
        return Just (BlessedTradition.ChurchOfKor)

      case SpecialAbilityId.TraditionChurchOfNandus:
        return Just (BlessedTradition.ChurchOfNandus)

      case SpecialAbilityId.TraditionChurchOfSwafnir:
        return Just (BlessedTradition.ChurchOfSwafnir)

      case SpecialAbilityId.TraditionCultOfNuminoru:
        return Just (BlessedTradition.CultOfNuminoru)

      default:
        return Nothing
    }
  }

/**
 * Map a blessed tradition's ID to a numeric blessed tradition ID used by
 * chants.
 */
export const mapBlessedNumIdToTradId =
  (tradition_id: BlessedTradition): Maybe<SpecialAbilityId> => {
    switch (tradition_id) {
      case BlessedTradition.ChurchOfPraios:
        return Just (SpecialAbilityId.TraditionChurchOfPraios)

      case BlessedTradition.ChurchOfRondra:
        return Just (SpecialAbilityId.TraditionChurchOfRondra)

      case BlessedTradition.ChurchOfBoron:
        return Just (SpecialAbilityId.TraditionChurchOfBoron)

      case BlessedTradition.ChurchOfHesinde:
        return Just (SpecialAbilityId.TraditionChurchOfHesinde)

      case BlessedTradition.ChurchOfPhex:
        return Just (SpecialAbilityId.TraditionChurchOfPhex)

      case BlessedTradition.ChurchOfPeraine:
        return Just (SpecialAbilityId.TraditionChurchOfPeraine)

      case BlessedTradition.ChurchOfEfferd:
        return Just (SpecialAbilityId.TraditionChurchOfEfferd)

      case BlessedTradition.ChurchOfTravia:
        return Just (SpecialAbilityId.TraditionChurchOfTravia)

      case BlessedTradition.ChurchOfFirun:
        return Just (SpecialAbilityId.TraditionChurchOfFirun)

      case BlessedTradition.ChurchOfTsa:
        return Just (SpecialAbilityId.TraditionChurchOfTsa)

      case BlessedTradition.ChurchOfIngerimm:
        return Just (SpecialAbilityId.TraditionChurchOfIngerimm)

      case BlessedTradition.ChurchOfRahja:
        return Just (SpecialAbilityId.TraditionChurchOfRahja)

      case BlessedTradition.CultOfTheNamelessOne:
        return Just (SpecialAbilityId.TraditionCultOfTheNamelessOne)

      case BlessedTradition.ChurchOfAves:
        return Just (SpecialAbilityId.TraditionChurchOfAves)

      case BlessedTradition.ChurchOfIfirn:
        return Just (SpecialAbilityId.TraditionChurchOfIfirn)

      case BlessedTradition.ChurchOfKor:
        return Just (SpecialAbilityId.TraditionChurchOfKor)

      case BlessedTradition.ChurchOfNandus:
        return Just (SpecialAbilityId.TraditionChurchOfNandus)

      case BlessedTradition.ChurchOfSwafnir:
        return Just (SpecialAbilityId.TraditionChurchOfSwafnir)

      case BlessedTradition.CultOfNuminoru:
        return Just (SpecialAbilityId.TraditionCultOfNuminoru)

      default:
        return Nothing
    }
  }
