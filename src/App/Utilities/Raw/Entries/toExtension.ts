import { fmap } from "../../../../Data/Functor";
import { notNull } from "../../../../Data/List";
import { Just, Nothing } from "../../../../Data/Maybe";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { prefixId } from "../../IDUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNatural, mensureMapNaturalInRange, mensureMapNonEmptyString } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { toSpellPrerequisites } from "./Sub/toPrerequisites";
import { toSourceLinks } from "./Sub/toSourceLinks";

export const toExtension =
  (prefix: IdPrefixes) =>
    mergeRowsById
      ("toExtension")
      (id => lookup_l10n => lookup_univ => {
        // Shortcuts

        const checkL10nNonEmptyString =
          lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

        const checkUnivNaturalNumber =
          lookupKeyValid (mensureMapNatural) (TableType.Univ) (lookup_univ)

        // Check and convert fields

        const ename = checkL10nNonEmptyString ("name")

        const eeffect = checkL10nNonEmptyString ("effect")

        const etarget = fmap (prefixId (prefix)) (checkUnivNaturalNumber ("target"))

        const elevel =
          lookupKeyValid (mensureMapNaturalInRange (1) (3))
                         (TableType.Univ)
                         (lookup_univ)
                         ("level")

        const eprerequisites = toSpellPrerequisites (lookup_univ)

        const ecost = checkUnivNaturalNumber ("cost")

        const esrc = toSourceLinks (lookup_l10n)

        // Return error or result

        return mapMNamed
          ({
            ename,
            eeffect,
            etarget,
            elevel,
            eprerequisites,
            ecost,
            esrc,
          })
          (rs => SelectOption ({
            id,
            name: rs.ename,
            description: Just (rs.eeffect),
            target: Just (rs.etarget),
            level: Just (rs.elevel),
            prerequisites: notNull (rs.eprerequisites) ? Just (rs.eprerequisites) : Nothing,
            cost: Just (rs.ecost),
            src: rs.esrc,
          }))
      })
