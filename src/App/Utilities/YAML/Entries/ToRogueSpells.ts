/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Right, second } from "../../../../Data/Either"
import { List } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { MagicalGroup, MagicalTradition } from "../../../Constants/Groups"
import { Spell } from "../../../Models/Wiki/Spell"
import { icToInt } from "../../AdventurePoints/improvementCostUtils"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { RogueSpellL10n } from "../Schema/RogueSpells/RogueSpells.l10n"
import { RogueSpellUniv } from "../Schema/RogueSpells/RogueSpells.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./toErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./toSourceRefs"


const toRogueSpell : YamlPairConverterE<RogueSpellUniv, RogueSpellL10n, string, Spell>
                   = ([ univ, l10n ]) => Right<[string, Record<Spell>]> ([
                       univ.id,
                       Spell ({
                         id: univ .id,
                         name: l10n.name,
                         check: List (univ.check1, univ.check2, univ.check3),
                         checkmod: Maybe (univ.checkMod),
                         gr: MagicalGroup.RogueSpells,
                         ic: icToInt (univ .ic),
                         property: univ.property,
                         tradition: List (MagicalTradition.Rogues),
                         subtradition: List (),
                         prerequisites: List (),
                         effect: toMarkdown (l10n.effect),
                         castingTime: l10n.castingTime,
                         castingTimeShort: l10n.castingTimeShort,
                         castingTimeNoMod: false,
                         cost: l10n.aeCost,
                         costShort: l10n.aeCostShort,
                         costNoMod: false,
                         range: l10n.range,
                         rangeShort: l10n.rangeShort,
                         rangeNoMod: false,
                         duration: l10n.duration,
                         durationShort: l10n.durationShort,
                         durationNoMod: false,
                         target: l10n.target,
                         src: toSourceRefs (l10n.src),
                         errata: toErrata (l10n.errata),
                         category: Nothing,
                       }),
                     ])


export const toRogueSpells : YamlFileConverter<string, Record<Spell>>
                           = pipe (
                               (yaml_mp : YamlNameMap) => zipBy ("id")
                                                                (yaml_mp.RogueSpellsUniv)
                                                                (yaml_mp.RogueSpellsL10n),
                               bindF (pipe (
                                 mapM (toRogueSpell),
                                 bindF (toMapIntegrity),
                               )),
                               second (fromMap)
                             )
