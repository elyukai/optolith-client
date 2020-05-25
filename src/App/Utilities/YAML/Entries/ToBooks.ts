/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Book } from "../../../Models/Wiki/Book"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


export const toBooks : YamlFileConverter<string, Record<Book>>
                     = pipe (
                       yaml_mp => mergeBy ("id")
                                          (yaml_mp.BooksL10nDefault)
                                          (yaml_mp.BooksL10nOverride),
                       map ((x) : [string, Record<Book>] => [ x .id, Book (x) ]),
                       toMapIntegrity,
                       second (fromMap)
                     )
