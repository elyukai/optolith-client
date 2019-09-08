import { not } from "../../../Data/Bool";
import { equals } from "../../../Data/Eq";
import { flip, on, thrush } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { set } from "../../../Data/Lens";
import { all, any, concat, elem, elemF, foldl, isList, List, map, sortBy } from "../../../Data/List";
import { and, bind, bindF, catMaybes, ensure, fromJust, fromMaybe, isJust, isNothing, Just, Maybe, maybe, maybeToList, Nothing, or } from "../../../Data/Maybe";
import { compare, dec, gt, gte, lte, min } from "../../../Data/Num";
import { lookupF, OrderedMap, toList } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { fst, Pair, snd } from "../../../Data/Tuple";
import { IdPrefixes } from "../../Constants/IdPrefixes";
import { ActivatableDependent, isActivatableDependent, isExtendedActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { DependencyObject } from "../../Models/ActiveEntries/DependencyObject";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableDependency, Dependent, Sex } from "../../Models/Hero/heroTypeHelpers";
import { Pact } from "../../Models/Hero/Pact";
import { Culture } from "../../Models/Wiki/Culture";
import { RequireActivatable, RequireActivatableL } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement, isCultureRequirement } from "../../Models/Wiki/prerequisites/CultureRequirement";
import { RequireIncreasable, RequireIncreasableL } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { PactRequirement } from "../../Models/Wiki/prerequisites/PactRequirement";
import { RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement";
import { isSexRequirement, SexRequirement } from "../../Models/Wiki/prerequisites/SexRequirement";
import { Profession } from "../../Models/Wiki/Profession";
import { Race } from "../../Models/Wiki/Race";
import { Skill } from "../../Models/Wiki/Skill";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { AllRequirements, ProfessionDependency, SID } from "../../Models/Wiki/wikiTypeHelpers";
import { isActive } from "../Activatable/isActive";
import { isPactFromStateValid } from "../Activatable/pactUtils";
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils";
import { getHeroStateItem } from "../heroStateUtils";
import { prefixId } from "../IDUtils";
import { pipe, pipe_ } from "../pipe";
import { getPrimaryAttributeId } from "../primaryAttributeUtils";
import { getAllWikiEntriesByGroup } from "../WikiUtils";

type Validator = (wiki: WikiModelRecord) =>
                 (state: HeroModelRecord) =>
                 (req: AllRequirements) =>
                 (sourceId: string) => boolean

const { races, cultures, professions, skills } = WikiModel.AL
const { race, culture, profession, specialAbilities, attributes, sex, pact } = HeroModel.AL

const RIA = RequireIncreasable.A
const RAA = RequireActivatable.A
const DOA = DependencyObject.A
const SDAL = SkillDependent.AL

const getAllRaceEntries =
  (wiki: WikiModelRecord) =>
    pipe (
      race,
      bindF (lookupF (races (wiki))),
      fmap (
        selectedRace => concat (
          List (
            Race.AL.stronglyRecommendedAdvantages (selectedRace),
            Race.AL.automaticAdvantages (selectedRace),
            Race.AL.stronglyRecommendedAdvantages (selectedRace),
            Race.AL.stronglyRecommendedDisadvantages (selectedRace),
            Race.AL.commonAdvantages (selectedRace),
            Race.AL.commonDisadvantages (selectedRace)
          )
        )
      )
    )

const getAllCultureEntries =
  (wiki: WikiModelRecord) =>
    pipe (
      culture,
      bindF (lookupF (cultures (wiki))),
      fmap (
        selectedCulture => concat (
          List (
            Culture.AL.commonAdvantages (selectedCulture),
            Culture.AL.commonDisadvantages (selectedCulture)
          )
        )
      )
    )

const getAllProfessionEntries =
  (wiki: WikiModelRecord) =>
    pipe (
      profession,
      bindF (lookupF (professions (wiki))),
      fmap (
        selectedProfession => concat (
          List (
            Profession.AL.suggestedAdvantages (selectedProfession),
            Profession.AL.suggestedDisadvantages (selectedProfession)
          )
        )
      )
    )

const isRCPValid =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (sourceId: string): boolean =>
    any (elem (sourceId))
        (catMaybes (
          List (
            getAllRaceEntries (wiki) (state),
            getAllCultureEntries (wiki) (state),
            getAllProfessionEntries (wiki) (state)
          )
        ))

const isSexValid =
  (currentSex: "m" | "f") => (req: Record<SexRequirement>): boolean =>
    equals (currentSex) (SexRequirement.AL.value (req))

const isRaceValid =
  (current_race_id: string) =>
  (req: Record<RaceRequirement>): boolean => {
    const value = RaceRequirement.A.value (req)
    const active = RaceRequirement.A.active (req)

    if (isList (value)) {
      return any (pipe (
                         prefixId (IdPrefixes.RACES),
                         equals (current_race_id)
                       ))
                 (value) === active
    }

    return prefixId (IdPrefixes.RACES) (value) === current_race_id === active
  }

const isCultureValid =
  (current_culture_id: string) =>
  (req: Record<CultureRequirement>): boolean => {
    const value = CultureRequirement.AL.value (req)

    if (isList (value)) {
      return any (pipe (
                         prefixId (IdPrefixes.CULTURES),
                         equals (current_culture_id)
                       ))
                 (value)
    }

    return prefixId (IdPrefixes.CULTURES) (value) === current_culture_id
  }

const hasSamePactCategory =
  (state: Record<Pact>) =>
    pipe (
      PactRequirement.AL.category,
      equals (Pact.AL.category (state))
    )

const hasNeededPactType =
  (state: Record<Pact>) => (req: Record<PactRequirement>) => {
    switch (PactRequirement.AL.category (req)) {
      case 1:
        return equals (Pact.AL.type (state)) (3)
      default:
        return true
    }
  }

const hasNeededPactDomain =
  (state: Record<Pact>) => (req: Record<PactRequirement>) => {
    const maybeReqDomain = PactRequirement.AL.domain (req)
    const stateDomain = Pact.AL.domain (state)

    if (isNothing (maybeReqDomain)) {
      return true
    }

    if (typeof stateDomain === "string") {
      return false
    }

    const reqDomain = fromJust (maybeReqDomain)

    if (isList (reqDomain)) {
      return elem (stateDomain) (reqDomain)
    }

    return reqDomain === stateDomain
  }

const hasNeededPactLevel = (state: Record<Pact>) => (req: Record<PactRequirement>) =>
  // Fulfills the level requirement
  or (fmap (lte (Pact.A.level (state))) (PactRequirement.A.level (req)))
  // Its a lesser Pact and the needed Pact-Level is "1"
  || (
    or (fmap (lte (1)) (PactRequirement.A.level (req)))
    && (Pact.A.level (state) === 0)
  )

const isPactValid =
  (maybePact: Maybe<Record<Pact>>) => (req: Record<PactRequirement>): boolean =>
    or (fmap<Record<Pact>, boolean> (currentPact => isPactFromStateValid (currentPact)
                                           && hasSamePactCategory (currentPact) (req)
                                           && hasNeededPactType (currentPact) (req)
                                           && hasNeededPactDomain (currentPact) (req)
                                           && hasNeededPactLevel (currentPact) (req))
                                         (maybePact))

const isPrimaryAttributeValid =
  (state: HeroModelRecord) => (req: Record<RequirePrimaryAttribute>): boolean =>
    or (fmap (pipe (
               lookupF (attributes (state)),
               fmap (AttributeDependent.AL.value),
               fromMaybe (8),
               gte (RequirePrimaryAttribute.AL.value (req))
             ))
             (getPrimaryAttributeId (specialAbilities (state))
                                    (RequirePrimaryAttribute.AL.type (req))))

const isIncreasableValid =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (sourceId: string) =>
  (req: Record<RequireIncreasable>) =>
  (objectValidator: Validator): boolean => {
    const id = RequireIncreasable.AL.id (req)

    if (isList (id)) {
      return any (pipe (
                   set (RequireIncreasableL.id),
                   thrush (req),
                   objectValidator (wiki) (state),
                   thrush (sourceId)
                 ))
                 (id)
    }

    return or (fmap ((obj: Dependent) =>
                      !ActivatableDependent.is (obj) && SDAL.value (obj) >= RIA.value (req))
                    (getHeroStateItem (state) (id)))
  }

/**
 * Check if one of the passed selection ids is part of the currently active
 * selections and if that matches the requirement (`active`).
 */
const isOneOfListActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<RequireActivatable>) =>
  (sid: List<number>): boolean =>
    Maybe.elem (RAA.active (req))
               (fmap<List<string | number>, boolean> (pipe (List.elemF, any, thrush (sid)))
                                                     (activeSelections))

/**
 * Check if the passed selection id is part of the currently active selections
 * and if that matches the requirement (`active`).
 */
const isSingleActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<RequireActivatable>) =>
  (sid: string | number): boolean =>
    Maybe.elem (RAA.active (req))
               (fmap (elem (sid)) (activeSelections))

const isActiveSelection =
  (activeSelections: Maybe<List<string | number>>) =>
  (req: Record<RequireActivatable>) =>
  (sid: SID): boolean =>
    isList (sid)
      ? isOneOfListActiveSelection (activeSelections) (req) (sid)
      : isSingleActiveSelection (activeSelections) (req) (sid)

/**
 * Checks if the passed required level is fulfilled by the passed instance.
 */
const isNeededLevelGiven =
  (level: number) =>
    pipe (
      ActivatableDependent.AL.active,
      any (pipe (ActiveObject.AL.tier, fmap (gte (level)), or))
    )

const isActivatableValid =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (sourceId: string) =>
  (req: Record<RequireActivatable>) =>
  (objectValidator: Validator): boolean => {
    const id = RAA.id (req)

    if (isList (id)) {
      return any (pipe (
                   set (RequireActivatableL.id),
                   thrush (req),
                   objectValidator (wiki) (state),
                   thrush (sourceId)
                 ))
                 (id)
    }
    else {
      const sid = RAA.sid (req)

      if (Maybe.elem<SID> ("sel") (sid)) {
        return true
      }

      if (Maybe.elem<SID> ("GR") (sid)) {
        return and (pipe (
                           bindF<Dependent, Record<ActivatableDependent>>
                             (ensure (isActivatableDependent)),
                           bindF<Record<ActivatableDependent>, boolean>
                             (target => {
                               const arr =
                                 map (Skill.AL.id)
                                     (getAllWikiEntriesByGroup
                                       (skills (wiki))
                                       (maybeToList (
                                         RAA.sid2 (req) as Maybe<number>
                                       )))

                               return fmap (all (pipe (elemF<string | number> (arr), not)))
                                           (getActiveSelectionsMaybe (Just (target)))
                             })
                         )
                         (getHeroStateItem (state) (id)))
      }

      const mhero_entry = bind (getHeroStateItem (state) (id))
                               (ensure (isExtendedActivatableDependent))

      if (Maybe.any (ActivatableDependent.is) (mhero_entry)) {
        const hero_entry = fromJust (mhero_entry)
        const activeSelections = getActiveSelectionsMaybe (mhero_entry)

        const maybeSid = RAA.sid (req)
        const maybeLevel = RAA.tier (req)

        const sidValid = fmap (isActiveSelection (activeSelections) (req)) (maybeSid)
        const levelValid = fmap (flip (isNeededLevelGiven) (hero_entry)) (maybeLevel)

        if (isJust (maybeSid) || isJust (maybeLevel)) {
          return and (sidValid) && and (levelValid)
        }

        return isActive (hero_entry) === RAA.active (req)
      }

      if (Maybe.any (ActivatableSkillDependent.is) (mhero_entry)) {
        return ActivatableSkillDependent.AL.active (fromJust (mhero_entry))
          === RAA.active (req)
      }

      return !RAA.active (req)
    }
  }

/**
 * Checks if the requirement is fulfilled.
 * @param state The current hero data.
 * @param req A requirement object.
 * @param sourceId The id of the entry the requirement object belongs to.
 * @param pact A valid `Pact` object or `undefined`.
 */
export const validateObject =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (req: AllRequirements) =>
  (sourceId: string): boolean =>
    req === "RCP"
      ? isRCPValid (wiki) (hero) (sourceId)
      : SexRequirement.is (req)
      ? isSexValid (sex (hero)) (req)
      : RaceRequirement.is (req)
      ? or (fmapF (race (hero)) (flip (isRaceValid) (req)))
      : CultureRequirement.is (req)
      ? or (fmapF (culture (hero)) (flip (isCultureValid) (req)))
      : PactRequirement.is (req)
      ? isPactValid (pact (hero)) (req)
      : RequirePrimaryAttribute.is (req)
      ? isPrimaryAttributeValid (hero) (req)
      : RequireIncreasable.is (req)
      ? isIncreasableValid (wiki) (hero) (sourceId) (req) (validateObject)
      : isActivatableValid (wiki) (hero) (sourceId) (req) (validateObject)

/**
 * Checks if all requirements are fulfilled.
 * @param state The current hero data.
 * @param prerequisites An array of requirement objects.
 * @param sourceId The id of the entry the requirement objects belong to.
 * @param pact A valid `Pact` object or `undefined`.
 */
export const validatePrerequisites =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (prerequisites: List<AllRequirements>) =>
  (sourceId: string): boolean =>
    all (pipe (validateObject (wiki) (state), thrush (sourceId)))
        (prerequisites)

/**
 * Returns if the current index can be skipped because there is already a lower
 * level which prerequisites are not met.
 *
 * This is for performance reasons to not check the prerequisites of higher levels.
 */
const skipLevelCheck =
  (current_req: Pair<number, List<AllRequirements>>) =>
  (mmax: Maybe<number>) =>
    isJust (mmax) && pipe_ (current_req, fst, gt (fromJust (mmax)))

/**
 * Get maximum valid level.
 * @param state The current hero data.
 * @param requirements A Map of tier prereqisite arrays.
 * @param sourceId The id of the entry the requirement objects belong to.
 */
export const validateLevel =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (requirements: OrderedMap<number, List<AllRequirements>>) =>
  (dependencies: List<ActivatableDependency>) =>
  (sourceId: string): Maybe<number> =>
    pipe_ (
      requirements,
      toList,
      sortBy (on (compare) (fst)),
      // first check the prerequisites:
      foldl ((max: Maybe<number>) => (entry: Pair<number, List<AllRequirements>>) =>
              // if `max` is lower than the current level (from `entry`), just
              // skip the prerequisite validation
              !skipLevelCheck (entry) (max)
              // otherwise, validate them
              && !validatePrerequisites (wiki) (state) (snd (entry)) (sourceId)
                // if *not* valid, set the max to be lower than the actual
                // current level (because it must not be reached)
                ? Just (fst (entry) - 1)
                // otherwise, just pass the previous max value
                : max)
            (Nothing),
      // then, check the dependencies
      flip (foldl ((max: Maybe<number>) => (dep: ActivatableDependency) =>
                    // If `dep` prohibits higher level:
                    // - it can only be contained in a record
                    Record.isRecord (dep)
                    // - and it must be *prohibited*, so `active` must be `false`
                    && Maybe.elem (false) (DOA.active (dep))
                      ? pipe_ (
                          dep,
                          // get the current prohibited level
                          DOA.tier,
                                // - if its a Nothing, do nothing
                          maybe (max)
                                // - otherwise decrease the level by one (the
                                // actual level must not be reached) and then
                                // take the lower one, if both the current and
                                // the previous are Justs, otherwise the
                                // current.
                                (pipe (dec, level => Just (maybe (level) (min (level)) (max))))
                        )
                      // otherwise, dont do anything
                      : max))
           (dependencies)
    )

/**
 * Checks if all profession prerequisites are fulfilled.
 * @param prerequisites An array of prerequisite objects.
 */
export const validateProfession =
  (prerequisites: List<ProfessionDependency>) =>
  (current_sex: Sex) =>
  (current_race_id: string) =>
  (current_culture_id: string): boolean =>
    all<ProfessionDependency> (req =>
                                isSexRequirement (req)
                                ? isSexValid (current_sex) (req)
                                : RaceRequirement.is (req)
                                ? isRaceValid (current_race_id) (req)
                                : isCultureRequirement (req)
                                ? isCultureValid (current_culture_id) (req)
                                : false)
                              (prerequisites)
