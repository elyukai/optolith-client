type enhancementLevel1 = {
  id: int,
  name: string,
  effect: string,
  cost: int,
};

type enhancementLevel2 = {
  id: int,
  name: string,
  effect: string,
  cost: int,
  requireLevel1: bool,
};

type level3Prerequisite =
  | First
  | Second;

type enhancementLevel3 = {
  id: int,
  name: string,
  effect: string,
  cost: int,
  requirePrevious: Maybe.t(level3Prerequisite),
};

type enhancement = {
  target: int,
  level1: enhancementLevel1,
  level2: enhancementLevel2,
  level3: enhancementLevel3,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

type t = {
  id: int,
  name: string,
  check: (int, int, int),
  checkMod: Maybe.t(CheckModifier.t),
  effect: string,
  castingTime: string,
  castingTimeShort: string,
  castingTimeNoMod: bool,
  kpCost: string,
  kpCostShort: string,
  kpCostNoMod: bool,
  range: string,
  rangeShort: string,
  rangeNoMod: bool,
  duration: string,
  durationShort: string,
  durationNoMod: bool,
  target: string,
  traditions: list(int),
  aspects: list(int),
  ic: IC.t,
  gr: int,
  src: list(Static_SourceRef.t),
  errata: list(Static_Erratum.t),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type enhancementLevelL10n = {
    id: int,
    name: string,
    effect: string,
  };

  let enhancementLevelL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
  };

  type enhancementL10n = {
    target: int,
    level1: enhancementLevelL10n,
    level2: enhancementLevelL10n,
    level3: enhancementLevelL10n,
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let enhancementL10n = json => {
    target: json |> field("target", int),
    level1: json |> field("level1", enhancementLevelL10n),
    level2: json |> field("level2", enhancementLevelL10n),
    level3: json |> field("level3", enhancementLevelL10n),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type enhancementLevel1Univ = {
    id: int,
    cost: int,
  };

  let enhancementLevel1Univ = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
  };

  type enhancementLevel2Univ = {
    id: int,
    cost: int,
    requireLevel1: bool,
  };

  let level3Prerequisite = json =>
    json
    |> int
    |> (
      x =>
        switch (x) {
        | 1 => 1
        | y =>
          raise(
            DecodeError("Unknown level 2 prerequisite: " ++ Int.show(y)),
          )
        }
    );

  let enhancementLevel2Univ = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    requireLevel1:
      json
      |> optionalField("previousRequirement", level3Prerequisite)
      |> Maybe.isJust,
  };

  type enhancementLevel3Univ = {
    id: int,
    cost: int,
    requirePrevious: Maybe.t(level3Prerequisite),
  };

  let level3Prerequisite = json =>
    json
    |> int
    |> (
      x =>
        switch (x) {
        | 1 => First
        | 2 => Second
        | y =>
          raise(
            DecodeError("Unknown level 3 prerequisite: " ++ Int.show(y)),
          )
        }
    );

  let enhancementLevel3Univ = json => {
    id: json |> field("id", int),
    cost: json |> field("cost", int),
    requirePrevious:
      json |> optionalField("previousRequirement", level3Prerequisite),
  };

  type enhancementUniv = {
    target: int,
    level1: enhancementLevel1Univ,
    level2: enhancementLevel2Univ,
    level3: enhancementLevel3Univ,
  };

  let enhancementUniv = json => {
    target: json |> field("target", int),
    level1: json |> field("level1", enhancementLevel1Univ),
    level2: json |> field("level2", enhancementLevel2Univ),
    level3: json |> field("level3", enhancementLevel3Univ),
  };

  let enhancement = (univ, l10n: enhancementL10n): enhancement => {
    target: univ.target,
    level1: {
      id: univ.level1.id,
      name: l10n.level1.name,
      effect: l10n.level1.effect,
      cost: univ.level1.cost,
    },
    level2: {
      id: univ.level2.id,
      name: l10n.level2.name,
      effect: l10n.level2.effect,
      cost: univ.level2.cost,
      requireLevel1: univ.level2.requireLevel1,
    },
    level3: {
      id: univ.level3.id,
      name: l10n.level3.name,
      effect: l10n.level3.effect,
      cost: univ.level3.cost,
      requirePrevious: univ.level3.requirePrevious,
    },
    src: l10n.src,
    errata: l10n.errata,
  };

  let enhancements = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Int.show,
      enhancement,
      x => x.target,
      x => x.target,
      yamlData.liturgicalChantEnhancementsUniv |> list(enhancementUniv),
      yamlData.liturgicalChantEnhancementsL10n |> list(enhancementL10n),
    );

  type tL10n = {
    id: int,
    name: string,
    effect: string,
    castingTime: string,
    castingTimeShort: string,
    kpCost: string,
    kpCostShort: string,
    range: string,
    rangeShort: string,
    duration: string,
    durationShort: string,
    target: string,
    src: list(Static_SourceRef.t),
    errata: list(Static_Erratum.t),
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    effect: json |> field("effect", string),
    castingTime: json |> field("castingTime", string),
    castingTimeShort: json |> field("castingTimeShort", string),
    kpCost: json |> field("kpCost", string),
    kpCostShort: json |> field("kpCostShort", string),
    range: json |> field("range", string),
    rangeShort: json |> field("rangeShort", string),
    duration: json |> field("duration", string),
    durationShort: json |> field("durationShort", string),
    target: json |> field("target", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type tUniv = {
    id: int,
    check1: int,
    check2: int,
    check3: int,
    checkMod: Maybe.t(CheckModifier.t),
    castingTimeNoMod: bool,
    kpCostNoMod: bool,
    rangeNoMod: bool,
    durationNoMod: bool,
    traditions: list(int),
    aspects: Maybe.t(list(int)),
    ic: IC.t,
    gr: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    check1: json |> field("check1", int),
    check2: json |> field("check2", int),
    check3: json |> field("check3", int),
    checkMod: json |> optionalField("checkMod", CheckModifier.Decode.t),
    castingTimeNoMod: json |> field("castingTimeNoMod", bool),
    kpCostNoMod: json |> field("kpCostNoMod", bool),
    rangeNoMod: json |> field("rangeNoMod", bool),
    durationNoMod: json |> field("durationNoMod", bool),
    traditions: json |> field("traditions", list(int)),
    aspects: json |> optionalField("traditions", list(int)),
    ic: json |> field("ic", IC.Decode.t),
    gr: json |> field("gr", int),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      check: (univ.check1, univ.check2, univ.check3),
      checkMod: univ.checkMod,
      effect: l10n.effect,
      castingTime: l10n.castingTime,
      castingTimeShort: l10n.castingTimeShort,
      castingTimeNoMod: univ.castingTimeNoMod,
      kpCost: l10n.kpCost,
      kpCostShort: l10n.kpCostShort,
      kpCostNoMod: univ.kpCostNoMod,
      range: l10n.range,
      rangeShort: l10n.rangeShort,
      rangeNoMod: univ.rangeNoMod,
      duration: l10n.duration,
      durationShort: l10n.durationShort,
      durationNoMod: univ.durationNoMod,
      target: l10n.target,
      traditions: univ.traditions,
      aspects: univ.aspects |> Maybe.fromMaybe([]),
      ic: univ.ic,
      gr: univ.gr,
      src: l10n.src,
      errata: l10n.errata,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.liturgicalChantsUniv |> list(tUniv),
      yamlData.liturgicalChantsL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
