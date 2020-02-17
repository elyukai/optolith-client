/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { SubjectL10n } from "../Schema/Subjects/Subjects.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"


const toSubject : (x : SubjectL10n) => [number, Record<NumIdName>]
                = x => [ x.id, NumIdName (x) ]


export const toSubjects : YamlFileConverter<number, Record<NumIdName>>
                        = pipe (
                            yaml_mp => yaml_mp.SubjectsL10n,
                            map (toSubject),
                            toMapIntegrity,
                            second (fromMap)
                          )
