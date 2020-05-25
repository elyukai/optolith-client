/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { Attribute } from "../../../Models/Wiki/Attribute"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


export const toAttributes : YamlFileConverter<string, Record<Attribute>>
                          = pipe (
                            yaml_mp => mergeBy ("id")
                                               (yaml_mp.AttributesL10nDefault)
                                               (yaml_mp.AttributesL10nOverride),
                            map ((x) : [string, Record<Attribute>] => [
                              x .id,
                              Attribute ({
                                ...x,
                                category: Category.ATTRIBUTES,
                              }),
                            ]),
                            toMapIntegrity,
                            second (fromMap)
                          )
