/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Book } from "../../../Models/Wiki/Book"
import { isPrerelease } from "../../../Selectors/envSelectors"
import { pipe } from "../../pipe"
import { mapMaybe } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


export const toBooks : YamlFileConverter<string, Record<Book>>
                     = pipe (
                       yaml_mp => mergeBy ("id")
                                          (yaml_mp.BooksL10nDefault)
                                          (yaml_mp.BooksL10nOverride),
                       mapMaybe ((x) : [string, Record<Book>] | undefined =>
                         isPrerelease || x.isMissingImplementation !== true
                         ? [ x .id, Book (x) ]
                         : undefined),
                       toMapIntegrity,
                       second (fromMap)
                     )
