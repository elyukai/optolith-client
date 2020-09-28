/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ExperienceLevelL10n } from "../../../../../app/Database/Schema/ExperienceLevels/ExperienceLevels.l10n"
import { ExperienceLevelUniv } from "../../../../../app/Database/Schema/ExperienceLevels/ExperienceLevels.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"


const toEL : YamlPairConverterE<ExperienceLevelUniv, ExperienceLevelL10n, string, ExperienceLevel>
                = ([ univ, l10n ]) => Right<[string, Record<ExperienceLevel>]> ([
                    univ.id,
                    ExperienceLevel ({
                      id: univ.id,
                      name: l10n.name,
                      ap: univ.ap,
                      maxAttributeValue: univ.maxAttributeValue,
                      maxSkillRating: univ.maxSkillRating,
                      maxCombatTechniqueRating: univ.maxCombatTechniqueRating,
                      maxTotalAttributeValues: univ.maxTotalAttributeValues,
                      maxSpellsLiturgicalChants: univ.maxSpellsLiturgicalChants,
                      maxUnfamiliarSpells: univ.maxUnfamiliarSpells,
                    }),
                  ])


export const toExperienceLevels : YamlFileConverter<string, Record<ExperienceLevel>>
                                = pipe (
                                    (yaml_mp : YamlNameMap) =>
                                      zipBy ("id")
                                            (yaml_mp.ExperienceLevelsUniv)
                                            (yaml_mp.ExperienceLevelsL10nDefault)
                                            (yaml_mp.ExperienceLevelsL10nOverride),
                                    bindF (pipe (
                                      mapM (toEL),
                                      bindF (toMapIntegrity),
                                    )),
                                    second (fromMap)
                                  )
