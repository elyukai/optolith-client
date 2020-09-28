/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SpellGroupL10n } from "../../../../../app/Database/Schema/SpellGroups/SpellGroups.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toSpellGroup : (x : SpellGroupL10n) => [number, Record<NumIdName>]
                   = x => [ x.id, NumIdName (x) ]


export const toSpellGroups : YamlFileConverter<number, Record<NumIdName>>
                           = pipe (
                               yaml_mp => mergeBy ("id")
                                                  (yaml_mp.SpellGroupsL10nDefault)
                                                  (yaml_mp.SpellGroupsL10nOverride),
                               map (toSpellGroup),
                               toMapIntegrity,
                               second (fromMap)
                             )
