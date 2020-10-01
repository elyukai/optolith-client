open Static;
open SelectOption;
open Ley_Option.Monad;
open Activatable_Convert;
open Activatable_Accessors;

module L = Ley_List;
module O = Ley_Option;
module SOM = SelectOption.Map;
module F = Ley_Function;

let getSelectOption = (x, id) =>
  id
  |> activatableOptionToSelectOptionId
  >>= Ley_Function.flip(Map.lookup, selectOptions(x));

/**
 * Get a selection option's name with the given id from given wiki entry.
 * Returns `None` if not found.
 */
let getSelectOptionName = (x, id) =>
  id |> getSelectOption(x) <&> (y => y.name);

/**
 * Get a selection option's cost with the given id from given wiki entry.
 * Returns `None` if not found.
 */
let getSelectOptionCost = (x, id) =>
  id |> getSelectOption(x) >>= (y => y.cost);

/**
 * Get all option IDs from the given entry at the passed index.
 */
let getActiveOptions = (index, x: Hero.Activatable.t) =>
  x.active
  |> O.mapOption((y: Hero.Activatable.single) =>
       Ley_List.Safe.atMay(y.options, index)
     );

let mapActiveOptions = (f, index, x: Hero.Activatable.t) =>
  x.active
  |> O.mapOption((y: Hero.Activatable.single) =>
       Ley_List.Safe.atMay(y.options, index) >>= f
     );

/**
 * Get all first option IDs from the given entry.
 */
let getActiveOptions1 = (x: Hero.Activatable.t) =>
  x.active
  |> O.mapOption((y: Hero.Activatable.single) => y.options |> O.listToOption);

let mapActiveOptions1 = (f, x: Hero.Activatable.t) =>
  x.active
  |> O.mapOption((y: Hero.Activatable.single) =>
       y.options |> O.listToOption >>= f
     );

/**
 * Get all first select option IDs from the given entry.
 */
let getActiveSelectOptions1 =
  mapActiveOptions1(Activatable_Convert.activatableOptionToSelectOptionId);

/**
 * Get all second option IDs from the given entry.
 */
let getActiveOptions2 = getActiveOptions(1);

/**
 * Get all second option ids from the given entry, sorted by their first option
 * id in a map.
 */
let getActiveOptions2Map = (x: Hero.Activatable.t) =>
  L.Foldable.foldr(
    (current: Hero.Activatable.single, mp) =>
      current.options
      |> O.listToOption
      >>= Activatable_Convert.activatableOptionToSelectOptionId
      |> O.Monad.liftM2(
           (secondOption, option) =>
             SOM.alter(
               maybeSecondOptions =>
                 maybeSecondOptions
                 |> O.fromOption([])
                 |> L.cons(secondOption)
                 |> (xs => Some(xs)),
               option,
               mp,
             ),
           current.options |> F.flip(L.Safe.atMay, 1),
         )
      |> O.fromOption(mp),
    SOM.empty,
    x.active,
  );

let getOption = (index, heroEntry) =>
  Ley_List.Safe.atMay(heroEntry.options, index);

let getOption1 = heroEntry => heroEntry.options |> Ley_Option.listToOption;

let getOption2 = getOption(1);

let getOption3 = getOption(2);

let getCustomInput = (option: Id.Activatable.Option.t) =>
  switch (option) {
  | CustomInput(x) => Some(x)
  | Preset(_) => None
  };

let getGenericId = (option: Id.Activatable.Option.t) =>
  [@warning "-4"]
  (
    switch (option) {
    | Preset((Generic, x)) => Some(x)
    | _ => None
    }
  );

let lookupMap = (k, mp, f) => f <$> Ley_IntMap.lookup(k, mp);

let getSkillFromOption =
    (staticData: Static.t, option: Id.Activatable.Option.t) =>
  [@warning "-4"]
  (
    switch (option) {
    | Preset((Skill, id)) => Ley_IntMap.lookup(id, staticData.skills)
    | _ => None
    }
  );
