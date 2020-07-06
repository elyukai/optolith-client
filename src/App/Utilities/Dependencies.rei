module Flatten: {
  /**
   * `flattenSkillDependencies getValueForTargetId id dependencies` flattens the
   * list of dependencies to usable values. That means, optional dependencies
   * (objects) will be evaluated and will be included in the resulting list,
   * depending on whether it has to follow the optional dependency or not. The
   * result is a plain `List` of all non-optional dependencies.
   */
  let flattenSkillDependencies:
    (int => int, int, list(Hero.Skill.dependency)) => list(int);

  /**
   * `flattenSkillDependencies getValueForTargetId id dependencies` flattens the
   * list of dependencies to usable values. That means, optional dependencies
   * (objects) will be evaluated and will be included in the resulting list,
   * depending on whether it has to follow the optional dependency or not. The
   * result is a plain `List` of all non-optional dependencies.
   */
  let flattenActivatableSkillDependencies:
    (int => Hero.ActivatableSkill.value, int, list(Hero.Skill.dependency)) =>
    list(int);

  /**
   * `flattenActivatableDependencies getActiveListForTargetId id dependencies`
   * flattens the list of dependencies to usable values. That means, optional
   * dependencies (objects) will be evaluated and will be included in the
   * resulting list, depending on whether it has to follow the optional
   * dependency or not. The result is a plain `List` of all non-optional
   * dependencies.
   */
  let flattenActivatableDependencies:
    (
      int => list(Hero.Activatable.single),
      int,
      list(Hero.Activatable.dependency)
    ) =>
    list(Hero.Activatable.dependency);

  /**
   * Get all required first select option ids from the given entry.
   */
  let getRequiredSelectOptions1:
    (Ley.IntMap.t(Hero.Activatable.t), Hero.Activatable.t) =>
    list(OneOrMany.t(Id.selectOption));
};

module TransferredUnfamiliar: {
  /**
   * Returns if the passed spell is an unfamiliar spell based on the passed
   * list of transferred unfamiliar spells and the active traditions.
   */
  let isUnfamiliarSpell:
    (
      list(Hero.TransferUnfamiliar.t),
      list(Tradition.Magical.fullTradition),
      Static.Spell.t
    ) =>
    bool;

  /**
   * Adds new transferred unfamiliar spells if the entry to activate allows
   * transferring unfamiliar spells.
   */
  let addTransferUnfamiliarDependencies:
    (Activatable_Convert.singleWithId, Hero.t) => Hero.t;

  /**
   * Check if an entry that allows transferring unfamiliar entries into a familiar
   * tradition can be removed, because it might happen, that this is not allowed,
   * because otherwise you'd have more unfamiliar spells than allowed by the
   * selected experience level during creation phase.
   */
  let isEntryAllowingTransferUnfamiliarRemovable:
    (Static.t, Hero.t, int) => bool;

  /**
   * From a list of spell select options, only return the **unfamiliar** ones.
   */
  let filterUnfamiliar:
    (Static.Spell.t => bool, Static.t, list(Static.SelectOption.t)) =>
    list(Static.SelectOption.t);
};

/**
 * Adds dependencies to all required entries to ensure rule validity.
 */
let addDependencies:
  (
    Static.t,
    list(Prerequisites.prerequisite),
    Id.prerequisiteSource,
    Hero.t
  ) =>
  Hero.t;

/**
 * Removes dependencies from all required entries to ensure rule validity.
 */
let removeDependencies:
  (
    Static.t,
    list(Prerequisites.prerequisite),
    Id.prerequisiteSource,
    Hero.t
  ) =>
  Hero.t;
