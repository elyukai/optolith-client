type t = {
  naming: Activatable_Active_Name.combinedName,
  active: Activatable_Convert.singleWithId,
  apValue: int,
  isAutomatic: bool,
  validation: Activatable_Active_Validation.t,
  staticEntry: Static.activatable,
  heroEntry: Hero.Activatable.t,
};

let getActive =
    (
      ~isEntryToAdd,
      ~addLevelToName,
      cache,
      staticData,
      hero,
      staticEntry,
      heroEntry,
      singleEntry,
    ) => {
  let naming =
    Activatable_Active_Name.getName(
      ~addLevelToName,
      staticData,
      staticEntry,
      singleEntry,
    );

  let validation =
    Activatable_Active_Validation.isRemovalOrModificationValid(
      cache,
      staticData,
      hero,
      staticEntry,
      heroEntry,
      singleEntry,
    );

  let {Activatable_Active_AdventurePointValue.apValue, isAutomatic} =
    Activatable_Active_AdventurePointValue.getApValueDifferenceOnChange(
      ~isEntryToAdd,
      ~automaticAdvantages=cache.automaticAdvantages,
      staticData,
      hero,
      staticEntry,
      heroEntry,
      singleEntry,
    );

  {
    naming,
    active: singleEntry,
    apValue,
    isAutomatic,
    validation,
    staticEntry,
    heroEntry,
  };
};
