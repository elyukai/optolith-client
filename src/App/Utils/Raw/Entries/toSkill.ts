import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { Either, liftM2 } from "../../../../Data/Either";
import { fromArray, List, lookup, map, notNullStr, pure } from "../../../../Data/List";
import { ensure, fromNullable, Just, Maybe, maybe_, Nothing } from "../../../../Data/Maybe";
import { fst, Pair, snd } from "../../../../Data/Pair";
import { Record } from "../../../../Data/Record";
import { RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { Skill } from "../../../Models/Wiki/Skill";
import { Application } from "../../../Models/Wiki/sub/Application";
import { prefixId } from "../../IDUtils";
import { toInt } from "../../NumberUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNatural, mensureMapNaturalFixedList, mensureMapNonEmptyString, mensureMapPairList, mensureMapPairListOptional, mensureMapStringPred } from "../validateMapValueUtils";
import { allRights, Expect, lookupKeyValid } from "../validateValueUtils";
import { isRawRequiringActivatable } from "./Prerequisites/ActivatableRequirement";
import { lookupValidSourceLinks, toSourceLinks } from "./Sub/toSourceLinks";

const encumbrance = /true|false|maybe/

const checkEncumbrance =
  (x: string) => encumbrance .test (x)

export const stringToPrerequisite =
  (x: string): Maybe<List<Record<RequireActivatable>>> => {
    try {
      const obj = JSON.parse (x)

      if (typeof obj !== "object" || obj === null) return Nothing

      return isRawRequiringActivatable (obj)
        ? Just (pure (RequireActivatable ({
            id: Array.isArray (obj .id) ? fromArray (obj .id) : obj .id,
            active: obj .active,
            sid: Array.isArray (obj .sid) ? Just (fromArray (obj .sid)) : fromNullable (obj .sid),
            sid2: fromNullable (obj .sid2),
            tier: fromNullable (obj .tier),
          })))
        : Nothing
    }
    catch (e) {
      return Nothing
    }
  }

export const toSkill =
  mergeRowsById
    ("toSkill")
    (id => lookup_l10n => lookup_univ => {
      // Shortcuts

      const checkL10nNonEmptyString =
        lookupKeyValid (lookup_l10n) (mensureMapNonEmptyString)

      const checkApplicationsL10n =
        lookupKeyValid (lookup_l10n)
                       (mensureMapPairList ("&&")
                                           ("?")
                                           (Expect.Integer)
                                           (Expect.NonEmptyString)
                                           (toInt)
                                           (ensure (notNullStr)))

      const checkApplicationsUniv =
        lookupKeyValid (lookup_univ)
                       (mensureMapPairListOptional ("&")
                                                   ("?")
                                                   (Expect.Integer)
                                                   ("RequireActivatable")
                                                   (toInt)
                                                   (stringToPrerequisite))

      const checkSkillCheck =
        lookupKeyValid (lookup_univ)
                       (mensureMapNaturalFixedList (3) ("&"))

      const checkEncumbranceInfluence =
        lookupKeyValid (lookup_univ)
                       (mensureMapStringPred (checkEncumbrance)
                                             (`"true" | "false" | "maybe"`))

      const checkUnivNaturalNumber =
        lookupKeyValid (lookup_univ) (mensureMapNatural)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const eapplicationsL10n = checkApplicationsL10n ("applications")

      const eapplicationsUniv = checkApplicationsUniv ("applications")

      const eapplications =
        liftM2<
          string,
          List<Pair<number, string>>,
          Maybe<List<Pair<number, List<Record<RequireActivatable>>>>>,
          List<Record<Application>>
        >
          (l10n =>
            maybe_ (() => map ((p: Pair<number, string>) => Application ({
                                id: fst (p),
                                name: snd (p),
                                prerequisites: Nothing,
                              }))
                              (l10n))
                   (univ => map ((p: Pair<number, string>) => Application ({
                                  id: fst (p),
                                  name: snd (p),
                                  prerequisites:
                                    lookup<number, List<Record<RequireActivatable>>> (fst (p))
                                                                                     (univ),
                                }))
                                (l10n)))
          (eapplicationsL10n)
          (eapplicationsUniv)

      const applicationsInput = lookup_l10n ("input")

      const echeck =
        Either.fmap<string, List<string | number>, List<string>>
          (map (prefixId (IdPrefixes.ATTRIBUTES)))
          (checkSkillCheck ("check"))

      const eic = checkUnivNaturalNumber ("ic")

      const eenc = checkEncumbranceInfluence ("enc")

      const tools = lookup_l10n ("tools")

      const equality = checkL10nNonEmptyString ("quality")

      const efailed = checkL10nNonEmptyString ("failed")

      const ecritical = checkL10nNonEmptyString ("critical")

      const ebotch = checkL10nNonEmptyString ("botch")

      const egr = checkUnivNaturalNumber ("gr")

      const esrc = lookupValidSourceLinks (lookup_l10n)

      // Return error or result

      return allRights
        ({
          ename,
          eapplications,
          echeck,
          eic,
          eenc,
          equality,
          efailed,
          ecritical,
          ebotch,
          egr,
          esrc,
        })
        (rs => Skill ({
          id: prefixId (IdPrefixes.SKILLS) (id),
          name: rs.ename,
          applications: rs.eapplications,
          applicationsInput,
          check: rs.echeck,
          ic: rs.eic,
          encumbrance: rs.eenc,
          tools,
          quality: rs.equality,
          failed: rs.efailed,
          critical: rs.ecritical,
          botch: rs.ebotch,
          gr: rs.egr,
          src: toSourceLinks (rs.esrc),
          category: Nothing,
        }))
    })
