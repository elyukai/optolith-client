type dependency = {
  source: Id.ActivatableAndSkill.t,
  target: OneOrMany.t(int),
  value: int,
};

module type Dynamic = {let minValue: int;};

module Dynamic = (Type: Dynamic) => {
  type t = {
    id: int,
    value: int,
    dependencies: list(dependency),
  };

  let minValue = Type.minValue;

  let empty = id => {id, value: minValue, dependencies: []};

  let isEmpty = (x: t) =>
    x.value <= minValue && Ley_List.Foldable.null(x.dependencies);

  let getValueDef = Ley_Option.option(minValue, (x: t) => x.value);
};

module DynamicActivatable = {
  type value =
    | Inactive
    | Active(int);

  type t = {
    id: int,
    value,
    dependencies: list(dependency),
  };

  let empty = id => {id, value: Inactive, dependencies: []};

  let isEmpty = (x: t) =>
    x.value === Inactive && Ley_List.Foldable.null(x.dependencies);

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
