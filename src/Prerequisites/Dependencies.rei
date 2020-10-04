module Flatten: {
  /**
   * `flattenSkillDependencies getValueForTargetId id dependencies` flattens the
   * list of dependencies to usable values. That means, optional dependencies
   * (objects) will be evaluated and will be included in the resulting list,
   * depending on whether it has to follow the optional dependency or not. The
   * result is a plain `List` of all non-optional dependencies.
   */
  let flattenSkillDependencies:
    (int => int, int, list(Increasable.Dynamic.dependency)) => list(int);

  /**
   * `flattenSkillDependencies getValueForTargetId id dependencies` flattens the
   * list of dependencies to usable values. That means, optional dependencies
   * (objects) will be evaluated and will be included in the resulting list,
   * depending on whether it has to follow the optional dependency or not. The
   * result is a plain `List` of all non-optional dependencies.
   */
  let flattenActivatableSkillDependencies:
    (
      int => ActivatableSkill.Dynamic.value,
      int,
      list(Increasable.Dynamic.dependency)
    ) =>
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
      int => list(Activatable_Dynamic.single),
      int,
      list(Activatable_Dynamic.dependency)
    ) =>
    list(Activatable_Dynamic.dependency);

  /**
   * Get all required first select option ids from the given entry.
   */
  let getRequiredSelectOptions1:
    (Ley_IntMap.t(Activatable_Dynamic.t), Activatable_Dynamic.t) =>
    list(OneOrMany.t(Id.Activatable.SelectOption.t));
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
      Spell.Static.t
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
};

/**
 * Adds dependencies to all required entries to ensure rule validity.
 */
let addDependencies:
  (Static.t, list(Prerequisite.Unified.t), Id.PrerequisiteSource.t, Hero.t) =>
  Hero.t;

/**
 * Removes dependencies from all required entries to ensure rule validity.
 */
let removeDependencies:
  (Static.t, list(Prerequisite.Unified.t), Id.PrerequisiteSource.t, Hero.t) =>
  Hero.t;

/**
 * `getMaxLevel staticData hero sourceId dependencies levelPrerequisites`
 * returns the maximum level based on the map of prerequisites
 * `levelPrerequisites` where the key is the level and the value the
 * prerequisites that need to be met for the respective level as well as based
 * on the registered `dependencies` of the entry.
 *
 * The return value is based on prerequisites *and* entry dependencies. To get
 * the max level only based on prerequisites, use
 * `Prerequisites.Validation.getMaxLevel`.
 */
let getMaxLevel:
  (
    Static.t,
    Hero.t,
    Id.All.t,
    list(Activatable_Dynamic.dependency),
    Ley_IntMap.t(list(Prerequisite.Unified.t))
  ) =>
  option(int);

module Activatable: {
  /**
   * `areOptionDependenciesMatched dependency single` takes an activatable
   * `dependency` and a `single` activatable activation and returns if that
   * activation matches the options defined in the dependency. Other values from
   * the dependency are not validated.
   */
  let areOptionDependenciesMatched:
    (Activatable_Dynamic.dependency, Activatable_Dynamic.single) => bool;

  /**
   * `isDependencyMatched dependency single` takes an activatable `dependency`
   * and a `single` activatable activation and returns if that activation
   * matches the dependency.
   */
  let isDependencyMatched:
    (Activatable_Dynamic.dependency, Activatable_Dynamic.single) => bool;
};
