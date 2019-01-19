import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { map } from "../../../../Data/List";
import { fmap, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { validateMapOptionalNaturalNumberProp, validateMapOptionalStringListProp, validateMapRequiredNaturalNumberProp, validateMapRequiredNonEmptyStringProp } from "../validateMapValueUtils";
import { allRights, lookupKeyValid } from "../validateValueUtils";
import { toActivatableCost } from "./Sub/toActivatableCost";
import { toPrerequisites } from "./Sub/toPrerequisites";
import { toPrerequisitesIndex } from "./Sub/toPrerequisitesIndex";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

const category = /[A-Z_]+/

const checkCategory =
  (x: string) => category .test (x)

export const toAdvantage =
  mergeRowsById
    ("toAdvantage")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (validateMapRequiredNonEmptyStringProp)

      const checkOptionalCategoryList =
        lookupKeyValid (lookup_univ) (validateMapOptionalStringListProp (checkCategory) ("&"))

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateMapRequiredNaturalNumberProp)

      const checkOptionalUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (validateMapOptionalNaturalNumberProp)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const ecost = toActivatableCost (lookup_univ)

      const etiers = checkOptionalUnivNaturalNumber ("tiers")

      const emax = checkOptionalUnivNaturalNumber ("max")

      const eselect = checkOptionalCategoryList ("select")

      const input = lookup_l10n ("input")

      const erules = checkL10nNonEmptyString ("rules")

      const range = lookup_l10n ("range")

      const actions = lookup_l10n ("actions")

      const apValue = lookup_l10n ("apValue")

      const apValueAppend = lookup_l10n ("apValueAppend")

      const eprerequisites = toPrerequisites (lookup_univ)

      const prerequisites = lookup_l10n ("prerequisites")

      const eprerequisitesIndex = toPrerequisitesIndex (lookup_l10n) (lookup_univ)

      const prerequisitesStart = lookup_l10n ("prerequisitesStart")

      const prerequisitesEnd = lookup_l10n ("prerequisitesEnd")

      const egr = checkUnivNaturalNumber ("gr")

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
        ({
          ename,
          ecost,
          etiers,
          emax,
          eselect,
          erules,
          eprerequisites,
          eprerequisitesIndex,
          egr,
          esrc,
        })
        (rs => Advantage ({
          id: prefixId (IdPrefixes.PROFESSIONS) (id),
          name: rs.ename,
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
                                                      tier: Nothing,
                                                      specializations: Nothing,
                                                      specializationsInput: Nothing,
                                                      applications: Nothing,
                                                      applicationsInput: Nothing,
                                                      gr: Nothing,
                                                    })))
                                                    (rs.eselect),

          input,
          rules: rs.erules,
          range,
          actions,
          apValue,
          apValueAppend,
          prerequisites: rs.eprerequisites,
          prerequisitesText: prerequisites,
          prerequisitesTextIndex: rs.eprerequisitesIndex,
          prerequisitesTextStart: prerequisitesStart,
          prerequisitesTextEnd: prerequisitesEnd,

          gr: rs.egr,

          src: toSourceLinks (rs.esrc),

          category: Nothing,
        }))
    })
