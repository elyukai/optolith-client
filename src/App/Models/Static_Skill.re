type application = {
  id: int,
  name: string,
  prerequisite: Maybe.t(Static_Prerequisites.activatable),
};

type use = {
  id: int,
  name: string,
  prerequisite: Static_Prerequisites.activatable,
};

type encumbrance =
  | True
  | False
  | Maybe(Maybe.t(string));

type t = {
  id: int,
  name: string,
  check: list(int),
  encumbrance,
  encumbranceDescription: Maybe.t(string),
  gr: int,
  ic: IC.t,
  applications: list(application),
  applicationsInput: Maybe.t(string),
  uses: list(use),
  tools: Maybe.t(string),
  quality: string,
  failed: string,
  critical: string,
  botch: string,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

type group = {
  id: int,
  name: string,
  fullName: string,
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  let applicationL10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let useL10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  type tL10n = {
    id: int,
    name: string,
    applications: list((int, string)),
    applicationsInput: Maybe.t(string),
    uses: list((int, string)),
    encDescription: Maybe.t(string),
    tools: Maybe.t(string),
    quality: string,
    failed: string,
    critical: string,
    botch: string,
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    applications: json |> field("applications", list(applicationL10n)),
    applicationsInput: json |> field("applicationsInput", maybe(string)),
    uses: json |> field("uses", list(useL10n)),
    encDescription: json |> field("encDescription", maybe(string)),
    tools: json |> field("tools", maybe(string)),
    quality: json |> field("quality", string),
    failed: json |> field("failed", string),
    critical: json |> field("critical", string),
    botch: json |> field("botch", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  let applicationUniv = json => (
    json |> field("id", int),
    json |> field("prerequisite", Static_Prerequisites.Decode.activatable),
  );

  let useUniv = json => (
    json |> field("id", int),
    json |> field("prerequisite", Static_Prerequisites.Decode.activatable),
  );

  type encumbranceUniv =
    | True
    | False
    | Maybe;

  let encumbranceUniv = json =>
    json
    |> string
    |> (
      str =>
        switch (str) {
        | "true" => json |> int |> (_ => True)
        | "false" => json |> int |> (_ => False)
        | "maybe" => json |> int |> (_ => Maybe)
        | _ => raise(DecodeError("Unknown encumbrance: " ++ str))
        }
    );

  type tUniv = {
    id: int,
    applications: list((int, Static_Prerequisites.activatable)),
    uses: list((int, Static_Prerequisites.activatable)),
    check1: int,
    check2: int,
    check3: int,
    ic: IC.t,
    enc: encumbranceUniv,
    gr: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    applications: json |> field("applications", list(applicationUniv)),
    uses: json |> field("uses", list(useUniv)),
    check1: json |> field("check1", int),
    check2: json |> field("check2", int),
    check3: json |> field("check3", int),
    ic: json |> field("ic", IC.Decode.t),
    enc: json |> field("enc", encumbranceUniv),
    gr: json |> field("gr", int),
  };

  let group = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    fullName: json |> field("fullName", string),
  };
};
