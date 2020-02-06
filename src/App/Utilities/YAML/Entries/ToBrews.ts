/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { BrewL10n } from "../Schema/Brews/Brews.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"


const toBrew : (x : BrewL10n) => [number, Record<NumIdName>]
             = x => [
                 x.id,
                 NumIdName ({
                   id: x.id,
                   name: x.name,
                 }),
               ]


export const toBrews : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp => yaml_mp.BrewsL10n,
                                        map (toBrew),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
