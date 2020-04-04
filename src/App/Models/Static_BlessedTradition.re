type t = {
  id: int,
  numId: int,
  name: string,
  primary: int,
  aspects: Maybe.t((int, int)),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: int,
    name: string,
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
  };

  type tUniv = {
    id: int,
    numId: int,
    primary: int,
    aspects: Maybe.t((int, int)),
  };

  let tUniv = json => {
    id: json |> field("id", int),
    numId: json |> field("numId", int),
    primary: json |> field("primary", int),
    aspects: json |> optionalField("aspects", pair(int, int)),
  };

  let t = (univ, l10n) => {
    id: univ.id,
    numId: univ.numId,
    name: l10n.name,
    primary: univ.primary,
    aspects: univ.aspects,
  };
};
