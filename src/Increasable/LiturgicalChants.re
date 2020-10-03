open Ley_Option;
open Ley_Option;
open Hero.ActivatableSkill;

module F = Ley_Function;
module IM = Ley_IntMap;
module L = Ley_List;
module O = Ley_Option;

/**
 * Returns the SR maximum if there is no aspect knowledge active for the
 * passed spell.
 */
let getMaxSrFromAspectKnowledge =
    (aspectKnowledge, staticEntry: LiturgicalChant.Static.t) =>
  aspectKnowledge
  <&> Activatable_SelectOptions.getActiveOptions1
  |> option(true, actives =>
       Ley_List.Foldable.all(
         aspect =>
           Ley_List.Foldable.notElem(
             Id.Activatable.Option.Preset((Generic, aspect)),
             actives,
           ),
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
      ~staticEntry: LiturgicalChant.Static.t,
    ) =>
  [
    Some(Skills.getMaxSrByCheckAttrs(heroAttrs, staticEntry.check)),
    Skills.getMaxSrFromEl(startEl, phase),
    getMaxSrFromAspectKnowledge(aspectKnowledge, staticEntry),
  ]
  |> catOptions
  |> Ley_List.Foldable.minimum
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
      ~aspectKnowledge,
      ~staticEntry,
      ~heroEntry: Hero.ActivatableSkill.t,
    ) =>
  ActivatableSkills.valueToInt(heroEntry.value)
  < getMax(
      ~startEl,
      ~phase,
      ~heroAttrs,
      ~exceptionalSkill,
      ~aspectKnowledge,
      ~staticEntry,
    );

module AspectKnowledge = {
  let minimumSkillRating = 10;

  let minimumAmount = 3;

  let isOnMinimum = (spell: Hero.ActivatableSkill.t) =>
    switch (spell.value) {
    | Active(value) => value >= minimumSkillRating
    | Inactive => false
    };

  let addToCounter = (chant: LiturgicalChant.Static.t, counter) =>
    L.Foldable.foldr(
      aspect => IM.insertWith((+), aspect, 1),
      counter,
      chant.aspects,
    );

  /**
   * Returns a count of liturgical chants with SR >= 10, grouped by their
   * property.
   */
  let countApplicable = (staticChants, heroChants) =>
    IM.foldrWithKey(
      (chantId, chant) =>
        isOnMinimum(chant)
          ? IM.lookup(chantId, staticChants) |> O.option(F.id, addToCounter)
          : F.id,
      IM.empty,
      heroChants,
    );

  let counterToAvailable =
    IM.foldrWithKey(
      (aspectId, count) => count >= minimumAmount ? L.cons(aspectId) : F.id,
      [],
    );

  /**
   * `getAvailableAspects staticChants heroChants` returns a list containing all
   * aspect ids of which at least 3 chants are on SR 10 or higher.
   */
  let getAvailableAspects = (staticChants, heroChants) =>
    heroChants |> countApplicable(staticChants) |> counterToAvailable;

  /**
   * Check if the active property knowledges allow the passed spell to be
   * decreased. (There must be at leased 3 spells of the respective property
   * active.)
   */
  let getMinSr =
      (
        counter,
        activeAspectKnowledges,
        staticEntry: LiturgicalChant.Static.t,
        heroEntry: Hero.ActivatableSkill.t,
      ) =>
    activeAspectKnowledges
    // Is liturgical chant part of dependencies of any active Aspect Knowledge?
    |> L.Foldable.any((sid: Id.Activatable.Option.t) =>
         [@warning "-4"]
         (
           switch (sid) {
           | Preset((Generic, x)) => L.Foldable.elem(x, staticEntry.aspects)
           | _ => false
           }
         )
       )
    // If yes, check if spell is above 10 and if there are not enough spells
    // above 10 to allow a decrease below 10
    |> (
      hasActiveAspectKnowledge =>
        hasActiveAspectKnowledge
          ? staticEntry.aspects
            |> L.Foldable.any(aspect =>
                 IM.lookup(aspect, counter)
                 |> option(false, count =>
                      ActivatableSkills.valueToInt(heroEntry.value) >= 10
                      && count <= 3
                    )
               )
            |> (isRequired => isRequired ? Some(10) : None)
          : None
    );
};

/**
 * Check if the dependencies allow the passed spell to be decreased.
 */
let getMinSrByDeps =
    (heroLiturgicalChants, heroEntry: Hero.ActivatableSkill.t) =>
  heroEntry.dependencies
  |> Dependencies.Flatten.flattenActivatableSkillDependencies(
       id =>
         heroLiturgicalChants
         |> Ley_IntMap.lookup(id)
         |> ActivatableSkills.getValueDef,
       heroEntry.id,
     )
  |> ensure(Ley_List.Extra.notNull)
  >>= Ley_List.Foldable.foldr(
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
let getMin =
    (~aspectKnowledge, ~staticLiturgicalChants, ~heroLiturgicalChants) => {
  let counter =
    AspectKnowledge.countApplicable(
      staticLiturgicalChants,
      heroLiturgicalChants,
    );

  let activeAspectKnowledges =
    Activatable_SelectOptions.getActiveOptions1(aspectKnowledge);

  (~staticEntry, ~heroEntry) =>
    [
      getMinSrByDeps(heroLiturgicalChants, heroEntry),
      AspectKnowledge.getMinSr(
        counter,
        activeAspectKnowledges,
        staticEntry,
        heroEntry,
      ),
    ]
    |> catOptions
    |> ensure(Ley_List.Extra.notNull)
    <&> Ley_List.Foldable.maximum;
};

/**
 * Returns if the passed spell's skill rating can be decreased.
 */
let isDecreasable =
    (~aspectKnowledge, ~staticLiturgicalChants, ~heroLiturgicalChants) => {
  let getMinCached =
    getMin(~aspectKnowledge, ~staticLiturgicalChants, ~heroLiturgicalChants);

  (~staticEntry, ~heroEntry: Hero.ActivatableSkill.t) =>
    ActivatableSkills.valueToInt(heroEntry.value)
    > (getMinCached(~staticEntry, ~heroEntry) |> fromOption(0));
};
