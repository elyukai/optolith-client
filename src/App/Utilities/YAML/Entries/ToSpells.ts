/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SpellL10n } from "../../../../../app/Database/Schema/Spells/Spells.l10n"
import { SpellUniv } from "../../../../../app/Database/Schema/Spells/Spells.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { icToJs } from "../../../Constants/Groups"
import { Spell } from "../../../Models/Wiki/Spell"
import { AllRequirementObjects } from "../../../Models/Wiki/wikiTypeHelpers"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toActivatablePrerequisite, toIncreasablePrerequisite } from "./ToPrerequisites"
import { toSourceRefs } from "./ToSourceRefs"


const toSpell : YamlPairConverterE<SpellUniv, SpellL10n, string, Spell>
              = ([ univ, l10n ]) => Right<[string, Record<Spell>]> ([
                  univ.id,
                  Spell ({
                    id: univ .id,
                    name: l10n.name,
                    check: List (univ.check1, univ.check2, univ.check3),
                    checkmod: Maybe (univ.checkMod),
                    gr: univ .gr,
                    ic: icToJs (univ .ic),
                    property: univ.property,
                    tradition: fromArray (univ.traditions),
                    subtradition: List (),
                    prerequisites: List<AllRequirementObjects> (
                      ...(univ.activatablePrerequisites ?? [])
                        .map (toActivatablePrerequisite),
                      ...(univ.increasablePrerequisites ?? [])
                        .map (toIncreasablePrerequisite),
                    ),
                    effect: toMarkdown (l10n.effect),
                    castingTime: l10n.castingTime,
                    castingTimeShort: l10n.castingTimeShort,
                    castingTimeNoMod: univ.castingTimeNoMod,
                    cost: l10n.aeCost,
                    costShort: l10n.aeCostShort,
                    costNoMod: univ.aeCostNoMod,
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


export const toSpells : YamlFileConverter<string, Record<Spell>>
                      = pipe (
                          (yaml_mp : YamlNameMap) => zipBy ("id")
                                                           (yaml_mp.SpellsUniv)
                                                           (yaml_mp.SpellsL10nDefault)
                                                           (yaml_mp.SpellsL10nOverride),
                          bindF (pipe (
                            mapM (toSpell),
                            bindF (toMapIntegrity),
                          )),
                          second (fromMap)
                        )
