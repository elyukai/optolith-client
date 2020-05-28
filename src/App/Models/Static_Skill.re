[@genType]
[@genType.as "Application"]
type application = {
  id: int,
  name: string,
  prerequisite: option(Static_Prerequisites.activatable),
};

[@genType]
[@genType.as "Use"]
type use = {
  id: int,
  name: string,
  prerequisite: Static_Prerequisites.activatable,
};

[@genType]
[@genType.as "Encumbrance"]
type encumbrance =
  | True
  | False
  | Maybe(option(string));

[@genType]
[@genType.as "Skill"]
type t = {
  id: int,
  name: string,
  check: (int, int, int),
  encumbrance,
  gr: int,
  ic: IC.t,
  applications: Ley_IntMap.t(application),
  applicationsInput: option(string),
  uses: Ley_IntMap.t(use),
  tools: option(string),
  quality: string,
  failed: string,
  critical: string,
  botch: string,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

[@genType]
[@genType.as "SkillGroup"]
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
    applicationsInput: option(string),
    uses: option(list((int, string))),
    encDescription: option(string),
    tools: option(string),
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
    applicationsInput: json |> optionalField("applicationsInput", string),
    uses: json |> optionalField("uses", list(useL10n)),
    encDescription: json |> optionalField("encDescription", string),
    tools: json |> optionalField("tools", string),
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
    applications: option(list((int, Static_Prerequisites.activatable))),
    uses: option(list((int, Static_Prerequisites.activatable))),
    check1: int,
    check2: int,
    check3: int,
    ic: IC.t,
    enc: encumbranceUniv,
    gr: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    applications:
      json |> optionalField("applications", list(applicationUniv)),
    uses: json |> optionalField("uses", list(useUniv)),
    check1: json |> field("check1", int),
    check2: json |> field("check2", int),
    check3: json |> field("check3", int),
    ic: json |> field("ic", IC.Decode.t),
    enc: json |> field("enc", encumbranceUniv),
    gr: json |> field("gr", int),
  };

  let newApplication = (univ, l10n) => (
    fst(univ),
    {id: fst(univ), name: snd(l10n), prerequisite: Some(snd(univ))}: application,
  );

  let application = l10n => (
    fst(l10n),
    {id: fst(l10n), name: snd(l10n), prerequisite: None}: application,
  );

  let use = (univ, l10n) => (
    fst(univ),
    {id: fst(univ), name: snd(l10n), prerequisite: snd(univ)}: use,
  );

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      check: (univ.check1, univ.check2, univ.check3),
      encumbrance:
        switch (univ.enc) {
        | True => True
        | False => False
        | Maybe => Maybe(l10n.encDescription)
        },
      gr: univ.gr,
      ic: univ.ic,
      applications:
        Yaml_Zip.zipByPartition(
          Ley.Int.show,
          newApplication,
          application,
          fst,
          fst,
          univ.applications |> Ley.Option.fromOption([]),
          l10n.applications,
        )
        |> (((mergeds, singles)) => singles @ mergeds |> Ley.IntMap.fromList),
      applicationsInput: l10n.applicationsInput,
      uses:
        Yaml_Zip.zipBy(
          Ley.Int.show,
          use,
          fst,
          fst,
          univ.uses |> Ley.Option.fromOption([]),
          l10n.uses |> Ley.Option.fromOption([]),
        )
        |> Ley.IntMap.fromList,
      tools: l10n.tools,
      quality: l10n.quality,
      failed: l10n.failed,
      critical: l10n.critical,
      botch: l10n.botch,
      src: l10n.src,
      errata: l10n.errata,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Ley.Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.skillsUniv |> list(tUniv),
      yamlData.skillsL10n |> list(tL10n),
    )
    |> Ley.IntMap.fromList;

  let group = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    fullName: json |> field("fullName", string),
  };

  let groups = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.skillGroupsL10n
    |> list(group)
    |> Ley.List.map((x: group) => (x.id, x))
    |> Ley.IntMap.fromList;
};
