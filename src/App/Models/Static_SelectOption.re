type t = {
  id: Ids.selectOptionId,
  name: string,
  cost: Maybe.t(int),
  prerequisites: Maybe.t(Static_Prerequisites.t),
  description: Maybe.t(string),
  isSecret: Maybe.t(bool),
  languages: Maybe.t(list(int)),
  continent: Maybe.t(int),
  isExtinct: Maybe.t(bool),
  specializations: Maybe.t(list(string)),
  specializationInput: Maybe.t(string),
  gr: Maybe.t(int),
  level: Maybe.t(int),
  target: Maybe.t(string),
  applications: Maybe.t(list(Static_Skill.application)),
  applicationInput: Maybe.t(string),
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: Ids.selectOptionId,
    name: string,
    description: Maybe.t(string),
    specializations: Maybe.t(list(string)),
    specializationInput: Maybe.t(string),
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", Static_Prerequisites.Decode.selectOptionId),
    name: json |> field("name", string),
    description: json |> field("description", maybe(string)),
    specializations: json |> field("specializations", maybe(list(string))),
    specializationInput: json |> field("specializationInput", maybe(string)),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type tUniv = {
    id: Ids.selectOptionId,
    cost: Maybe.t(int),
    isSecret: Maybe.t(bool),
    languages: Maybe.t(list(int)),
    continent: Maybe.t(int),
    isExtinct: Maybe.t(bool),
    animalGr: Maybe.t(int),
    animalLevel: Maybe.t(int),
  };
  // let tUniv = json => {
  //   id: json |> field("id", Static_Prerequisites.Decode.selectOptionId),
  //   name: json |> field("name", string),
  //   description: json |> field("description", maybe(string)),
  //   specializations: json |> field("specializations", maybe(list(string))),
  //   specializationInput: json |> field("specializationInput", maybe(string)),
  //   src: json |> field("src", Static_SourceRef.Decode.list),
  //   errata: json |> field("errata", Static_Erratum.Decode.list),
  // };
};
