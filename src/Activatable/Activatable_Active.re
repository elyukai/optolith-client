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
      ~automaticAdvantages,
      ~addLevelToName,
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

  let {Activatable_Active_AdventurePointValue.apValue, isAutomatic} =
    Activatable_Active_AdventurePointValue.getApValue(
      ~isEntryToAdd,
      ~automaticAdvantages,
      staticData,
      hero,
      staticEntry,
      heroEntry,
      singleEntry,
    );
  ();
  // {
  //   naming,
  //   active: singleEntry,
  //   apValue,
  //   isAutomatic,
  //   validation: ,
  //   staticEntry,
  //   heroEntry,
  // };
};
