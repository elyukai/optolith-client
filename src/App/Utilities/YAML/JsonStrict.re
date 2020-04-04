open Json.Decode;

let maybe = (decode: decoder('a), json) =>
  if ((Obj.magic(json): Js.undefined('a)) == Js.undefined) {
    Maybe.Nothing;
  } else {
    Maybe.Just(decode(json));
  };
