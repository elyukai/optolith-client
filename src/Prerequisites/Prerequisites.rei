module Dynamic: {
  /**
   * `getDynamicPrerequisites` returns a list of dynamic prerequisites for the
   * passed entry. *Dynamic* in this case means, that there are flexible
   * parameters they are based on, so that they can't be statically defined in
   * the data files.
   *
   * Merge them together with the flattened static prerequisites to get the full
   * list of prerequisites for an entry.
   */
  let getDynamicPrerequisites:
    (
      ~isEntryToAdd: bool,
      Static.t,
      Static.activatable,
      option(Activatable_Dynamic.t),
      Activatable_Convert.singleWithId
    ) =>
    list(Prerequisite.Unified.t);
};

module Validation: {
  /**
   * `isPrerequisiteMet` returns if the passed prerequisite is met.
   */
  let isPrerequisiteMet:
    (Static.t, Hero.t, Id.All.t, Prerequisite.Unified.t) => bool;

  /**
   * `arePrerequisitesMet` returns if all passed prerequisites are met.
   */
  let arePrerequisitesMet:
    (Static.t, Hero.t, Id.All.t, list(Prerequisite.Unified.t)) => bool;

  /**
   * `getMaxLevel staticData hero sourceId levelPrerequisites` returns the
   * maximum level based on the map of prerequisites `levelPrerequisites` where
   * the key is the level and the value the prerequisites that need to be met
   * for the respective level.
   *
   * The return value is purely based on prerequisites, entry dependencies are
   * not taken into account. To get the max level based on prerequisites *and*
   * dependencies, use `Dependencies.getMaxLevel`.
   */
  let getMaxLevel:
    (
      Static.t,
      Hero.t,
      Id.All.t,
      Ley_IntMap.t(list(Prerequisite.Unified.t))
    ) =>
    option(int);
};

module Activatable: {
  let getFlatFirstPrerequisites:
    Static.activatable => list(Prerequisite.Unified.t);

  let getLevelPrerequisites:
    Static.activatable => Ley_IntMap.t(list(Prerequisite.Unified.t));
};
