[@genType]
[@genType.as "FrequencyException"]
type frequencyException =
  | Single(int)
  | Group(int);

[@genType]
[@genType.as "Culture"]
type t = {
  id: int,
  name: string,
  language: list(int),
  script: option(list(int)),
  areaKnowledge: string,
  areaKnowledgeShort: string,
  socialStatus: list(int),
  commonMundaneProfessionsAll: bool,
  commonMundaneProfessionsExceptions: option(list(frequencyException)),
  commonMundaneProfessionsText: option(string),
  commonMagicProfessionsAll: bool,
  commonMagicProfessionsExceptions: option(list(frequencyException)),
  commonMagicProfessionsText: option(string),
  commonBlessedProfessionsAll: bool,
  commonBlessedProfessionsExceptions: option(list(frequencyException)),
  commonBlessedProfessionsText: option(string),
  commonAdvantages: list(int),
  commonAdvantagesText: option(string),
  commonDisadvantages: list(int),
  commonDisadvantagesText: option(string),
  uncommonAdvantages: list(int),
  uncommonAdvantagesText: option(string),
  uncommonDisadvantages: list(int),
  uncommonDisadvantagesText: option(string),
  commonSkills: list(int),
  uncommonSkills: list(int),
  commonNames: string,
  culturalPackageCost: int,
  culturalPackageSkills: Ley_IntMap.t(int),
};

module Decode = {
  open Json.Decode;
  open JsonStrict;

  type tL10n = {
    id: int,
    name: string,
    areaKnowledge: string,
    areaKnowledgeShort: string,
    commonMundaneProfessions: option(string),
    commonMagicalProfessions: option(string),
    commonBlessedProfessions: option(string),
    commonAdvantages: option(string),
    commonDisadvantages: option(string),
    uncommonAdvantages: option(string),
    uncommonDisadvantages: option(string),
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
    literacy: option(list(int)),
    social: list(int),
    commonMundaneProfessionsAll: bool,
    commonMundaneProfessionsExceptions: option(list(frequencyException)),
    commonMagicalProfessionsAll: bool,
    commonMagicalProfessionsExceptions: option(list(frequencyException)),
    commonBlessedProfessionsAll: bool,
    commonBlessedProfessionsExceptions: option(list(frequencyException)),
    commonAdvantages: option(list(int)),
    commonDisadvantages: option(list(int)),
    uncommonAdvantages: option(list(int)),
    uncommonDisadvantages: option(list(int)),
    commonSkills: list(int),
    uncommonSkills: option(list(int)),
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
      commonAdvantages: univ.commonAdvantages |> Ley.Option.fromOption([]),
      commonAdvantagesText: l10n.commonAdvantages,
      commonDisadvantages:
        univ.commonDisadvantages |> Ley.Option.fromOption([]),
      commonDisadvantagesText: l10n.commonDisadvantages,
      uncommonAdvantages:
        univ.uncommonAdvantages |> Ley.Option.fromOption([]),
      uncommonAdvantagesText: l10n.uncommonAdvantages,
      uncommonDisadvantages:
        univ.uncommonDisadvantages |> Ley.Option.fromOption([]),
      uncommonDisadvantagesText: l10n.uncommonDisadvantages,
      commonSkills: univ.commonSkills,
      uncommonSkills: univ.uncommonSkills |> Ley.Option.fromOption([]),
      commonNames: l10n.commonNames,
      culturalPackageCost: univ.culturalPackageCost,
      culturalPackageSkills: univ.culturalPackageSkills |> Ley.IntMap.fromList,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Ley.Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.culturesUniv |> list(tUniv),
      yamlData.culturesL10n |> list(tL10n),
    )
    |> Ley.IntMap.fromList;
};
