/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { RogueSpellL10n } from "../../../../../app/Database/Schema/RogueSpells/RogueSpells.l10n"
import { RogueSpellUniv } from "../../../../../app/Database/Schema/RogueSpells/RogueSpells.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { RogueSpell } from "../../../Models/Wiki/RogueSpell"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toRogueSpell : YamlPairConverterE<RogueSpellUniv, RogueSpellL10n, string, RogueSpell>
                   = ([ univ, l10n ]) => Right<[string, Record<RogueSpell>]> ([
                       univ.id,
                       RogueSpell ({
                         id: univ .id,
                         name: l10n.name,
                         check: Tuple (univ.check1, univ.check2, univ.check3),
                         checkmod: Maybe (univ.checkMod),
                         ic: univ .ic,
                         property: univ.property,
                         effect: toMarkdown (l10n.effect),
                         castingTime: l10n.castingTime,
                         castingTimeShort: l10n.castingTimeShort,
                         cost: l10n.aeCost,
                         costShort: l10n.aeCostShort,
                         range: l10n.range,
                         rangeShort: l10n.rangeShort,
                         duration: l10n.duration,
                         durationShort: l10n.durationShort,
                         target: l10n.target,
                         src: toSourceRefs (l10n.src),
                         errata: toErrata (l10n.errata),
                       }),
                     ])


export const toRogueSpells : YamlFileConverter<string, Record<RogueSpell>>
                           = pipe (
                               (yaml_mp : YamlNameMap) => zipBy ("id")
                                                                (yaml_mp.RogueSpellsUniv)
                                                                (yaml_mp.RogueSpellsL10nDefault)
                                                                (yaml_mp.RogueSpellsL10nOverride),
                               bindF (pipe (
                                 mapM (toRogueSpell),
                                 bindF (toMapIntegrity),
                               )),
                               second (fromMap)
                             )
