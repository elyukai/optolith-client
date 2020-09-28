/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { CombatTechniqueL10n } from "../../../../../app/Database/Schema/CombatTechniques/CombatTechniques.l10n"
import { CombatTechniqueUniv } from "../../../../../app/Database/Schema/CombatTechniques/CombatTechniques.univ"
import { bindF, second } from "../../../../Data/Either"
import { fromArray } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { icToJs } from "../../../Constants/Groups"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverter } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toSourceRefs } from "./ToSourceRefs"


const toCT : YamlPairConverter<CombatTechniqueUniv, CombatTechniqueL10n, string, CombatTechnique>
           = ([ univ, l10n ]) => [
               univ.id,
               CombatTechnique ({
                 id: univ.id,
                 name: l10n.name,
                 gr: univ.gr,
                 ic: icToJs (univ.ic),
                 bpr: univ.bpr,
                 primary: fromArray (univ.primary),
                 special: Maybe (l10n.special),
                 hasNoParry: univ.hasNoParry ?? false,
                 src: toSourceRefs (l10n.src),
                 errata: toErrata (l10n.errata),
                 category: Nothing,
               }),
             ]


export const toCombatTechniques : YamlFileConverter<string, Record<CombatTechnique>>
                                = pipe (
                                    (yaml_mp : YamlNameMap) =>
                                      zipBy ("id")
                                            (yaml_mp.CombatTechniquesUniv)
                                            (yaml_mp.CombatTechniquesL10nDefault)
                                            (yaml_mp.CombatTechniquesL10nOverride),
                                    bindF (pipe (
                                      map (toCT),
                                      toMapIntegrity,
                                    )),
                                    second (fromMap)
                                  )
