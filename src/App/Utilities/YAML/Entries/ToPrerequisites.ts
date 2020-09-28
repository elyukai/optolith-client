/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { PrerequisiteIndexReplacement } from "../../../../../app/Database/Schema/Advantages/Advantages.l10n"
import * as RawPrerequisites from "../../../../../app/Database/Schema/Prerequisites/Prerequisites"
import { flip, ident } from "../../../../Data/Function"
import { fmapF } from "../../../../Data/Functor"
import { flength, fnull, foldr, fromArray, head, List, map, NonEmptyList, notNull } from "../../../../Data/List"
import { catMaybes, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { assocs, insert, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { fst, snd } from "../../../../Data/Tuple"
import { OverridePrerequisite } from "../../../Models/Static_Prerequisites.gen"
import { ProfessionRequireActivatable, RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement"
import { CultureRequirement } from "../../../Models/Wiki/prerequisites/CultureRequirement"
import { RequireIncreasable } from "../../../Models/Wiki/prerequisites/IncreasableRequirement"
import { PactRequirement } from "../../../Models/Wiki/prerequisites/PactRequirement"
import { PrimaryAttributeType, RequirePrimaryAttribute } from "../../../Models/Wiki/prerequisites/PrimaryAttributeRequirement"
import { ProfessionRequireIncreasable } from "../../../Models/Wiki/prerequisites/ProfessionRequireIncreasable"
import { RaceRequirement } from "../../../Models/Wiki/prerequisites/RaceRequirement"
import { SexRequirement } from "../../../Models/Wiki/prerequisites/SexRequirement"
import { SocialPrerequisite } from "../../../Models/Wiki/prerequisites/SocialPrerequisite"
import { AllRequirementObjects, PrerequisitesIndex } from "../../../Models/Wiki/wikiTypeHelpers"
import { pipe, pipe_ } from "../../pipe"


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


export const toIncreasablePrerequisiteP : (x : RawPrerequisites.IncreasableRequirementForProfession)
                                        => Record<ProfessionRequireIncreasable>
                                        = x => ProfessionRequireIncreasable ({
                                                 id: x.id,
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
                                  => PrerequisitesByLevel | List<AllRequirementObjects>
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
                                                ),
                                              mp => pipe_ (
                                                      mp,
                                                      assocs,
                                                      acs => fnull (acs)
                                                             ? List ()
                                                             : flength (acs) === 1
                                                               && fst (head (acs)) === 1
                                                             ? snd (head (acs))
                                                             : mp
                                                    )
                                            )


const createReplaceWith = (value : string) => ({ tag: "ReplaceWith", value }) as const


const combineSingleIndex = (univ ?: boolean, l10n ?: string) : OverridePrerequisite | undefined =>
                             typeof l10n === "string"
                             ? createReplaceWith (l10n)
                             : univ === true
                             ? "Hide" as const
                             : undefined


const combinedIndexMap = (univ ?: number[], l10n ?: PrerequisiteIndexReplacement[]) =>
  pipe_ (
    OrderedMap.empty as OrderedMap<number, OverridePrerequisite>,
    univ === undefined
    ? ident
    : flip (foldr ((k : number) => insert (k) <OverridePrerequisite> ("Hide")))
           (fromArray (univ)),
    l10n === undefined
    ? ident
    : flip (foldr ((x : PrerequisiteIndexReplacement) =>
                    insert (x.index) <OverridePrerequisite> (createReplaceWith (x.replacement))))
          (fromArray (l10n))
  )


const getPrerequisitesIndexLevel =
  (univ : RawPrerequisites.HidePrerequisites, l10n : RawPrerequisites.ReplacePrerequisites) => ({
    sex: combineSingleIndex (univ.sexPrerequisite, l10n.sexPrerequisite),
    race: combineSingleIndex (univ.racePrerequisite, l10n.racePrerequisite),
    culture: combineSingleIndex (univ.culturePrerequisite, l10n.culturePrerequisite),
    pact: combineSingleIndex (univ.pactPrerequisite, l10n.pactPrerequisite),
    social: combineSingleIndex (univ.socialStatusPrerequisite, l10n.socialStatusPrerequisite),
    primaryAttribute: combineSingleIndex (
                        univ.primaryAttributePrerequisite,
                        l10n.primaryAttributePrerequisite
                      ),
    activatable: combinedIndexMap (univ.activatablePrerequisites, l10n.activatablePrerequisites),
    activatableMultiEntry: OrderedMap.empty,
    activatableMultiSelect: OrderedMap.empty,
    increasable: combinedIndexMap (univ.activatablePrerequisites, l10n.activatablePrerequisites),
    increasableMultiEntry: OrderedMap.empty,
  })


type PrereqIndexPair = readonly [
  RawPrerequisites.HidePrerequisites,
  RawPrerequisites.ReplacePrerequisites
]


const getPrerequisitesIndexForLevels = (
  univ ?: RawPrerequisites.HidePrerequisitesAtLevel[],
  l10n ?: RawPrerequisites.ReplacePrerequisitesAtLevel[]
) => {
    const combined = (l10n ?? [])
      .reduce<ReadonlyMap<number, PrereqIndexPair>> (
        (mp, { level, hide }) => {
          const from_map = mp.get (level)

          if (from_map === undefined) {
            return new Map ([
              ...mp,
              [ level, [ {}, hide ] as PrereqIndexPair ] as const,
            ])
          }
          else {
            return new Map ([ ...mp, [ level, [ from_map[0], hide ] as const ] ])
          }
        },
        new Map (
          (univ ?? [])
            .map (e => [ e.level, [ e, {} ] as PrereqIndexPair ] as const)
        )
      )

    const arr = [ ...combined ]

    const res_arr = arr.map (
      ([ level, [ univ_e, l10n_e ] ]) =>
        [ level, getPrerequisitesIndexLevel (univ_e, l10n_e) ] as const
    )

    return OrderedMap.fromArray (res_arr)
  }


export const getPrerequisitesIndex = (
  univ : RawPrerequisites.HidePrerequisitesWithLevel | undefined,
  l10n : RawPrerequisites.ReplacePrerequisitesWithLevel | undefined
) : PrerequisitesIndex => ({
    ...getPrerequisitesIndexLevel (univ ?? {}, l10n ?? {}),
    levels: getPrerequisitesIndexForLevels (
              univ?.levels,
              l10n?.levels
            ),
  })
