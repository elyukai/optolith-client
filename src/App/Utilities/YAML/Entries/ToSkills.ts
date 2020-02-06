/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Either, fromRight_, isLeft, Left, Right, RightI, second } from "../../../../Data/Either"
import { on } from "../../../../Data/Function"
import { fmap } from "../../../../Data/Functor"
import { append, fromArray, List } from "../../../../Data/List"
import { fromMaybe, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair, uncurry } from "../../../../Data/Tuple"
import { Skill } from "../../../Models/Wiki/Skill"
import { Application } from "../../../Models/Wiki/sub/Application"
import { Use } from "../../../Models/Wiki/sub/Use"
import { pipe, pipe_ } from "../../pipe"
import { map } from "../Array"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { icToInt } from "../ICToInt"
import { SkillL10n, UseL10n } from "../Schema/Skills/Skills.l10n"
import { SkillUniv, UseUniv } from "../Schema/Skills/Skills.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipById, zipByIdLoose } from "../ZipById"
import { toErrata } from "./toErrata"
import { toMarkdown, toMarkdownM } from "./ToMarkdown"
import { toActivatablePrerequisite } from "./ToPrerequisites"
import { toSourceRefs } from "./toSourceRefs"


const toApplications : (x : [SkillUniv, SkillL10n]) => List<Record<Application>>
                     = pipe (
                       x => zipByIdLoose (x [0] .applications)
                                         (x [1] .applications),
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
               (x) : Either<Error[], Maybe<[UseUniv, UseL10n][]>> =>
                 x [1] .uses === undefined
                 ? Right (Nothing)
                 : x [0] .uses === undefined
                 ? Left ([ new Error (`toSkills: skill "${x [0] .id}" has uses but there are no entries in universal file`) ])
                 : pipe_ (
                     zipById (x [0] .uses)
                             (x [1] .uses),
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
                  const applications = toApplications (x)

                  const euses = toUses (x)

                  if (isLeft<Error[]> (euses)) {
                    return euses
                  }

                  const uses = fromRight_<RightI<typeof euses>> (euses)

                  return Right<[string, Record<Skill>]> ([
                    x [0] .id,
                    Skill ({
                      id: x [0] .id,
                      name: x [1] .name,
                      check: List (x [0] .check1, x [0] .check2, x [0] .check3),
                      encumbrance: x [0] .enc,
                      encumbranceDescription: Maybe (x [1] .name),
                      gr: x [0] .gr,
                      ic: icToInt (x [0] .ic),
                      applications,
                      applicationsInput: Maybe (x [1] .applicationsInput),
                      uses,
                      tools: toMarkdownM (Maybe (x [1] .tools)),
                      quality: toMarkdown (x [1] .quality),
                      failed: toMarkdown (x [1] .failed),
                      critical: toMarkdown (x [1] .critical),
                      botch: toMarkdown (x [1] .botch),
                      src: toSourceRefs (x [1] .src),
                      errata: toErrata (x [1] .errata),
                      category: Nothing,
                    }),
                  ])
                }


export const toSkills : YamlFileConverter<string, Record<Skill>>
                      = pipe (
                          (yaml_mp : YamlNameMap) => zipById (yaml_mp.SkillsUniv)
                                                             (yaml_mp.SkillsL10n),
                          bindF (pipe (
                            mapM (toSkill),
                            bindF (toMapIntegrity),
                          )),
                          second (fromMap)
                        )
