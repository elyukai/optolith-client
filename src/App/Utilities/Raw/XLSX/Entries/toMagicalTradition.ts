import { AttrId } from "../../../../Constants/Ids"
import { MagicalTradition } from "../../../../Models/Wiki/MagicalTradition"
import { fromRow } from "../MergeRows"
import { lookupKeyValid, mapMNamed, TableType } from "../Validators/Generic"
import { mensureMapFloatOptional, mensureMapNaturalOptional, mensureMapStrEnumOption, mensureMapStringRegexp } from "../Validators/ToValue"

export const toMagicalTradition =
  fromRow
    ("toMagicalTradition")
    (() => lookup_univ => {
      // Shortcuts

      const checkUnivId =
        lookupKeyValid (mensureMapStringRegexp (/[A-Z]+_[1-9]\d*/u) ("ID"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkUnivNaturalNumberOptional =
        lookupKeyValid (mensureMapNaturalOptional) (TableType.Univ) (lookup_univ)

      const checkUnivFloatOptional =
        lookupKeyValid (mensureMapFloatOptional) (TableType.Univ) (lookup_univ)

      const checkUnivAttrIdOptional =
        lookupKeyValid (mensureMapStrEnumOption ("AttrId")
                                                (AttrId))
                       (TableType.Univ)
                       (lookup_univ)

      // Check and convert fields

      const eid = checkUnivId ("id")

      const enumId = checkUnivNaturalNumberOptional ("numId")

      const eprimary = checkUnivAttrIdOptional ("primary")

      const eaeMod = checkUnivFloatOptional ("aeMod")

      // Return error or result

      return mapMNamed
        ({
          eid,
          enumId,
          eprimary,
          eaeMod,
        })
        (rs => MagicalTradition ({
          id: rs.eid,
          numId: rs.enumId,
          primary: rs.eprimary,
          aeMod: rs.eaeMod,
        }))
    })
