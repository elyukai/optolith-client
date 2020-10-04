open Ley_Option;
open Ley_Option.Infix;

module F = Ley_Function;
module IM = Ley_IntMap;
module L = Ley_List;
module O = Ley_Option;

/**
 * Returns the SR maximum if there is no property knowledge active for the passed
 * spell.
 */
let getMaxSrFromPropertyKnowledge =
    (propertyKnowledge, staticEntry: Spell.Static.t) =>
  propertyKnowledge
  <&> Activatable_SelectOptions.mapActiveOptions1(
        [@warning "-4"]
        (
          fun
          | Preset((Generic, id)) => Some(id)
          | _ => None
        ),
      )
  |> option(true, L.notElem(staticEntry.property))
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
      ~staticEntry: Spell.Static.t,
    ) =>
  [
    Some(Skills.getMaxSrByCheckAttrs(heroAttrs, staticEntry.check)),
    Skills.getMaxSrFromEl(startEl, phase),
    getMaxSrFromPropertyKnowledge(propertyKnowledge, staticEntry),
  ]
  |> catOptions
  |> L.minimum
  |> (+)(
       Skills.getExceptionalSkillBonus(
         exceptionalSkill,
         (Spell, staticEntry.id),
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
      ~heroEntry: ActivatableSkill.Dynamic.t,
    ) =>
  ActivatableSkill.Dynamic.valueToInt(heroEntry.value)
  < getMax(
      ~startEl,
      ~phase,
      ~heroAttrs,
      ~exceptionalSkill,
      ~propertyKnowledge,
      ~staticEntry,
    );

module PropertyKnowledge = {
  let minimumSkillRating = 10;

  let minimumAmount = 3;

  let isOnMinimum = (spell: ActivatableSkill.Dynamic.t) =>
    switch (spell.value) {
    | Active(value) => value >= minimumSkillRating
    | Inactive => false
    };

  let addToCounter = (spell: Spell.Static.t) =>
    IM.insertWith((+), spell.property, 1);

  /**
   * Returns a count of spells with SR >= 10, grouped by their property.
   */
  let countApplicable = (staticSpells, heroSpells) =>
    IM.foldrWithKey(
      (spellId, spell) =>
        isOnMinimum(spell)
          ? IM.lookup(spellId, staticSpells) |> O.option(F.id, addToCounter)
          : F.id,
      IM.empty,
      heroSpells,
    );

  let counterToAvailable =
    IM.foldrWithKey(
      (propertyId, count) =>
        count >= minimumAmount ? L.cons(propertyId) : F.id,
      [],
    );

  /**
   * `getAvailableProperties staticSpells heroSpells` returns a list containing
   * all property ids of which at least 3 spells are on SR 10 or higher.
   */
  let getAvailableProperties = (staticSpells, heroSpells) =>
    heroSpells |> countApplicable(staticSpells) |> counterToAvailable;

  /**
   * Check if the active property knowledges allow the passed spell to be
   * decreased. (There must be at leased 3 spells of the respective property
   * active.)
   */
  let getMinSr =
      (
        counter,
        activePropertyKnowledges,
        staticEntry: Spell.Static.t,
        heroEntry: ActivatableSkill.Dynamic.t,
      ) =>
    activePropertyKnowledges
    // Is spell part of dependencies of any active Property
    // Knowledge?
    |> Ley_List.any((sid: Id.Activatable.Option.t) =>
         [@warning "-4"]
         (
           switch (sid) {
           | Preset((Generic, x)) => x === staticEntry.property
           | _ => false
           }
         )
       )
    // If yes, check if spell is above 10 and if there are not
    // enough spells above 10 to allow a decrease below 10
    |> (
      hasActivePropertyKnowledge =>
        hasActivePropertyKnowledge
          ? counter
            |> Ley_IntMap.lookup(staticEntry.property)
            >>= (
              count =>
                ActivatableSkill.Dynamic.valueToInt(heroEntry.value) >= 10
                && count <= 3
                  ? Some(10) : None
            )
          : None
    );
};

/**
 * Check if the dependencies allow the passed spell to be decreased.
 */
let getMinSrByDeps = (heroSpells, heroEntry: ActivatableSkill.Dynamic.t) =>
  heroEntry.dependencies
  |> Dependencies.Flatten.flattenActivatableSkillDependencies(
       id =>
         heroSpells
         |> Ley_IntMap.lookup(id)
         |> ActivatableSkill.Dynamic.getValueDef,
       heroEntry.id,
     )
  |> ensure(Ley_List.Extra.notNull)
  >>= Ley_List.foldr(
        (d, acc) =>
          option(Some(d), prev => Some(Ley_Int.max(prev, d)), acc),
        None,
      );

/**
 * Returns the minimum skill rating for the passed skill.
 *
 * Optimized for when the three first params are only called once in a loop,
 * as more expensive calculations are cached then.
 */
let getMin = (~propertyKnowledge, ~staticSpells, ~heroSpells) => {
  let counter = PropertyKnowledge.countApplicable(staticSpells, heroSpells);

  let activePropertyKnowledges =
    Activatable_SelectOptions.getActiveOptions1(propertyKnowledge);

  (~staticEntry, ~heroEntry) =>
    [
      getMinSrByDeps(heroSpells, heroEntry),
      PropertyKnowledge.getMinSr(
        counter,
        activePropertyKnowledges,
        staticEntry,
        heroEntry,
      ),
    ]
    |> catOptions
    |> ensure(Ley_List.Extra.notNull)
    <&> Ley_List.maximum;
};

/**
 * Returns if the passed spell's skill rating can be decreased.
 */
let isDecreasable = (~propertyKnowledge, ~staticSpells, ~heroSpells) => {
  let getMinCached = getMin(~propertyKnowledge, ~staticSpells, ~heroSpells);

  (~staticEntry, ~heroEntry: ActivatableSkill.Dynamic.t) =>
    ActivatableSkill.Dynamic.valueToInt(heroEntry.value)
    > (getMinCached(~staticEntry, ~heroEntry) |> fromOption(0));
};
