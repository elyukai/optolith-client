/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { LiturgicalChantL10n } from "../../../../../app/Database/Schema/LiturgicalChants/LiturgicalChants.l10n"
import { LiturgicalChantUniv } from "../../../../../app/Database/Schema/LiturgicalChants/LiturgicalChants.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { icToJs } from "../../../Constants/Groups"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toLC : YamlPairConverterE<LiturgicalChantUniv, LiturgicalChantL10n, string, LiturgicalChant>
           = ([ univ, l10n ]) => Right<[string, Record<LiturgicalChant>]> ([
               univ.id,
               LiturgicalChant ({
                 id: univ .id,
                 name: l10n.name,
                 nameShort: Maybe (l10n.nameShort),
                 check: List (univ.check1, univ.check2, univ.check3),
                 checkmod: Maybe (univ.checkMod),
                 gr: univ .gr,
                 ic: icToJs (univ .ic),
                 aspects: fromArray (univ.aspects ?? []),
                 tradition: fromArray (univ.traditions),
                 effect: toMarkdown (l10n.effect),
                 castingTime: l10n.castingTime,
                 castingTimeShort: l10n.castingTimeShort,
                 castingTimeNoMod: univ.castingTimeNoMod,
                 cost: l10n.kpCost,
                 costShort: l10n.kpCostShort,
                 costNoMod: univ.kpCostNoMod,
                 range: l10n.range,
                 rangeShort: l10n.rangeShort,
                 rangeNoMod: univ.rangeNoMod,
                 duration: l10n.duration,
                 durationShort: l10n.durationShort,
                 durationNoMod: univ.durationNoMod,
                 target: l10n.target,
                 src: toSourceRefs (l10n.src),
                 errata: toErrata (l10n.errata),
                 category: Nothing,
               }),
             ])


export const toLiturgicalChants : YamlFileConverter<string, Record<LiturgicalChant>>
                                = pipe (
                                    (yaml_mp : YamlNameMap) =>
                                      zipBy ("id")
                                            (yaml_mp.LiturgicalChantsUniv)
                                            (yaml_mp.LiturgicalChantsL10nDefault)
                                            (yaml_mp.LiturgicalChantsL10nOverride),
                                    bindF (pipe (
                                      mapM (toLC),
                                      bindF (toMapIntegrity),
                                    )),
                                    second (fromMap)
                                  )
