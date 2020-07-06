open Static_Prerequisites;

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
    (Static_Prerequisites.t, list(prerequisite)) => list(prerequisite);

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
    (option(Ley.IntMap.key), option(Ley.IntMap.key), tWithLevel) =>
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
};
