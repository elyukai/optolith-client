open Ley_List;
open Ley_Option;
open Ley_Option.Functor;

let getMaxPrimaryAttributeValueById = (heroAttrs, ps) =>
  ps
  |> map(p => Ley_IntMap.lookup(p, heroAttrs) |> Attributes.getValueDef)
  |> (<+>)(0)
  |> Ley_List.Foldable.maximum;

let attributeValueToMod = value => Ley_Int.max(0, (value - 8) / 3);

let getPrimaryAttributeMod = (heroAttrs, ps) =>
  ps |> getMaxPrimaryAttributeValueById(heroAttrs) |> attributeValueToMod;

/**
 * Takes a combat technique's hero entry that might not exist and returns the
 * value of that combat technique. Note: If the combat technique is not yet
 * defined, it's value is `6`.
 */
let getValueDef = option(6, (x: Hero.Skill.t) => x.value);

let getAttack = (heroAttrs, staticEntry: CombatTechnique.t, heroEntry) =>
  heroEntry
  |> getValueDef
  |> (+)(
       getPrimaryAttributeMod(
         heroAttrs,
         staticEntry.gr === 1
           ? [Id.attributeToInt(Courage)] : staticEntry.primary,
       ),
     );

let getParry = (heroAttrs, staticEntry: CombatTechnique.t, heroEntry) =>
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
          |> Ley_Option.Foldable.elem(`CombatTechnique(id))
          |> (hasBonus => hasBonus ? 1 : 0)
      )
      |> fromOption(0),
    exceptionalCombatTechnique,
  );

let getMaxCtrFromEl = (el: ExperienceLevel.t, phase: Id.phase) =>
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
      ~staticEntry: CombatTechnique.t,
    ) =>
  [
    Some(getMaxPrimaryAttributeValueById(heroAttrs, staticEntry.primary)),
    getMaxCtrFromEl(startEl, phase),
  ]
  |> catOptions
  |> Ley_List.Foldable.minimum
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
    (onlyOneCombatTechniqueForHunter, staticEntry: CombatTechnique.t) =>
  onlyOneCombatTechniqueForHunter
  && staticEntry.gr === Id.combatTechniqueGroupToInt(Ranged)
    ? Some(10) : None;

/**
 * Check if the dependencies allow the passed combat technique to be decreased.
 */
let getMinCtrByDeps = (heroCombatTechniques, heroEntry: Hero.Skill.t) =>
  heroEntry.dependencies
  |> Dependencies.Flatten.flattenSkillDependencies(
       id => heroCombatTechniques |> Ley_IntMap.lookup(id) |> getValueDef,
       heroEntry.id,
     )
  |> ensure(Ley_List.Extra.notNull)
  <&> Ley_List.Foldable.maximum;

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
  |> ensure(Ley_List.Extra.notNull)
  <&> Ley_List.Foldable.maximum;

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
