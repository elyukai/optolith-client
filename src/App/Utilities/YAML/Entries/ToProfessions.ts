/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { NameBySex as RawNameBySex, ProfessionL10n } from "../../../../../app/Database/Schema/Professions/Professions.l10n"
import { ProfessionCombatTechnique, ProfessionLiturgicalChant, ProfessionSkill, ProfessionSpell, ProfessionUniv } from "../../../../../app/Database/Schema/Professions/Professions.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { catMaybes, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Profession } from "../../../Models/Wiki/Profession"
import { ProfessionSelections } from "../../../Models/Wiki/professionSelections/ProfessionAdjustmentSelections"
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
import { toCantripSO, toCombatTechniqueSO, toCurseSO, toLanguageScriptSO, toSkillSO, toSkillSpecializationSO, toTerrainKnowledgeSO } from "./ToProfessionSelectOptions"
import { toSourceRefs } from "./ToSourceRefs"


const toNameBySex : (name : string | RawNameBySex) => string | Record<NameBySex>
                  = name => typeof name === "object" ? NameBySex (name) : name


const toNameBySexM : (name : string | RawNameBySex | undefined) => Maybe<string | Record<NameBySex>>
                   = name => typeof name === "object" ? Just (NameBySex (name)) : Maybe (name)


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


const toProfession : YamlPairConverterE<ProfessionUniv, ProfessionL10n, string, Profession>
                   = ([ univ, l10n ]) => Right<[string, Record<Profession>]> ([
                       univ.id,
                       Profession ({
                         id: univ.id,
                         name: toNameBySex (l10n.name),
                         subname: toNameBySexM (l10n.subname),
                         ap: Maybe (univ.cost),
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
                           ...(l10n.activatablePrerequisites === undefined
                               ? []
                               : l10n.activatablePrerequisites .map (toActivatablePrerequisiteP)),
                           ...(univ.increasablePrerequisites === undefined
                               ? []
                               : univ.increasablePrerequisites .map (toIncreasablePrerequisiteP)),
                         ),
                         prerequisitesStart: Maybe (l10n.prerequisitesStart),
                         prerequisitesEnd: Nothing,
                         selections: ProfessionSelections ({
                           [ProfessionSelectionIds.CANTRIPS]:
                             univ.cantripSelectOptions === undefined
                             ? Nothing
                             : Just (toCantripSO (univ.cantripSelectOptions)),
                           [ProfessionSelectionIds.COMBAT_TECHNIQUES]:
                             univ.combatTechniqueSelectOptions === undefined
                             ? Nothing
                             : Just (toCombatTechniqueSO (univ.combatTechniqueSelectOptions)),
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
                             : Just (toSkillSpecializationSO (
                                 univ.skillSpecializationSelectOptions
                               )),
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
                         suggestedAdvantages: fromArray (univ.suggestedAdvantages ?? []),
                         suggestedAdvantagesText: Maybe (l10n.suggestedAdvantages),
                         suggestedDisadvantages: fromArray (univ.suggestedDisadvantages ?? []),
                         suggestedDisadvantagesText: Maybe (l10n.suggestedDisadvantages),
                         unsuitableAdvantages: fromArray (univ.unsuitableAdvantages ?? []),
                         unsuitableAdvantagesText: Maybe (l10n.unsuitableAdvantages),
                         unsuitableDisadvantages: fromArray (univ.unsuitableDisadvantages ?? []),
                         unsuitableDisadvantagesText: Maybe (l10n.unsuitableDisadvantages),
                         isVariantRequired: univ.isVariantRequired,
                         variants: fromArray (univ.variants ?? []),
                         gr: univ.gr,
                         subgr: univ.sgr,
                         src: toSourceRefs (l10n.src),
                         errata: toErrata (l10n.errata),
                         category: Nothing,
                       }),
                     ])


export const toProfessions : YamlFileConverter<string, Record<Profession>>
                           = pipe (
                               (yaml_mp : YamlNameMap) =>
                                 zipBy ("id")
                                       (yaml_mp.ProfessionsUniv)
                                       (yaml_mp.ProfessionsL10nDefault)
                                       (yaml_mp.ProfessionsL10nOverride),
                               bindF (pipe (
                                 mapM (toProfession),
                                 bindF (toMapIntegrity),
                               )),
                               second (fromMap)
                             )
