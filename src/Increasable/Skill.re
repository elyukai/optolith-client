module Dynamic =
  Increasable.Dynamic.Make({
    let minValue = 0;
  });

module Static = {
  module Application = {
    type t = {
      id: int,
      name: string,
      prerequisite: option(Prerequisite.Activatable.t),
    };

    module Decode = {
      module Translation = {
        type t = {name: string};

        let t = json => Json.Decode.{name: json |> field("name", string)};
      };

      module TranslationMap = TranslationMap.Make(Translation);

      type multilingual = {
        id: int,
        prerequisite: option(Prerequisite.Activatable.t),
        translations: TranslationMap.t,
      };

      let multilingual = json =>
        Json.Decode.{
          id: json |> field("id", int),
          prerequisite:
            JsonStrict.(
              json
              |> optionalField(
                   "prerequisite",
                   Prerequisite.Activatable.Decode.t,
                 )
            ),
          translations:
            json |> field("translations", TranslationMap.Decode.t),
        };

      let resolveTranslations = (langs, x) =>
        Ley_Option.Infix.(
          x.translations
          |> TranslationMap.Decode.getFromLanguageOrder(langs)
          <&> (
            translation => {
              id: x.id,
              name: translation.name,
              prerequisite: x.prerequisite,
            }
          )
        );
    };
  };

  module Use = {
    type t = {
      id: int,
      name: string,
      prerequisite: Prerequisite.Activatable.t,
    };

    module Decode = {
      module Translation = {
        type t = {name: string};

        let t = json => Json.Decode.{name: json |> field("name", string)};
      };

      module TranslationMap = TranslationMap.Make(Translation);

      type multilingual = {
        id: int,
        prerequisite: Prerequisite.Activatable.t,
        translations: TranslationMap.t,
      };

      let multilingual = json =>
        Json.Decode.{
          id: json |> field("id", int),
          prerequisite:
            json |> field("prerequisite", Prerequisite.Activatable.Decode.t),
          translations:
            json |> field("translations", TranslationMap.Decode.t),
        };

      let resolveTranslations = (langs, x) =>
        Ley_Option.Infix.(
          x.translations
          |> TranslationMap.Decode.getFromLanguageOrder(langs)
          <&> (
            translation => {
              id: x.id,
              name: translation.name,
              prerequisite: x.prerequisite,
            }
          )
        );
    };
  };

  type encumbrance =
    | True
    | False
    | Maybe(option(string));

  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    encumbrance,
    gr: int,
    ic: IC.t,
    applications: Ley_IntMap.t(Application.t),
    applicationsInput: option(string),
    uses: Ley_IntMap.t(Use.t),
    tools: option(string),
    quality: string,
    failed: string,
    critical: string,
    botch: string,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        applicationsInput: option(string),
        encDescription: option(string),
        tools: option(string),
        quality: string,
        failed: string,
        critical: string,
        botch: string,
        errata: list(Erratum.t),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          applicationsInput:
            json |> optionalField("applicationsInput", string),
          encDescription: json |> optionalField("encDescription", string),
          tools: json |> optionalField("tools", string),
          quality: json |> field("quality", string),
          failed: json |> field("failed", string),
          critical: json |> field("critical", string),
          botch: json |> field("botch", string),
          errata: json |> field("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type encumbranceUniv =
      | True
      | False
      | Maybe;

    let encumbranceUniv = json =>
      Json.Decode.(
        json
        |> string
        |> (
          str =>
            switch (str) {
            | "true" => json |> int |> (_ => (True: encumbranceUniv))
            | "false" => json |> int |> (_ => (False: encumbranceUniv))
            | "maybe" => json |> int |> (_ => (Maybe: encumbranceUniv))
            | _ => raise(DecodeError("Unknown encumbrance: " ++ str))
            }
        )
      );

    type multilingual = {
      id: int,
      check: SkillCheck.t,
      applications: option(list(Application.Decode.multilingual)),
      uses: option(list(Use.Decode.multilingual)),
      ic: IC.t,
      enc: encumbranceUniv,
      gr: int,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        applications:
          json
          |> optionalField(
               "applications",
               list(Application.Decode.multilingual),
             ),
        uses: json |> optionalField("uses", list(Use.Decode.multilingual)),
        check: json |> field("check", SkillCheck.Decode.t),
        ic: json |> field("ic", IC.Decode.t),
        enc: json |> field("enc", encumbranceUniv),
        gr: json |> field("gr", int),
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
            check: x.check,
            encumbrance:
              switch (x.enc) {
              | True => True
              | False => False
              | Maybe => Maybe(translation.encDescription)
              },
            applications:
              x.applications
              |> Ley_Option.option(Ley_IntMap.empty, applications =>
                   applications
                   |> Ley_List.foldr(
                        application =>
                          application
                          |> Application.Decode.resolveTranslations(langs)
                          |> Ley_Option.option(
                               Ley_Function.id,
                               Ley_IntMap.insert(application.id),
                             ),
                        Ley_IntMap.empty,
                      )
                 ),
            applicationsInput: translation.applicationsInput,
            uses:
              x.uses
              |> Ley_Option.option(Ley_IntMap.empty, uses =>
                   uses
                   |> Ley_List.foldr(
                        use =>
                          use
                          |> Use.Decode.resolveTranslations(langs)
                          |> Ley_Option.option(
                               Ley_Function.id,
                               Ley_IntMap.insert(use.id),
                             ),
                        Ley_IntMap.empty,
                      )
                 ),
            ic: x.ic,
            gr: x.gr,
            tools: translation.tools,
            quality: translation.quality,
            failed: translation.failed,
            critical: translation.critical,
            botch: translation.botch,
            src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
            errata: translation.errata,
          }
        )
      );

    let t = (langs, json) =>
      json |> multilingual |> resolveTranslations(langs);

    let toAssoc = (x: t) => (x.id, x);

    let assoc = Decoder.decodeAssoc(t, toAssoc);
  };
};
