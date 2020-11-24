include Json.Decode;

[@bs.val] external _stringify: Js.Json.t => string = "JSON.stringify";

let idTagName = "type";

let maybe = (decode: decoder('a), json) =>
  if ((Obj.magic(json): Js.undefined('a)) == Js.undefined
      || (Obj.magic(json): Js.null('a)) == Js.null) {
    None;
  } else {
    Some(decode(json));
  };

let optionalField = (key, decode, json) =>
  if (Js.typeof(json) === "object"
      && !Js.Array.isArray(json)
      && !((Obj.magic(json): Js.null('a)) === Js.null)) {
    let dict: Js.Dict.t(Js.Json.t) = Obj.magic(json);

    switch (Js.Dict.get(dict, key)) {
    | None => None
    | Some(value) =>
      try(Some(decode(value))) {
      | DecodeError(msg) =>
        raise(DecodeError(msg ++ "\n\tat field '" ++ key ++ "'"))
      }
    };
  } else {
    raise(DecodeError("Expected object, got " ++ _stringify(json)));
  };

let const = (x: 'a, json) =>
  if ((Obj.magic(json): 'a) == x) {
    x;
  } else {
    raise(
      DecodeError(
        "Expected \""
        ++ _stringify(json)
        ++ "\", but received: "
        ++ _stringify(json),
      ),
    );
  };
