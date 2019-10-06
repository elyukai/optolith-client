import { fmap, fmapF } from "../../../../Data/Functor";
import { map } from "../../../../Data/List";
import { alt, joinMaybeList, Nothing } from "../../../../Data/Maybe";
import { OrderedMap } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { SpecialAbility, SpecialAbilityCombatTechniqueGroup, SpecialAbilityCombatTechniques } from "../../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { prefixCT, prefixId } from "../../IDUtils";
import { toNatural } from "../../NumberUtils";
import { mergeRowsById } from "../mergeTableRows";
import { modifyNegIntNoBreak } from "../rawConversionUtils";
import { Expect } from "../showExpected";
import { mensureMapListLengthInRangeOptional, mensureMapNatural, mensureMapNaturalInRangeOptional, mensureMapNaturalListOptional, mensureMapNaturalOptional, mensureMapNonEmptyString, mensureMapNumEnumOptional, mensureMapStringPredListOptional } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { toActivatableCost } from "./Sub/toActivatableCost";
import { toPrerequisites } from "./Sub/toPrerequisites";
import { toPrerequisitesIndex } from "./Sub/toPrerequisitesIndex";
import { toSourceLinks } from "./Sub/toSourceLinks";

const category = /[A-Z_]+/u

const checkCategory =
  (x: string) => category .test (x)

export const toSpecialAbility =
  mergeRowsById
    ("toSpecialAbility")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkOptionalCategoryList =
        lookupKeyValid (mensureMapStringPredListOptional (checkCategory)
                                                         ("Category")
                                                         ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkExtendedSpecialAbilitiesList =
        lookupKeyValid (mensureMapListLengthInRangeOptional (1)
                                                            (3)
                                                            ("&")
                                                            (Expect.NaturalNumber)
                                                            (toNatural))
                       (TableType.Univ)
                       (lookup_univ)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural)
                       (TableType.Univ)
                       (lookup_univ)

      const checkOptionalUnivNaturalInRange1to3Number =
        lookupKeyValid (mensureMapNaturalInRangeOptional (1) (3))
                       (TableType.Univ)
                       (lookup_univ)

      const checkOptionalUnivNaturalNumber =
        lookupKeyValid (mensureMapNaturalOptional)
                       (TableType.Univ)
                       (lookup_univ)

      const checkOptionalUnivNaturalNumberList =
        lookupKeyValid (mensureMapNaturalListOptional ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkCombatTechniqueGroup =
        lookupKeyValid (mensureMapNumEnumOptional ("SpecialAbilityCombatTechniqueGroup")
                                                (SpecialAbilityCombatTechniqueGroup))
                       (TableType.Univ)
                       (lookup_univ)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const nameInWiki = lookup_l10n ("nameInWiki")

      const ecost = toActivatableCost (lookup_univ)

      const etiers = checkOptionalUnivNaturalNumber ("tiers")

      const emax = checkOptionalUnivNaturalNumber ("max")

      const eselect = checkOptionalCategoryList ("select")

      const input = lookup_l10n ("input")

      const egr = checkUnivNaturalNumber ("gr")

      const esubgr = checkOptionalUnivNaturalInRange1to3Number ("subgr")

      const eextended = checkExtendedSpecialAbilitiesList ("extended")

      const rules = lookup_l10n ("rules")

      const effect = lookup_l10n ("effect")

      const penalty = lookup_l10n ("penalty")

      const ecombatTechniques = checkOptionalUnivNaturalNumberList ("combatTechniques")

      const ecombatTechniquesGroup = checkCombatTechniqueGroup ("combatTechniquesGroup")

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

      const ebrew = checkOptionalUnivNaturalNumber ("brew")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
        ({
          ename,
          ecost,
          etiers,
          emax,
          eselect,
          ecombatTechniques,
          ecombatTechniquesGroup,
          egr,
          esubgr,
          eextended,
          eproperty,
          easpect,
          eprerequisites,
          eprerequisitesIndex,
          ebrew,
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
          subgr: rs.esubgr,
          extended: fmap (map (prefixId (IdPrefixes.SPECIAL_ABILITIES))) (rs.eextended),
          rules: fmap (modifyNegIntNoBreak) (rules),
          effect: fmap (modifyNegIntNoBreak) (effect),
          penalty: fmap (modifyNegIntNoBreak) (penalty),
          combatTechniques:
            fmapF (rs.ecombatTechniquesGroup)
                  (group => SpecialAbilityCombatTechniques ({
                              group,
                              explicitIds: map (prefixCT) (joinMaybeList (rs.ecombatTechniques)),
                              customText: combatTechniques,
                            })),
          aeCost: fmap (modifyNegIntNoBreak) (aeCost),
          protectiveCircle: fmap (modifyNegIntNoBreak) (protectiveCircle),
          wardingCircle: fmap (modifyNegIntNoBreak) (wardingCircle),
          volume: fmap (modifyNegIntNoBreak) (volume),
          bindingCost: fmap (modifyNegIntNoBreak) (bindingCost),
          property: alt<string | number> (rs.eproperty) (property),
          aspect: rs.easpect,
          apValue: fmap (modifyNegIntNoBreak) (apValue),
          apValueAppend: fmap (modifyNegIntNoBreak) (apValueAppend),
          prerequisites: rs.eprerequisites,
          prerequisitesText: fmap (modifyNegIntNoBreak) (prerequisites),
          prerequisitesTextIndex: OrderedMap.map ((x: string | false) =>
                                                   x === false ? false : modifyNegIntNoBreak (x))
                                                 (rs.eprerequisitesIndex),
          prerequisitesTextStart: fmap (modifyNegIntNoBreak) (prerequisitesStart),
          prerequisitesTextEnd: fmap (modifyNegIntNoBreak) (prerequisitesEnd),
          brew: rs.ebrew,

          src: rs.esrc,

          category: Nothing,
        }))
    })
