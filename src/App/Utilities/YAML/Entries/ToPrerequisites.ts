/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { flip, ident } from "../../../../Data/Function"
import { fmapF } from "../../../../Data/Functor"
import { foldr, fromArray, List, map, NonEmptyList, notNull } from "../../../../Data/List"
import { catMaybes, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { insert, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { ProfessionRequireActivatable, RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement"
import { CultureRequirement } from "../../../Models/Wiki/prerequisites/CultureRequirement"
import { RequireIncreasable } from "../../../Models/Wiki/prerequisites/IncreasableRequirement"
import { PactRequirement } from "../../../Models/Wiki/prerequisites/PactRequirement"
import { PrimaryAttributeType, RequirePrimaryAttribute } from "../../../Models/Wiki/prerequisites/PrimaryAttributeRequirement"
import { RaceRequirement } from "../../../Models/Wiki/prerequisites/RaceRequirement"
import { SexRequirement } from "../../../Models/Wiki/prerequisites/SexRequirement"
import { SocialPrerequisite } from "../../../Models/Wiki/prerequisites/SocialPrerequisite"
import { AllRequirementObjects } from "../../../Models/Wiki/wikiTypeHelpers"
import { pipe, pipe_ } from "../../pipe"
import * as RawPrerequisites from "../Schema/Prerequisites/Prerequisites"


export const toSocialPrerequisite : (x : RawPrerequisites.SocialStatusRequirement)
                                  => Record<SocialPrerequisite>
                                  = x => SocialPrerequisite ({
                                           value: x,
                                         })


export const toSexPrerequisite : (x : RawPrerequisites.SexRequirement)
                                  => Record<SexRequirement>
                                  = x => SexRequirement ({
                                           id: Nothing,
                                           value: x,
                                         })


export const toRacePrerequisite : (x : RawPrerequisites.RaceRequirement)
                                => Record<RaceRequirement>
                                = x => RaceRequirement ({
                                         id: Nothing,
                                         active: typeof x === "object" && !Array.isArray (x)
                                                 ? x.active
                                                 : true,
                                         value: Array.isArray (x)
                                                ? fromArray (x)
                                                : typeof x === "object"
                                                ? Array.isArray (x.race)
                                                  ? fromArray (x.race)
                                                  : x.race
                                                : x,
                                       })


export const toCulturePrerequisite : (x : RawPrerequisites.CultureRequirement)
                                   => Record<CultureRequirement>
                                   = x => CultureRequirement ({
                                            id: Nothing,
                                            value: Array.isArray (x)
                                                   ? fromArray (x)
                                                   : x,
                                          })


export const toPrimaryAttrPrerequisite : (x : RawPrerequisites.PrimaryAttributeRequirement)
                                       => Record<RequirePrimaryAttribute>
                                       = x => RequirePrimaryAttribute ({
                                                id: Nothing,
                                                value: x.value,
                                                type: x.type === "magical"
                                                      ? PrimaryAttributeType.Magical
                                                      : PrimaryAttributeType.Blessed,
                                              })


export const toPactPrerequisite : (x : RawPrerequisites.PactRequirement)
                                => Record<PactRequirement>
                                = x => PactRequirement ({
                                         id: Nothing,
                                         category: x.category,
                                         domain: typeof x.domain === "object"
                                                 ? Just (fromArray (x.domain))
                                                 : Maybe (x.domain),
                                         level: Maybe (x.level),
                                       })


export const toActivatablePrerequisite : (x : RawPrerequisites.ActivatableRequirement)
                                       => Record<RequireActivatable>
                                       = x => RequireActivatable ({
                                                id: Array.isArray (x.id)
                                                  ? fromArray (x.id) as NonEmptyList<string>
                                                  : x.id,
                                                active: x.active,
                                                sid: Maybe (
                                                  Array.isArray (x.sid)
                                                  ? fromArray<string | number> (x.sid) as
                                                      NonEmptyList<number>
                                                  : x.sid
                                                ),
                                                sid2: Maybe (x.sid2),
                                                tier: Maybe (x.level),
                                              })


export const toActivatablePrerequisiteP : (x : RawPrerequisites.ActivatableRequirementForProfession)
                                        => Record<ProfessionRequireActivatable>
                                        = x => ProfessionRequireActivatable ({
                                                 id: x.id,
                                                 active: x.active,
                                                 sid: Maybe (x.sid),
                                                 sid2: Maybe (x.sid2),
                                                 tier: Maybe (x.level),
                                               })


export const toActivatablePrerequisitePL : (x : RawPrerequisites.ActivatableRequirementL10n)
                                         => Record<ProfessionRequireActivatable>
                                         = x => ProfessionRequireActivatable ({
                                                  id: x.id,
                                                  active: x.active,
                                                  sid: Maybe (x.sid),
                                                  tier: Maybe (x.level),
                                                })


export const toIncreasablePrerequisite : (x : RawPrerequisites.IncreasableRequirement)
                                       => Record<RequireIncreasable>
                                       = x => RequireIncreasable ({
                                                id: Array.isArray (x.id)
                                                  ? fromArray (x.id) as NonEmptyList<string>
                                                  : x.id,
                                                value: x.value,
                                              })


export const toPrerequisites : (univ : RawPrerequisites.Prerequisites)
                             => List<AllRequirementObjects>
                             = univ => catMaybes (List<Maybe<AllRequirementObjects>> (
                                                   fmapF (Maybe (univ.sexPrerequisite))
                                                         (toSexPrerequisite),
                                                   fmapF (Maybe (univ.racePrerequisite))
                                                         (toRacePrerequisite),
                                                   fmapF (Maybe (univ.culturePrerequisite))
                                                         (toCulturePrerequisite),
                                                   fmapF (Maybe (univ.primaryAttributePrerequisite))
                                                         (toPrimaryAttrPrerequisite),
                                                   fmapF (Maybe (univ.socialStatusPrerequisite))
                                                         (toSocialPrerequisite),
                                                   fmapF (Maybe (univ.pactPrerequisite))
                                                         (toPactPrerequisite),
                                                   ...(univ.activatablePrerequisites === undefined
                                                       ? List (Nothing)
                                                       : pipe_ (
                                                           univ.activatablePrerequisites,
                                                           fromArray,
                                                           map (pipe (
                                                             toActivatablePrerequisite,
                                                             Just
                                                           ))
                                                         )),
                                                   ...(univ.increasablePrerequisites === undefined
                                                       ? List (Nothing)
                                                       : pipe_ (
                                                           univ.increasablePrerequisites,
                                                           fromArray,
                                                           map (pipe (
                                                             toIncreasablePrerequisite,
                                                             Just
                                                           ))
                                                         ))
                                                 ))


type RawLevelOptions = RawPrerequisites.LevelPrerequisites
type PrerequisiteList = List<AllRequirementObjects>
type PrerequisitesByLevel = OrderedMap<number, PrerequisiteList>


export const toLevelPrerequisites : (univ : RawPrerequisites.WithLevelPrerequisites)
                                  => PrerequisitesByLevel
                                  = univ => pipe_ (
                                              OrderedMap.empty as PrerequisitesByLevel,
                                              mp => {
                                                const level1 = toPrerequisites (univ)

                                                if (notNull (level1)) {
                                                  return insert (1)
                                                                <PrerequisiteList> (level1)
                                                                (mp)
                                                }

                                                return mp
                                              },
                                              univ.levelPrerequisites === undefined
                                              ? ident
                                              : pipe_ (
                                                  univ.levelPrerequisites,
                                                  fromArray,
                                                  flip (foldr ((x : RawLevelOptions) => pipe_ (
                                                                x,
                                                                toPrerequisites,
                                                                insert (x.level)
                                                              )))
                                                )
                                            )
