import { notNull, notNullStr } from "../../../../Data/List";
import { Just, Nothing } from "../../../../Data/Maybe";
import { Pair } from "../../../../Data/Pair";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { prefixId } from "../../IDUtils";
import { mergeRowsByIdAndMainId } from "../mergeTableRows";
import { mensureMapBoolean, mensureMapNaturalInRangeOptional, mensureMapNaturalListOptional, mensureMapNaturalOptional, mensureMapNonEmptyString, mensureMapStringPredListOptional } from "../validateMapValueUtils";
import { Expect, lookupKeyValid, mapMNamed } from "../validateValueUtils";
import { toSpellPrerequisites } from "./Sub/toPrerequisites";
import { toSourceLinks } from "./Sub/toSourceLinks";

export const toActivatableSelectOption =
  (prefix: IdPrefixes) =>
    mergeRowsByIdAndMainId
      ("toActivatableSelectOption")
      (mainId => id => lookup_l10n => lookup_univ => {
        // Shortcuts

        const checkL10nNonEmptyString =
          lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

        const checkL10nNonEmptyStringList =
          lookupKeyValid (mensureMapStringPredListOptional (notNullStr)
                                                           (Expect.NonEmptyString)
                                                           ("&"))
                         (lookup_l10n)

        const checkUnivNaturalNumberListOptional =
          lookupKeyValid (mensureMapNaturalListOptional ("&")) (lookup_univ)

        const checkOptionalUnivNaturalNumber =
          lookupKeyValid (mensureMapNaturalOptional) (lookup_univ)

        const checkUnivBoolean =
          lookupKeyValid (mensureMapBoolean) (lookup_univ)

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
              description,
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
