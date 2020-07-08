type t('a) =
  | One('a)
  | Many(list('a));

module Decode = {
  open Json.Decode;

  let t = decoder =>
    oneOf([
      json => json |> decoder |> (x => One(x)),
      json => json |> list(decoder) |> (x => Many(x)),
    ]);
};
