open Prerequisite;

type prerequisite =
  | CommonSuggestedByRCP
  | Sex(sex)
  | Race(race)
  | Culture(culture)
  | Pact(pact)
  | Social(socialStatus)
  | PrimaryAttribute(primaryAttribute)
  | Activatable(activatable)
  | ActivatableMultiEntry(activatableMultiEntry)
  | ActivatableMultiSelect(activatableMultiSelect)
  | Increasable(increasable)
  | IncreasableMultiEntry(increasableMultiEntry);

module Flatten: {
  /**
   * `flattenPrerequisites oldLevel newLevel prerequisites` returns a
   * flattened list of the passed prerequisites object.
   */
  let flattenPrerequisites:
    (Prerequisite.t, list(prerequisite)) => list(prerequisite);

  /**
   * Get a flattened list of the prerequisites of the first level of the passed
   * prerequisites object, which means it returns the base prerequisites that
   * must always be met to activate the associated entry.
   */
  let getFirstLevelPrerequisites: tWithLevel => list(prerequisite);

  /**
   * Get a flattened list of the prerequisites of the first level of the passed
   * prerequisites object of an advantage or disadvantage, which means it
   * returns the base prerequisites that must always be met to activate the
   * associated advantage or disadvantage.
   */
  let getFirstDisAdvLevelPrerequisites:
    tWithLevelDisAdv => list(prerequisite);

  /**
   * `flattenPrerequisitesRange oldLevel newLevel prerequisites` returns a
   * flattened list of the prerequisites of the matching levels of the passed
   * prerequisites object.
   */
  let flattenPrerequisitesRange:
    (option(Ley_IntMap.key), option(Ley_IntMap.key), tWithLevel) =>
    list(prerequisite);
};

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
      option(Hero.Activatable.t),
      Activatable_Convert.singleWithId
    ) =>
    list(prerequisite);
};

module Validation: {
  /**
   * `isPrerequisiteMet` returns if the passed prerequisite is met.
   */
  let isPrerequisiteMet: (Static.t, Hero.t, Id.t, prerequisite) => bool;

  /**
   * `arePrerequisitesMet` returns if all passed prerequisites are met.
   */
  let arePrerequisitesMet:
    (Static.t, Hero.t, Id.t, list(prerequisite)) => bool;

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
    (Static.t, Hero.t, Id.t, Ley_IntMap.t(Prerequisite.t)) => option(int);
};

module Activatable: {
  let getFlatFirstPrerequisites: Static.activatable => list(prerequisite);

  let getLevelPrerequisites:
    Static.activatable => Ley_IntMap.t(Prerequisite.t);
};
