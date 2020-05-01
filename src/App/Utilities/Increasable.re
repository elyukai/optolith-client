module Attributes = {
  open Maybe;
  open Hero.Attribute;

  /**
   * Takes an attribute's hero entry that might not exist and returns the value
   * of that attribute. Note: If the attribute is not yet defined, it's value is
   * `8`.
   */
  let getValueDef = maybe(8, x => x.value);

  /**
   * Takes a skill check's attribute triple and returns it's values.
   */
  let getSkillCheckValues = (mp, (a1, a2, a3)) => (
    IntMap.lookup(a1, mp) |> getValueDef,
    IntMap.lookup(a2, mp) |> getValueDef,
    IntMap.lookup(a3, mp) |> getValueDef,
  );
};

module Skills = {
  open Maybe;
  open Maybe.Functor;
  open Hero.Activatable;

  /**
   * Takes a skill's hero entry that might not exist and returns the value of
   * that skill. Note: If the skill is not yet defined, it's value is `0`.
   */
  let getValueDef = maybe(8, (x: Hero.Skill.t) => x.value);

  /**
   * Get the SR maximum bonus from an active Exceptional Skill advantage.
   */
  let getExceptionalSkillBonus = (exceptionalSkill, id) =>
    maybe(
      0,
      (x: Hero.Activatable.t) =>
        x.active
        |> ListH.countBy((a: Hero.Activatable.single) =>
             a.options |> listToMaybe |> Maybe.Foldable.elem(id)
           ),
      exceptionalSkill,
    );

  /**
   * Creates the base for a list for calculating the maximum of a skill based on
   * the skill check's attributes' values.
   */
  let getMaxSrByCheckAttrs = (mp, check) =>
    check
    |> Attributes.getSkillCheckValues(mp)
    |> (((a1, a2, a3)) => ListH.Foldable.maximum([a1, a2, a3]) + 2);

  /**
   * Adds the maximum skill rating defined by the chosen experience level to the
   * list created by `getInitialMaximumList` if the hero is in character
   * creation phase.
   */
  let getMaxSrFromEl = (el: Static.ExperienceLevel.t, phase: Ids.Phase.t) =>
    switch (phase) {
    | Outline
    | Definition => Just(el.maxSkillRating)
    | Advancement => Nothing
    };

  /**
   * Returns the maximum skill rating for the passed skill.
   */
  let getMax =
      (~el, ~phase, ~attrs, ~exceptionalSkill, ~staticEntry: Static.Skill.t) =>
    [
      Just(getMaxSrByCheckAttrs(attrs, staticEntry.check)),
      getMaxSrFromEl(el, phase),
    ]
    |> catMaybes
    |> ListH.Foldable.minimum
    |> (+)(
         getExceptionalSkillBonus(exceptionalSkill, `Skill(staticEntry.id)),
       );

  /**
   * Returns if the passed skill's skill rating can be increased.
   */
  let isIncreasable =
      (
        ~el,
        ~phase,
        ~attrs,
        ~exceptionalSkill,
        ~staticEntry,
        ~heroEntry: Hero.Skill.t,
      ) =>
    heroEntry.value
    < getMax(~el, ~phase, ~attrs, ~exceptionalSkill, ~staticEntry);

  let getMinSrByCraftInstruments =
      (craftInstruments, skills, staticEntry: Static.Skill.t) =>
    Id.(
      {
        switch (unsafeSkillFromInt(staticEntry.id)) {
        | Woodworking as skillId
        | Metalworking as skillId when Activatable.isActiveM(craftInstruments) =>
          // Sum of Woodworking and Metalworking must be at least 12.
          let minimumSum = 12;

          let otherSkillId =
            switch (skillId) {
            | Woodworking => Metalworking
            | Metalworking => Woodworking
            // Case will never happen but it fixes the compiler warning
            | _ => Woodworking
            };

          let otherSkillRating =
            skills |> IntMap.lookup(skillToInt(otherSkillId)) |> getValueDef;

          Just(minimumSum - otherSkillRating);
        | _ => Nothing
        };
      }
    );

  /**
   * Check if the dependencies allow the passed skill to be decreased.
   */
  let getMinSrByDeps = (heroSkills, heroEntry: Hero.Skill.t) =>
    heroEntry.dependencies
    |> Dependencies.flatten(
         id => heroSkills |> IntMap.lookup(id) |> getValueDef,
         heroEntry.id,
       )
    |> ensure(ListH.Extra.notNull)
    <&> ListH.Foldable.maximum;

  /**
   * Returns the minimum skill rating for the passed skill.
   */
  let getMin = (~craftInstruments, ~heroSkills, ~staticEntry, ~heroEntry) =>
    [
      getMinSrByDeps(heroSkills, heroEntry),
      getMinSrByCraftInstruments(craftInstruments, heroSkills, staticEntry),
    ]
    |> catMaybes
    |> ensure(ListH.Extra.notNull)
    <&> ListH.Foldable.maximum;

  /**
   * Returns if the passed skill's skill rating can be decreased.
   */
  let isDecreasable =
      (~craftInstruments, ~heroSkills, ~staticEntry, ~heroEntry: Hero.Skill.t) =>
    heroEntry.value
    > (
        getMin(~craftInstruments, ~heroSkills, ~staticEntry, ~heroEntry)
        |> fromMaybe(0)
      );

  module Routine = {
    open Maybe.Monad;

    let attributeThreshold = 13;

    /**
     * Returns the total of missing attribute points for a routine check without
     * using the optional rule for routine checks, because the minimum attribute
     * value is 13 in that case.
     */
    let getMissingPoints = ((a1, a2, a3)) =>
      [a1, a2, a3]
      |> ListH.map(a => attributeThreshold - a |> Int.max(0))
      |> ListH.Foldable.sum;

    /**
     * Returns the minimum check modifier from which a routine check is possible
     * without using the optional rule for routine checks.
     */
    let getBaseMinCheckMod = sr =>
      - Js.Math.floor_int((Js.Int.toFloat(sr) -. 1.0) /. 3.0) + 3;

    /**
     * Returns the minimum check modifier from which a routine check is possible for
     * the passed skill rating. Returns `Nothing` if no routine check is possible,
     * otherwise a `Just` of a pair, where the first value is the minimum check
     * modifier and the second a boolean, where `True` states that the minimum check
     * modifier is only valid when using the optional rule for routine checks, thus
     * otherwise a routine check would not be possible.
     */
    let getMinCheckModForRoutine = (check, sr) =>
      sr
      // Routine checks do only work if the SR is larger than 0
      |> ensure((>)(0))
      >>= (
        sr => {
          let missingPoints = getMissingPoints(check);
          let checkModThreshold = getBaseMinCheckMod(sr);

          let dependentCheckMod = checkModThreshold + missingPoints;

          dependentCheckMod < 4
            ? Just((dependentCheckMod, missingPoints > 0)) : Nothing;
        }
      );
  };
};

module CombatTechniques = {
  open ListH;
  open Maybe;
  open Maybe.Functor;

  let getMaxPrimaryAttributeValueById = (heroAttrs, ps) =>
    ps
    |> map(p => IntMap.lookup(p, heroAttrs) |> Attributes.getValueDef)
    |> (<+>)(0)
    |> ListH.Foldable.maximum;

  let attributeValueToMod = value => Int.max(0, (value - 8) / 3);

  let getPrimaryAttributeMod = (heroAttrs, ps) =>
    ps |> getMaxPrimaryAttributeValueById(heroAttrs) |> attributeValueToMod;

  /**
   * Takes a combat technique's hero entry that might not exist and returns the
   * value of that combat technique. Note: If the combat technique is not yet
   * defined, it's value is `6`.
   */
  let getValueDef = maybe(6, (x: Hero.Skill.t) => x.value);

  let getAttack =
      (heroAttrs, staticEntry: Static.CombatTechnique.t, heroEntry) =>
    heroEntry
    |> getValueDef
    |> (+)(
         getPrimaryAttributeMod(
           heroAttrs,
           staticEntry.gr === 1
             ? [Id.attributeToInt(Courage)] : staticEntry.primary,
         ),
       );

  let getParry = (heroAttrs, staticEntry: Static.CombatTechnique.t, heroEntry) =>
    staticEntry.gr === Id.combatTechniqueGroupToInt(Melee)
    && staticEntry.id !== Id.combatTechniqueToInt(ChainWeapons)
    && staticEntry.id !== Id.combatTechniqueToInt(Brawling)
      ? Just(
          heroEntry
          |> getValueDef
          |> Js.Int.toFloat
          |> (/.)(2.0)
          |> Js.Math.round
          |> Js.Math.floor
          |> (+)(getPrimaryAttributeMod(heroAttrs, staticEntry.primary)),
        )
      : Nothing;

  /**
   * Get the CtR maximum bonus from an active Exceptional Combat Technique
   * advantage.
   */
  let getExceptionalCombatTechniqueBonus = (exceptionalCombatTechnique, id) =>
    maybe(
      0,
      (x: Hero.Activatable.t) =>
        x.active
        |> listToMaybe
        <&> (
          a =>
            a.options
            |> listToMaybe
            |> Maybe.Foldable.elem(`CombatTechnique(id))
            |> (hasBonus => hasBonus ? 1 : 0)
        )
        |> fromMaybe(0),
      exceptionalCombatTechnique,
    );

  let getMaxCtrFromEl = (el: Static.ExperienceLevel.t, phase: Ids.Phase.t) =>
    switch (phase) {
    | Outline
    | Definition => Just(el.maxCombatTechniqueRating)
    | Advancement => Nothing
    };

  /**
   * Returns the maximum combat technique rating for the passed combat
   * technique.
   */
  let getMax =
      (
        ~el,
        ~phase,
        ~attrs,
        ~exceptionalCombatTechnique,
        ~staticEntry: Static.CombatTechnique.t,
      ) =>
    [
      Just(getMaxPrimaryAttributeValueById(attrs, staticEntry.primary)),
      getMaxCtrFromEl(el, phase),
    ]
    |> catMaybes
    |> ListH.Foldable.minimum
    |> (+)(
         getExceptionalCombatTechniqueBonus(
           exceptionalCombatTechnique,
           staticEntry.id,
         ),
       );

  /**
   * Returns if the passed combat technique's combat technique rating can be
   * increased.
   */
  let isIncreasable =
      (
        ~el,
        ~phase,
        ~attrs,
        ~exceptionalCombatTechnique,
        ~staticEntry,
        ~heroEntry: Hero.Skill.t,
      ) =>
    heroEntry.value
    < getMax(~el, ~phase, ~attrs, ~exceptionalCombatTechnique, ~staticEntry);

  let getMinCtrByHunter =
      (onlyOneCombatTechniqueForHunter, staticEntry: Static.CombatTechnique.t) =>
    onlyOneCombatTechniqueForHunter
    && staticEntry.gr === Id.combatTechniqueGroupToInt(Ranged)
      ? Just(10) : Nothing;

  /**
   * Check if the dependencies allow the passed combat technique to be decreased.
   */
  let getMinCtrByDeps = (heroCombatTechniques, heroEntry: Hero.Skill.t) =>
    heroEntry.dependencies
    |> Dependencies.flatten(
         id => heroCombatTechniques |> IntMap.lookup(id) |> getValueDef,
         heroEntry.id,
       )
    |> ensure(ListH.Extra.notNull)
    <&> ListH.Foldable.maximum;

  /**
   * Returns the minimum combat technique rating for the passed combat
   * technique.
   */
  let getMin =
      (
        ~onlyOneCombatTechniqueForHunter,
        ~heroCombatTechniques,
        ~staticEntry,
        ~heroEntry,
      ) =>
    [
      getMinCtrByDeps(heroCombatTechniques, heroEntry),
      getMinCtrByHunter(onlyOneCombatTechniqueForHunter, staticEntry),
    ]
    |> catMaybes
    |> ensure(ListH.Extra.notNull)
    <&> ListH.Foldable.maximum;

  /**
   * Returns if the passed combat technique's combat technique rating can be
   * decreased.
   */
  let isDecreasable =
      (
        ~onlyOneCombatTechniqueForHunter,
        ~heroCombatTechniques,
        ~staticEntry,
        ~heroEntry: Hero.Skill.t,
      ) =>
    heroEntry.value
    > (
        getMin(
          ~onlyOneCombatTechniqueForHunter,
          ~heroCombatTechniques,
          ~staticEntry,
          ~heroEntry,
        )
        |> fromMaybe(6)
      );
};

module Spells = {};

module LiturgicalChants = {};
