/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SkillL10n, UseL10n } from "../../../../../app/Database/Schema/Skills/Skills.l10n"
import { SkillUniv, UseUniv } from "../../../../../app/Database/Schema/Skills/Skills.univ"
import { bindF, Either, fromRight_, isLeft, Left, Right, RightI, second } from "../../../../Data/Either"
import { on } from "../../../../Data/Function"
import { fmap } from "../../../../Data/Functor"
import { append, fromArray, List } from "../../../../Data/List"
import { fromMaybe, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair, uncurry } from "../../../../Data/Tuple"
import { icToJs } from "../../../Constants/Groups"
import { Skill } from "../../../Models/Wiki/Skill"
import { Application } from "../../../Models/Wiki/sub/Application"
import { Use } from "../../../Models/Wiki/sub/Use"
import { pipe, pipe_ } from "../../pipe"
import { map } from "../Array"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy, zipByIdLoose } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown, toMarkdownM } from "./ToMarkdown"
import { toActivatablePrerequisite } from "./ToPrerequisites"
import { toSourceRefs } from "./ToSourceRefs"


const toApplications : (x : [SkillUniv, SkillL10n]) => List<Record<Application>>
                     = pipe (
                         ([ univ, l10n ]) => zipByIdLoose ((univ.applications ?? []))
                                                          (l10n.applications),
                         ([ xs, ys ]) : Pair<Record<Application>[], Record<Application>[]> =>
                           Pair (
                             xs.map (([ u, l ]) => Application ({
                                                   id: u.id,
                                                   name: l.name,
                                                   prerequisite:
                                                     Just (
                                                       toActivatablePrerequisite (u.prerequisite)
                                                     ),
                                                 })),
                             ys.map (l => Application ({
                                            id: l.id,
                                            name: l.name,
                                          }))
                           ),
                         uncurry (on (append as append<Record<Application>>)
                                     <Record<Application>[]> (fromArray))
                       )


const toUses : (x : [SkillUniv, SkillL10n]) => Either<Error[], List<Record<Use>>>
             = pipe (
                 ([ univ, l10n ]) : Either<Error[], Maybe<[UseUniv, UseL10n][]>> =>
                   l10n.uses === undefined
                   ? Right (Nothing)
                   : univ.uses === undefined
                   ? Left ([ new Error (`toSkills: skill "${univ.id}" has uses but there are no entries in universal file`) ])
                   : pipe_ (
                       zipBy ("id")
                             (univ.uses)
                             (l10n.uses)
                             (undefined),
                       second (Just)
                     ),
                 second (pipe (
                          fmap (pipe (
                                 map (([ u, l ]) => Use ({
                                                      id: u.id,
                                                      name: l.name,
                                                      prerequisite:
                                                        toActivatablePrerequisite (u.prerequisite),
                                                    })),
                                 fromArray
                               )),
                          fromMaybe (List ())
                        ))
               )


const toSkill : YamlPairConverterE<SkillUniv, SkillL10n, string, Skill>
              = x => {
                  const [ univ, l10n ] = x

                  const applications = toApplications (x)

                  const euses = toUses (x)

                  if (isLeft<Error[]> (euses)) {
                    return euses
                  }

                  const uses = fromRight_<RightI<typeof euses>> (euses)

                  return Right<[string, Record<Skill>]> ([
                    univ.id,
                    Skill ({
                      id: univ.id,
                      name: l10n.name,
                      check: List (univ.check1, univ.check2, univ.check3),
                      encumbrance: univ.enc,
                      encumbranceDescription: Maybe (l10n.encDescription),
                      gr: univ.gr,
                      ic: icToJs (univ.ic),
                      applications,
                      applicationsInput: Maybe (l10n.applicationsInput),
                      uses,
                      tools: toMarkdownM (Maybe (l10n.tools)),
                      quality: toMarkdown (l10n.quality),
                      failed: toMarkdown (l10n.failed),
                      critical: toMarkdown (l10n.critical),
                      botch: toMarkdown (l10n.botch),
                      src: toSourceRefs (l10n.src),
                      errata: toErrata (l10n.errata),
                      category: Nothing,
                    }),
                  ])
                }


export const toSkills : YamlFileConverter<string, Record<Skill>>
                      = pipe (
                          (yaml_mp : YamlNameMap) => zipBy ("id")
                                                           (yaml_mp.SkillsUniv)
                                                           (yaml_mp.SkillsL10nDefault)
                                                           (yaml_mp.SkillsL10nOverride),
                          bindF (pipe (
                            mapM (toSkill),
                            bindF (toMapIntegrity),
                          )),
                          second (fromMap)
                        )
