/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SubjectL10n } from "../../../../../app/Database/Schema/Subjects/Subjects.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toSubject : (x : SubjectL10n) => [number, Record<NumIdName>]
                = x => [ x.id, NumIdName (x) ]


export const toSubjects : YamlFileConverter<number, Record<NumIdName>>
                        = pipe (
                            yaml_mp => mergeBy ("id")
                                               (yaml_mp.SubjectsL10nDefault)
                                               (yaml_mp.SubjectsL10nOverride),
                            map (toSubject),
                            toMapIntegrity,
                            second (fromMap)
                          )
