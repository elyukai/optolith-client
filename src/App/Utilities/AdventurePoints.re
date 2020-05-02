open Maybe;

type categories = {
  total: int,
  spent: int,
  available: int,
  spentOnAdvantages: int,
  spentOnMagicalAdvantages: int,
  spentOnBlessedAdvantages: int,
  spentOnDisadvantages: int,
  spentOnMagicalDisadvantages: int,
  spentOnBlessedDisadvantages: int,
  spentOnAttributes: int,
  spentOnSkills: int,
  spentOnCombatTechniques: int,
  spentOnSpells: int,
  spentOnLiturgicalChants: int,
  spentOnCantrips: int,
  spentOnBlessings: int,
  spentOnSpecialAbilities: int,
  spentOnEnergies: int,
  spentOnRace: int,
  spentOnProfession: maybe(int),
};

let%private defaultDisAdvantagesMax = 80;
let%private defaultDisAdvantagesSubtypeMax = 50;

/**
 * Checks if there are enough AP available. If there are, returns `Nothing`.
 * Otherwise returns a `Just` of the missing AP.
 */
let getMissingAp = (~isInCharacterCreation, ~apAvailable, ~apCost) =>
  apCost > 0 && !isInCharacterCreation
    ? apCost <= apAvailable ? Nothing : Just(apCost - apAvailable) : Nothing;

/**
 * Returns the maximum AP value you can spend on magical/blessed
 * advantages/disadvantages. Default is 50, but the tradition may only allow 25.
 */
let getDisAdvantagesSubtypeMax = (staticData, hero: Hero.t, isMagical) =>
  isMagical
    ? hero.specialAbilities
      |> Traditions.Magical.getEntries(staticData)
      |> listToMaybe
      |> maybe(
           defaultDisAdvantagesSubtypeMax,
           ((_, _, trad: Static.MagicalTradition.t)) =>
           trad.isDisAdvAPMaxHalved
             ? defaultDisAdvantagesSubtypeMax / 2
             : defaultDisAdvantagesSubtypeMax
         )
    : defaultDisAdvantagesSubtypeMax;

type missingApForDisAdvantage = {
  totalMissing: maybe(int),
  mainMissing: maybe(int),
  subMissing: maybe(int),
};

let%private getDisAdvantageSubtypeApSpent =
            (~apCategories, ~isDisadvantage, ~isMagical, ~isBlessed) =>
  isDisadvantage
    ? isMagical
        ? Just(apCategories.spentOnMagicalDisadvantages)
        : isBlessed ? Just(apCategories.spentOnBlessedDisadvantages) : Nothing
    : isMagical
        ? Just(apCategories.spentOnMagicalAdvantages)
        : isBlessed ? Just(apCategories.spentOnBlessedAdvantages) : Nothing;

type disAdvantageStatic =
  | Advantage(Static.Advantage.t)
  | Disadvantage(Static.Disadvantage.t);

/**
 * Checks if there are enough AP available and if the restrictions for
 * advantages/disadvantages will be met.
 */
let getMissingApForDisAdvantage =
    (
      ~staticData,
      ~hero,
      ~isInCharacterCreation,
      ~apCategories,
      ~isMagical,
      ~isBlessed,
      ~apCost,
      ~staticEntry,
    ) => {
  let isDisadvantage =
    switch (staticEntry) {
    | Advantage(_) => false
    | Disadvantage(_) => true
    };

  let noMaxAPInfluence =
    switch (staticEntry) {
    | Advantage(x) => x.noMaxAPInfluence
    | Disadvantage(x) => x.noMaxAPInfluence
    };

  let apSpent =
    isDisadvantage
      ? apCategories.spentOnDisadvantages : apCategories.spentOnAdvantages;

  let mApSpentSubtype =
    getDisAdvantageSubtypeApSpent(
      ~apCategories,
      ~isDisadvantage,
      ~isMagical,
      ~isBlessed,
    );

  let subtypeMax = getDisAdvantagesSubtypeMax(staticData, hero, isMagical);

  // A disadvantage has negative cost, but the sum to check is always positive
  // (to be able to use one function for both advantages and disadvantages)
  let absoluteApCost = Int.abs(apCost);

  // Checks if there are enough AP below the max for the subtype (magical/blessed)
  let missingApForSubtype =
    isInCharacterCreation && !noMaxAPInfluence
      // (current + spent) - max > 0 => invalid
      ? Maybe.Monad.(
          mApSpentSubtype
          >>= (
            apSpentSubtype =>
              Maybe.ensure(
                (<)(0),
                apSpentSubtype + absoluteApCost - subtypeMax,
              )
          )
        )
      : Nothing;

  // Checks if there are enough AP below the max for advantages/disadvantages
  let missingApForMain =
    isInCharacterCreation && !noMaxAPInfluence
      // (current + spent) - max > 0 => invalid
      ? Maybe.ensure(
          (<)(0),
          apSpent + absoluteApCost - defaultDisAdvantagesMax,
        )
      : Nothing;

  // Checks if there are enough AP available in total
  let missingApForTotal =
    getMissingAp(
      ~isInCharacterCreation,
      ~apAvailable=apCategories.available,
      ~apCost,
    );

  {
    totalMissing: missingApForTotal,
    mainMissing: missingApForMain,
    subMissing: missingApForSubtype,
  };
};

module Sum = {
  open Static;
  open Function;
  open IntMap;
  open IntMap.Foldable;

  let getApSpentOnAttributes =
    foldr(
      (x: Hero.Attribute.t) => x.value |> IC.getAPForRange(E, 8) |> (+),
      0,
    );

  let getApSpentOnSkills = staticData =>
    foldr(
      (x: Hero.Skill.t) =>
        lookup(x.id, staticData.skills)
        |> maybe(id, (staticEntry: Skill.t) =>
             x.value |> IC.getAPForRange(staticEntry.ic, 0) |> (+)
           ),
      0,
    );

  let getApSpentOnCombatTechniques = staticData =>
    foldr(
      (x: Hero.Skill.t) =>
        lookup(x.id, staticData.combatTechniques)
        |> maybe(id, (staticEntry: CombatTechnique.t) =>
             x.value |> IC.getAPForRange(staticEntry.ic, 6) |> (+)
           ),
      0,
    );

  let getApSpentOnSpells = staticData =>
    foldr(
      (x: Hero.ActivatableSkill.t) =>
        switch (x.value) {
        | Active(value) =>
          lookup(x.id, staticData.spells)
          |> maybe(id, (staticEntry: Spell.t) =>
               value |> IC.getAPForRange(staticEntry.ic, 0) |> (+)
             )
        | Inactive => id
        },
      0,
    );

  let getApSpentOnLiturgicalChants = staticData =>
    foldr(
      (x: Hero.ActivatableSkill.t) =>
        switch (x.value) {
        | Active(value) =>
          lookup(x.id, staticData.liturgicalChants)
          |> maybe(id, (staticEntry: LiturgicalChant.t) =>
               value |> IC.getAPForRange(staticEntry.ic, 0) |> (+)
             )
        | Inactive => id
        },
      0,
    );

  let getApSpentOnCantrips = size;

  let getAPSpentOnBlessings = size;
  // // Advantages / Disadvantages / Special Abilities
  //
  // type ActiveAdvantage = Record<ActiveActivatable<Advantage>>
  // type ActiveDisadvantage = Record<ActiveActivatable<Disadvantage>>
  // type ActiveSpecialAbility = Record<ActiveActivatable<SpecialAbility>>
  //
  // const AAA_ = ActiveActivatableA_
  //
  // /**
  //  * The return value is a triple:
  //  *
  //  * - The second value is the simple AP cost sum that needs to be subtracted from
  //  *   the amount of total AP. Automatic advantage costs are exluded here.
  //  * - The first value is like the first, but it is the value that needs to be
  //  *   compared with the AP max for advantages. Some entries do not count towards
  //  *   this max. But automatic advantages are relevant here.
  //  */
  // export const getAPSpentForAdvantages =
  //   (wiki: StaticDataRecord) =>
  //   (xmap: HeroModel["advantages"]) =>
  //   (active: List<ActiveAdvantage>) =>
  //     pipe_ (
  //       active,
  //       List.foldr ((e: Record<ActiveActivatable<Advantage>>): ident<Pair<number, number>> =>
  //                    AAA_.isAutomatic (e)
  //                    ? first (add (AAA_.finalCost (e)))
  //                    : elem (AAA_.id (e)) (AdvantageIdsNoMaxInfl)
  //                    ? second (add (AAA_.finalCost (e)))
  //                    : bimap (add (AAA_.finalCost (e)))
  //                            (add (AAA_.finalCost (e))))
  //                  (Pair (0, 0)),
  //       join <ident<number>, ident<Pair<number, number>>>
  //            (bimap)
  //            (add (getAdventurePointsSpentDifference (wiki) (xmap) (active)))
  //     )
  //
  // export const getAPSpentForMagicalAdvantages =
  //   (wiki: StaticDataRecord) =>
  //   (xmap: HeroModel["advantages"]) =>
  //     pipe (
  //       filter<ActiveAdvantage> (pipe (
  //                                 ActiveActivatable.A.wikiEntry,
  //                                 Advantage.AL.gr,
  //                                 equals (2)
  //                               )) as ident<List<ActiveAdvantage>>,
  //       getAPSpentForAdvantages (wiki) (xmap)
  //     )
  //
  // export const getAPSpentForBlessedAdvantages =
  //   (wiki: StaticDataRecord) =>
  //   (xmap: HeroModel["advantages"]) =>
  //     pipe (
  //       filter<ActiveAdvantage> (pipe (
  //                                 ActiveActivatable.A.wikiEntry,
  //                                 Advantage.AL.gr,
  //                                 equals (3)
  //                               )) as ident<List<ActiveAdvantage>>,
  //       getAPSpentForAdvantages (wiki) (xmap)
  //     )
  //
  // /**
  //  * Returns (AP spent on disadvantages, actual AP lost)
  //  */
  // export const getAPSpentForDisadvantages =
  //   (wiki: StaticDataRecord) =>
  //   (xmap: HeroModel["disadvantages"]) =>
  //   (active: List<ActiveDisadvantage>): Pair<number, number> =>
  //     pipe_ (
  //       active,
  //       List.foldr ((e: Record<ActiveActivatable<Disadvantage>>): ident<Pair<number, number>> =>
  //                    AAA_.isAutomatic (e)
  //                    ? first (add (AAA_.finalCost (e)))
  //                    : bimap (add (AAA_.finalCost (e)))
  //                            (add (AAA_.finalCost (e))))
  //                  (Pair (0, 0)),
  //       join <ident<number>, ident<Pair<number, number>>>
  //            (bimap)
  //            (add (getAdventurePointsSpentDifference (wiki) (xmap) (active)))
  //     )
  //
  // export const getAPSpentForMagicalDisadvantages =
  //   (wiki: StaticDataRecord) =>
  //   (xmap: HeroModel["disadvantages"]) =>
  //     pipe (
  //       filter<ActiveDisadvantage> (pipe (
  //                                    ActiveActivatable.A.wikiEntry,
  //                                    Disadvantage.AL.gr,
  //                                    equals (2)
  //                                  )) as ident<List<ActiveDisadvantage>>,
  //       getAPSpentForDisadvantages (wiki) (xmap)
  //     )
  //
  // export const getAPSpentForBlessedDisadvantages =
  //   (wiki: StaticDataRecord) =>
  //   (xmap: HeroModel["disadvantages"]) =>
  //     pipe (
  //       filter<ActiveDisadvantage> (pipe (
  //                                    ActiveActivatable.A.wikiEntry,
  //                                    Disadvantage.AL.gr,
  //                                    equals (3)
  //                                  )) as ident<List<ActiveDisadvantage>>,
  //       getAPSpentForDisadvantages (wiki) (xmap)
  //     )
  //
  // export const getAPSpentForSpecialAbilities =
  //   (wiki: StaticDataRecord) =>
  //   (xmap: HeroModel["specialAbilities"]) =>
  //   (active: List<ActiveSpecialAbility>) =>
  //     pipe_ (
  //       active,
  //       List.foldr<Record<ActiveActivatable<SpecialAbility>>, number>
  //         (pipe (ActiveActivatableA_.finalCost, add))
  //         (0),
  //       add (getAdventurePointsSpentDifference (wiki)
  //                                              (xmap)
  //                                              (active))
  //     )
  //
  // export const getAPSpentForEnergies =
  //   (energies: Record<Energies>) => {
  //     const addedArcaneEnergyCost =
  //       pipe_ (energies, Energies.A.addedArcaneEnergyPoints, curryN3 (getAPForRange) ("D") (0))
  //
  //     const addedKarmaPointsCost =
  //       pipe_ (energies, Energies.A.addedKarmaPoints, curryN3 (getAPForRange) ("D") (0))
  //
  //     const addedLifePointsCost =
  //       pipe_ (energies, Energies.A.addedLifePoints, curryN3 (getAPForRange) ("D") (0))
  //
  //     const boughtBackArcaneEnergyCost =
  //       pipe_ (
  //         energies,
  //         Energies.A.permanentArcaneEnergyPoints,
  //         PermanentEnergyLossAndBoughtBack.A.redeemed,
  //         multiply (2)
  //       )
  //
  //     const boughtBackKarmaPointsCost =
  //       pipe_ (
  //         energies,
  //         Energies.A.permanentKarmaPoints,
  //         PermanentEnergyLossAndBoughtBack.A.redeemed,
  //         multiply (2)
  //       )
  //
  //     return sum (List (
  //       addedArcaneEnergyCost,
  //       addedKarmaPointsCost,
  //       addedLifePointsCost,
  //       boughtBackArcaneEnergyCost,
  //       boughtBackKarmaPointsCost
  //     ))
  //   }
  //
  // export const getAPSpentForRace =
  //   (wiki: StaticDataRecord) =>
  //     pipe (
  //       bindF (lookupF (SDA.races (wiki))),
  //       maybe (0) (Race.A.ap)
  //     )
  //
  // /**
  //  * Pass wiki, profession id, optional profession variant id and the current
  //  * phase.
  //  */
  // export const getAPSpentForProfession =
  //   (wiki: StaticDataRecord) =>
  //   (mprofId: Maybe<string>) =>
  //   (mprofVarId: Maybe<string>) =>
  //     pipe (
  //       ensure (equals (1)),
  //       thenF (mprofId),
  //       bindF (lookupF (SDA.professions (wiki))),
  //       fmap (pipe (
  //         Profession.A.ap,
  //         Maybe.sum,
  //         add (pipe_ (
  //           mprofVarId,
  //           bindF (lookupF (SDA.professionVariants (wiki))),
  //           fmap (ProfessionVariant.A.ap),
  //           Maybe.sum
  //         ))
  //       ))
  //     )
  //
  // const getPrinciplesObligationsDiff =
  //   (id: string) =>
  //   (staticData: StaticDataRecord) =>
  //   (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  //   (entries: List<Record<ActiveActivatable>>): number => {
  //     if (any (pipe (ActiveActivatableAL_.id, equals (id))) (entries)) {
  //       return pipe_ (
  //         hero_slice,
  //         lookup (id),
  //         bindF (entry => {
  //           const current_active = ActivatableDependent.A.active (entry)
  //
  //           const current_max_level = foldl (compareMaxLevel)
  //                                           (0)
  //                                           (current_active)
  //
  //           const current_second_max_level = foldl (compareSubMaxLevel (current_max_level))
  //                                                  (0)
  //                                                  (current_active)
  //
  //           const at_max_level =
  //             countWith (pipe (ActiveObject.A.tier, elem (current_max_level)))
  //                       (current_active)
  //
  //           const mbase_cost =
  //             pipe_ (
  //               staticData,
  //               SDA.disadvantages,
  //               lookup (id),
  //               bindF (Disadvantage.A.cost),
  //               misNumberM
  //             )
  //
  //           return at_max_level > 1
  //             ? fmapF (mbase_cost) (base => current_max_level * -base)
  //             : fmapF (mbase_cost) (base => current_second_max_level * -base)
  //         }),
  //         sum
  //       )
  //     }
  //
  //     return 0
  //   }
  //
  // const getPropertyOrAspectKnowledgeDiff =
  //   (id: string) =>
  //     pipe (
  //       find (pipe (ActiveActivatableA_.id, equals (id))),
  //       fmap (entry => {
  //         const current_active_length =
  //           pipe_ (entry, ActiveActivatable.AL.heroEntry, ActivatableDependent.A.active, flength)
  //
  //         const mcost = pipe_ (entry, ActiveActivatable.AL.wikiEntry, Disadvantage.AL.cost)
  //
  //         if (isJust (mcost)) {
  //           const cost = fromJust (mcost)
  //
  //           if (isList (cost)) {
  //             const actualAPSum = pipe_ (cost, take (current_active_length), List.sum)
  //
  //             // Sum of *displayed* AP values for entries
  //             const current_cost_sum =
  //               sum (subscript (cost) (current_active_length - 1)) * current_active_length
  //
  //             return actualAPSum - current_cost_sum
  //           }
  //         }
  //
  //         return 0
  //       }),
  //       sum
  //     )
  //
  // /**
  //  * `getSinglePersFlawDiff :: Int -> Int -> ActiveActivatable -> SID -> Int -> Int`
  //  *
  //  * `getSinglePersFlawDiff sid paid_entries entry current_sid current_entries`
  //  *
  //  * @param sid SID the diff is for.
  //  * @param paid_entries Amount of active entries of the same SID that you get AP
  //  * for.
  //  * @param entry An entry of Personality Flaw.
  //  * @param current_sid The current SID to check.
  //  * @param current_entries The current amount of active entries of the current
  //  * SID.
  //  */
  // const getSinglePersFlawDiff =
  //   (sid: number) =>
  //   (paid_entries: number) =>
  //   (entry: Record<ActiveActivatable>) =>
  //   (current_sid: number | string) =>
  //   (current_entries: number): number =>
  //     current_sid === sid && current_entries > paid_entries
  //     ? maybe (0)
  //             (pipe (multiply (paid_entries), negate))
  //             (getSelectOptionCost (AAA.wikiEntry (entry) as Activatable)
  //                                  (Just (sid)))
  //     : 0
  //
  // const getPersonalityFlawsDiff =
  //   (entries: List<Record<ActiveActivatable>>): number =>
  //     pipe_ (
  //       entries,
  //
  //       // Find any Personality Flaw entry, as all of them have the same list of
  //       // active objects
  //       find (pipe (ActiveActivatableA_.id, equals<string> (DisadvantageId.PersonalityFlaw))),
  //       fmap (entry => pipe_ (
  //         entry,
  //         ActiveActivatableA_.active,
  //         countWithByKeyMaybe (e => then (guard (isNothing (AOA.cost (e))))
  //                                        (AOA.sid (e))),
  //         OrderedMap.foldrWithKey ((sid: string | number) => (val: number) =>
  //                                   pipe_ (
  //                                     List (
  //                                       getSinglePersFlawDiff (7) (1) (entry) (sid) (val),
  //                                       getSinglePersFlawDiff (8) (2) (entry) (sid) (val)
  //                                     ),
  //                                     List.sum,
  //                                     add
  //                                   ))
  //                                 (0)
  //       )),
  //
  //       // If no Personality Flaw was found, there's no diff.
  //       Maybe.sum
  //     )
  //
  // const getBadHabitsDiff =
  //   (staticData: StaticDataRecord) =>
  //   (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  //   (entries: List<Record<ActiveActivatable>>): number =>
  //     any (pipe (ActiveActivatableAL_.id, equals<string> (DisadvantageId.BadHabit))) (entries)
  //       ? sum (pipe_ (
  //         hero_slice,
  //         lookup<string> (DisadvantageId.PersonalityFlaw),
  //         fmap (pipe (
  //
  //           // get current active
  //           ActivatableDependent.A.active,
  //           getActiveWithNoCustomCost,
  //           flength,
  //           gt (3),
  //           bool_ (() => 0)
  //                 (() => pipe_ (
  //                   staticData,
  //                   SDA.disadvantages,
  //                   lookup<string> (DisadvantageId.BadHabit),
  //                   bindF (Disadvantage.A.cost),
  //                   misNumberM,
  //                   fmap (multiply (-3)),
  //                   sum
  //                 ))
  //         ))
  //       ))
  //       : 0
  //
  // const getSkillSpecializationsDiff =
  //   (staticData: StaticDataRecord) =>
  //   (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  //   (entries: List<Record<ActiveActivatable>>): number => {
  //     if (any (pipe (ActiveActivatableAL_.id, equals<string> (SpecialAbilityId.SkillSpecialization)))
  //             (entries)) {
  //       return sum (pipe_ (
  //         hero_slice,
  //         lookup<string> (SpecialAbilityId.SkillSpecialization),
  //         fmap (entry => {
  //           const current_active = ActivatableDependent.A.active (entry)
  //
  //           // Count how many specializations are for the same skill
  //           const sameSkill =
  //             countWithByKeyMaybe (pipe (ActiveObject.A.sid, misStringM))
  //                                 (current_active)
  //
  //           // Return the accumulated value, otherwise 0.
  //           const getFlatSkillDone = findWithDefault (0)
  //
  //           // Calculates the diff for a single skill specialization
  //           const getSingleDiff =
  //             (accMap: OrderedMap<string, number>) =>
  //             (sid: string) =>
  //             (counter: number) =>
  //             (skill: Record<Skill>) =>
  //               Skill.A.ic (skill) * (getFlatSkillDone (sid) (accMap) + 1 - counter)
  //
  //           type TrackingPair = Pair<number, OrderedMap<string, number>>
  //
  //           // Iterates through the counter and sums up all cost differences for
  //           // each specialization.
  //           //
  //           // It keeps track of how many specializations have been already
  //           // taken into account.
  //           const skillDone =
  //             foldr (pipe (
  //                     ActiveObject.A.sid,
  //                     misStringM,
  //                     bindF (current_sid =>
  //                             fmapF (lookup (current_sid) (sameSkill))
  //                                   (count => (p: TrackingPair) => {
  //                                     const m = snd (p)
  //
  //                                     // Check if the value in the map is either
  //                                     // Nothing or a Just of a lower number than
  //                                     // the complete counter
  //                                     // => which means there are still actions to
  //                                     // be done
  //                                     if (all (lt (count)) (lookup (current_sid) (m))) {
  //                                       const mskill =
  //                                         pipe_ (staticData, SDA.skills, lookup (current_sid))
  //
  //                                       return Pair (
  //                                         fst (p) + sum (fmap (getSingleDiff (m)
  //                                                                            (current_sid)
  //                                                                            (count))
  //                                                             (mskill)),
  //                                         alter (pipe (altF (Just (0)), fmap (inc)))
  //                                               (current_sid)
  //                                               (m)
  //                                       )
  //                                     }
  //
  //                                     return p
  //                                   })),
  //                     fromMaybe<ident<TrackingPair>> (ident)
  //                   ))
  //                   (Pair (0, empty))
  //                   (current_active)
  //
  //           return fst (skillDone)
  //         })
  //       ))
  //     }
  //
  //     return 0
  //   }
  //
  // const getPropertyKnowledgeDiff =
  //   getPropertyOrAspectKnowledgeDiff (SpecialAbilityId.PropertyKnowledge)
  //
  // const getAspectKnowledgeDiff =
  //   getPropertyOrAspectKnowledgeDiff (SpecialAbilityId.AspectKnowledge)
  //
  // /**
  //  * The returned number modifies the current AP spent.
  //  */
  // export const getAdventurePointsSpentDifference =
  //   (staticData: StaticDataRecord) =>
  //   (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  //   (entries: List<Record<ActiveActivatable>>): number => {
  //     const adventurePointsSpentDifferences = List (
  //       getPrinciplesObligationsDiff (DisadvantageId.Principles) (staticData) (hero_slice) (entries),
  //       getPrinciplesObligationsDiff (DisadvantageId.Obligations) (staticData) (hero_slice) (entries),
  //       getPersonalityFlawsDiff (entries),
  //       getBadHabitsDiff (staticData) (hero_slice) (entries),
  //       getSkillSpecializationsDiff (staticData) (hero_slice) (entries),
  //       getPropertyKnowledgeDiff (entries),
  //       getAspectKnowledgeDiff (entries)
  //     )
  //
  //     return List.sum (adventurePointsSpentDifferences)
  //   }
  //
  // export const getAPObject =
  //   (staticData: StaticDataRecord) =>
  //   (hero: HeroModelRecord) =>
  //   (automatic_advantages: List<string>) =>
  //   (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) => {
  //     const total = HA.adventurePointsTotal (hero)
  //
  //     const spentOnAttributes = getAPSpentForAttributes (HA.attributes (hero))
  //
  //     const spentOnSkills = getAPSpentForSkills (SDA.skills (staticData))
  //                                               (HA.skills (hero))
  //
  //     const spentOnCombatTechniques =
  //       getAPSpentForCombatTechniques (SDA.combatTechniques (staticData))
  //                                     (HA.combatTechniques (hero))
  //
  //     const spentOnSpells = getAPSpentForSpells (SDA.spells (staticData))
  //                                               (HA.spells (hero))
  //
  //     const spentOnLiturgicalChants =
  //       getAPSpentForLiturgicalChants (SDA.liturgicalChants (staticData))
  //                                     (HA.liturgicalChants (hero))
  //
  //     const spentOnCantrips = getAPSpentForCantrips (HA.cantrips (hero))
  //
  //     const spentOnBlessings = getAPSpentForBlessings (HA.blessings (hero))
  //
  //     const spentOnEnergies = getAPSpentForEnergies (HA.energies (hero))
  //
  //     const spentOnRace = getAPSpentForRace (staticData) (HA.race (hero))
  //
  //     const spentOnProfession = getAPSpentForProfession (staticData)
  //                                                       (HA.profession (hero))
  //                                                       (HA.professionVariant (hero))
  //                                                       (HA.phase (hero))
  //
  //     const spentOnSpecialAbilities =
  //       getAPSpentForSpecialAbilities (staticData)
  //                                     (HA.specialAbilities (hero))
  //                                     (getAllActiveByCategory (Category.SPECIAL_ABILITIES)
  //                                                             (false)
  //                                                             (automatic_advantages)
  //                                                             (matching_script_and_lang_related)
  //                                                             (staticData)
  //                                                             (hero))
  //
  //     const spentOnAdvantages =
  //         getAPSpentForAdvantages (staticData)
  //                                 (HA.advantages (hero))
  //                                 (getAllActiveByCategory (Category.ADVANTAGES)
  //                                                         (false)
  //                                                         (automatic_advantages)
  //                                                         (matching_script_and_lang_related)
  //                                                         (staticData)
  //                                                         (hero))
  //
  //     const spentOnMagicalAdvantages =
  //         getAPSpentForMagicalAdvantages (staticData)
  //                                        (HA.advantages (hero))
  //                                        (getAllActiveByCategory (Category.ADVANTAGES)
  //                                                                (false)
  //                                                                (automatic_advantages)
  //                                                                (matching_script_and_lang_related)
  //                                                                (staticData)
  //                                                                (hero))
  //
  //     const spentOnBlessedAdvantages =
  //         getAPSpentForBlessedAdvantages (staticData)
  //                                         (HA.advantages (hero))
  //                                         (getAllActiveByCategory (Category.ADVANTAGES)
  //                                                                 (false)
  //                                                                 (automatic_advantages)
  //                                                                 (matching_script_and_lang_related)
  //                                                                 (staticData)
  //                                                                 (hero))
  //
  //     const spentOnDisadvantages =
  //         getAPSpentForDisadvantages (staticData)
  //                                     (HA.disadvantages (hero))
  //                                     (getAllActiveByCategory (Category.DISADVANTAGES)
  //                                                             (false)
  //                                                             (automatic_advantages)
  //                                                             (matching_script_and_lang_related)
  //                                                             (staticData)
  //                                                             (hero))
  //
  //     const spentOnMagicalDisadvantages =
  //         getAPSpentForMagicalDisadvantages (staticData)
  //                                           (HA.disadvantages (hero))
  //                                           (getAllActiveByCategory (Category.DISADVANTAGES)
  //                                                                   (false)
  //                                                                   (automatic_advantages)
  //                                                                   (matching_script_and_lang_related)
  //                                                                   (staticData)
  //                                                                   (hero))
  //
  //     const spentOnBlessedDisadvantages =
  //         getAPSpentForBlessedDisadvantages (staticData)
  //                                           (HA.disadvantages (hero))
  //                                           (getAllActiveByCategory (Category.DISADVANTAGES)
  //                                                                   (false)
  //                                                                   (automatic_advantages)
  //                                                                   (matching_script_and_lang_related)
  //                                                                   (staticData)
  //                                                                   (hero))
  //
  //     const spent =
  //       spentOnAttributes
  //       + spentOnSkills
  //       + spentOnCombatTechniques
  //       + spentOnSpells
  //       + spentOnLiturgicalChants
  //       + spentOnCantrips
  //       + spentOnBlessings
  //       + spentOnEnergies
  //       + spentOnRace
  //       + Maybe.sum (spentOnProfession)
  //       + spentOnSpecialAbilities
  //       + snd (spentOnAdvantages)
  //       + snd (spentOnMagicalAdvantages)
  //       + snd (spentOnBlessedAdvantages)
  //       + snd (spentOnDisadvantages)
  //       + snd (spentOnMagicalDisadvantages)
  //       + snd (spentOnBlessedDisadvantages)
  //
  //     return AdventurePointsCategories ({
  //       total,
  //       spent,
  //       available: total - spent,
  //       spentOnAttributes,
  //       spentOnSkills,
  //       spentOnCombatTechniques,
  //       spentOnSpells,
  //       spentOnLiturgicalChants,
  //       spentOnCantrips,
  //       spentOnBlessings,
  //       spentOnEnergies,
  //       spentOnRace,
  //       spentOnProfession,
  //       spentOnSpecialAbilities,
  //       spentOnAdvantages: fst (spentOnAdvantages),
  //       spentOnMagicalAdvantages: fst (spentOnMagicalAdvantages),
  //       spentOnBlessedAdvantages: fst (spentOnBlessedAdvantages),
  //       spentOnDisadvantages: fst (spentOnDisadvantages),
  //       spentOnMagicalDisadvantages: fst (spentOnMagicalDisadvantages),
  //       spentOnBlessedDisadvantages: fst (spentOnBlessedDisadvantages),
  //     })
  //   }
};
