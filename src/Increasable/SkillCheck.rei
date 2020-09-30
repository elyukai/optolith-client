type t;

/**
 * Takes a skill check and returns it's values.
 */
let getValues: (Ley_IntMap.t(Attribute.Dynamic.t), t) => (int, int, int);

// /**
//  * Takes a skill check and returns it's attributes' names.
//  */
// let getAttributes:
//   (Ley_IntMap.t(Attribute.t), t) =>
//   option((Attribute.t, Attribute.t, Attribute.t));

let decode: Json.Decode.decoder(t);
