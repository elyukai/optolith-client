/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { MagicalMelodyL10n } from "../../../../../app/Database/Schema/MagicalMelodies/MagicalMelodies.l10n"
import { MagicalMelodyUniv } from "../../../../../app/Database/Schema/MagicalMelodies/MagicalMelodies.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { fromMap, insert, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { SkillId } from "../../../Constants/Ids"
import { NumIdName } from "../../../Models/NumIdName"
import { MagicalMelody as MM } from "../../../Models/Wiki/MagicalMelody"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toMagicalMelody : YamlPairConverterE<MagicalMelodyUniv, MagicalMelodyL10n, string, MM>
                      = ([ univ, l10n ]) => Right<[string, Record<MM>]> ([
                          univ.id,
                          MM ({
                            id: univ .id,
                            name: l10n.name,
                            nameByTradition:
                              l10n.nameByTradition.reduce<OrderedMap<number, Record<NumIdName>>> (
                                (mp, { id, name }) => insert (id) (NumIdName ({ id, name })) (mp),
                                OrderedMap.empty
                              ),
                            check: Tuple (univ.check1, univ.check2, univ.check3),
                            skill: univ.skill === undefined
                                   ? List (SkillId.Singing, SkillId.Music)
                                   : List (univ.skill),
                            ic: univ .ic,
                            property: univ.property,
                            musictraditions: fromArray (univ.musictraditions),
                            effect: toMarkdown (l10n.effect),
                            cost: l10n.aeCost,
                            costShort: l10n.aeCostShort,
                            duration: l10n.duration,
                            durationShort: l10n.durationShort,
                            src: toSourceRefs (l10n.src),
                            errata: toErrata (l10n.errata),
                          }),
                        ])


export const toMagicalMelodies : YamlFileConverter<string, Record<MM>>
                               = pipe (
                                   (yaml_mp : YamlNameMap) =>
                                     zipBy ("id")
                                           (yaml_mp.MagicalMelodiesUniv)
                                           (yaml_mp.MagicalMelodiesL10nDefault)
                                           (yaml_mp.MagicalMelodiesL10nOverride),
                                   bindF (pipe (
                                     mapM (toMagicalMelody),
                                     bindF (toMapIntegrity),
                                   )),
                                   second (fromMap)
                                 )
