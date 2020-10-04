module Dynamic = {
  type t = int;
};

module Static = {
  type frequencyException =
    | Single(int)
    | Group(int);

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
    culturalPackageApValue: int,
    culturalPackageSkills: Ley_IntMap.t(int),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Translations = {
    type t = {
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
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
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
        commonDisadvantages:
          json |> optionalField("commonDisadvantages", string),
        uncommonAdvantages:
          json |> optionalField("uncommonAdvantages", string),
        uncommonDisadvantages:
          json |> optionalField("uncommonDisadvantages", string),
        commonNames: json |> field("commonNames", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
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
    commonAdvantages: list(int),
    commonDisadvantages: list(int),
    uncommonAdvantages: list(int),
    uncommonDisadvantages: list(int),
    commonSkills: list(int),
    uncommonSkills: list(int),
    culturalPackageApValue: int,
    culturalPackageSkills: Ley_IntMap.t(int),
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeFrequencyException =
    JsonStrict.(
      field("scope", string)
      |> andThen(
           fun
           | "Single" => (json => Single(json |> field("value", int)))
           | "Group" => (json => Group(json |> field("value", int)))
           | str =>
             raise(DecodeError("Unknown frequency exception: " ++ str)),
         )
    );

  let decodeMultilingual = json =>
    JsonStrict.{
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
             list(decodeFrequencyException),
           ),
      commonMagicalProfessionsAll:
        json |> field("commonMagicalProfessionsAll", bool),
      commonMagicalProfessionsExceptions:
        json
        |> optionalField(
             "commonMagicalProfessionsExceptions",
             list(decodeFrequencyException),
           ),
      commonBlessedProfessionsAll:
        json |> field("commonBlessedProfessionsAll", bool),
      commonBlessedProfessionsExceptions:
        json
        |> optionalField(
             "commonBlessedProfessionsExceptions",
             list(decodeFrequencyException),
           ),
      commonAdvantages:
        json
        |> optionalField("commonAdvantages", list(int))
        |> Ley_Option.fromOption([]),
      commonDisadvantages:
        json
        |> optionalField("commonDisadvantages", list(int))
        |> Ley_Option.fromOption([]),
      uncommonAdvantages:
        json
        |> optionalField("uncommonAdvantages", list(int))
        |> Ley_Option.fromOption([]),
      uncommonDisadvantages:
        json
        |> optionalField("uncommonDisadvantages", list(int))
        |> Ley_Option.fromOption([]),
      commonSkills: json |> field("commonSkills", list(int)),
      uncommonSkills:
        json
        |> optionalField("uncommonSkills", list(int))
        |> Ley_Option.fromOption([]),
      culturalPackageApValue: json |> field("culturalPackageApValue", int),
      culturalPackageSkills:
        json
        |> field("culturalPackageSkills", list(pair(int, int)))
        |> Ley_IntMap.fromList,
      src: json |> field("src", PublicationRef.decodeMultilingualList),
      translations: json |> field("translations", TranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => (
          x.id,
          {
            id: x.id,
            name: translation.name,
            language: x.languages,
            script: x.literacy,
            areaKnowledge: translation.areaKnowledge,
            areaKnowledgeShort: translation.areaKnowledgeShort,
            socialStatus: x.social,
            commonMundaneProfessionsAll: x.commonMundaneProfessionsAll,
            commonMundaneProfessionsExceptions:
              x.commonMundaneProfessionsExceptions,
            commonMundaneProfessionsText: translation.commonMundaneProfessions,
            commonMagicProfessionsAll: x.commonMagicalProfessionsAll,
            commonMagicProfessionsExceptions:
              x.commonMagicalProfessionsExceptions,
            commonMagicProfessionsText: translation.commonMagicalProfessions,
            commonBlessedProfessionsAll: x.commonBlessedProfessionsAll,
            commonBlessedProfessionsExceptions:
              x.commonBlessedProfessionsExceptions,
            commonBlessedProfessionsText: translation.commonBlessedProfessions,
            commonAdvantages: x.commonAdvantages,
            commonAdvantagesText: translation.commonAdvantages,
            commonDisadvantages: x.commonDisadvantages,
            commonDisadvantagesText: translation.commonDisadvantages,
            uncommonAdvantages: x.uncommonAdvantages,
            uncommonAdvantagesText: translation.uncommonAdvantages,
            uncommonDisadvantages: x.uncommonDisadvantages,
            uncommonDisadvantagesText: translation.uncommonDisadvantages,
            commonSkills: x.commonSkills,
            uncommonSkills: x.uncommonSkills,
            commonNames: translation.commonNames,
            culturalPackageApValue: x.culturalPackageApValue,
            culturalPackageSkills: x.culturalPackageSkills,
            src: PublicationRef.resolveTranslationsList(langs, x.src),
            errata: translation.errata,
          },
        )
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
