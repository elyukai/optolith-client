import { liftM2 } from "../../../../Data/Either";
import { fmap } from "../../../../Data/Functor";
import { fromArray, List, lookup, map, NonEmptyList, notNullStr } from "../../../../Data/List";
import { any, ensure, fromJust, joinMaybeList, Just, Maybe, maybe_, Nothing, Some } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { parseJSON } from "../../../../Data/String/JSON";
import { fst, Pair, snd } from "../../../../Data/Tuple";
import { IdPrefixes } from "../../../Constants/IdPrefixes";
import { RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { Skill } from "../../../Models/Wiki/Skill";
import { Application } from "../../../Models/Wiki/sub/Application";
import { prefixId } from "../../IDUtils";
import { toInt, toNatural } from "../../NumberUtils";
import { mergeRowsById } from "../mergeTableRows";
import { modifyNegIntNoBreak } from "../rawConversionUtils";
import { Expect } from "../showExpected";
import { mensureMapNatural, mensureMapNaturalFixedList, mensureMapNonEmptyString, mensureMapPairList, mensureMapPairListOptional, mensureMapStringPred } from "../validateMapValueUtils";
import { lookupKeyValid, mapMNamed, TableType } from "../validateValueUtils";
import { isRawRequiringActivatable } from "./Prerequisites/RawActivatableRequirement";
import { toSourceLinks } from "./Sub/toSourceLinks";

const encumbrance = /true|false|maybe/

const checkEncumbrance =
  (x: string) => encumbrance .test (x)

export const stringToPrerequisite =
  (x: string): Maybe<List<Record<RequireActivatable>>> => {
    try {
      const mobj = parseJSON (x)

      if (any ((y: Some): y is object => typeof y === "object" && y !== null) (mobj)) {
        const obj = fromJust<any> (mobj)

        return isRawRequiringActivatable (obj)
          ? Just (List (RequireActivatable ({
              id: Array.isArray (obj .id)
                ? fromArray (obj .id) as NonEmptyList<string>
                : obj .id,
              active: obj .active,
              sid: Array.isArray (obj .sid)
                ? Just (fromArray (obj .sid) as NonEmptyList<number>)
                : Maybe (obj .sid),
              sid2: Maybe (obj .sid2),
              tier: Maybe (obj .tier),
            })))
          : Nothing
      }

      return Nothing
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
        lookupKeyValid (mensureMapNonEmptyString) (TableType.L10n) (lookup_l10n)

      const checkApplicationsL10n =
        lookupKeyValid (mensureMapPairList ("&&")
                                           ("?")
                                           (Expect.Integer)
                                           (Expect.NonEmptyString)
                                           (toInt)
                                           (ensure (notNullStr)))
                       (TableType.L10n)
                       (lookup_l10n)

      const checkUsesL10n =
        lookupKeyValid (mensureMapPairListOptional ("&&")
                                                   ("?")
                                                   (Expect.NaturalNumber)
                                                   (Expect.NonEmptyString)
                                                   (toNatural)
                                                   (ensure (notNullStr)))
                       (TableType.L10n)
                       (lookup_l10n)

      const checkApplicationsUniv =
        lookupKeyValid (mensureMapPairListOptional ("&")
                                                   ("?")
                                                   (Expect.Integer)
                                                   ("RequireActivatable")
                                                   (toInt)
                                                   (stringToPrerequisite))
                       (TableType.Univ)
                       (lookup_univ)

      const checkUsesUniv =
        lookupKeyValid (mensureMapPairListOptional ("&")
                                                   ("?")
                                                   (Expect.NaturalNumber)
                                                   ("RequireActivatable")
                                                   (toInt)
                                                   (stringToPrerequisite))
                       (TableType.Univ)
                       (lookup_univ)

      const checkSkillCheck =
        lookupKeyValid (mensureMapNaturalFixedList (3) ("&"))
                       (TableType.Univ)
                       (lookup_univ)

      const checkEncumbranceInfluence =
        lookupKeyValid (mensureMapStringPred (checkEncumbrance)
                                             (`"true" | "false" | "maybe"`))
                       (TableType.Univ)
                       (lookup_univ)

      const checkUnivNaturalNumber =
        lookupKeyValid (mensureMapNatural)
                       (TableType.Univ)
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

      const eusesL10n = checkUsesL10n ("uses")

      const eusesUniv = checkUsesUniv ("uses")

      const euses =
        liftM2
          (Maybe.liftM2<
            List<Pair<number, string>>,
            List<Pair<number, List<Record<RequireActivatable>>>>,
            List<Record<Application>>
          > (l10n => univ => map ((p: Pair<number, string>) => Application ({
                                   id: fst (p),
                                   name: snd (p),
                                   prerequisites:
                                     lookup<number, List<Record<RequireActivatable>>> (fst (p))
                                                                                      (univ),
                                 }))
                                 (l10n)))
          (eusesL10n)
          (eusesUniv)

      const echeck = fmap (map (prefixId (IdPrefixes.ATTRIBUTES)))
                                 (checkSkillCheck ("check"))

      const eic = checkUnivNaturalNumber ("ic")

      const eenc = checkEncumbranceInfluence ("enc")

      const encDescription = lookup_l10n ("encDescription")

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
          euses,
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
          uses: joinMaybeList (rs.euses),
          check: rs.echeck,
          ic: rs.eic,
          encumbrance: rs.eenc,
          encumbranceDescription: encDescription,
          tools: fmap (modifyNegIntNoBreak) (tools),
          quality: modifyNegIntNoBreak (rs.equality),
          failed: modifyNegIntNoBreak (rs.efailed),
          critical: modifyNegIntNoBreak (rs.ecritical),
          botch: modifyNegIntNoBreak (rs.ebotch),
          gr: rs.egr,
          src: rs.esrc,
          category: Nothing,
        }))
    })
