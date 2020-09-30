type t = {
  id: int,
  name: string,
  check: (int, int, int),
  checkMod: option(CheckModifier.t),
  effect: string,
  ritualTime: string,
  ritualTimeShort: string,
  aeCost: string,
  aeCostShort: string,
  range: string,
  rangeShort: string,
  duration: string,
  durationShort: string,
  target: string,
  property: int,
  activatablePrerequisites: option(list(Prerequisite.activatable)),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: int,
    name: string,
    effect: string,
    ritualTime: string,
    ritualTimeShort: string,
    aeCost: string,
    aeCostShort: string,
    range: string,
    rangeShort: string,
    duration: string,
    durationShort: string,
    target: string,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
    ritualTime: json |> field("ritualTime", string),
    ritualTimeShort: json |> field("ritualTimeShort", string),
    aeCost: json |> field("aeCost", string),
    aeCostShort: json |> field("aeCostShort", string),
    range: json |> field("range", string),
    rangeShort: json |> field("rangeShort", string),
    duration: json |> field("duration", string),
    durationShort: json |> field("durationShort", string),
    target: json |> field("target", string),
    src: json |> field("src", PublicationRef.decodeMultilingualList),
    errata: json |> field("errata", Erratum.Decode.list),
  };

  type tUniv = {
    id: int,
    check1: int,
    check2: int,
    check3: int,
    checkMod: option(CheckModifier.t),
    property: int,
    activatablePrerequisites: option(list(Prerequisite.activatable)),
  };

  let tUniv = json => {
    id: json |> field("id", int),
    check1: json |> field("check1", int),
    check2: json |> field("check2", int),
    check3: json |> field("check3", int),
    checkMod: json |> optionalField("checkMod", CheckModifier.Decode.t),
    property: json |> field("property", int),
    activatablePrerequisites:
      json
      |> optionalField(
           "activatablePrerequisites",
           list(Prerequisite.Decode.activatable),
         ),
  };

  let t = (univ: tUniv, l10n: tL10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      check: (univ.check1, univ.check2, univ.check3),
      checkMod: univ.checkMod,
      effect: l10n.effect,
      ritualTime: l10n.ritualTime,
      ritualTimeShort: l10n.ritualTimeShort,
      aeCost: l10n.aeCost,
      aeCostShort: l10n.aeCostShort,
      range: l10n.range,
      rangeShort: l10n.rangeShort,
      duration: l10n.duration,
      durationShort: l10n.durationShort,
      target: l10n.target,
      property: univ.property,
      activatablePrerequisites: univ.activatablePrerequisites,
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
      yamlData.geodeRitualsUniv |> list(tUniv),
      yamlData.geodeRitualsL10n |> list(tL10n),
    )
    |> Ley_IntMap.fromList;
};
