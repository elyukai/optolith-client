type frequencyException =
  | Single(int)
  | Group(int);

type t = {
  id: int,
  name: string,
  language: list(int),
  script: Maybe.t(list(int)),
  areaKnowledge: string,
  areaKnowledgeShort: string,
  socialStatus: list(int),
  commonMundaneProfessionsAll: bool,
  commonMundaneProfessionsExceptions: Maybe.t(list(frequencyException)),
  commonMundaneProfessionsText: Maybe.t(string),
  commonMagicProfessionsAll: bool,
  commonMagicProfessionsExceptions: Maybe.t(list(frequencyException)),
  commonMagicProfessionsText: Maybe.t(string),
  commonBlessedProfessionsAll: bool,
  commonBlessedProfessionsExceptions: Maybe.t(list(frequencyException)),
  commonBlessedProfessionsText: Maybe.t(string),
  commonAdvantages: Maybe.t(list(int)),
  commonAdvantagesText: Maybe.t(string),
  commonDisadvantages: Maybe.t(list(int)),
  commonDisadvantagesText: Maybe.t(string),
  uncommonAdvantages: Maybe.t(list(int)),
  uncommonAdvantagesText: Maybe.t(string),
  uncommonDisadvantages: Maybe.t(list(int)),
  uncommonDisadvantagesText: Maybe.t(string),
  commonSkills: list(int),
  uncommonSkills: Maybe.t(list(int)),
  commonNames: string,
  culturalPackageCost: int,
  culturalPackageSkills: IntMap.t(int),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: int,
    name: string,
    areaKnowledge: string,
    areaKnowledgeShort: string,
    commonMundaneProfessions: Maybe.t(string),
    commonMagicalProfessions: Maybe.t(string),
    commonBlessedProfessions: Maybe.t(string),
    commonAdvantages: Maybe.t(string),
    commonDisadvantages: Maybe.t(string),
    uncommonAdvantages: Maybe.t(string),
    uncommonDisadvantages: Maybe.t(string),
    commonNames: string,
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
    areaKnowledge: json |> field("areaKnowledge", string),
    areaKnowledgeShort: json |> field("areaKnowledgeShort", string),
    commonMundaneProfessions:
      json |> optionalField("commonMundaneProfessions", string),
    commonMagicalProfessions:
      json |> optionalField("commonMagicalProfessions", string),
    commonBlessedProfessions:
      json |> optionalField("commonBlessedProfessions", string),
    commonAdvantages: json |> optionalField("commonAdvantages", string),
    commonDisadvantages: json |> optionalField("commonDisadvantages", string),
    uncommonAdvantages: json |> optionalField("uncommonAdvantages", string),
    uncommonDisadvantages:
      json |> optionalField("uncommonDisadvantages", string),
    commonNames: json |> field("commonNames", string),
  };

  let frequencyException = json =>
    json
    |> field("scope", string)
    |> (
      str =>
        switch (str) {
        | "Single" => Single(json |> field("value", int))
        | "Group" => Group(json |> field("value", int))
        | _ => raise(DecodeError("Unknown frequency exception: " ++ str))
        }
    );

  type tUniv = {
    id: int,
    languages: list(int),
    literacy: Maybe.t(list(int)),
    social: list(int),
    commonMundaneProfessionsAll: bool,
    commonMundaneProfessionsExceptions: Maybe.t(list(frequencyException)),
    commonMagicalProfessionsAll: bool,
    commonMagicalProfessionsExceptions: Maybe.t(list(frequencyException)),
    commonBlessedProfessionsAll: bool,
    commonBlessedProfessionsExceptions: Maybe.t(list(frequencyException)),
    commonAdvantages: Maybe.t(list(int)),
    commonDisadvantages: Maybe.t(list(int)),
    uncommonAdvantages: Maybe.t(list(int)),
    uncommonDisadvantages: Maybe.t(list(int)),
    commonSkills: list(int),
    uncommonSkills: Maybe.t(list(int)),
    culturalPackageCost: int,
    culturalPackageSkills: list((int, int)),
  };

  let tUniv = json => {
    id: json |> field("id", int),
    languages: json |> field("languages", list(int)),
    literacy: json |> optionalField("literacy", list(int)),
    social: json |> field("social", list(int)),
    commonMundaneProfessionsAll:
      json |> field("commonMundaneProfessionsAll", bool),
    commonMundaneProfessionsExceptions:
      json
      |> optionalField(
           "commonMundaneProfessionsExceptions",
           list(frequencyException),
         ),
    commonMagicalProfessionsAll:
      json |> field("commonMagicalProfessionsAll", bool),
    commonMagicalProfessionsExceptions:
      json
      |> optionalField(
           "commonMagicalProfessionsExceptions",
           list(frequencyException),
         ),
    commonBlessedProfessionsAll:
      json |> field("commonBlessedProfessionsAll", bool),
    commonBlessedProfessionsExceptions:
      json
      |> optionalField(
           "commonBlessedProfessionsExceptions",
           list(frequencyException),
         ),
    commonAdvantages: json |> optionalField("commonAdvantages", list(int)),
    commonDisadvantages:
      json |> optionalField("commonDisadvantages", list(int)),
    uncommonAdvantages:
      json |> optionalField("uncommonAdvantages", list(int)),
    uncommonDisadvantages:
      json |> optionalField("uncommonDisadvantages", list(int)),
    commonSkills: json |> field("commonSkills", list(int)),
    uncommonSkills: json |> optionalField("uncommonSkills", list(int)),
    culturalPackageCost: json |> field("culturalPackageCost", int),
    culturalPackageSkills:
      json |> field("culturalPackageSkills", list(pair(int, int))),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      language: univ.languages,
      script: univ.literacy,
      areaKnowledge: l10n.areaKnowledge,
      areaKnowledgeShort: l10n.areaKnowledgeShort,
      socialStatus: univ.social,
      commonMundaneProfessionsAll: univ.commonMundaneProfessionsAll,
      commonMundaneProfessionsExceptions:
        univ.commonMundaneProfessionsExceptions,
      commonMundaneProfessionsText: l10n.commonMundaneProfessions,
      commonMagicProfessionsAll: univ.commonMagicalProfessionsAll,
      commonMagicProfessionsExceptions:
        univ.commonMagicalProfessionsExceptions,
      commonMagicProfessionsText: l10n.commonMagicalProfessions,
      commonBlessedProfessionsAll: univ.commonBlessedProfessionsAll,
      commonBlessedProfessionsExceptions:
        univ.commonBlessedProfessionsExceptions,
      commonBlessedProfessionsText: l10n.commonBlessedProfessions,
      commonAdvantages: univ.commonAdvantages,
      commonAdvantagesText: l10n.commonAdvantages,
      commonDisadvantages: univ.commonDisadvantages,
      commonDisadvantagesText: l10n.commonDisadvantages,
      uncommonAdvantages: univ.uncommonAdvantages,
      uncommonAdvantagesText: l10n.uncommonAdvantages,
      uncommonDisadvantages: univ.uncommonDisadvantages,
      uncommonDisadvantagesText: l10n.uncommonDisadvantages,
      commonSkills: univ.commonSkills,
      uncommonSkills: univ.uncommonSkills,
      commonNames: l10n.commonNames,
      culturalPackageCost: univ.culturalPackageCost,
      culturalPackageSkills: univ.culturalPackageSkills |> IntMap.fromList,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.culturesUniv |> list(tUniv),
      yamlData.culturesL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
