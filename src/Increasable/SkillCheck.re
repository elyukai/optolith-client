module IM = Ley_IntMap;
module O = Ley_Option;

type t = (int, int, int);

/**
 * Takes a skill check and returns it's values.
 */
let getValues = (mp, (a1, a2, a3)) => (
  IM.lookup(a1, mp) |> Attribute.Dynamic.getValueDef,
  IM.lookup(a2, mp) |> Attribute.Dynamic.getValueDef,
  IM.lookup(a3, mp) |> Attribute.Dynamic.getValueDef,
);

/**
 * Takes a skill check and returns it's attributes' names.
 */
let getAttributes = (mp: IM.t(Attribute.Static.t), (a1, a2, a3)) =>
  O.liftM3(
    (a1, a2, a3) => (a1, a2, a3),
    IM.lookup(a1, mp),
    IM.lookup(a2, mp),
    IM.lookup(a3, mp),
  );

let decode = Json.Decode.(tuple3(int, int, int));
