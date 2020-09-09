/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { CultureL10n } from "../../../../../app/Database/Schema/Cultures/Cultures.l10n"
import { CultureUniv } from "../../../../../app/Database/Schema/Cultures/Cultures.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Culture } from "../../../Models/Wiki/Culture"
import { CommonProfession } from "../../../Models/Wiki/sub/CommonProfession"
import { IncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toSourceRefs } from "./ToSourceRefs"


const toCulture : YamlPairConverterE<CultureUniv, CultureL10n, string, Culture>
                = ([ univ, l10n ]) => Right<[string, Record<Culture>]> ([
                    univ.id,
                    Culture ({
                      id: univ.id,
                      name: l10n.name,
                      languages: fromArray (univ.languages),
                      scripts: fromArray (univ.literacy ?? []),
                      socialStatus: fromArray (univ.social),
                      areaKnowledge: l10n.areaKnowledge,
                      areaKnowledgeShort: l10n.areaKnowledgeShort,
                      commonProfessions: List (
                        univ.commonMundaneProfessionsExceptions === undefined
                          ? univ.commonMundaneProfessionsAll
                          : CommonProfession ({
                              list: fromArray (univ.commonMundaneProfessionsExceptions),
                              reverse: univ.commonMundaneProfessionsAll,
                            }),
                        univ.commonMagicalProfessionsExceptions === undefined
                          ? univ.commonMagicalProfessionsAll
                          : CommonProfession ({
                              list: fromArray (univ.commonMagicalProfessionsExceptions),
                              reverse: univ.commonMagicalProfessionsAll,
                            }),
                        univ.commonBlessedProfessionsExceptions === undefined
                          ? univ.commonBlessedProfessionsAll
                          : CommonProfession ({
                              list: fromArray (univ.commonBlessedProfessionsExceptions),
                              reverse: univ.commonBlessedProfessionsAll,
                            }),
                      ),
                      commonMundaneProfessions: Maybe (l10n.commonMundaneProfessions),
                      commonMagicProfessions: Maybe (l10n.commonMagicalProfessions),
                      commonBlessedProfessions: Maybe (l10n.commonBlessedProfessions),
                      commonAdvantages: fromArray (univ.commonAdvantages ?? []),
                      commonAdvantagesText: Maybe (l10n.commonAdvantages),
                      commonDisadvantages: fromArray (univ.commonDisadvantages ?? []),
                      commonDisadvantagesText: Maybe (l10n.commonDisadvantages),
                      uncommonAdvantages: fromArray (univ.uncommonAdvantages ?? []),
                      uncommonAdvantagesText: Maybe (l10n.uncommonAdvantages),
                      uncommonDisadvantages: fromArray (univ.uncommonDisadvantages ?? []),
                      uncommonDisadvantagesText: Maybe (l10n.uncommonDisadvantages),
                      commonSkills: fromArray (univ.commonSkills ?? []),
                      uncommonSkills: fromArray (univ.uncommonSkills ?? []),
                      commonNames: l10n.commonNames,
                      culturalPackageAdventurePoints: univ.culturalPackageCost,
                      culturalPackageSkills:
                        fromArray (univ.culturalPackageSkills.map (IncreaseSkill)),
                      src: toSourceRefs (l10n.src),
                      errata: toErrata (l10n.errata),
                      category: Nothing,
                    }),
                  ])


export const toCultures : YamlFileConverter<string, Record<Culture>>
                        = pipe (
                            (yaml_mp : YamlNameMap) =>
                              zipBy ("id")
                                    (yaml_mp.CulturesUniv)
                                    (yaml_mp.CulturesL10nDefault)
                                    (yaml_mp.CulturesL10nOverride),
                            bindF (pipe (
                              mapM (toCulture),
                              bindF (toMapIntegrity),
                            )),
                            second (fromMap)
                          )
