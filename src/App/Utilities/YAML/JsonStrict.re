open Json.Decode;

[@bs.val] external _stringify: Js.Json.t => string = "JSON.stringify";

let maybe = (decode: decoder('a), json) =>
  if ((Obj.magic(json): Js.undefined('a)) == Js.undefined
      || (Obj.magic(json): Js.null('a)) == Js.null) {
    Maybe.Nothing;
  } else {
    Maybe.Just(decode(json));
  };

let optionalField = (key, decode, json) => field(key, maybe(decode), json);
