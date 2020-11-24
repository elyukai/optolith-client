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

  module Decode = {
    module Translation = {
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
        errata: option(list(Erratum.t)),
      };

      let t = json =>
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
          errata: json |> optionalField("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

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
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let frequencyException =
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

    let multilingual = json =>
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
          |> field(
               "culturalPackageSkills",
               list(json =>
                 (json |> field("id", int), json |> field("value", int))
               ),
             )
          |> Ley_IntMap.fromList,
        src: json |> field("src", PublicationRef.Decode.multilingualList),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
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
            src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
            errata: translation.errata |> Ley_Option.fromOption([]),
          }
        )
      );

    let t = (langs, json) =>
      json |> multilingual |> resolveTranslations(langs);

    let toAssoc = (x: t) => (x.id, x);

    let assoc = Decoder.decodeAssoc(t, toAssoc);
  };
};
