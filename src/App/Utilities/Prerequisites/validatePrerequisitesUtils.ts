import { not } from "../../../Data/Bool";
import { equals } from "../../../Data/Eq";
import { flip, on, thrush } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { compare } from "../../../Data/Int";
import { set } from "../../../Data/Lens";
import { all, any, concat, elem, elemF, foldl, isList, List, map, sortBy } from "../../../Data/List";
import { and, bindF, catMaybes, ensure, fromJust, isJust, isNothing, Just, Maybe, maybe, maybeToList, Nothing, or } from "../../../Data/Maybe";
import { lookupF, OrderedMap, toList } from "../../../Data/OrderedMap";
import { fst, Pair, snd } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import { IdPrefixes } from "../../Constants/IdPrefixes";
import { ActivatableDependent, isActivatableDependent, isMaybeActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent, isMaybeActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { DependencyObject } from "../../Models/ActiveEntries/DependencyObject";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableDependency, Dependent, ExtendedActivatableDependent, Sex } from "../../Models/Hero/heroTypeHelpers";
import { Pact } from "../../Models/Hero/Pact";
import { Culture } from "../../Models/Wiki/Culture";
import { RequireActivatable, RequireActivatableL } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { CultureRequirement, isCultureRequirement } from "../../Models/Wiki/prerequisites/CultureRequirement";
import { isRequiringIncreasable, RequireIncreasable, RequireIncreasableL } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { isPactRequirement, PactRequirement } from "../../Models/Wiki/prerequisites/PactRequirement";
import { isPrimaryAttributeRequirement, RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { isRaceRequirement, RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement";
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
import { dec, gt, gte, lte, min } from "../mathUtils";
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
    const value = RaceRequirement.AL.value (req)

    if (isList (value)) {
      return any (pipe (
                         prefixId (IdPrefixes.RACES),
                         equals (current_race_id)
                       ))
                 (value)
    }

    return prefixId (IdPrefixes.RACES) (value) === current_race_id
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
  or (fmap (lte (Pact.AL.level (state))) (PactRequirement.AL.level (req)))

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
               Maybe.elem (RequirePrimaryAttribute.AL.value (req))
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

      const maybeInstance =
        getHeroStateItem (state) (id) as Maybe<ExtendedActivatableDependent>

      if (isMaybeActivatableDependent (maybeInstance)) {
        const instance = Maybe.fromJust (maybeInstance)
        const activeSelections = getActiveSelectionsMaybe (maybeInstance)

        const maybeSid = RAA.sid (req)
        const maybeLevel = RAA.tier (req)

        const sidValid = fmap (isActiveSelection (activeSelections) (req)) (maybeSid)
        const levelValid = fmap (flip (isNeededLevelGiven) (instance)) (maybeLevel)

        if (isJust (maybeSid) || isJust (maybeLevel)) {
          return and (sidValid) && and (levelValid)
        }

        return isActive (instance) === RAA.active (req)
      }

      if (isMaybeActivatableSkillDependent (maybeInstance)) {
        return ActivatableSkillDependent.AL.active (fromJust (maybeInstance))
          === RAA.active (req)
      }

      return false
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
      : isSexRequirement (req)
      ? isSexValid (sex (hero)) (req)
      : isRaceRequirement (req)
      ? or (fmapF (race (hero)) (flip (isRaceValid) (req)))
      : isCultureRequirement (req)
      ? or (fmapF (culture (hero)) (flip (isCultureValid) (req)))
      : isPactRequirement (req)
      ? isPactValid (pact (hero)) (req)
      : isPrimaryAttributeRequirement (req)
      ? isPrimaryAttributeValid (hero) (req)
      : isRequiringIncreasable (req)
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
 */
const isSkipping =
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
    foldl ((max: Maybe<number>) => (dep: ActivatableDependency) =>
            // If `dep` prohibits higher level
            typeof dep === "object"
            && Maybe.elem (false) (DependencyObject.AL.active (dep))
              ? maybe<Maybe<number>>
                (max)
                (pipe (dec, level => Just (maybe<number> (level) (min (level)) (max))))
                (DependencyObject.AL.tier (dep))
              : max)
          (pipe_ (
            requirements,
            toList,
            sortBy (on (compare) (fst)),
            foldl ((max: Maybe<number>) => (entry: Pair<number, List<AllRequirements>>) =>
                    !isSkipping (entry) (max)
                    || validatePrerequisites (wiki) (state) (snd (entry)) (sourceId)
                      ? Just (fst (entry))
                      : max)
                  (Nothing)
          ))
          (dependencies)

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
                                     : isRaceRequirement (req)
                                     ? isRaceValid (current_race_id) (req)
                                     : isCultureRequirement (req)
                                     ? isCultureValid (current_culture_id) (req)
                                     : false
                                   )
                                   (prerequisites)
