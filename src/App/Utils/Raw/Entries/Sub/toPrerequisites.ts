import { pipe } from "ramda";
import { Either, Left, mapM, maybeToEither, Right, second } from "../../../../../Data/Either";
import { flip } from "../../../../../Data/Function";
import { fromArray, isInfixOf, List, splitOn, uncons } from "../../../../../Data/List";
import { bindF, ensure, fmap, fromJust, fromMaybe, fromNullable, isNothing, Just, Maybe, Nothing } from "../../../../../Data/Maybe";
import { fromList } from "../../../../../Data/OrderedMap";
import { fromBoth, fst, Pair, snd } from "../../../../../Data/Pair";
import { RequireActivatable } from "../../../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement } from "../../../../Models/Wiki/prerequisites/CultureRequirement";
import { RequireIncreasable } from "../../../../Models/Wiki/prerequisites/IncreasableRequirement";
import { PactRequirement } from "../../../../Models/Wiki/prerequisites/PactRequirement";
import { RequirePrimaryAttribute } from "../../../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { RaceRequirement } from "../../../../Models/Wiki/prerequisites/RaceRequirement";
import { SexRequirement } from "../../../../Models/Wiki/prerequisites/SexRequirement";
import { AllRequirementObjects, AllRequirements, LevelAwarePrerequisites } from "../../../../Models/Wiki/wikiTypeHelpers";
import { ifElse } from "../../../ifElse";
import { gte } from "../../../mathUtils";
import { toInt } from "../../../NumberUtils";
import { lookupKeyValid, mstrToMaybe } from "../../validateValueUtils";
import { isRawRequiringActivatable } from "../Prerequisites/ActivatableRequirement";
import { isRawCultureRequirement } from "../Prerequisites/CultureRequirement";
import { isRawRequiringIncreasable } from "../Prerequisites/IncreasableRequirement";
import { isRawPactRequirement } from "../Prerequisites/PactRequirement";
import { isRawRequiringPrimaryAttribute } from "../Prerequisites/PrimaryAttributeRequirement";
import { isRawRaceRequirement } from "../Prerequisites/RaceRequirement";
import { isRawSexRequirement } from "../Prerequisites/SexRequirement";

const toLevelAwarePrerequisites =
  pipe (
    splitOn ("&&"),
    mapM (pipe (
      splitOn ("&"),
      uncons,
      fmap (
        p => {
          const level = bindF<number, number> (ensure (gte (0)))
                                              (toInt (fst (p)))

          if (isNothing (level)) {
            return Left (`Invalid level. Expected: Natural, Received: ${fst (p)}`)
          }

          const levelAwarePrerequisites =
            Maybe.mapM<string, AllRequirements>
              (pipe (
                (x: string) => JSON.parse (x),
                ensure (x => typeof x === "object" && x !== null || x === "RCP"),
                bindF<any, AllRequirements> (
                  x => x === "RCP"
                    ? Just<"RCP"> ("RCP")
                    : isRawRequiringActivatable (x)
                    ? Just (RequireActivatable ({
                        id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                        active: x .active,
                        sid: Array.isArray (x .sid)
                          ? Just (fromArray (x .sid))
                          : fromNullable (x .sid),
                        sid2: fromNullable (x .sid2),
                        tier: fromNullable (x .tier),
                      }))
                    : isRawRequiringIncreasable (x)
                    ? Just (RequireIncreasable ({
                        id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                        value: x .value,
                      }))
                    : isRawRequiringPrimaryAttribute (x)
                    ? Just (RequirePrimaryAttribute ({
                        id: Nothing,
                        value: x .value,
                        type: x .type,
                      }))
                    : isRawSexRequirement (x)
                    ? Just (SexRequirement ({
                        id: Nothing,
                        value: x .value,
                      }))
                    : isRawRaceRequirement (x)
                    ? Just (RaceRequirement ({
                        id: Nothing,
                        value: Array.isArray (x .value)
                          ? fromArray (x .value)
                          : x .value,
                      }))
                    : isRawCultureRequirement (x)
                    ? Just (CultureRequirement ({
                        id: Nothing,
                        value: Array.isArray (x .value)
                          ? fromArray (x .value)
                          : x .value,
                      }))
                    : isRawPactRequirement (x)
                    ? Just (PactRequirement ({
                        id: Nothing,
                        category: x .category,
                        domain: Array.isArray (x .domain)
                          ? Just (fromArray (x .domain))
                          : fromNullable (x .domain),
                        level: fromNullable (x .level),
                      }))
                    : Nothing
                )
              ))
              (snd (p))

          return maybeToEither<string, Pair<number, List<AllRequirements>>>
            (
              `Invalid level-aware prerequisites. `
              + `Expected: List Prerequisite, Received: ${snd (p)}`
            )
            (fmap (fromBoth<number, List<AllRequirements>> (fromJust (level)))
                  (levelAwarePrerequisites))
        }
      ),
      fromMaybe<Either<string, Pair<number, List<AllRequirements>>>>
        (Left ("Invalid list definition for level."))
    )),
    second (fromList)
  )

const toFlatPrerequisites =
  (xs: string) =>
    pipe (
           splitOn ("&"),
           Maybe.mapM<string, AllRequirements>
             (pipe (
               (x: string) => JSON.parse (x),
               ensure (x => typeof x === "object" && x !== null || x === "RCP"),
               bindF<any, AllRequirements> (
                 x => x === "RCP"
                   ? Just<"RCP"> ("RCP")
                   : isRawRequiringActivatable (x)
                   ? Just (RequireActivatable ({
                       id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                       active: x .active,
                       sid: Array.isArray (x .sid)
                         ? Just (fromArray (x .sid))
                         : fromNullable (x .sid),
                       sid2: fromNullable (x .sid2),
                       tier: fromNullable (x .tier),
                     }))
                   : isRawRequiringIncreasable (x)
                   ? Just (RequireIncreasable ({
                       id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                       value: x .value,
                     }))
                   : isRawRequiringPrimaryAttribute (x)
                   ? Just (RequirePrimaryAttribute ({
                       id: Nothing,
                       value: x .value,
                       type: x .type,
                     }))
                   : isRawSexRequirement (x)
                   ? Just (SexRequirement ({
                       id: Nothing,
                       value: x .value,
                     }))
                   : isRawRaceRequirement (x)
                   ? Just (RaceRequirement ({
                       id: Nothing,
                       value: Array.isArray (x .value)
                         ? fromArray (x .value)
                         : x .value,
                     }))
                   : isRawCultureRequirement (x)
                   ? Just (CultureRequirement ({
                       id: Nothing,
                       value: Array.isArray (x .value)
                         ? fromArray (x .value)
                         : x .value,
                     }))
                   : isRawPactRequirement (x)
                   ? Just (PactRequirement ({
                       id: Nothing,
                       category: x .category,
                       domain: Array.isArray (x .domain)
                         ? Just (fromArray (x .domain))
                         : fromNullable (x .domain),
                       level: fromNullable (x .level),
                     }))
                   : Nothing
               )
             )),
           maybeToEither<string, List<AllRequirements>>
             (
               `Invalid level-aware prerequisites. `
               + `Expected: List Prerequisite, Received: ${xs}`
             )
         )
         (xs)

const toFlatSpellPrerequisites =
  (xs: string) =>
    pipe (
           splitOn ("&"),
           Maybe.mapM<string, AllRequirementObjects>
             (pipe (
               (x: string) => JSON.parse (x),
               ensure (x => typeof x === "object" && x !== null),
               bindF<any, AllRequirementObjects> (
                 x => isRawRequiringActivatable (x)
                   ? Just (RequireActivatable ({
                       id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                       active: x .active,
                       sid: Array.isArray (x .sid)
                         ? Just (fromArray (x .sid))
                         : fromNullable (x .sid),
                       sid2: fromNullable (x .sid2),
                       tier: fromNullable (x .tier),
                     }))
                   : isRawRequiringIncreasable (x)
                   ? Just (RequireIncreasable ({
                       id: Array.isArray (x .id) ? fromArray (x .id) : x .id,
                       value: x .value,
                     }))
                   : isRawRequiringPrimaryAttribute (x)
                   ? Just (RequirePrimaryAttribute ({
                       id: Nothing,
                       value: x .value,
                       type: x .type,
                     }))
                   : isRawSexRequirement (x)
                   ? Just (SexRequirement ({
                       id: Nothing,
                       value: x .value,
                     }))
                   : isRawRaceRequirement (x)
                   ? Just (RaceRequirement ({
                       id: Nothing,
                       value: Array.isArray (x .value)
                         ? fromArray (x .value)
                         : x .value,
                     }))
                   : isRawCultureRequirement (x)
                   ? Just (CultureRequirement ({
                       id: Nothing,
                       value: Array.isArray (x .value)
                         ? fromArray (x .value)
                         : x .value,
                     }))
                   : isRawPactRequirement (x)
                   ? Just (PactRequirement ({
                       id: Nothing,
                       category: x .category,
                       domain: Array.isArray (x .domain)
                         ? Just (fromArray (x .domain))
                         : fromNullable (x .domain),
                       level: fromNullable (x .level),
                     }))
                   : Nothing
               )
             )),
           maybeToEither<string, List<AllRequirementObjects>>
             (
               `Invalid prerequisites. Expected: List Prerequisite, Received: ${xs}`
             )
         )
         (xs)

const toLevelAwareOrPlainPrerequisites =
  ifElse<string, Either<string, LevelAwarePrerequisites>>
    (isInfixOf ("&&"))
    (toLevelAwarePrerequisites)
    (toFlatPrerequisites)

/**
 * Convert a raw string to `Right LevelAwarePrerequisites`. If an error occurs
 * during conversion (scheme incorrect), a `Left` containing the error message
 * will be returned.
 */
export const toPrerequisites =
  flip (
         lookupKeyValid (pipe (
                          mstrToMaybe,
                          fmap (toLevelAwareOrPlainPrerequisites),
                          fromMaybe<Either<string, LevelAwarePrerequisites>> (Right (List.empty))
                        ))
       )
       ("prerequisites") as
         (lookup_univ: (key: string) => Maybe<string>) =>
           Either<string, LevelAwarePrerequisites>

/**
 * Convert a raw string to `Right Prerequisites`. If an error occurs during
 * conversion (scheme incorrect), a `Left` containing the error message will be
 * returned.
 */
export const toSpellPrerequisites =
  flip (
         lookupKeyValid (pipe (
                          mstrToMaybe,
                          fmap (toFlatSpellPrerequisites),
                          fromMaybe<Either<string, List<AllRequirementObjects>>>
                            (Right (List.empty))
                        ))
       )
       ("prerequisites") as
         (lookup_univ: (key: string) => Maybe<string>) =>
           Either<string, List<AllRequirementObjects>>
