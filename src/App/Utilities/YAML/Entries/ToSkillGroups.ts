/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SkillGroupL10n } from "../../../../../app/Database/Schema/SkillGroups/SkillGroups.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { SkillGroup } from "../../../Models/Wiki/SkillGroup"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toSkillGroup : (x : SkillGroupL10n) => [number, Record<SkillGroup>]
                   = x => [ x.id, SkillGroup (x) ]


export const toSkillGroups : YamlFileConverter<number, Record<SkillGroup>>
                           = pipe (
                               yaml_mp => mergeBy ("id")
                                                  (yaml_mp.SkillGroupsL10nDefault)
                                                  (yaml_mp.SkillGroupsL10nOverride),
                               map (toSkillGroup),
                               toMapIntegrity,
                               second (fromMap)
                             )
