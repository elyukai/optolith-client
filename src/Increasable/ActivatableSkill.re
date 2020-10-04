module type Dynamic = {
  type value =
    | Inactive
    | Active(int);

  type t = {
    id: int,
    value,
    dependencies: list(Increasable.Dynamic.dependency),
  };

  let empty: int => t;

  let isEmpty: t => bool;

  let getValueDef: option(t) => value;

  let valueToInt: value => int;

  let isActive: t => bool;

  let isActiveM: option(t) => bool;
};

module Dynamic: Dynamic = {
  type value =
    | Inactive
    | Active(int);

  type t = {
    id: int,
    value,
    dependencies: list(Increasable.Dynamic.dependency),
  };

  let empty = id => {id, value: Inactive, dependencies: []};

  let isEmpty = (x: t) =>
    x.value === Inactive && Ley_List.null(x.dependencies);

  let getValueDef = Ley_Option.option(Inactive, (x: t) => x.value);

  let valueToInt = value =>
    switch (value) {
    | Active(sr) => sr
    | Inactive => 0
    };

  let isActive = (x: t) =>
    switch (x.value) {
    | Active(_) => true
    | Inactive => false
    };

  let isActiveM = Ley_Option.option(false, isActive);
};

module MainParameter = {
  type t = {
    full: string,
    abbr: string,
    isNotModifiable: bool,
  };

  type translation = {
    full: string,
    abbr: string,
  };

  let decode = json =>
    Json.Decode.{
      full: json |> field("full", string),
      abbr: json |> field("abbr", string),
    };

  let make = (isNotModifiable, {full, abbr}: translation) => {
    full,
    abbr,
    isNotModifiable,
  };
};
