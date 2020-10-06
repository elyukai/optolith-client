module Dynamic = {
  type t = {
    id: int,
    lessonPackage: option(int),
  };
};

module Static = {
  type restrictedSpellwork =
    | Spell(int)
    | Property(int)
    | OneFromProperty(int)
    | DemonSummoning
    | Borbaradian
    | DamageIntelligent;

  type lessonPackage = {
    id: int,
    name: string,
    apValue: int,
    combatTechniques: Ley_IntMap.t(int),
    skills: Ley_IntMap.t(int),
    spells: Ley_IntMap.t(int),
  };

  type t = {
    id: int,
    name: string,
    guideline: int,
    electiveSpellworks: list(int),
    restrictedSpellworks: list(restrictedSpellwork),
    lessonPackages: Ley_IntMap.t(lessonPackage),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module LessonPackageTranslation = {
      type t = {name: string};

      let t = json => Json.Decode.{name: json |> field("name", string)};
    };

    module LessonPackageTranslationMap =
      TranslationMap.Make(LessonPackageTranslation);

    type lessonPackageMultilingual = {
      id: int,
      apValue: int,
      combatTechniques: Ley_IntMap.t(int),
      skills: Ley_IntMap.t(int),
      spells: Ley_IntMap.t(int),
      translations: LessonPackageTranslationMap.t,
    };

    let lessonPackageMultilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        apValue: json |> field("apValue", int),
        combatTechniques:
          json
          |> optionalField(
               "combatTechniques",
               list(json =>
                 (json |> field("id", int), json |> field("value", int))
               ),
             )
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        skills:
          json
          |> optionalField(
               "skills",
               list(json =>
                 (json |> field("id", int), json |> field("value", int))
               ),
             )
          |> Ley_Option.option(Ley_IntMap.empty, Ley_IntMap.fromList),
        spells:
          json
          |> field(
               "spells",
               list(json =>
                 (json |> field("id", int), json |> field("value", int))
               ),
             )
          |> Ley_IntMap.fromList,
        translations:
          json |> field("translations", LessonPackageTranslationMap.Decode.t),
      };

    let lessonPackageMultilingualAssoc = json =>
      json |> lessonPackageMultilingual |> (x => (x.id, x));

    let resolveLessonPackageTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> LessonPackageTranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            apValue: x.apValue,
            combatTechniques: x.combatTechniques,
            skills: x.skills,
            spells: x.spells,
          }
        )
      );

    let restrictedSpellwork =
      Json.Decode.(
        field("type", string)
        |> andThen(
             fun
             | "Spell" => field("value", int) |> map(id => Spell(id))
             | "Property" => field("value", int) |> map(id => Property(id))
             | "OneFromProperty" =>
               field("value", int) |> map(id => OneFromProperty(id))
             | "DemonSummoning" => (_ => DemonSummoning)
             | "Borbaradian" => (_ => Borbaradian)
             | "DamageIntelligent" => (_ => DamageIntelligent)
             | str =>
               raise(
                 DecodeError("Unknown restricted spellwork type: " ++ str),
               ),
           )
      );

    module Translation = {
      type t = {
        name: string,
        errata: list(Erratum.t),
      };

      let t = json =>
        Json.Decode.{
          name: json |> field("name", string),
          errata: json |> field("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      guideline: int,
      electiveSpellworks: list(int),
      restrictedSpellworks: list(restrictedSpellwork),
      lessonPackages: Ley_IntMap.t(lessonPackageMultilingual),
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      Json.Decode.{
        id: json |> field("id", int),
        guideline: json |> field("guideline", int),
        electiveSpellworks: json |> field("electiveSpellworks", list(int)),
        restrictedSpellworks:
          json |> field("restrictedSpellworks", list(restrictedSpellwork)),
        lessonPackages:
          json
          |> field("lessonPackages", list(lessonPackageMultilingualAssoc))
          |> Ley_IntMap.fromList,
        src: json |> field("src", PublicationRef.Decode.multilingualList),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x: multilingual) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            guideline: x.guideline,
            electiveSpellworks: x.electiveSpellworks,
            restrictedSpellworks: x.restrictedSpellworks,
            lessonPackages:
              x.lessonPackages
              |> Ley_IntMap.mapMaybe(resolveLessonPackageTranslations(langs)),
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
