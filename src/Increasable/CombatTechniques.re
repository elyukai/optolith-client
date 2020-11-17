open Ley_List;
open Ley_Option;
open Ley_Option.Infix;

let getMaxPrimaryAttributeValueById = (heroAttrs, ps) =>
  ps
  |> map(p =>
       Ley_IntMap.lookup(p, heroAttrs) |> Attribute.Dynamic.getValueDef
     )
  |> (<+>)(0)
  |> Ley_List.maximum;

let attributeValueToMod = value => Ley_Int.max(0, (value - 8) / 3);

let getPrimaryAttributeMod = (heroAttrs, ps) =>
  ps |> getMaxPrimaryAttributeValueById(heroAttrs) |> attributeValueToMod;

let getAttack = (heroAttrs, staticEntry: CombatTechnique.Static.t, heroEntry) =>
  heroEntry
  |> CombatTechnique.Dynamic.getValueDef
  |> (+)(
       getPrimaryAttributeMod(
         heroAttrs,
         staticEntry.gr === 1
           ? [Id.Attribute.toInt(Courage)] : staticEntry.primary,
       ),
     );

let getParry = (heroAttrs, staticEntry: CombatTechnique.Static.t, heroEntry) =>
  staticEntry.gr === Id.CombatTechnique.Group.toInt(Melee)
  && staticEntry.id !== Id.CombatTechnique.toInt(ChainWeapons)
  && staticEntry.id !== Id.CombatTechnique.toInt(Brawling)
    ? Some(
        heroEntry
        |> CombatTechnique.Dynamic.getValueDef
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
    (x: Activatable_Dynamic.t) =>
      x.active
      |> listToOption
      <&> (
        a =>
          a.options
          |> listToOption
          |> Ley_Option.elem(
               Id.Activatable.Option.Preset(CombatTechnique(id)),
             )
          |> (hasBonus => hasBonus ? 1 : 0)
      )
      |> fromOption(0),
    exceptionalCombatTechnique,
  );

let getMaxCtrFromEl = (el: ExperienceLevel.t, phase) =>
  Id.Phase.(
    switch (phase) {
    | Outline
    | Definition => Some(el.maxCombatTechniqueRating)
    | Advancement => None
    }
  );

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
      ~staticEntry: CombatTechnique.Static.t,
    ) =>
  [
    Some(getMaxPrimaryAttributeValueById(heroAttrs, staticEntry.primary)),
    getMaxCtrFromEl(startEl, phase),
  ]
  |> catOptions
  |> Ley_List.minimum
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
      ~heroEntry: CombatTechnique.Dynamic.t,
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
    (onlyOneCombatTechniqueForHunter, staticEntry: CombatTechnique.Static.t) =>
  onlyOneCombatTechniqueForHunter
  && staticEntry.gr === Id.CombatTechnique.Group.toInt(Ranged)
    ? Some(10) : None;

/**
 * Check if the dependencies allow the passed combat technique to be decreased.
 */
let getMinCtrByDeps =
    (heroCombatTechniques, heroEntry: CombatTechnique.Dynamic.t) =>
  heroEntry.dependencies
  |> Dependencies.Flatten.flattenSkillDependencies(
       id =>
         heroCombatTechniques
         |> Ley_IntMap.lookup(id)
         |> CombatTechnique.Dynamic.getValueDef,
       heroEntry.id,
     )
  |> ensure(Ley_List.Extra.notNull)
  <&> Ley_List.maximum;

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
  <&> Ley_List.maximum;

/**
 * Returns if the passed combat technique's combat technique rating can be
 * decreased.
 */
let isDecreasable =
    (
      ~onlyOneCombatTechniqueForHunter,
      ~heroCombatTechniques,
      ~staticEntry,
      ~heroEntry: CombatTechnique.Dynamic.t,
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
