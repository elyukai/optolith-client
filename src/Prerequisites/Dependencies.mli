module Resolve : sig
  val skill_deps :
    (int -> int) -> int -> Increasable.Dynamic.dependency list -> int list
  (** [skill_deps value_by_id id dependencies] flattens the list of dependencies
      to usable values. That means, optional dependencies (objects) will be evaluated and will be included in the resulting list, depending on whether it has to follow the optional dependency or not. The result is a plain [list] of all non-optional dependencies. *)

  val activatable_skill_deps :
    (int -> ActivatableSkill.Dynamic.value) ->
    int ->
    Increasable.Dynamic.dependency list ->
    int list
  (** [activatable_skill_deps value_by_id id dependencies]`flattens the list of dependencies to usable values. That means, optional dependencies (objects) will be evaluated and will be included in the resulting list, depending on whether it has to follow the optional dependency or not. The result is a plain [list] of all non-optional dependencies. *)

  val activatable_deps :
    (int -> Activatable_Dynamic.single list) ->
    int ->
    Activatable_Dynamic.dependency list ->
    Activatable_Dynamic.dependency list
  (** [activatable_deps actives_by_id id dependencies] flattens the list of
      dependencies to usable values. That means, optional dependencies (objects)
      will be evaluated and will be included in the resulting list, depending on
      whether it has to follow the optional dependency or not. The result is a
      plain [list] of all non-optional dependencies. *)

  val required_select_options_1 :
    'a Activatable_Dynamic.t Ley_IntMap.t ->
    'a Activatable_Dynamic.t ->
    Id.Activatable.SelectOption.t OneOrMany.t list
  (**
   * Get all required first select option ids from the given entry.
   *)
end

val addDependencies :
  Static.t ->
  Prerequisite.Unified.t list ->
  Id.PrerequisiteSource.t ->
  Hero.t ->
  Hero.t
(**
 * Adds dependencies to all required entries to ensure rule validity.
 *)

val removeDependencies :
  Static.t ->
  Prerequisite.Unified.t list ->
  Id.PrerequisiteSource.t ->
  Hero.t ->
  Hero.t
(**
 * Removes dependencies from all required entries to ensure rule validity.
 *)

val getMaxLevel :
  Static.t ->
  Hero.t ->
  Id.All.t ->
  Activatable_Dynamic.dependency list ->
  Prerequisite.Unified.t list Ley_IntMap.t ->
  int option
(**
 * `getMaxLevel staticData hero sourceId dependencies levelPrerequisites`
 * returns the maximum level based on the map of prerequisites
 * `levelPrerequisites` where the key is the level and the value the
 * prerequisites that need to be met for the respective level as well as based
 * on the registered `dependencies` of the entry.
 *
 * The return value is based on prerequisites *and* entry dependencies. To get
 * the max level only based on prerequisites, use
 * `Prerequisites.Validation.getMaxLevel`.
 *)

module Activatable : sig
  val areOptionDependenciesMatched :
    Activatable_Dynamic.dependency -> Activatable_Dynamic.single -> bool
  (**
   * `areOptionDependenciesMatched dependency single` takes an activatable
   * `dependency` and a `single` activatable activation and returns if that
   * activation matches the options defined in the dependency. Other values from
   * the dependency are not validated.
   *)

  val isDependencyMatched :
    Activatable_Dynamic.dependency -> Activatable_Dynamic.single -> bool
  (**
   * `isDependencyMatched dependency single` takes an activatable `dependency`
   * and a `single` activatable activation and returns if that activation
   * matches the dependency.
   *)
end

module TransferredUnfamiliar : sig
  val isUnfamiliarSpell :
    Hero.TransferUnfamiliar.t list ->
    Tradition.Magical.fullTradition list ->
    Spell.Static.t ->
    bool
  (**
   * Returns if the passed spell is an unfamiliar spell based on the passed
   * list of transferred unfamiliar spells and the active traditions.
   *)

  val addTransferUnfamiliarDependencies :
    Activatable_Convert.singleWithId -> Hero.t -> Hero.t
  (**
   * Adds new transferred unfamiliar spells if the entry to activate allows
   * transferring unfamiliar spells.
   *)

  val isEntryAllowingTransferUnfamiliarRemovable :
    Static.t -> Hero.t -> int -> bool
  (**
   * Check if an entry that allows transferring unfamiliar entries into a familiar
   * tradition can be removed, because it might happen, that this is not allowed,
   * because otherwise you'd have more unfamiliar spells than allowed by the
   * selected experience level during creation phase.
   *)
end
