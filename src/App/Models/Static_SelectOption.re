type t = {
  id: Ids.selectOptionId,
  name: string,
  cost: Maybe.t(int),
  prerequisites: Static_Prerequisites.t,
  description: Maybe.t(string),
  isSecret: Maybe.t(bool),
  languages: Maybe.t(list(int)),
  continent: Maybe.t(int),
  isExtinct: Maybe.t(bool),
  specializations: Maybe.t(list(string)),
  specializationInput: Maybe.t(string),
  animalGr: Maybe.t(int),
  animalLevel: Maybe.t(int),
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
    description: json |> optionalField("description", string),
    specializations: json |> optionalField("specializations", list(string)),
    specializationInput: json |> optionalField("specializationInput", string),
    src: json |> field("src", Static_SourceRef.Decode.list),
    errata: json |> field("errata", Static_Erratum.Decode.list),
  };

  type tUniv = {
    id: Ids.selectOptionId,
    cost: Maybe.t(int),
    sexPrerequisite: Maybe.t(Static_Prerequisites.sex),
    racePrerequisite: Maybe.t(Static_Prerequisites.race),
    culturePrerequisite: Maybe.t(Static_Prerequisites.culture),
    pactPrerequisite: Maybe.t(Static_Prerequisites.pact),
    socialPrerequisite: Maybe.t(Static_Prerequisites.socialStatus),
    primaryAttributePrerequisite:
      Maybe.t(Static_Prerequisites.primaryAttribute),
    activatablePrerequisite: Maybe.t(list(Static_Prerequisites.activatable)),
    activatableMultiEntryPrerequisite:
      Maybe.t(list(Static_Prerequisites.activatableMultiEntry)),
    activatableMultiSelectPrerequisite:
      Maybe.t(list(Static_Prerequisites.activatableMultiSelect)),
    increasablePrerequisite: Maybe.t(list(Static_Prerequisites.increasable)),
    increasableMultiEntryPrerequisite:
      Maybe.t(list(Static_Prerequisites.increasableMultiEntry)),
    isSecret: Maybe.t(bool),
    languages: Maybe.t(list(int)),
    continent: Maybe.t(int),
    isExtinct: Maybe.t(bool),
    animalGr: Maybe.t(int),
    animalLevel: Maybe.t(int),
  };

  let tUniv = json => {
    id: json |> field("id", Static_Prerequisites.Decode.selectOptionId),
    cost: json |> optionalField("cost", int),
    sexPrerequisite:
      json
      |> optionalField("sexPrerequisite", Static_Prerequisites.Decode.sex),
    racePrerequisite:
      json
      |> optionalField("racePrerequisite", Static_Prerequisites.Decode.race),
    culturePrerequisite:
      json
      |> optionalField(
           "culturePrerequisite",
           Static_Prerequisites.Decode.culture,
         ),
    pactPrerequisite:
      json
      |> optionalField("pactPrerequisite", Static_Prerequisites.Decode.pact),
    socialPrerequisite:
      json
      |> optionalField(
           "socialPrerequisite",
           Static_Prerequisites.Decode.socialStatus,
         ),
    primaryAttributePrerequisite:
      json
      |> optionalField(
           "primaryAttributePrerequisite",
           Static_Prerequisites.Decode.primaryAttribute,
         ),
    activatablePrerequisite:
      json
      |> optionalField(
           "activatablePrerequisite",
           list(Static_Prerequisites.Decode.activatable),
         ),
    activatableMultiEntryPrerequisite:
      json
      |> optionalField(
           "activatableMultiEntryPrerequisite",
           list(Static_Prerequisites.Decode.activatableMultiEntry),
         ),
    activatableMultiSelectPrerequisite:
      json
      |> optionalField(
           "activatableMultiSelectPrerequisite",
           list(Static_Prerequisites.Decode.activatableMultiSelect),
         ),
    increasablePrerequisite:
      json
      |> optionalField(
           "increasablePrerequisite",
           list(Static_Prerequisites.Decode.increasable),
         ),
    increasableMultiEntryPrerequisite:
      json
      |> optionalField(
           "increasableMultiEntryPrerequisite",
           list(Static_Prerequisites.Decode.increasableMultiEntry),
         ),
    isSecret: json |> optionalField("isSecret", bool),
    languages: json |> optionalField("languages", list(int)),
    continent: json |> optionalField("continent", int),
    isExtinct: json |> optionalField("isExtinct", bool),
    animalGr: json |> optionalField("animalGr", int),
    animalLevel: json |> optionalField("animalLevel", int),
  };

  let t = (univ, l10n) => {
    id: univ.id,
    name: l10n.name,
    cost: univ.cost,
    prerequisites: {
      sex: univ.sexPrerequisite,
      race: univ.racePrerequisite,
      culture: univ.culturePrerequisite,
      pact: univ.pactPrerequisite,
      social: univ.socialPrerequisite,
      primaryAttribute: univ.primaryAttributePrerequisite,
      activatable: univ.activatablePrerequisite |> Maybe.fromMaybe([]),
      activatableMultiEntry:
        univ.activatableMultiEntryPrerequisite |> Maybe.fromMaybe([]),
      activatableMultiSelect:
        univ.activatableMultiSelectPrerequisite |> Maybe.fromMaybe([]),
      increasable: univ.increasablePrerequisite |> Maybe.fromMaybe([]),
      increasableMultiEntry:
        univ.increasableMultiEntryPrerequisite |> Maybe.fromMaybe([]),
    },
    description: l10n.description,
    isSecret: univ.isSecret,
    languages: univ.languages,
    continent: univ.continent,
    isExtinct: univ.isExtinct,
    specializations: l10n.specializations,
    specializationInput: l10n.specializationInput,
    animalGr: univ.animalGr,
    animalLevel: univ.animalLevel,
    target: Maybe.Nothing,
    applications: Maybe.Nothing,
    applicationInput: Maybe.Nothing,
    src: l10n.src,
    errata: l10n.errata,
  };
};
