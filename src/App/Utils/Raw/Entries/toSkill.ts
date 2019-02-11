import { IdPrefixes } from "../../../../constants/IdPrefixes";
import { liftM2 } from "../../../../Data/Either";
import { fmap } from "../../../../Data/Functor";
import { fromArray, List, lookup, map, notNullStr } from "../../../../Data/List";
import { ensure, Just, Maybe, maybe_, Nothing } from "../../../../Data/Maybe";
import { fst, Pair, snd } from "../../../../Data/Pair";
import { Record } from "../../../../Data/Record";
import { RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { Skill } from "../../../Models/Wiki/Skill";
import { Application } from "../../../Models/Wiki/sub/Application";
import { prefixId } from "../../IDUtils";
import { toInt } from "../../NumberUtils";
import { mergeRowsById } from "../mergeTableRows";
import { mensureMapNatural, mensureMapNaturalFixedList, mensureMapNonEmptyString, mensureMapPairList, mensureMapPairListOptional, mensureMapStringPred } from "../validateMapValueUtils";
import { Expect, lookupKeyValid, mapMNamed } from "../validateValueUtils";
import { isRawRequiringActivatable } from "./Prerequisites/RawActivatableRequirement";
import { toSourceLinks } from "./Sub/toSourceLinks";

const encumbrance = /true|false|maybe/

const checkEncumbrance =
  (x: string) => encumbrance .test (x)

export const stringToPrerequisite =
  (x: string): Maybe<List<Record<RequireActivatable>>> => {
    try {
      const obj = JSON.parse (x)

      if (typeof obj !== "object" || obj === null) return Nothing

      return isRawRequiringActivatable (obj)
        ? Just (List (RequireActivatable ({
            id: Array.isArray (obj .id) ? fromArray (obj .id) : obj .id,
            active: obj .active,
            sid: Array.isArray (obj .sid) ? Just (fromArray (obj .sid)) : Maybe (obj .sid),
            sid2: Maybe (obj .sid2),
            tier: Maybe (obj .tier),
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
        lookupKeyValid (mensureMapNonEmptyString) (lookup_l10n)

      const checkApplicationsL10n =
        lookupKeyValid (mensureMapPairList ("&&")
                                           ("?")
                                           (Expect.Integer)
                                           (Expect.NonEmptyString)
                                           (toInt)
                                           (ensure (notNullStr)))
                       (lookup_l10n)

      const checkApplicationsUniv =
        lookupKeyValid (mensureMapPairListOptional ("&")
                                                   ("?")
                                                   (Expect.Integer)
                                                   ("RequireActivatable")
                                                   (toInt)
                                                   (stringToPrerequisite))
                       (lookup_univ)

      const checkSkillCheck =
        lookupKeyValid (mensureMapNaturalFixedList (3) ("&"))
                       (lookup_univ)

      const checkEncumbranceInfluence =
        lookupKeyValid (mensureMapStringPred (checkEncumbrance)
                                             (`"true" | "false" | "maybe"`))
                       (lookup_univ)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural)
                       (lookup_univ)

      // Check and convert fields

      const ename = checkL10nNonEmptyString ("name")

      const eapplicationsL10n = checkApplicationsL10n ("applications")

      const eapplicationsUniv = checkApplicationsUniv ("applications")

      const eapplications =
        liftM2<
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

      const echeck = fmap (map (prefixId (IdPrefixes.ATTRIBUTES)))
                                 (checkSkillCheck ("check"))

      const eic = checkUnivNaturalNumber ("ic")

      const eenc = checkEncumbranceInfluence ("enc")

      const tools = lookup_l10n ("tools")

      const equality = checkL10nNonEmptyString ("quality")

      const efailed = checkL10nNonEmptyString ("failed")

      const ecritical = checkL10nNonEmptyString ("critical")

      const ebotch = checkL10nNonEmptyString ("botch")

      const egr = checkUnivNaturalNumber ("gr")

      const esrc = toSourceLinks (lookup_l10n)

      // Return error or result

      return mapMNamed
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
          src: rs.esrc,
          category: Nothing,
        }))
    })
