module IM = Ley_IntMap;
module I = Ley_Int;
module O = Ley_Option;

// const hasRequiredMinimumLevel =
//   (min_level: Maybe<number>) => (max_level: Maybe<number>): boolean =>
//     isJust (max_level) && isJust (min_level)
//
// const isRequiredByOthers =
//   (current_active: Record<ActiveObjectWithId>) =>
//   (state_entry: Record<ActivatableDependent>): boolean =>
//     pipe (
//            ADA.dependencies,
//            any (
//              ifElse<ActivatableDependency, boolean>
//                (isBoolean)
//                (e => e && flength (ADA.active (state_entry)) === 1)
//                (e => (
//                    equals (DOA.sid (e)) (AOWIA.sid (current_active))
//                    && equals (AOWIA.sid2 (current_active)) (DOA.sid2 (e))
//                    && equals (AOWIA.tier (current_active)) (DOA.tier (e))
//                  )
//                  || (
//                    isJust (DOA.tier (e))
//                    && isJust (AOWIA.tier (current_active))
//                    && or (fmap (equals (Maybe.gte (DOA.tier (e))
//                                                   (AOWIA.tier (current_active))))
//                                (DOA.active (e)))
//                  ))
//            )
//          )
//          (state_entry)
//
// /**
//  * Checks if you can somehow remove an ActiveObject from the given entry.
//  */
// const isRemovalDisabledEntrySpecific =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
//   (wiki_entry: Activatable) =>
//   (hero_entry: Record<ActivatableDependent>) =>
//
//   // tslint:disable-next-line: cyclomatic-complexity
//   (active: Record<ActiveObjectWithId>): boolean => {
//     const mstart_el =
//       lookupF (SDA.experienceLevels (wiki))
//               (HA.experienceLevel (hero))
//
//     if (isMagicalTradId (AAL.id (wiki_entry))) {
//       // All active tradition entries
//       const traditions =
//         getMagicalTraditionsHeroEntries (HA.specialAbilities (hero))
//
//       const multiple_traditions = flength (traditions) > 1
//
//       // multiple traditions are currently not supported and there must be no
//       // active spell or cantrip
//       return multiple_traditions
//         || countActiveSkillEntries ("spells") (hero) > 0
//         || size (HA.cantrips (hero)) > 0
//     }
//     else if (isBlessedTradId (AAL.id (wiki_entry))) {
//       // there must be no active liturgical chant or blessing
//       return countActiveSkillEntries ("liturgicalChants") (hero) > 0
//         || size (HA.blessings (hero)) > 0
//     }
//
//     switch (AAL.id (wiki_entry)) {
//       case AdvantageId.exceptionalSkill: {
//         // value of target skill
//         const mvalue =
//           pipe_ (
//             active,
//             AOWIA.sid,
//             misStringM,
//             bindF (lookupF (HA.skills (hero))),
//             fmap (SkillDependent.AL.value)
//           )
//
//         // amount of active Exceptional Skill advantages for the same skill
//         const counter = countWith (pipe (AOA.sid, equals (AOWIA.sid (active))))
//                                   (ADA.active (hero_entry))
//
//         // if the maximum value is reached removal needs to be disabled
//         return or (liftM2 (gte)
//                           (mvalue)
//                           (fmap (pipe (ELA.maxSkillRating, add (counter)))
//                                 (mstart_el)))
//       }
//
//       case AdvantageId.exceptionalCombatTechnique: {
//         // value of target combat technique
//         const value =
//           pipe_ (
//             active,
//             AOWIA.sid,
//             misStringM,
//             bindF (lookupF (HeroModel.A.combatTechniques (hero))),
//             maybe (6) (SkillDependent.A.value)
//           )
//
//         // if the maximum value is reached removal needs to be disabled
//         return maybe (true) (pipe (ELA.maxCombatTechniqueRating, inc, lte (value))) (mstart_el)
//       }
//
//       case SpecialAbilityId.literacy: {
//         if (sel1 (matching_script_and_lang_related)) {
//           const active_matching_scripts = sel2 (matching_script_and_lang_related)
//
//           return flength (active_matching_scripts) === 1
//             && pipe_ (
//               AOWIA.sid (active),
//               misNumberM,
//               maybe (false) (elemF (active_matching_scripts))
//             )
//         }
//         else {
//           return false
//         }
//       }
//
//       case SpecialAbilityId.language: {
//         if (sel1 (matching_script_and_lang_related)) {
//           const active_matching_languages = sel3 (matching_script_and_lang_related)
//
//           return flength (active_matching_languages) === 1
//             && pipe_ (
//               AOWIA.sid (active),
//               misNumberM,
//               maybe (false) (elemF (active_matching_languages))
//             )
//         }
//         else {
//           return false
//         }
//       }
//
//       case SpecialAbilityId.propertyKnowledge:
//         return pipe_ (
//           active,
//           AOWIA.sid,
//           misNumberM,
//           maybe (false)
//                 (prop_id => OrderedMap.any ((spell: Record<ActivatableSkillDependent>) =>
//                                              ASDA.value (spell) > 14
//                                              && pipe_ (
//                                                   spell,
//                                                   ASDA.id,
//                                                   lookupF (SDA.spells (wiki)),
//                                                   maybe (true)
//                                                         (pipe (SA.property, equals (prop_id)))
//                                                 ))
//                                            (HA.spells (hero)))
//         )
//
//       case SpecialAbilityId.aspectKnowledge: {
//         const all_aspcs = getActiveSelections (hero_entry)
//
//         return pipe_ (
//           active,
//           AOWIA.sid,
//           misNumberM,
//           maybe (false)
//                 (aspc_id => {
//                   const other_aspcs = sdelete<string | number> (aspc_id) (all_aspcs)
//
//                   return OrderedMap.any ((chant: Record<ActivatableSkillDependent>) =>
//                                           ASDA.value (chant) > 14
//                                           && pipe_ (
//                                                chant,
//                                                ASDA.id,
//                                                lookupF (SDA.liturgicalChants (wiki)),
//                                                maybe (true)
//                                                      (pipe (
//                                                        LCA.aspects,
//                                                        aspcs => elem (aspc_id) (aspcs)
//                                                                 && all (notElemF (other_aspcs))
//                                                                        (aspcs)
//                                                      ))
//                                              ))
//                                         (HA.liturgicalChants (hero))
//                 })
//         )
//       }
//
//       case SpecialAbilityId.combatStyleCombination: {
//         const armedStyleActive = countActiveGroupEntries (wiki)
//                                                          (hero)
//                                                          (SpecialAbilityGroup.CombatStylesArmed)
//
//         const unarmedStyleActive = countActiveGroupEntries (wiki)
//                                                            (hero)
//                                                            (SpecialAbilityGroup.CombatStylesUnarmed)
//
//         const totalActive = armedStyleActive + unarmedStyleActive
//
//         // default is 1 per group (armed/unarmed), but with this SA 1 more in
//         // one group: maximum of 3, but max 2 per group. If max is reached, this
//         // SA cannot be removed
//         return totalActive >= 3
//           || armedStyleActive >= 2
//           || unarmedStyleActive >= 2
//       }
//
//       case SpecialAbilityId.magicStyleCombination: {
//         const totalActive = countActiveGroupEntries (wiki) (hero) (13)
//
//         // default is 1, but with this SA its 2. If it's 2 this SA is neccessary
//         // and cannot be removed
//         return totalActive >= 2
//       }
//
//       // Extended Blessed Special Abilities that allow to learn liturgical
//       // chants of different traditions
//       case SpecialAbilityId.zugvoegel:
//       case SpecialAbilityId.jaegerinnenDerWeissenMaid:
//       case SpecialAbilityId.anhaengerDesGueldenen: {
//         const mblessed_tradition =
//           getBlessedTraditionFromWiki (SDA.specialAbilities (wiki))
//                                       (HA.specialAbilities (hero))
//
//         // Wiki entries for all active liturgical chants
//         const active_chants =
//           pipe_ (
//             hero,
//             HA.liturgicalChants,
//             elems,
//             filter<Record<ActivatableSkillDependent>> (ASDA.active),
//             mapByIdKeyMap (SDA.liturgicalChants (wiki))
//           )
//
//         // If there are chants active that do not belong to the own tradition
//         const mactive_unfamiliar_chants =
//           fmap (pipe (isOwnTradition, notP, any, thrush (active_chants)))
//                (mblessed_tradition)
//
//         return or (mactive_unfamiliar_chants)
//       }
//
//       default:
//         return false
//     }
//   }
//
// const isEntryDisabledByDependencies =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (wiki_entry: Activatable) =>
//   (hero_entry: Record<ActivatableDependent>) =>
//   (active: Record<ActiveObjectWithId>) =>
//
//     // if there is any dependency that disables the possibility to remove
//     // the entry
//     any ((dep: ActivatableDependency) => {
//       // If there is a top-level dependency for the whole entry,
//       // it must be `true` because `false` would have prevented
//       // the entry from being added.
//       if (isBoolean (dep)) {
//         return true
//       }
//
//       // A Just if the depedency exists because of a list of ids
//       // in a prerequiste. Contains the source id of the object
//       // where the prerequisite is from.
//       const current_origin = DOA.origin (dep)
//
//       if (isJust (current_origin)) {
//         return pipe_ (
//           fromJust (current_origin),
//           getWikiEntry (wiki),
//           bindF<EntryWithCategory, Activatable>
//             (ensure (isActivatableWikiEntry)),
//
//           // Get flat prerequisites for origin entry
//           fmap (origin_entry =>
//             flattenPrerequisites (Nothing)
//                                  (alt (AAL.tiers (origin_entry)) (Just (1)))
//                                  (AAL.prerequisites (origin_entry))),
//
//           // Get the prerequisite that matches this entry
//           // to get all other options from list
//           bindF (find ((req): req is PrerequisitesWithIds => {
//                         if (typeof req === "string" || SocialPrerequisite.is (req)) {
//                           return false
//                         }
//
//                         const current_id = RAAL.id (req)
//
//                         // the id must be a list of ids
//                         // because otherwise no options in
//                         // terms of fulfilling the
//                         // prerequisite would be possible
//                         return isList (current_id)
//
//                           // check if the current entry's
//                           // id is actually a member of
//                           // the prerequisite
//                           && elem (AAL.id (wiki_entry))
//                                   (current_id)
//                       })),
//
//           // Check if there are other entries that would
//           // match the prerequisite so that this entry
//           // could be removed
//           fmap (req =>
//            !any ((x: string) =>
//                   validateObject (wiki)
//                                   (hero)
//                                   (setPrerequisiteId (x) (req))
//                                   (AAL.id (wiki_entry)))
//                 (sdelete (AAL.id (wiki_entry))
//                          (RAAL.id (req) as List<string>))),
//           or
//         )
//       }
//
//       // sid of the current dependency
//       const current_dep_sid = DOA.sid (dep)
//       const mcurrent_sid = AOWIA.sid (active)
//
//       if (Maybe.any (isList) (current_dep_sid) && isJust (mcurrent_sid)) {
//         // list of possible sids to fulfill the prerequisite
//         // and thus to fulfill the dependency
//         const xs = fromJust (current_dep_sid)
//         const current_sid = fromJust (mcurrent_sid)
//
//         if (notElem (current_sid) (xs)) {
//           return false
//         }
//
//         const current_active_selections = getActiveSelections (hero_entry)
//
//         // there must be at least two active sids being contained
//         // in the list of possible sids so that one of them can
//         // be removed
//         const multiple_valid_for_dependency =
//           flength (intersect (current_active_selections) (xs)) > 1
//
//         // must be negated because it must return `false` if
//         // the dependency says it can be removed
//         return !multiple_valid_for_dependency
//       }
//
//       return false
//     })
//     (ADA.dependencies (hero_entry))
//
// const isStyleSpecialAbilityRemovalDisabled =
//   (hero: HeroModelRecord) =>
//   (wiki_entry: Activatable): boolean =>
//     SpecialAbility.is (wiki_entry)
//     && !isStyleValidToRemove (hero)
//                              (Just (wiki_entry))
//
//
// export const getMaxLevelForDecreaseEntry: (def: number) => (count: number) => Maybe<number> =
//
//   // the more entries the user buys, the less levels are
//   // possible. If the user has 3 or more entries, the decrease entry cannot
//   // be used at all. In those cases (which should not happen), the maximum
//   // will be 0.
//   def => pipe (subtract (def), max (0), Just)

/**
 * `getMinLevelForIncreaseEntry defaultAmount currentAmount` returns the minimum
 * level for an "increase entry", which is an entry that allows to get more
 * specific values or entries than usually allowed. `currentAmount` is the
 * current amount of specific values or entries used and `defaultAmount` the
 * default amount allowed.
 */
let getMinLevelForIncreaseEntry = (defaultAmount, currentAmount) =>
  currentAmount > defaultAmount ? Some(currentAmount - defaultAmount) : None;

/**
 * `getMaxLevelForDecreaseEntry defaultAmount currentAmount` returns the maximum
 * level for a "decrease entry", which is an entry that disallows to get as many
 * specific values or entries as usually allowed. `currentAmount` is the current
 * amount of specific values or entries used and `defaultAmount` the default
 * amount allowed.
 */
let getMaxLevelForDecreaseEntry = (maxDecrease, current) =>
  I.max(0, maxDecrease - current);

/**
 * `countActiveFromGroup specialAbilityPairs group` counts active special
 * abilities from a certain `group`.
 */
let countActiveFromGroup = (specialAbilityPairs, group) =>
  IM.countWith(
    fun
    | ({SpecialAbility.gr}, Some(heroEntry)) =>
      gr === Id.specialAbilityGroupToInt(group)
      && Activatable_Accessors.isActive(heroEntry)
    | _ => false,
    specialAbilityPairs,
  );

//
// const getEntrySpecificMinimumLevel =
//   (staticData: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (x: Record<ActiveObjectWithId>): Maybe<number> => {
//     switch (AOWIA.id (x)) {
//       case AdvantageId.largeSpellSelection:
//         return pipe_ (
//           hero,
//           countActiveSkillEntries ("spells"),
//           getMinLevelForIncreaseEntry (3)
//         )
//
//       case AdvantageId.zahlreichePredigten:
//         return pipe_ (
//           24,
//           getSermonsAndVisionsCount (staticData) (hero),
//           getMinLevelForIncreaseEntry (3)
//         )
//
//       case AdvantageId.zahlreicheVisionen:
//         return pipe_ (
//           27,
//           getSermonsAndVisionsCount (staticData) (hero),
//           getMinLevelForIncreaseEntry (3)
//         )
//
//       case SpecialAbilityId.imitationszauberei:
//         return pipe_ (
//           hero,
//           HA.spells,
//           elems,
//           countWith (pipe (
//                       ASDA.id,
//                       lookupF (SDA.spells (staticData)),
//                       maybe (false)
//                             (pipe (SA.gr, gr => gr === MagicalGroup.Spells))
//                     )),
//           ensure (gt (0))
//         )
//
//       default:
//         return Nothing
//     }
//   }
//
// const getEntrySpecificMaximumLevel =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (entry_id: string): Maybe<number> => {
//     switch (entry_id) {
//       case DisadvantageId.smallSpellSelection:
//         return pipe_ (hero, countActiveSkillEntries ("spells"), getMaxLevelForDecreaseEntry (3))
//
//       case DisadvantageId.wenigePredigten:
//         return pipe_ (24, getSermonsAndVisionsCount (wiki) (hero), getMaxLevelForDecreaseEntry (3))
//
//       case DisadvantageId.wenigeVisionen:
//         return pipe_ (27, getSermonsAndVisionsCount (wiki) (hero), getMaxLevelForDecreaseEntry (3))
//
//       case SpecialAbilityId.dunklesAbbildDerBuendnisgabe:
//         return pipe_ (hero, HA.pact, fmap (PA.level))
//
//       default:
//         return Nothing
//     }
//   }
//
// type MinLevelDepSid = string | number | List<number>
//
// const adjustMinimumLevelByDependencies =
//   (entry: Record<ActiveObjectWithId>) =>
//     flip (foldl ((min_level: Maybe<number>): (dep: ActivatableDependency) => Maybe<number> =>
//                   pipe (
//
//                     // dependency must include a minimum level, which only occurs
//                     // in a DependencyObject
//                     ensure (DependencyObject.is),
//
//                     // get the level dependency from the object and ensure it's
//                     // greater than the current minimum level and that
//                     bindF (dep => bind (DOA.tier (dep))
//
//                                                              // new min must be lower than current
//                                                              // min level
//                                        (ensure (dep_level => sum (min_level) < dep_level
//
//                                                              // if the DependencyObject defines a
//                                                              // sid, too, the entry must match the
//                                                              // sid as well. A DependencyObject
//                                                              // without a sid is valid for all
//                                                              // entries (in case of calculating a
//                                                              // minimum level)
//                                                              && maybe (true)
//                                                                       (flip (Maybe.elem)
//                                                                             <MinLevelDepSid>
//                                                                             (AOWIA.sid (entry)))
//                                                                       (DOA.sid (dep))))),
//
//                     // if the current dependency's level is not valid, return
//                     // the current minimum
//                     flip (alt) (min_level)
//                   )))
//
// /**
//  * Get minimum valid tier.
//  */
// export const getMinTier =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (entry: Record<ActiveObjectWithId>) =>
//   (entry_dependencies: List<ActivatableDependency>): Maybe<number> =>
//     adjustMinimumLevelByDependencies (entry)
//                                      (entry_dependencies)
//                                      (getEntrySpecificMinimumLevel (wiki)
//                                                                    (hero)
//                                                                    (entry))
//
// const minMaybe: (mx: Maybe<number>) => (my: Maybe<number>) => Maybe<number> =
//   mx => my => isNothing (mx) ? my : isNothing (my) ? mx : Just (min (fromJust (mx)) (fromJust (my)))
//
// /**
//  * Get maximum valid tier.
//  */
// export const getMaxTier =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (entry_prerequisites: LevelAwarePrerequisites) =>
//   (entry_dependencies: List<ActivatableDependency>) =>
//   (entry_id: string): Maybe<number> => {
//     const entry_specific_max_level = getEntrySpecificMaximumLevel (wiki) (hero) (entry_id)
//
//     if (isOrderedMap (entry_prerequisites)) {
//       return minMaybe (entry_specific_max_level)
//                       (validateLevel (wiki)
//                                      (hero)
//                                      (entry_prerequisites)
//                                      (entry_dependencies)
//                                      (entry_id))
//     }
//
//     return entry_specific_max_level
//   }
//
// /**
//  * Checks if the given ActiveObject can be removed or changed in tier.
//  * @param obj The ActiveObject with origin id.
//  * @param state The current hero's state.
//  */
// export const getIsRemovalOrChangeDisabled =
//   (wiki: StaticDataRecord) =>
//   (hero: HeroModelRecord) =>
//   (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
//   (entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableActivationValidation>> =>
//     pipe (
//            getWikiEntry (wiki),
//            bindF<EntryWithCategory, Activatable> (ensure (isActivatableWikiEntry)),
//            bindF (
//              wiki_entry =>
//                pipe_ (
//                  entry,
//                  AOWIA.id,
//                  getHeroStateItem (hero),
//                  bindF<Dependent, Record<ActivatableDependent>>
//                    (ensure (isActivatableDependent)),
//                  fmap (hero_entry => {
//                    const minimum_level = getMinTier (wiki)
//                                                     (hero)
//                                                     (entry)
//                                                     (ADA.dependencies (hero_entry))
//
//                    return ActivatableActivationValidation ({
//                      disabled:
//
//                        // Disable if a minimum level is required
//                        hasRequiredMinimumLevel (minimum_level)
//                                                (AAL.tiers (wiki_entry))
//
//                        // Disable if other entries depend on this entry
//                        || isRequiredByOthers (entry)
//                                              (hero_entry)
//
//                        // Disable if style special ability is required for
//                        // extended special abilities
//                        || isStyleSpecialAbilityRemovalDisabled (hero)
//                                                                (wiki_entry)
//
//                        // Disable if dependencies disable remove
//                        // (overlap with `isRequiredByOther`? => merge?)
//                        || isEntryDisabledByDependencies (wiki)
//                                                         (hero)
//                                                         (wiki_entry)
//                                                         (hero_entry)
//                                                         (entry)
//
//                        // Disable if specific entry conditions disallow
//                        // remove
//                        || isRemovalDisabledEntrySpecific (wiki)
//                                                          (hero)
//                                                          (matching_script_and_lang_related)
//                                                          (wiki_entry)
//                                                          (hero_entry)
//                                                          (entry),
//                      minLevel: minimum_level,
//                      maxLevel: getMaxTier (wiki)
//                                           (hero)
//                                           (AAL.prerequisites (wiki_entry))
//                                           (ADA.dependencies (hero_entry))
//                                           (AOWIA.id (entry)),
//                    })
//                  })
//                )
//            )
//          )
/*          (AOWIA.id (entry)*/
