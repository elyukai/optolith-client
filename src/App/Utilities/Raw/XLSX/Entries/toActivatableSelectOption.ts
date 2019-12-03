import { fmap } from "../../../../../Data/Functor";
import { notNull, notNullStr } from "../../../../../Data/List";
import { fromMaybe, joinMaybeList, Just, Nothing } from "../../../../../Data/Maybe";
import { Pair } from "../../../../../Data/Tuple";
import { IdPrefixes } from "../../../../Constants/IdPrefixes";
import { SelectOption } from "../../../../Models/Wiki/sub/SelectOption";
import { prefixId } from "../../../IDUtils";
import { Expect } from "../../Expect";
import { mergeRowsByIdAndMainIdBothOpt } from "../MergeRows";
import { modifyNegIntNoBreak } from "../SourceHelpers";
import { lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic";
import { mensureMapBoolean, mensureMapNaturalInRangeOptional, mensureMapNaturalListOptional, mensureMapNaturalOptional, mensureMapStringPredListOptional } from "../Validators/ToValue";
import { toErrata } from "./Sub/toErrata";
import { toSpellPrerequisites } from "./Sub/toPrerequisites";
import { toSourceLinksOpt } from "./Sub/toSourceLinks";

export const toActivatableSelectOption =
  (prefix: IdPrefixes) =>
    mergeRowsByIdAndMainIdBothOpt
      ("toActivatableSelectOption")
      (mainId => id => lookup_row => {
        // Shortcuts

        const checkL10nNonEmptyStringList =
          lookupKeyValid (mensureMapStringPredListOptional (notNullStr)
                                                           (Expect.NonEmptyString)
                                                           ("&"))
                         (TableType.L10n)
                         (lookup_row)

        const checkUnivNaturalNumberListOptional =
          lookupKeyValid (mensureMapNaturalListOptional ("&")) (TableType.Univ) (lookup_row)

        const checkOptionalUnivNaturalNumber =
          lookupKeyValid (mensureMapNaturalOptional) (TableType.Univ) (lookup_row)

        const checkUnivBoolean =
          lookupKeyValid (mensureMapBoolean) (TableType.Univ) (lookup_row)

        // Check and convert fields

        const name = lookup_row ("name")

        const ecost = checkOptionalUnivNaturalNumber ("cost")

        const eprerequisites = toSpellPrerequisites (lookup_row)

        const description = lookup_row ("description")

        const esrc = toSourceLinksOpt (lookup_row)

        const eerrata = toErrata (lookup_row)

        const eisSecret = checkUnivBoolean ("isSecret")

        const elanguages = checkUnivNaturalNumberListOptional ("languages")

        const econtinent =
          lookupKeyValid (mensureMapNaturalInRangeOptional (1) (3))
                         (TableType.Univ)
                         (lookup_row)
                         ("continent")

        const eisExtinct = checkUnivBoolean ("isExtinct")

        const especializations = checkL10nNonEmptyStringList ("specializations")

        const specializationInput = lookup_row ("specializationInput")

        const egr = checkOptionalUnivNaturalNumber ("gr")

        const elevel = checkOptionalUnivNaturalNumber ("level")

        // Return error or result

        return mapMNamed
          ({
            ecost,
            eprerequisites,
            esrc,
            eerrata,
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
              name: fromMaybe ("") (name),
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
              src: joinMaybeList (rs.esrc),
              errata: rs.eerrata,
            })
          ))
      })
