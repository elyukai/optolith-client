type single = {
  options: list(Id.Activatable.Option.t),
  level: option(int),
  customCost: option(int),
};

type dependency = {
  source: Id.Activatable.t,
  target: OneOrMany.t(int),
  active: bool,
  options: list(OneOrMany.t(Id.Activatable.SelectOption.t)),
  level: option(int),
};

type t = {
  id: int,
  active: list(single),
  dependencies: list(dependency),
};

let empty = id => {id, active: [], dependencies: []};

let isEmpty = (x: t) =>
  Ley_List.null(x.active) && Ley_List.null(x.dependencies);
