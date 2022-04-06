/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SkillL10n, UseL10n } from "../../../../../app/Database/Schema/Skills/Skills.l10n"
import { SkillUniv, UseUniv } from "../../../../../app/Database/Schema/Skills/Skills.univ"
import { on } from "../../../../Data/Function"
import { append, fromArray, List } from "../../../../Data/List"
import { Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair, uncurry } from "../../../../Data/Tuple"
import { icToJs } from "../../../Constants/Groups"
import { Skill } from "../../../Models/Wiki/Skill"
import { Application } from "../../../Models/Wiki/sub/Application"
import { Use } from "../../../Models/Wiki/sub/Use"
import { Either, Left, Right, toNewEither } from "../../Either"
import { Just as NewJust, Maybe as NewMaybe, Nothing as NewNothing } from "../../Maybe"
import { pipe, pipe_ } from "../../pipe"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter } from "../ToRecordsByFile"
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
                             xs.map (([ u, l ]) =>
                               u.id < 0
                                  ? Application ({
                                                 id: u.id,
                                                 name: l.name,
                                                 affections: u.affections === undefined
                                                   ? List.empty
                                                   : List.fromArray (u.affections),
                                                 prerequisite:
                                                   Just (
                                                     toActivatablePrerequisite (u.prerequisite)
                                                   ),
                                                 })
                                  : Application ({
                                                 id: u.id,
                                                 name: l.name,
                                                 affections: u.affections === undefined
                                                   ? List.empty
                                                   : List.fromArray (u.affections),
                                                })),
                             ys.map (l => Application ({
                                            id: l.id,
                                            name: l.name,
                                            affections: List.empty,
                                          }))
                           ),
                         uncurry (on (append as append<Record<Application>>)
                                     <Record<Application>[]> (fromArray))
                       )


const toUses = ([ univ, l10n ] : [SkillUniv, SkillL10n]) =>
  (
    l10n.uses === undefined
    ? Right (NewNothing)
    : univ.uses === undefined
    ? Left ([ new Error (`toSkills: skill "${univ.id}" has uses but there are no entries in universal file`) ])
    : pipe_ (
        zipBy ("id")
              (univ.uses)
              (l10n.uses)
              (undefined),
        toNewEither
      )
        .map (NewJust)
  )
    .map ((res : NewMaybe<[UseUniv, UseL10n][]>) => res
      .map (xs =>
        fromArray (xs.map (([ u, l ]) =>
          Use ({
            id: u.id,
            name: l.name,
            prerequisite:
              toActivatablePrerequisite (u.prerequisite),
          }))))
      .fromMaybe (List ()))

const toSkill = (x : [SkillUniv, SkillL10n]) : Either<Error[], [string, Record<Skill>]> => {
  const [ univ, l10n ] = x

  const applications = toApplications (x)

  const euses = toUses (x)

  if (euses.isLeft) {
    return euses
  }

  const uses = euses.value

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


export const toSkills : YamlFileConverter<string, Record<Skill>> = (mp : YamlNameMap) =>
  toNewEither (zipBy ("id") (mp.SkillsUniv) (mp.SkillsL10nDefault) (mp.SkillsL10nOverride))
    .bind (rawSkills =>
      rawSkills
        .mapE (toSkill)
        .bind (skills => toNewEither (toMapIntegrity (skills)))
        .map (fromMap))
    .toOldEither ()
