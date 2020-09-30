open Ley_Option;
open Ley_Option.Functor;
open Ley_List;
open Hero.Activatable;

/**
 * Get the SR maximum bonus from an active Exceptional Skill advantage.
 */
let getExceptionalSkillBonus = (exceptionalSkill, id) =>
  option(
    0,
    (x: Hero.Activatable.t) =>
      x.active
      |> countBy((a: Hero.Activatable.single) =>
           a.options
           |> listToOption
           |> Ley_Option.Foldable.elem(Id.Activatable.Option.Preset(id))
         ),
    exceptionalSkill,
  );

/**
 * Creates the base for a list for calculating the maximum of a skill based on
 * the skill check's attributes' values.
 */
let getMaxSrByCheckAttrs = (mp, check) =>
  check
  |> SkillCheck.getValues(mp)
  |> (((a1, a2, a3)) => Ley_List.Foldable.maximum([a1, a2, a3]) + 2);

/**
 * Adds the maximum skill rating defined by the chosen experience level to the
 * list created by `getInitialMaximumList` if the hero is in character
 * creation phase.
 */
let getMaxSrFromEl = (startEl: ExperienceLevel.t, phase) =>
  Id.Phase.(
    switch (phase) {
    | Outline
    | Definition => Some(startEl.maxSkillRating)
    | Advancement => None
    }
  );

/**
 * Returns the maximum skill rating for the passed skill.
 */
let getMax =
    (
      ~startEl,
      ~phase,
      ~heroAttrs,
      ~exceptionalSkill,
      ~staticEntry: Skill.Static.t,
    ) =>
  [
    Some(getMaxSrByCheckAttrs(heroAttrs, staticEntry.check)),
    getMaxSrFromEl(startEl, phase),
  ]
  |> catOptions
  |> Ley_List.Foldable.minimum
  |> (+)(
       getExceptionalSkillBonus(exceptionalSkill, (Skill, staticEntry.id)),
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
      ~heroEntry: Skill.Dynamic.t,
    ) =>
  heroEntry.value
  < getMax(~startEl, ~phase, ~heroAttrs, ~exceptionalSkill, ~staticEntry);

let getMinSrByCraftInstruments =
    (craftInstruments, skills, staticEntry: Skill.Static.t) =>
  Id.Skill.(
    [@warning "-4"]
    {
      switch (fromInt(staticEntry.id)) {
      | Woodworking as skillId
      | Metalworking as skillId
          when Activatable_Accessors.isActiveM(craftInstruments) =>
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
          skills |> Ley_IntMap.lookup(toInt(otherSkillId)) |> getValueDef;

        Some(minimumSum - otherSkillRating);
      | _ => None
      };
    }
  );

/**
 * Check if the dependencies allow the passed skill to be decreased.
 */
let getMinSrByDeps = (heroSkills, heroEntry: Skill.Dynamic.t) =>
  heroEntry.dependencies
  |> Dependencies.Flatten.flattenSkillDependencies(
       id => heroSkills |> Ley_IntMap.lookup(id) |> getValueDef,
       heroEntry.id,
     )
  |> ensure(Ley_List.Extra.notNull)
  <&> Ley_List.Foldable.maximum;

/**
 * Returns the minimum skill rating for the passed skill.
 */
let getMin = (~craftInstruments, ~heroSkills, ~staticEntry, ~heroEntry) =>
  [
    getMinSrByDeps(heroSkills, heroEntry),
    getMinSrByCraftInstruments(craftInstruments, heroSkills, staticEntry),
  ]
  |> catOptions
  |> ensure(Ley_List.Extra.notNull)
  <&> Ley_List.Foldable.maximum;

/**
 * Returns if the passed skill's skill rating can be decreased.
 */
let isDecreasable =
    (
      ~craftInstruments,
      ~heroSkills,
      ~staticEntry,
      ~heroEntry: Skill.Dynamic.t,
    ) =>
  heroEntry.value
  > (
      getMin(~craftInstruments, ~heroSkills, ~staticEntry, ~heroEntry)
      |> fromOption(0)
    );

module Routine = {
  open Ley_Option.Monad;

  let attributeThreshold = 13;

  /**
   * Returns the total of missing attribute points for a routine check without
   * using the optional rule for routine checks, because the minimum attribute
   * value is 13 in that case.
   */
  let getMissingPoints = ((a1, a2, a3)) =>
    [a1, a2, a3]
    |> Ley_List.map(a => attributeThreshold - a |> Ley_Int.max(0))
    |> Ley_List.Foldable.sum;

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
