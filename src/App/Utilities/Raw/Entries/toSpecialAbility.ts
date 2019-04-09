import { fmap } from "../../../../Data/Functor";
import { map } from "../../../../Data/List";
import { alt, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNatural, mensureMapNaturalFixedListOptional, mensureMapNaturalOptional, mensureMapNonEmptyString, mensureMapStringPredListOptional, mensureMapStringPredOptional } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed } from "../validateValueUtils";
import { toActivatableCost } from "./Sub/toActivatableCost";
import { toPrerequisites } from "./Sub/toPrerequisites";
import { toPrerequisitesIndex } from "./Sub/toPrerequisitesIndex";
import { toSourceLinks } from "./Sub/toSourceLinks";

const category = /[A-Z_]+/

const checkCategory =
  (x: string) => category .test (x)

const combatSpecialAbilityType = /p|b|s/

const checkCSATypeString =
  (x: string) => combatSpecialAbilityType .test (x)

export const toSpecialAbility =
  mergeRowsById
    ("toSpecialAbility")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

      const checkOptionalCategoryList =
        lookupKeyValid (mensureMapStringPredListOptional (checkCategory)
                                                         ("Category")
                                                         ("&"))
                       (lookup_univ)

      const checkCombatSpecialAbilityType =
        lookupKeyValid (mensureMapStringPredOptional (checkCSATypeString)
                                                     (`"p" | "b" | "s"`))
                       (lookup_univ)

      const checkExtendedSpecialAbilitiesList =
        lookupKeyValid (mensureMapNaturalFixedListOptional (3) ("&"))
                       (lookup_univ)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural)
                       (lookup_univ)

      const checkOptionalUnivNaturalNumber =
        lookupKeyValid (mensureMapNaturalOptional)
                       (lookup_univ)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const nameInWiki = lookup_l10n ("name")

      const ecost = toActivatableCost (lookup_univ)

      const etiers = checkOptionalUnivNaturalNumber ("tiers")

      const emax = checkOptionalUnivNaturalNumber ("max")

      const eselect = checkOptionalCategoryList ("select")

      const input = lookup_l10n ("input")

      const egr = checkUnivNaturalNumber ("input")

      const etype = checkCombatSpecialAbilityType ("type")

      const eextended = checkExtendedSpecialAbilitiesList ("extended")

      const rules = lookup_l10n ("rules")

      const effect = lookup_l10n ("effect")

      const penalty = lookup_l10n ("penalty")

      const combatTechniques = lookup_l10n ("combatTechniques")

      const aeCost = lookup_l10n ("aeCost")

      const protectiveCircle = lookup_l10n ("protectiveCircle")

      const wardingCircle = lookup_l10n ("wardingCircle")

      const volume = lookup_l10n ("volume")

      const bindingCost = lookup_l10n ("bindingCost")

      const eproperty = checkOptionalUnivNaturalNumber ("property")

      const property = lookup_l10n ("property")

      const easpect = checkOptionalUnivNaturalNumber ("aspect")

      const apValue = lookup_l10n ("apValue")

      const apValueAppend = lookup_l10n ("apValueAppend")

      const eprerequisites = toPrerequisites (lookup_univ)

      const prerequisites = lookup_l10n ("prerequisites")

      const eprerequisitesIndex = toPrerequisitesIndex (lookup_l10n) (lookup_univ)

      const prerequisitesStart = lookup_l10n ("prerequisitesStart")

      const prerequisitesEnd = lookup_l10n ("prerequisitesEnd")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          ename,
          ecost,
          etiers,
          emax,
          eselect,
          egr,
          etype,
          eextended,
          eproperty,
          easpect,
          eprerequisites,
          eprerequisitesIndex,
          esrc,
        })
        (rs => SpecialAbility ({
          id: prefixId (IdPrefixes.SPECIAL_ABILITIES) (id),
          name: rs.ename,
          nameInWiki,
          cost: rs.ecost,
          tiers: rs.etiers,
          max: rs.emax,

          select:
            fmap (map<string, Record<SelectOption>> (x => SelectOption ({
                                                      id: x,
                                                      name: Nothing,
                                                      cost: Nothing,
                                                      prerequisites: Nothing,
                                                      target: Nothing,
                                                      level: Nothing,
                                                      specializations: Nothing,
                                                      specializationInput: Nothing,
                                                      applications: Nothing,
                                                      applicationInput: Nothing,
                                                      gr: Nothing,
                                                      src: Nothing,
                                                    })))
                                                    (rs.eselect),

          input,
          gr: rs.egr,
          type: rs.etype,
          extended: fmap (map (prefixId (IdPrefixes.SPECIAL_ABILITIES))) (rs.eextended),
          rules,
          effect,
          penalty,
          combatTechniques,
          aeCost,
          protectiveCircle,
          wardingCircle,
          volume,
          bindingCost,
          property: alt<string | number> (rs.eproperty) (property),
          aspect: rs.easpect,
          apValue,
          apValueAppend,
          prerequisites: rs.eprerequisites,
          prerequisitesText: prerequisites,
          prerequisitesTextIndex: rs.eprerequisitesIndex,
          prerequisitesTextStart: prerequisitesStart,
          prerequisitesTextEnd: prerequisitesEnd,

          src: rs.esrc,

          category: Nothing,
        }))
    })
