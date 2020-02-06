/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, second } from "../../../../Data/Either"
import { fromArray } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { icToInt } from "../ICToInt"
import { CombatTechniqueL10n } from "../Schema/CombatTechniques/CombatTechniques.l10n"
import { CombatTechniqueUniv } from "../Schema/CombatTechniques/CombatTechniques.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverter } from "../ToRecordsByFile"
import { zipById } from "../ZipById"
import { toErrata } from "./toErrata"
import { toSourceRefs } from "./toSourceRefs"


const toCT : YamlPairConverter<CombatTechniqueUniv, CombatTechniqueL10n, string, CombatTechnique>
           = x => [
                    x [0] .id,
                    CombatTechnique ({
                      id: x [0] .id,
                      name: x [1] .name,
                      gr: x [0] .gr,
                      ic: icToInt (x [0] .ic),
                      bpr: x [0] .bpr,
                      primary: fromArray (x [0] .primary),
                      special: Maybe (x [1] .special),
                      hasNoParry: x [0] .hasNoParry ?? false,
                      src: toSourceRefs (x [1] .src),
                      errata: toErrata (x [1] .errata),
                      category: Nothing,
                    }),
                  ]


export const toCombatTechniques : YamlFileConverter<string, Record<CombatTechnique>>
                                = pipe (
                                    (yaml_mp : YamlNameMap) =>
                                      zipById (yaml_mp.CombatTechniquesUniv)
                                              (yaml_mp.CombatTechniquesL10n),
                                    bindF (pipe (
                                      map (toCT),
                                      toMapIntegrity,
                                    )),
                                    second (fromMap)
                                  )
