/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { NameBySex as RawNameBySex } from "../../../../../app/Database/Schema/Professions/Professions.l10n"
import { ProfessionCombatTechnique, ProfessionLiturgicalChant, ProfessionSkill, ProfessionSpell } from "../../../../../app/Database/Schema/Professions/Professions.univ"
import { ProfessionVariantL10n } from "../../../../../app/Database/Schema/ProfessionVariants/ProfessionVariants.l10n"
import { ProfessionVariantUniv } from "../../../../../app/Database/Schema/ProfessionVariants/ProfessionVariants.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { catMaybes, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { ProfessionVariantSelections } from "../../../Models/Wiki/professionSelections/ProfessionVariantAdjustmentSelections"
import { ProfessionVariant } from "../../../Models/Wiki/ProfessionVariant"
import { IncreaseSkill } from "../../../Models/Wiki/sub/IncreaseSkill"
import { IncreaseSkillList } from "../../../Models/Wiki/sub/IncreaseSkillList"
import { NameBySex } from "../../../Models/Wiki/sub/NameBySex"
import { ProfessionDependency, ProfessionPrerequisite, ProfessionSelectionIds } from "../../../Models/Wiki/wikiTypeHelpers"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toActivatablePrerequisiteP, toCulturePrerequisite, toIncreasablePrerequisiteP, toRacePrerequisite, toSexPrerequisite } from "./ToPrerequisites"
import { toCantripSO, toCombatTechniqueSOV, toCurseSO, toLanguageScriptSO, toSkillSO, toSkillSpecializationSOV, toTerrainKnowledgeSO } from "./ToProfessionSelectOptions"


const toNameBySex : (name : string | RawNameBySex) => string | Record<NameBySex>
                  = name => typeof name === "object" ? NameBySex (name) : name


const toProfessionCombatTechnique : (x : ProfessionCombatTechnique) => Record<IncreaseSkill>
                                  = IncreaseSkill


const toProfessionSkill : (x : ProfessionSkill) => Record<IncreaseSkill>
                        = IncreaseSkill


const toProfessionSpell : (x : ProfessionSpell)
                        => Record<IncreaseSkill> | Record<IncreaseSkillList>
                        = x => typeof x.id === "object"
                               ? IncreaseSkillList ({
                                   id: fromArray (x.id),
                                   value: x.value,
                                 })
                               : IncreaseSkill ({
                                   id: x.id,
                                   value: x.value,
                                 })


const toProfessionLiturgicalChant : (x : ProfessionLiturgicalChant)
                                  => Record<IncreaseSkill> | Record<IncreaseSkillList>
                                  = x => typeof x.id === "object"
                                         ? IncreaseSkillList ({
                                             id: fromArray (x.id),
                                             value: x.value,
                                           })
                                         : IncreaseSkill ({
                                             id: x.id,
                                             value: x.value,
                                           })


// eslint-disable-next-line max-len
const toPV : YamlPairConverterE<ProfessionVariantUniv, ProfessionVariantL10n, string, ProfessionVariant>
           = ([ univ, l10n ]) => Right<[string, Record<ProfessionVariant>]> ([
               univ.id,
               ProfessionVariant ({
                 id: univ.id,
                 name: toNameBySex (l10n.name),
                 ap: univ.cost,
                 dependencies: catMaybes (List<Maybe<ProfessionDependency>> (
                   univ.sexDependency === undefined
                     ? Nothing
                     : Just (toSexPrerequisite (univ.sexDependency)),
                   univ.raceDependency === undefined
                     ? Nothing
                     : Just (toRacePrerequisite (univ.raceDependency)),
                   univ.cultureDependency === undefined
                     ? Nothing
                     : Just (toCulturePrerequisite (univ.cultureDependency))
                 )),
                 prerequisites: List<ProfessionPrerequisite> (
                   ...(univ.activatablePrerequisites === undefined
                       ? []
                       : univ.activatablePrerequisites .map (toActivatablePrerequisiteP)),
                   ...(univ.increasablePrerequisites === undefined
                       ? []
                       : univ.increasablePrerequisites .map (toIncreasablePrerequisiteP)),
                 ),
                 precedingText: Maybe (l10n.precedingText),
                 fullText: Maybe (l10n.fullText),
                 concludingText: Maybe (l10n.concludingText),
                 selections: ProfessionVariantSelections ({
                   [ProfessionSelectionIds.CANTRIPS]:
                     univ.cantripSelectOptions === undefined
                     ? Nothing
                     : Just (toCantripSO (univ.cantripSelectOptions)),
                   [ProfessionSelectionIds.COMBAT_TECHNIQUES]:
                     univ.combatTechniqueSelectOptions === undefined
                     ? Nothing
                     : Just (toCombatTechniqueSOV (univ.combatTechniqueSelectOptions)),
                   [ProfessionSelectionIds.CURSES]:
                     univ.curseSelectOptions === undefined
                     ? Nothing
                     : Just (toCurseSO (univ.curseSelectOptions)),
                   [ProfessionSelectionIds.LANGUAGES_SCRIPTS]:
                     univ.languageScriptSelectOptions === undefined
                     ? Nothing
                     : Just (toLanguageScriptSO (univ.languageScriptSelectOptions)),
                   [ProfessionSelectionIds.SKILLS]:
                     univ.skillSelectOptions === undefined
                     ? Nothing
                     : Just (toSkillSO (univ.skillSelectOptions)),
                   [ProfessionSelectionIds.SPECIALIZATION]:
                     univ.skillSpecializationSelectOptions === undefined
                     ? Nothing
                     : Just (toSkillSpecializationSOV (univ.skillSpecializationSelectOptions)),
                   [ProfessionSelectionIds.TERRAIN_KNOWLEDGE]:
                     univ.terrainKnowledgeSelectOptions === undefined
                     ? Nothing
                     : Just (toTerrainKnowledgeSO (univ.terrainKnowledgeSelectOptions)),
                   [ProfessionSelectionIds.GUILD_MAGE_UNFAMILIAR_SPELL]: false,
                 }),
                 specialAbilities: fromArray (
                   univ.specialAbilities?.map (toActivatablePrerequisiteP) ?? []
                 ),
                 combatTechniques: fromArray (
                   univ.combatTechniques?.map (toProfessionCombatTechnique) ?? []
                 ),
                 skills: fromArray (
                   univ.skills?.map (toProfessionSkill) ?? []
                 ),
                 spells: fromArray (
                   univ.spells?.map (toProfessionSpell) ?? []
                 ),
                 liturgicalChants: fromArray (
                   univ.liturgicalChants?.map (toProfessionLiturgicalChant) ?? []
                 ),
                 blessings: fromArray (univ.blessings ?? []),
                 errata: toErrata (l10n.errata),
                 category: Nothing,
               }),
             ])


export const toProfessionVariants : YamlFileConverter<string, Record<ProfessionVariant>>
                                  = pipe (
                                      (yaml_mp : YamlNameMap) =>
                                        zipBy ("id")
                                              (yaml_mp.ProfessionVariantsUniv)
                                              (yaml_mp.ProfessionVariantsL10nDefault)
                                              (yaml_mp.ProfessionVariantsL10nOverride),
                                      bindF (pipe (
                                        mapM (toPV),
                                        bindF (toMapIntegrity),
                                      )),
                                      second (fromMap)
                                    )
