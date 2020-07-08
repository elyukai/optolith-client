open Static;
open SelectOption;
open Ley_Option.Functor;
open Ley_Option.Monad;
open Activatable_Convert;
open Activatable_Accessors;

module SO = SelectOption;
module L = Ley_List;
module O = Ley_Option;
module IM = Ley_IntMap;
module SOM = SelectOption.SelectOptionMap;
module F = Ley_Function;

let getSelectOption = (x, id) =>
  id
  |> activatableOptionToSelectOptionId
  >>= Ley_Function.flip(SelectOptionMap.lookup, selectOptions(x));

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

/**
 * Get all first option IDs from the given entry.
 */
let getActiveOptions1 = (x: Hero.Activatable.t) =>
  x.active
  |> O.mapOption((y: Hero.Activatable.single) => y.options |> O.listToOption);

/**
 * Get all first select option IDs from the given entry.
 */
let getActiveSelectOptions1 = (x: Hero.Activatable.t) =>
  x.active
  |> O.mapOption((y: Hero.Activatable.single) =>
       y.options
       |> O.listToOption
       >>= Activatable_Convert.activatableOptionToSelectOptionId
     );

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

let getCustomInput = (option: Hero.Activatable.optionId) =>
  switch (option) {
  | `CustomInput(x) => Some(x)
  | `Generic(_)
  | `Skill(_)
  | `CombatTechnique(_)
  | `Spell(_)
  | `LiturgicalChant(_)
  | `Cantrip(_)
  | `Blessing(_)
  | `SpecialAbility(_) => None
  };

let getGenericId = (option: Hero.Activatable.optionId) =>
  switch (option) {
  | `Generic(x) => Some(x)
  | `Skill(_)
  | `CombatTechnique(_)
  | `Spell(_)
  | `LiturgicalChant(_)
  | `Cantrip(_)
  | `Blessing(_)
  | `SpecialAbility(_)
  | `CustomInput(_) => None
  };

let lookupMap = (k, mp, f) => f <$> Ley_IntMap.lookup(k, mp);

let getSkillFromOption =
    (staticData: Static.t, option: Hero.Activatable.optionId) =>
  switch (option) {
  | `Skill(id) => Ley_IntMap.lookup(id, staticData.skills)
  | `Generic(_)
  | `CombatTechnique(_)
  | `Spell(_)
  | `LiturgicalChant(_)
  | `Cantrip(_)
  | `Blessing(_)
  | `SpecialAbility(_)
  | `CustomInput(_) => None
  };
