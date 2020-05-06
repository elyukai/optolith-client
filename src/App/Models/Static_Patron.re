type category = {
  id: int,
  name: string,
  primaryPatronCultures: list(int),
};

type t = {
  id: int,
  name: string,
  category: int,
  skills: (int, int, int),
  limitedToCultures: list(int),
  isLimitedToCulturesReverse: bool,
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type categoryL10n = {
    id: int,
    name: string,
  };

  let categoryL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
  };

  type categoryUniv = {
    id: int,
    primaryPatronCultures: list(int),
  };

  let categoryUniv = json => {
    id: json |> field("id", int),
    primaryPatronCultures: json |> field("primaryPatronCultures", list(int)),
  };

  let category = (univ, l10n) => {
    id: univ.id,
    name: l10n.name,
    primaryPatronCultures: univ.primaryPatronCultures,
  };

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
    category: int,
    skills: (int, int, int),
    limitedToCultures: list(int),
    isLimitedToCulturesReverse: Maybe.t(bool),
  };

  let tUniv = json => {
    id: json |> field("id", int),
    category: json |> field("category", int),
    skills: json |> field("skills", tuple3(int, int, int)),
    limitedToCultures: json |> field("limitedToCultures", list(int)),
    isLimitedToCulturesReverse:
      json |> optionalField("isLimitedToCulturesReverse", bool),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      category: univ.category,
      skills: univ.skills,
      limitedToCultures: univ.limitedToCultures,
      isLimitedToCulturesReverse:
        univ.isLimitedToCulturesReverse |> Maybe.fromMaybe(false),
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.patronsUniv |> list(tUniv),
      yamlData.patronsL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
