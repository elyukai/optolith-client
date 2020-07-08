type application = {
  id: int,
  name: string,
  prerequisite: option(Prerequisite.activatable),
};

type use = {
  id: int,
  name: string,
  prerequisite: Prerequisite.activatable,
};

type encumbrance =
  | True
  | False
  | Maybe(option(string));

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
  src: list(SourceRef.t),
  errata: list(Erratum.t),
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
    applicationsInput: option(string),
    uses: option(list((int, string))),
    encDescription: option(string),
    tools: option(string),
    quality: string,
    failed: string,
    critical: string,
    botch: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
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
    src: json |> field("src", SourceRef.Decode.list),
    errata: json |> field("errata", Erratum.Decode.list),
  };

  let applicationUniv = json => (
    json |> field("id", int),
    json |> field("prerequisite", Prerequisite.Decode.activatable),
  );

  let useUniv = json => (
    json |> field("id", int),
    json |> field("prerequisite", Prerequisite.Decode.activatable),
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
    applications: option(list((int, Prerequisite.activatable))),
    uses: option(list((int, Prerequisite.activatable))),
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
          Ley_Int.show,
          newApplication,
          application,
          fst,
          fst,
          univ.applications |> Ley_Option.fromOption([]),
          l10n.applications,
        )
        |> (((mergeds, singles)) => singles @ mergeds |> Ley_IntMap.fromList),
      applicationsInput: l10n.applicationsInput,
      uses:
        Yaml_Zip.zipBy(
          Ley_Int.show,
          use,
          fst,
          fst,
          univ.uses |> Ley_Option.fromOption([]),
          l10n.uses |> Ley_Option.fromOption([]),
        )
        |> Ley_IntMap.fromList,
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
      Ley_Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.skillsUniv |> list(tUniv),
      yamlData.skillsL10n |> list(tL10n),
    )
    |> Ley_IntMap.fromList;

  let group = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    fullName: json |> field("fullName", string),
  };

  let groups = (yamlData: Yaml_Raw.yamlData) =>
    yamlData.skillGroupsL10n
    |> list(group)
    |> Ley_List.map((x: group) => (x.id, x))
    |> Ley_IntMap.fromList;
};
