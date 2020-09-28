/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ElvenMagicalSongL10n } from "../../../../../app/Database/Schema/ElvenMagicalSongs/ElvenMagicalSongs.l10n"
import { ElvenMagicalSongUniv } from "../../../../../app/Database/Schema/ElvenMagicalSongs/ElvenMagicalSongs.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { List } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { SkillId } from "../../../Constants/Ids"
import { ElvenMagicalSong as EMS } from "../../../Models/Wiki/ElvenMagicalSong"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toEMS : YamlPairConverterE<ElvenMagicalSongUniv, ElvenMagicalSongL10n, string, EMS>
            = ([ univ, l10n ]) => Right<[string, Record<EMS>]> ([
                univ.id,
                EMS ({
                  id: univ .id,
                  name: l10n.name,
                  check: Tuple (univ.check1, univ.check2, univ.check3),
                  checkmod: Maybe (univ.checkMod),
                  skill: univ.skill === undefined
                         ? List (SkillId.Singing, SkillId.Music)
                         : List (univ.skill),
                  ic: univ .ic,
                  property: univ.property,
                  effect: toMarkdown (l10n.effect),
                  cost: l10n.aeCost,
                  costShort: l10n.aeCostShort,
                  src: toSourceRefs (l10n.src),
                  errata: toErrata (l10n.errata),
                }),
              ])


export const toElvenMagicalSongs : YamlFileConverter<string, Record<EMS>>
                                 = pipe (
                                     (yaml_mp : YamlNameMap) =>
                                       zipBy ("id")
                                             (yaml_mp.ElvenMagicalSongsUniv)
                                             (yaml_mp.ElvenMagicalSongsL10nDefault)
                                             (yaml_mp.ElvenMagicalSongsL10nOverride),
                                     bindF (pipe (
                                       mapM (toEMS),
                                       bindF (toMapIntegrity),
                                     )),
                                     second (fromMap)
                                   )
