module Attributes = {
  open Ley.Option;
  open Hero.Attribute;

  /**
   * Takes an attribute's hero entry that might not exist and returns the value
   * of that attribute. Note: If the attribute is not yet defined, it's value is
   * `8`.
   */
  let getValueDef = option(8, x => x.value);

  /**
   * Takes a skill check's attribute triple and returns it's values.
   */
  let getSkillCheckValues = (mp, (a1, a2, a3)) => (
    Ley.IntMap.lookup(a1, mp) |> getValueDef,
    Ley.IntMap.lookup(a2, mp) |> getValueDef,
    Ley.IntMap.lookup(a3, mp) |> getValueDef,
  );
};

module Skills = {
  open Ley.Option;
  open Ley.Option.Functor;
  open Ley.List;
  open Hero.Activatable;

  /**
   * Takes a skill's hero entry that might not exist and returns the value of
   * that skill. Note: If the skill is not yet defined, it's value is `0`.
   */
  let getValueDef = option(8, (x: Hero.Skill.t) => x.value);

  /**
   * Get the SR maximum bonus from an active Exceptional Skill advantage.
   */
  let getExceptionalSkillBonus = (exceptionalSkill, id) =>
    option(
      0,
      (x: Hero.Activatable.t) =>
        x.active
        |> countBy((a: Hero.Activatable.single) =>
             a.options |> listToOption |> Ley.Option.Foldable.elem(id)
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
    |> (((a1, a2, a3)) => Ley.List.Foldable.maximum([a1, a2, a3]) + 2);

  /**
   * Adds the maximum skill rating defined by the chosen experience level to the
   * list created by `getInitialMaximumList` if the hero is in character
   * creation phase.
   */
  let getMaxSrFromEl = (startEl: Static.ExperienceLevel.t, phase: Ids.Phase.t) =>
    switch (phase) {
    | Outline
    | Definition => Some(startEl.maxSkillRating)
    | Advancement => None
    };

  /**
   * Returns the maximum skill rating for the passed skill.
   */
  let getMax =
      (
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalSkill,
        ~staticEntry: Static.Skill.t,
      ) =>
    [
      Some(getMaxSrByCheckAttrs(heroAttrs, staticEntry.check)),
      getMaxSrFromEl(startEl, phase),
    ]
    |> catOptions
    |> Ley.List.Foldable.minimum
    |> (+)(
         getExceptionalSkillBonus(exceptionalSkill, `Skill(staticEntry.id)),
       );

  /**
   * Returns if the passed skill's skill rating can be increased.
   */
  let isIncreasable =
      (
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalSkill,
        ~staticEntry,
        ~heroEntry: Hero.Skill.t,
      ) =>
    heroEntry.value
    < getMax(~startEl, ~phase, ~heroAttrs, ~exceptionalSkill, ~staticEntry);

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
            [@warning "-8"]
            (
              switch (skillId) {
              | Woodworking => Metalworking
              | Metalworking => Woodworking
              }
            );

          let otherSkillRating =
            skills
            |> Ley.IntMap.lookup(skillToInt(otherSkillId))
            |> getValueDef;

          Some(minimumSum - otherSkillRating);
        | _ => None
        };
      }
    );

  /**
   * Check if the dependencies allow the passed skill to be decreased.
   */
  let getMinSrByDeps = (heroSkills, heroEntry: Hero.Skill.t) =>
    heroEntry.dependencies
    |> Dependencies.Flatten.flattenSkillDependencies(
         id => heroSkills |> Ley.IntMap.lookup(id) |> getValueDef,
         heroEntry.id,
       )
    |> ensure(Ley.List.Extra.notNull)
    <&> Ley.List.Foldable.maximum;

  /**
   * Returns the minimum skill rating for the passed skill.
   */
  let getMin = (~craftInstruments, ~heroSkills, ~staticEntry, ~heroEntry) =>
    [
      getMinSrByDeps(heroSkills, heroEntry),
      getMinSrByCraftInstruments(craftInstruments, heroSkills, staticEntry),
    ]
    |> catOptions
    |> ensure(Ley.List.Extra.notNull)
    <&> Ley.List.Foldable.maximum;

  /**
   * Returns if the passed skill's skill rating can be decreased.
   */
  let isDecreasable =
      (~craftInstruments, ~heroSkills, ~staticEntry, ~heroEntry: Hero.Skill.t) =>
    heroEntry.value
    > (
        getMin(~craftInstruments, ~heroSkills, ~staticEntry, ~heroEntry)
        |> fromOption(0)
      );

  module Routine = {
    open Ley.Option.Monad;

    let attributeThreshold = 13;

    /**
     * Returns the total of missing attribute points for a routine check without
     * using the optional rule for routine checks, because the minimum attribute
     * value is 13 in that case.
     */
    let getMissingPoints = ((a1, a2, a3)) =>
      [a1, a2, a3]
      |> Ley.List.map(a => attributeThreshold - a |> Ley.Int.max(0))
      |> Ley.List.Foldable.sum;

    /**
     * Returns the minimum check modifier from which a routine check is possible
     * without using the optional rule for routine checks.
     */
    let getBaseMinCheckMod = sr =>
      - Js.Math.floor_int((Js.Int.toFloat(sr) -. 1.0) /. 3.0) + 3;

    /**
     * Returns the minimum check modifier from which a routine check is possible for
     * the passed skill rating. Returns `None` if no routine check is possible,
     * otherwise a `Some` of a pair, where the first value is the minimum check
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
            ? Some((dependentCheckMod, missingPoints > 0)) : None;
        }
      );
  };
};

module CombatTechniques = {
  open Ley.List;
  open Ley.Option;
  open Ley.Option.Functor;

  let getMaxPrimaryAttributeValueById = (heroAttrs, ps) =>
    ps
    |> map(p => Ley.IntMap.lookup(p, heroAttrs) |> Attributes.getValueDef)
    |> (<+>)(0)
    |> Ley.List.Foldable.maximum;

  let attributeValueToMod = value => Ley.Int.max(0, (value - 8) / 3);

  let getPrimaryAttributeMod = (heroAttrs, ps) =>
    ps |> getMaxPrimaryAttributeValueById(heroAttrs) |> attributeValueToMod;

  /**
   * Takes a combat technique's hero entry that might not exist and returns the
   * value of that combat technique. Note: If the combat technique is not yet
   * defined, it's value is `6`.
   */
  let getValueDef = option(6, (x: Hero.Skill.t) => x.value);

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
      ? Some(
          heroEntry
          |> getValueDef
          |> Js.Int.toFloat
          |> (/.)(2.0)
          |> Js.Math.round
          |> Js.Math.floor
          |> (+)(getPrimaryAttributeMod(heroAttrs, staticEntry.primary)),
        )
      : None;

  /**
   * Get the CtR maximum bonus from an active Exceptional Combat Technique
   * advantage.
   */
  let getExceptionalCombatTechniqueBonus = (exceptionalCombatTechnique, id) =>
    option(
      0,
      (x: Hero.Activatable.t) =>
        x.active
        |> listToOption
        <&> (
          a =>
            a.options
            |> listToOption
            |> Ley.Option.Foldable.elem(`CombatTechnique(id))
            |> (hasBonus => hasBonus ? 1 : 0)
        )
        |> fromOption(0),
      exceptionalCombatTechnique,
    );

  let getMaxCtrFromEl = (el: Static.ExperienceLevel.t, phase: Ids.Phase.t) =>
    switch (phase) {
    | Outline
    | Definition => Some(el.maxCombatTechniqueRating)
    | Advancement => None
    };

  /**
   * Returns the maximum combat technique rating for the passed combat
   * technique.
   */
  let getMax =
      (
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalCombatTechnique,
        ~staticEntry: Static.CombatTechnique.t,
      ) =>
    [
      Some(getMaxPrimaryAttributeValueById(heroAttrs, staticEntry.primary)),
      getMaxCtrFromEl(startEl, phase),
    ]
    |> catOptions
    |> Ley.List.Foldable.minimum
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
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalCombatTechnique,
        ~staticEntry,
        ~heroEntry: Hero.Skill.t,
      ) =>
    heroEntry.value
    < getMax(
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalCombatTechnique,
        ~staticEntry,
      );

  let getMinCtrByHunter =
      (onlyOneCombatTechniqueForHunter, staticEntry: Static.CombatTechnique.t) =>
    onlyOneCombatTechniqueForHunter
    && staticEntry.gr === Id.combatTechniqueGroupToInt(Ranged)
      ? Some(10) : None;

  /**
   * Check if the dependencies allow the passed combat technique to be decreased.
   */
  let getMinCtrByDeps = (heroCombatTechniques, heroEntry: Hero.Skill.t) =>
    heroEntry.dependencies
    |> Dependencies.Flatten.flattenSkillDependencies(
         id => heroCombatTechniques |> Ley.IntMap.lookup(id) |> getValueDef,
         heroEntry.id,
       )
    |> ensure(Ley.List.Extra.notNull)
    <&> Ley.List.Foldable.maximum;

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
    |> catOptions
    |> ensure(Ley.List.Extra.notNull)
    <&> Ley.List.Foldable.maximum;

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
        |> fromOption(6)
      );
};

module Spells = {
  open Ley.Option;
  open Ley.Option.Functor;
  open Ley.Option.Monad;
  open Hero.ActivatableSkill;

  /**
   * Takes a spell's hero entry that might not exist and returns the
   * value of that spell. Note: If the spell is not yet
   * defined, it's value is `None`.
   */
  let getValueDef = option(Inactive, (x: Hero.ActivatableSkill.t) => x.value);

  let flattenValue = value =>
    switch (value) {
    | Active(sr) => sr
    | Inactive => 0
    };

  let isActive =
    option(false, (x: Hero.ActivatableSkill.t) =>
      switch (x.value) {
      | Active(_) => true
      | Inactive => false
      }
    );

  /**
   * Returns the SR maximum if there is no property knowledge active for the passed
   * spell.
   */
  let getMaxSrFromPropertyKnowledge =
      (propertyKnowledge, staticEntry: Static.Spell.t) =>
    propertyKnowledge
    <&> Activatable.SelectOptions.getActiveOptions1
    |> option(
         true,
         Ley.List.Foldable.notElem(`Generic(staticEntry.property)),
       )
    |> (hasRestriction => hasRestriction ? Some(14) : None);

  /**
   * Returns the maximum skill rating for the passed spell.
   */
  let getMax =
      (
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalSkill,
        ~propertyKnowledge,
        ~staticEntry: Static.Spell.t,
      ) =>
    [
      Some(Skills.getMaxSrByCheckAttrs(heroAttrs, staticEntry.check)),
      Skills.getMaxSrFromEl(startEl, phase),
      getMaxSrFromPropertyKnowledge(propertyKnowledge, staticEntry),
    ]
    |> catOptions
    |> Ley.List.Foldable.minimum
    |> (+)(
         Skills.getExceptionalSkillBonus(
           exceptionalSkill,
           `Spell(staticEntry.id),
         ),
       );

  /**
   * Checks if the passed spell's skill rating can be increased.
   */
  let isIncreasable =
      (
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalSkill,
        ~propertyKnowledge,
        ~staticEntry,
        ~heroEntry: Hero.ActivatableSkill.t,
      ) =>
    flattenValue(heroEntry.value)
    < getMax(
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalSkill,
        ~propertyKnowledge,
        ~staticEntry,
      );

  /**
   * Returns a list of spells with SR >= 10, grouped by their property.
   */
  let getValidSpellsForPropertyKnowledgeCounter = (staticSpells, heroSpells) =>
    heroSpells
    |> Ley.IntMap.elems
    |> Ley.IntMap.countByM((x: Hero.ActivatableSkill.t) =>
         switch (x.value) {
         | Active(value) =>
           value
           |> ensure((>)(10))
           >>= (_ => Ley.IntMap.lookup(x.id, staticSpells))
           <&> ((spell: Static.Spell.t) => spell.property)
         | Inactive => None
         }
       );

  /**
   * Check if the active property knowledges allow the passed spell to be
   * decreased. (There must be at leased 3 spells of the respective property
   * active.)
   */
  let getMinSrFromPropertyKnowledge =
      (
        counter,
        activePropertyKnowledges,
        staticEntry: Static.Spell.t,
        heroEntry: Hero.ActivatableSkill.t,
      ) =>
    activePropertyKnowledges
    // Is spell part of dependencies of any active Property
    // Knowledge?
    |> Ley.List.Foldable.any((sid: Hero.Activatable.optionId) =>
         switch (sid) {
         | `Generic(x) => x === staticEntry.property
         | _ => false
         }
       )
    // If yes, check if spell is above 10 and if there are not
    // enough spells above 10 to allow a decrease below 10
    |> (
      hasActivePropertyKnowledge =>
        hasActivePropertyKnowledge
          ? counter
            |> Ley.IntMap.lookup(staticEntry.property)
            >>= (
              count =>
                flattenValue(heroEntry.value) >= 10 && count <= 3
                  ? Some(10) : None
            )
          : None
    );

  /**
   * Check if the dependencies allow the passed spell to be decreased.
   */
  let getMinSrByDeps = (heroSpells, heroEntry: Hero.ActivatableSkill.t) =>
    heroEntry.dependencies
    |> Dependencies.Flatten.flattenActivatableSkillDependencies(
         id => heroSpells |> Ley.IntMap.lookup(id) |> getValueDef,
         heroEntry.id,
       )
    |> ensure(Ley.List.Extra.notNull)
    >>= Ley.List.Foldable.foldr(
          (d, acc) =>
            option(Some(d), prev => Some(Ley.Int.max(prev, d)), acc),
          None,
        );

  /**
   * Returns the minimum skill rating for the passed skill.
   *
   * Optimized for when the three first params are only called once in a loop,
   * as more expensive calculations are cached then.
   */
  let getMin = (~propertyKnowledge, ~staticSpells, ~heroSpells) => {
    let counter =
      getValidSpellsForPropertyKnowledgeCounter(staticSpells, heroSpells);
    let activePropertyKnowledges =
      Activatable.SelectOptions.getActiveOptions1(propertyKnowledge);

    (~staticEntry, ~heroEntry) =>
      [
        getMinSrByDeps(heroSpells, heroEntry),
        getMinSrFromPropertyKnowledge(
          counter,
          activePropertyKnowledges,
          staticEntry,
          heroEntry,
        ),
      ]
      |> catOptions
      |> ensure(Ley.List.Extra.notNull)
      <&> Ley.List.Foldable.maximum;
  };

  /**
   * Returns if the passed spell's skill rating can be decreased.
   */
  let isDecreasable = (~propertyKnowledge, ~staticSpells, ~heroSpells) => {
    let getMinCached = getMin(~propertyKnowledge, ~staticSpells, ~heroSpells);

    (~staticEntry, ~heroEntry: Hero.ActivatableSkill.t) =>
      flattenValue(heroEntry.value)
      > (getMinCached(~staticEntry, ~heroEntry) |> fromOption(0));
  };
};

module LiturgicalChants = {
  open Ley.Option;
  open Ley.Option.Functor;
  open Ley.Option.Monad;
  open Hero.ActivatableSkill;

  /**
   * Takes a liturgical chant's hero entry that might not exist and returns the
   * value of that liturgical chant. Note: If the liturgical chant is not yet
   * defined, it's value is `None`.
   */
  let getValueDef = option(Inactive, (x: Hero.ActivatableSkill.t) => x.value);

  let flattenValue = value =>
    switch (value) {
    | Active(sr) => sr
    | Inactive => 0
    };

  let isActive =
    option(false, (x: Hero.ActivatableSkill.t) =>
      switch (x.value) {
      | Active(_) => true
      | Inactive => false
      }
    );

  /**
   * Returns the SR maximum if there is no aspect knowledge active for the
   * passed spell.
   */
  let getMaxSrFromAspectKnowledge =
      (aspectKnowledge, staticEntry: Static.LiturgicalChant.t) =>
    aspectKnowledge
    <&> Activatable.SelectOptions.getActiveOptions1
    |> option(true, actives =>
         Ley.List.Foldable.all(
           aspect => Ley.List.Foldable.notElem(`Generic(aspect), actives),
           staticEntry.aspects,
         )
       )
    |> (hasRestriction => hasRestriction ? Some(14) : None);

  /**
   * Returns the maximum skill rating for the passed spell.
   */
  let getMax =
      (
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalSkill,
        ~aspectKnowledge,
        ~staticEntry: Static.LiturgicalChant.t,
      ) =>
    [
      Some(Skills.getMaxSrByCheckAttrs(heroAttrs, staticEntry.check)),
      Skills.getMaxSrFromEl(startEl, phase),
      getMaxSrFromAspectKnowledge(aspectKnowledge, staticEntry),
    ]
    |> catOptions
    |> Ley.List.Foldable.minimum
    |> (+)(
         Skills.getExceptionalSkillBonus(
           exceptionalSkill,
           `Spell(staticEntry.id),
         ),
       );

  /**
   * Checks if the passed spell's skill rating can be increased.
   */
  let isIncreasable =
      (
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalSkill,
        ~aspectKnowledge,
        ~staticEntry,
        ~heroEntry: Hero.ActivatableSkill.t,
      ) =>
    flattenValue(heroEntry.value)
    < getMax(
        ~startEl,
        ~phase,
        ~heroAttrs,
        ~exceptionalSkill,
        ~aspectKnowledge,
        ~staticEntry,
      );

  /**
   * Returns a list of liturgical chants with SR >= 10, grouped by their aspect.
   */
  let getValidLiturgicalChantsForAspectKnowledgeCounter =
      (staticLiturgicalChants, heroLiturgicalChants) =>
    heroLiturgicalChants
    |> Ley.IntMap.Foldable.foldr(
         (x: Hero.ActivatableSkill.t, acc) =>
           switch (x.value) {
           | Active(value) =>
             value
             |> ensure((>)(10))
             >>= (_ => Ley.IntMap.lookup(x.id, staticLiturgicalChants))
             |> option(acc, (chant: Static.LiturgicalChant.t) =>
                  Ley.List.Foldable.foldr(
                    aspect =>
                      Ley.IntMap.alter(
                        count =>
                          count
                          |> fromOption(0)
                          |> Ley.Int.inc
                          |> (x => Some(x)),
                        aspect,
                      ),
                    acc,
                    chant.aspects,
                  )
                )
           | Inactive => acc
           },
         Ley.IntMap.empty,
       );

  /**
   * Check if the active property knowledges allow the passed spell to be
   * decreased. (There must be at leased 3 spells of the respective property
   * active.)
   */
  let getMinSrFromAspectKnowledge =
      (
        counter,
        activeAspectKnowledges,
        staticEntry: Static.LiturgicalChant.t,
        heroEntry: Hero.ActivatableSkill.t,
      ) =>
    activeAspectKnowledges
    // Is liturgical chant part of dependencies of any active Aspect Knowledge?
    |> Ley.List.Foldable.any((sid: Hero.Activatable.optionId) =>
         switch (sid) {
         | `Generic(x) => Ley.List.Foldable.elem(x, staticEntry.aspects)
         | _ => false
         }
       )
    // If yes, check if spell is above 10 and if there are not enough spells
    // above 10 to allow a decrease below 10
    |> (
      hasActiveAspectKnowledge =>
        hasActiveAspectKnowledge
          ? staticEntry.aspects
            |> Ley.List.Foldable.any(aspect =>
                 Ley.IntMap.lookup(aspect, counter)
                 |> option(false, count =>
                      flattenValue(heroEntry.value) >= 10 && count <= 3
                    )
               )
            |> (isRequired => isRequired ? Some(10) : None)
          : None
    );

  /**
   * Check if the dependencies allow the passed spell to be decreased.
   */
  let getMinSrByDeps =
      (heroLiturgicalChants, heroEntry: Hero.ActivatableSkill.t) =>
    heroEntry.dependencies
    |> Dependencies.Flatten.flattenActivatableSkillDependencies(
         id => heroLiturgicalChants |> Ley.IntMap.lookup(id) |> getValueDef,
         heroEntry.id,
       )
    |> ensure(Ley.List.Extra.notNull)
    >>= Ley.List.Foldable.foldr(
          (d, acc) =>
            option(Some(d), prev => Some(Ley.Int.max(prev, d)), acc),
          None,
        );

  /**
   * Returns the minimum skill rating for the passed skill.
   *
   * Optimized for when the three first params are only called once in a loop,
   * as more expensive calculations are cached then.
   */
  let getMin =
      (~aspectKnowledge, ~staticLiturgicalChants, ~heroLiturgicalChants) => {
    let counter =
      getValidLiturgicalChantsForAspectKnowledgeCounter(
        staticLiturgicalChants,
        heroLiturgicalChants,
      );
    let activeAspectKnowledges =
      Activatable.SelectOptions.getActiveOptions1(aspectKnowledge);

    (~staticEntry, ~heroEntry) =>
      [
        getMinSrByDeps(heroLiturgicalChants, heroEntry),
        getMinSrFromAspectKnowledge(
          counter,
          activeAspectKnowledges,
          staticEntry,
          heroEntry,
        ),
      ]
      |> catOptions
      |> ensure(Ley.List.Extra.notNull)
      <&> Ley.List.Foldable.maximum;
  };

  /**
   * Returns if the passed spell's skill rating can be decreased.
   */
  let isDecreasable =
      (~aspectKnowledge, ~staticLiturgicalChants, ~heroLiturgicalChants) => {
    let getMinCached =
      getMin(
        ~aspectKnowledge,
        ~staticLiturgicalChants,
        ~heroLiturgicalChants,
      );

    (~staticEntry, ~heroEntry: Hero.ActivatableSkill.t) =>
      flattenValue(heroEntry.value)
      > (getMinCached(~staticEntry, ~heroEntry) |> fromOption(0));
  };
};
