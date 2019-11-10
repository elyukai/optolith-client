import { fmap } from "../../../../../Data/Functor";
import { map } from "../../../../../Data/List";
import { Nothing } from "../../../../../Data/Maybe";
import { OrderedMap } from "../../../../../Data/OrderedMap";
import { Record } from "../../../../../Data/Record";
import { IdPrefixes } from "../../../../Constants/IdPrefixes";
import { Advantage } from "../../../../Models/Wiki/Advantage";
import { SelectOption } from "../../../../Models/Wiki/sub/SelectOption";
import { prefixId } from "../../../IDUtils";
import { mergeRowsById } from "../MergeRows";
import { modifyNegIntNoBreak } from "../SourceHelpers";
import { lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic";
import { mensureMapNatural, mensureMapNaturalOptional, mensureMapNonEmptyString, mensureMapStringPredListOptional } from "../Validators/ToValue";
import { toActivatableCost } from "./Sub/toActivatableCost";
import { toErrata } from "./Sub/toErrata";
import { toPrerequisites } from "./Sub/toPrerequisites";
import { toPrerequisitesIndex } from "./Sub/toPrerequisitesIndex";
import { toSourceLinks } from "./Sub/toSourceLinks";

const category = /[A-Z_]+/u

const checkCategory =
  (x: string) => category .test (x)

export const toAdvantage =
  mergeRowsById
    ("toAdvantage")
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

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural) (TableType.Univ) (lookup_univ)

      const checkOptionalUnivNaturalNumber =
        lookupKeyValid (mensureMapNaturalOptional) (TableType.Univ) (lookup_univ)

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

      const esrc = toSourceLinks (lookup_l10n)

      const eerrata = toErrata (lookup_l10n)

      // Return error or result

      return mapMNamed
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
          eerrata,
        })
        (rs => Advantage ({
          id: prefixId (IdPrefixes.ADVANTAGES) (id),
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
                                                      level: Nothing,
                                                      specializations: Nothing,
                                                      specializationInput: Nothing,
                                                      applications: Nothing,
                                                      applicationInput: Nothing,
                                                      gr: Nothing,
                                                      src: Nothing,
                                                      errata: Nothing,
                                                    })))
                                                    (rs.eselect),

          input,
          rules: modifyNegIntNoBreak (rs.erules),
          range: fmap (modifyNegIntNoBreak) (range),
          actions: fmap (modifyNegIntNoBreak) (actions),
          apValue: fmap (modifyNegIntNoBreak) (apValue),
          apValueAppend: fmap (modifyNegIntNoBreak) (apValueAppend),
          prerequisites: rs.eprerequisites,
          prerequisitesText: fmap (modifyNegIntNoBreak) (prerequisites),
          prerequisitesTextIndex: OrderedMap.map ((x: string | false) =>
                                                   x === false ? false : modifyNegIntNoBreak (x))
                                                 (rs.eprerequisitesIndex),
          prerequisitesTextStart: fmap (modifyNegIntNoBreak) (prerequisitesStart),
          prerequisitesTextEnd: fmap (modifyNegIntNoBreak) (prerequisitesEnd),

          gr: rs.egr,

          src: rs.esrc,
          errata: rs.eerrata,

          category: Nothing,
        }))
    })
