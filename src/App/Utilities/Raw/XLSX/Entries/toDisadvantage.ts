import { fmap } from "../../../../../Data/Functor"
import { concatMap } from "../../../../../Data/List"
import { Nothing } from "../../../../../Data/Maybe"
import { OrderedMap } from "../../../../../Data/OrderedMap"
import { IdPrefixes } from "../../../../Constants/IdPrefixes"
import { Disadvantage } from "../../../../Models/Wiki/Disadvantage"
import { prefixId } from "../../../IDUtils"
import { mergeRowsById } from "../MergeRows"
import { modifyNegIntNoBreak } from "../SourceHelpers"
import { lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic"
import { mensureMapNatural, mensureMapNaturalOptional, mensureMapNonEmptyString } from "../Validators/ToValue"
import { toActivatableCost } from "./Sub/toActivatableCost"
import { toErrata } from "./Sub/toErrata"
import { categoryToSelectOptions, toOptionalCategoryList } from "./Sub/toOptionalCategoryList"
import { toPrerequisites } from "./Sub/toPrerequisites"
import { toPrerequisitesIndex } from "./Sub/toPrerequisitesIndex"
import { toSourceLinks } from "./Sub/toSourceLinks"

export const toDisadvantage =
  mergeRowsById
    ("toDisadvantage")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural) (TableType.Univ) (lookup_univ)

      const checkOptionalUnivNaturalNumber =
        lookupKeyValid (mensureMapNaturalOptional) (TableType.Univ) (lookup_univ)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const ecost = toActivatableCost (lookup_univ)

      const etiers = checkOptionalUnivNaturalNumber ("tiers")

      const emax = checkOptionalUnivNaturalNumber ("max")

      const eselect = toOptionalCategoryList (lookup_univ) ("select")

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
        (rs => Disadvantage ({
          id: prefixId (IdPrefixes.DISADVANTAGES) (id),
          name: rs.ename,
          cost: rs.ecost,
          tiers: rs.etiers,
          max: rs.emax,
          select: fmap (concatMap (categoryToSelectOptions)) (rs.eselect),
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
