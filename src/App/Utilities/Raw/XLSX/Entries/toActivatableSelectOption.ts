import { fmap } from "../../../../../Data/Functor";
import { notNull, notNullStr } from "../../../../../Data/List";
import { Just, Nothing } from "../../../../../Data/Maybe";
import { Pair } from "../../../../../Data/Tuple";
import { IdPrefixes } from "../../../../Constants/IdPrefixes";
import { SelectOption } from "../../../../Models/Wiki/sub/SelectOption";
import { prefixId } from "../../../IDUtils";
import { Expect } from "../../Expect";
import { mergeRowsByIdAndMainIdUnivOpt } from "../MergeRows";
import { modifyNegIntNoBreak } from "../SourceHelpers";
import { lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic";
import { mensureMapBoolean, mensureMapNaturalInRangeOptional, mensureMapNaturalListOptional, mensureMapNaturalOptional, mensureMapNonEmptyString, mensureMapStringPredListOptional } from "../Validators/ToValue";
import { toSpellPrerequisites } from "./Sub/toPrerequisites";
import { toSourceLinks } from "./Sub/toSourceLinks";

export const toActivatableSelectOption =
  (prefix: IdPrefixes) =>
    mergeRowsByIdAndMainIdUnivOpt
      ("toActivatableSelectOption")
      (mainId => id => lookup_l10n => lookup_univ => {
        // Shortcuts

        const checkL10nNonEmptyString =
          lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

        const checkL10nNonEmptyStringList =
          lookupKeyValid (mensureMapStringPredListOptional (notNullStr)
                                                           (Expect.NonEmptyString)
                                                           ("&"))
                         (TableType.L10n)
                         (lookup_l10n)

        const checkUnivNaturalNumberListOptional =
          lookupKeyValid (mensureMapNaturalListOptional ("&")) (TableType.Univ) (lookup_univ)

        const checkOptionalUnivNaturalNumber =
          lookupKeyValid (mensureMapNaturalOptional) (TableType.Univ) (lookup_univ)

        const checkUnivBoolean =
          lookupKeyValid (mensureMapBoolean) (TableType.Univ) (lookup_univ)

        // Check and convert fields

        const ename = checkL10nNonEmptyString ("name")

        const ecost = checkOptionalUnivNaturalNumber ("cost")

        const eprerequisites = toSpellPrerequisites (lookup_univ)

        const description = lookup_l10n ("description")

        const esrc = toSourceLinks (lookup_l10n)

        const eisSecret = checkUnivBoolean ("isSecret")

        const elanguages = checkUnivNaturalNumberListOptional ("languages")

        const econtinent =
          lookupKeyValid (mensureMapNaturalInRangeOptional (1) (3))
                         (TableType.Univ)
                         (lookup_univ)
                         ("continent")

        const eisExtinct = checkUnivBoolean ("isExtinct")

        const especializations = checkL10nNonEmptyStringList ("specializations")

        const specializationInput = lookup_l10n ("specializationInput")

        const egr = checkOptionalUnivNaturalNumber ("gr")

        const elevel = checkOptionalUnivNaturalNumber ("level")

        // Return error or result

        return mapMNamed
          ({
            ename,
            ecost,
            eprerequisites,
            esrc,
            eisSecret,
            elanguages,
            econtinent,
            eisExtinct,
            especializations,
            egr,
            elevel,
          })
          (rs => Pair (
            prefixId (prefix) (mainId),
            SelectOption ({
              id,
              name: rs.ename,
              cost: rs.ecost,
              prerequisites: notNull (rs.eprerequisites) ? Just (rs.eprerequisites) : Nothing,
              description: fmap (modifyNegIntNoBreak) (description),
              isSecret: Just (rs.eisSecret),
              languages: rs.elanguages,
              continent: rs.econtinent,
              isExtinct: Just (rs.eisExtinct),
              specializations: rs.especializations,
              specializationInput,
              gr: rs.egr,
              level: rs.elevel,
              src: rs.esrc,
            })
          ))
      })
