module Static = {
  module ApplicableCombatTechniques = {
    type generalRestriction =
      | Improvised
      | PointedBlade
      | Mount
      | Race(int) // Only from a certain race
      | ExcludeTechniques(list(int));

    type meleeRestriction =
      | Improvised
      | PointedBlade
      | Mount
      | HasParry
      | OneHanded
      | Race(int) // Only from a certain race
      | ExcludeTechniques(list(int));

    type specificRestriction =
      | Improvised
      | PointedBlade
      | Mount
      | Race(int) // Only from a certain race
      | Level(int) // Only from a certain level of the special ability
      | Weapons(list(int)); // Only certain weapons

    type specific = {
      id: int,
      restrictions: list(specificRestriction),
    };

    type t =
      | All(list(generalRestriction))
      | AllMelee(list(meleeRestriction))
      | AllRanged(list(generalRestriction))
      | Specific(list(specific))
      | DependingOnCombatStyle;
  };

  module Extended = {
    type entry = {
      id: int,
      option: option(OneOrMany.t(int)),
    };

    type t = (entry, entry, entry);
  };

  module Property = {
    type t =
      | DependingOnProperty
      | Single(int);
  };

  type groupSpecific =
    | Default
        // 1, 2, 4, 6, 7, 14, 24, 26, 27, 28, 29, 31, 32, 34, 40, 41
        ({rules: string})
    | Combat({
        // 3, 11, 12, 21
        rules: string,
        type_: int,
        combatTechniques: ApplicableCombatTechniques.t,
        penalty: option(string),
      })
    | ProtectiveWardingCircle({
        // 8
        aeCost: int,
        protectiveCircle: string,
        wardingCircle: string,
      })
    | CombatStyle({
        // 9, 10
        rules: string,
        type_: int,
        combatTechniques: ApplicableCombatTechniques.t,
        penalty: option(string),
        extended: Extended.t,
      })
    | GeneralStyle({
        // 13, 25, 33
        rules: string,
        extended: Extended.t,
      })
    | TraditionArtifact({
        // 5, 15, 16, 17, 18, 19, 35, 37, 38, 39, 42, 43, 44, 45
        effect: string,
        aeCost: option(string),
        volume: string,
        bindingCost: option(string),
        property: Property.t,
      })
    | Steckenzauber({
        // 20
        effect: string,
        aeCost: string,
        property: Property.t,
      })
    | AncestorGlyphs({
        // 22
        rules: string,
        aeCost: string,
      })
    | CeremonialItem({
        // 23
        effect: string,
        aspect: int,
      })
    | Paktgeschenk
        // 30
        ({effect: string})
    | Kesselzauber({
        // 36
        effect: string,
        aeCost: option(string),
        volume: option(string),
        bindingCost: option(string),
        brew: int,
        property: Property.t,
      });

  type t = {
    id: int,
    name: string,
    nameInWiki: option(string),
    levels: option(int),
    max: option(int),
    selectOptions: SelectOption.map,
    input: option(string),
    gr: int,
    groupSpecific,
    prerequisites: Prerequisite.Collection.General.t,
    prerequisitesText: option(string),
    prerequisitesTextStart: option(string),
    prerequisitesTextEnd: option(string),
    apValue: option(Advantage.Static.apValue),
    apValueText: option(string),
    apValueTextAppend: option(string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module ApplicableCombatTechniques = {
      include ApplicableCombatTechniques;

      let generalRestriction =
        Json.Decode.(
          field("type", string)
          |> andThen(
               fun
               | "Improvised" => (_ => (Improvised: generalRestriction))
               | "PointedBlade" => (_ => PointedBlade)
               | "Mount" => (_ => Mount)
               | "Race" =>
                 field("value", int)
                 |> map((raceId) => (Race(raceId): generalRestriction))
               | "ExcludeTechniques" =>
                 field("value", list(int))
                 |> map((ctIds) =>
                      (ExcludeTechniques(ctIds): generalRestriction)
                    )
               | str =>
                 raise(
                   DecodeError(
                     "Unknown general combat technique restriction type: "
                     ++ str,
                   ),
                 ),
             )
        );

      let meleeRestriction =
        Json.Decode.(
          field("type", string)
          |> andThen(
               fun
               | "Improvised" => (_ => (Improvised: meleeRestriction))
               | "PointedBlade" => (_ => PointedBlade)
               | "Mount" => (_ => Mount)
               | "HasParry" => (_ => HasParry)
               | "OneHanded" => (_ => OneHanded)
               | "Race" =>
                 field("value", int)
                 |> map((raceId) => (Race(raceId): meleeRestriction))
               | "ExcludeTechniques" =>
                 field("value", list(int))
                 |> map((ctIds) =>
                      (ExcludeTechniques(ctIds): meleeRestriction)
                    )
               | str =>
                 raise(
                   DecodeError(
                     "Unknown general combat technique restriction type: "
                     ++ str,
                   ),
                 ),
             )
        );

      let specificRestriction =
        Json.Decode.(
          field("type", string)
          |> andThen(
               fun
               | "Improvised" => (_ => (Improvised: specificRestriction))
               | "PointedBlade" => (_ => PointedBlade)
               | "Mount" => (_ => Mount)
               | "Race" =>
                 field("value", int)
                 |> map((raceId) => (Race(raceId): specificRestriction))
               | "Level" =>
                 field("value", int)
                 |> map((level) => (Level(level): specificRestriction))
               | "Weapons" =>
                 field("value", list(int))
                 |> map((weaponIds) =>
                      (Weapons(weaponIds): specificRestriction)
                    )
               | str =>
                 raise(
                   DecodeError(
                     "Unknown general combat technique restriction type: "
                     ++ str,
                   ),
                 ),
             )
        );

      let specific = json =>
        Json.Decode.(
          (
            {
              id: json |> field("id", int),
              restrictions:
                json |> field("restrictions", list(specificRestriction)),
            }: specific
          )
        );

      let t =
        Json.Decode.(
          field("type", string)
          |> andThen(
               fun
               | "All" =>
                 field("value", list(generalRestriction))
                 |> map(x => All(x))
               | "AllMelee" =>
                 field("value", list(meleeRestriction))
                 |> map(x => AllMelee(x))
               | "AllRanged" =>
                 field("value", list(generalRestriction))
                 |> map(x => AllRanged(x))
               | "Specific" =>
                 field("value", list(specific)) |> map(x => Specific(x))
               | "DependingOnCombatStyle" => (_ => DependingOnCombatStyle)
               | str =>
                 raise(
                   DecodeError(
                     "Unknown general combat technique restriction type: "
                     ++ str,
                   ),
                 ),
             )
        );
    };

    module Extended = {
      include Extended;

      let entry = json =>
        Json_Decode_Strict.{
          id: json |> field("id", int),
          option: json |> optionalField("option", OneOrMany.Decode.t(int)),
        };

      let t = Json.Decode.tuple3(entry, entry, entry);
    };

    module Property = {
      include Property;

      let t =
        Json.Decode.(
          field("type", string)
          |> andThen(
               fun
               | "DependingOnProperty" => (_ => DependingOnProperty)
               | "Single" =>
                 field("value", int) |> map(propId => Single(propId))
               | str => raise(DecodeError("Unknown property type: " ++ str)),
             )
        );
    };

    module GroupSpecific = {
      module Default = {
        module Translation = {
          type t = {rules: string};

          let t = json =>
            Json.Decode.{rules: json |> field("rules", string)};
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module Combat = {
        module Translation = {
          type t = {
            rules: string,
            penalty: option(string),
          };

          let t = json =>
            Json_Decode_Strict.{
              rules: json |> field("rules", string),
              penalty: json |> optionalField("penalty", string),
            };
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module ProtectiveWardingCircle = {
        module Translation = {
          type t = {
            protectiveCircle: string,
            wardingCircle: string,
          };

          let t = json =>
            Json.Decode.{
              protectiveCircle: json |> field("protectiveCircle", string),
              wardingCircle: json |> field("wardingCircle", string),
            };
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module CombatStyle = {
        module Translation = {
          type t = {
            rules: string,
            penalty: option(string),
          };

          let t = json =>
            Json_Decode_Strict.{
              rules: json |> field("rules", string),
              penalty: json |> optionalField("penalty", string),
            };
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module GeneralStyle = {
        module Translation = {
          type t = {rules: string};

          let t = json =>
            Json.Decode.{rules: json |> field("rules", string)};
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module TraditionArtifact = {
        module Translation = {
          type t = {
            effect: string,
            aeCost: option(string),
            volume: string,
            bindingCost: option(string),
          };

          let t = json =>
            Json_Decode_Strict.{
              effect: json |> field("effect", string),
              aeCost: json |> optionalField("aeCost", string),
              volume: json |> field("volume", string),
              bindingCost: json |> optionalField("bindingCost", string),
            };
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module Steckenzauber = {
        module Translation = {
          type t = {
            effect: string,
            aeCost: string,
          };

          let t = json =>
            Json.Decode.{
              effect: json |> field("effect", string),
              aeCost: json |> field("aeCost", string),
            };
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module AncestorGlyphs = {
        module Translation = {
          type t = {
            rules: string,
            aeCost: string,
          };

          let t = json =>
            Json_Decode_Strict.{
              rules: json |> field("rules", string),
              aeCost: json |> field("aeCost", string),
            };
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module CeremonialItem = {
        module Translation = {
          type t = {effect: string};

          let t = json =>
            Json.Decode.{effect: json |> field("effect", string)};
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module Paktgeschenk = {
        module Translation = {
          type t = {effect: string};

          let t = json =>
            Json.Decode.{effect: json |> field("effect", string)};
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      module Kesselzauber = {
        module Translation = {
          type t = {
            effect: string,
            aeCost: option(string),
            volume: option(string),
            bindingCost: option(string),
          };

          let t = json =>
            Json_Decode_Strict.{
              effect: json |> field("effect", string),
              aeCost: json |> optionalField("aeCost", string),
              volume: json |> optionalField("volume", string),
              bindingCost: json |> optionalField("bindingCost", string),
            };
        };

        module TranslationMap = TranslationMap.Make(Translation);
      };

      type groupSpecificMultilingual =
        | Default
            // 1, 2, 4, 6, 7, 14, 24, 26, 27, 28, 29, 31, 32, 34, 40, 41
            ({translations: Default.TranslationMap.t})
        | Combat({
            // 3, 11, 12, 21
            type_: int,
            combatTechniques: ApplicableCombatTechniques.t,
            translations: Combat.TranslationMap.t,
          })
        | ProtectiveWardingCircle({
            // 8
            aeCost: int,
            translations: ProtectiveWardingCircle.TranslationMap.t,
          })
        | CombatStyle({
            // 9, 10
            type_: int,
            combatTechniques: ApplicableCombatTechniques.t,
            extended: Extended.t,
            translations: CombatStyle.TranslationMap.t,
          })
        | GeneralStyle({
            // 13, 25, 33
            extended: Extended.t,
            translations: GeneralStyle.TranslationMap.t,
          })
        | TraditionArtifact({
            // 5, 15, 16, 17, 18, 19, 35, 37, 38, 39, 42, 43, 44, 45
            property: Property.t,
            translations: TraditionArtifact.TranslationMap.t,
          })
        | Steckenzauber({
            // 20
            property: Property.t,
            translations: Steckenzauber.TranslationMap.t,
          })
        | AncestorGlyphs
            // 22
            ({translations: AncestorGlyphs.TranslationMap.t})
        | CeremonialItem({
            // 23
            aspect: int,
            translations: CeremonialItem.TranslationMap.t,
          })
        | Paktgeschenk
            // 30
            ({translations: Paktgeschenk.TranslationMap.t})
        | Kesselzauber({
            // 36
            brew: int,
            property: Property.t,
            translations: Kesselzauber.TranslationMap.t,
          });

      module Translation = {
        type t = {
          name: string,
          nameInWiki: option(string),
          input: option(string),
          prerequisites: option(string),
          prerequisitesStart: option(string),
          prerequisitesEnd: option(string),
          apValue: option(string),
          apValueAppend: option(string),
          errata: option(list(Erratum.t)),
        };

        let t = json =>
          Json_Decode_Strict.{
            name: json |> field("name", string),
            nameInWiki: json |> optionalField("nameInWiki", string),
            input: json |> optionalField("input", string),
            prerequisites: json |> optionalField("prerequisites", string),
            prerequisitesStart:
              json |> optionalField("prerequisitesStart", string),
            prerequisitesEnd:
              json |> optionalField("prerequisitesEnd", string),
            apValue: json |> optionalField("apValue", string),
            apValueAppend: json |> optionalField("apValueAppend", string),
            errata: json |> optionalField("errata", Erratum.Decode.list),
          };
      };

      module TranslationMap = TranslationMap.Make(Translation);

      type multilingual = {
        group: int,
        groupSpecific: groupSpecificMultilingual,
        translations: TranslationMap.t,
      };

      let multilingual =
        Json.Decode.(
          field("type", int)
          |> andThen(
               fun
               | 1 as group
               | 2 as group
               | 4 as group
               | 6 as group
               | 7 as group
               | 14 as group
               | 24 as group
               | 26 as group
               | 27 as group
               | 28 as group
               | 29 as group
               | 31 as group
               | 32 as group
               | 34 as group
               | 40 as group
               | 41 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       Default({
                         translations: Default.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 3 as group
               | 11 as group
               | 12 as group
               | 21 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       Combat({
                         type_: json |> field("type", int),
                         combatTechniques:
                           json
                           |> field(
                                "combatTechniques",
                                ApplicableCombatTechniques.t,
                              ),
                         translations: Combat.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 8 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       ProtectiveWardingCircle({
                         aeCost: json |> field("aeCost", int),
                         translations:
                           ProtectiveWardingCircle.TranslationMap.Decode.t(
                             json,
                           ),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 9 as group
               | 10 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       CombatStyle({
                         type_: json |> field("type", int),
                         combatTechniques:
                           json
                           |> field(
                                "combatTechniques",
                                ApplicableCombatTechniques.t,
                              ),
                         extended: json |> field("extended", Extended.t),
                         translations:
                           CombatStyle.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 13 as group
               | 25 as group
               | 33 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       GeneralStyle({
                         extended: json |> field("extended", Extended.t),
                         translations:
                           GeneralStyle.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 5 as group
               | 15 as group
               | 16 as group
               | 17 as group
               | 18 as group
               | 19 as group
               | 35 as group
               | 37 as group
               | 38 as group
               | 39 as group
               | 42 as group
               | 43 as group
               | 44 as group
               | 45 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       TraditionArtifact({
                         property: json |> field("property", Property.t),
                         translations:
                           TraditionArtifact.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 20 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       Steckenzauber({
                         property: json |> field("property", Property.t),
                         translations:
                           Steckenzauber.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 22 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       AncestorGlyphs({
                         translations:
                           AncestorGlyphs.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 23 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       CeremonialItem({
                         aspect: json |> field("aspect", int),
                         translations:
                           CeremonialItem.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 30 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       Paktgeschenk({
                         translations:
                           Paktgeschenk.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | 36 as group =>
                 field("value", json =>
                   {
                     group,
                     groupSpecific:
                       Kesselzauber({
                         brew: json |> field("brew", int),
                         property: json |> field("property", Property.t),
                         translations:
                           Kesselzauber.TranslationMap.Decode.t(json),
                       }),
                     translations: TranslationMap.Decode.t(json),
                   }
                 )
               | num =>
                 raise(
                   DecodeError(
                     "Unknown special ability group: " ++ Ley_Int.show(num),
                   ),
                 ),
             )
        );

      let resolveTranslations = (langs, x: multilingual) =>
        Ley_Option.Infix.(
          x.translations
          |> TranslationMap.Decode.getFromLanguageOrder(langs)
          >>= (
            translation =>
              (
                switch (x.groupSpecific) {
                | Default({translations}) =>
                  translations
                  |> Default.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      Default({rules: groupTranslation.rules}): groupSpecific
                    )
                  )
                | Combat({type_, combatTechniques, translations}) =>
                  translations
                  |> Combat.TranslationMap.Decode.getFromLanguageOrder(langs)
                  <&> (
                    (groupTranslation) => (
                      Combat({
                        type_,
                        rules: groupTranslation.rules,
                        penalty: groupTranslation.penalty,
                        combatTechniques,
                      }): groupSpecific
                    )
                  )
                | ProtectiveWardingCircle({aeCost, translations}) =>
                  translations
                  |> ProtectiveWardingCircle.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      ProtectiveWardingCircle({
                        aeCost,
                        protectiveCircle: groupTranslation.protectiveCircle,
                        wardingCircle: groupTranslation.wardingCircle,
                      }): groupSpecific
                    )
                  )
                | CombatStyle({
                    type_,
                    combatTechniques,
                    extended,
                    translations,
                  }) =>
                  translations
                  |> CombatStyle.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      CombatStyle({
                        type_,
                        rules: groupTranslation.rules,
                        penalty: groupTranslation.penalty,
                        combatTechniques,
                        extended,
                      }): groupSpecific
                    )
                  )
                | GeneralStyle({extended, translations}) =>
                  translations
                  |> GeneralStyle.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      GeneralStyle({rules: groupTranslation.rules, extended}): groupSpecific
                    )
                  )
                | TraditionArtifact({property, translations}) =>
                  translations
                  |> TraditionArtifact.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      TraditionArtifact({
                        effect: groupTranslation.effect,
                        aeCost: groupTranslation.aeCost,
                        volume: groupTranslation.volume,
                        bindingCost: groupTranslation.bindingCost,
                        property,
                      }): groupSpecific
                    )
                  )
                | Steckenzauber({property, translations}) =>
                  translations
                  |> Steckenzauber.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      Steckenzauber({
                        effect: groupTranslation.effect,
                        aeCost: groupTranslation.aeCost,
                        property,
                      }): groupSpecific
                    )
                  )
                | AncestorGlyphs({translations}) =>
                  translations
                  |> AncestorGlyphs.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      AncestorGlyphs({
                        rules: groupTranslation.rules,
                        aeCost: groupTranslation.aeCost,
                      }): groupSpecific
                    )
                  )
                | CeremonialItem({aspect, translations}) =>
                  translations
                  |> CeremonialItem.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      CeremonialItem({
                        effect: groupTranslation.effect,
                        aspect,
                      }): groupSpecific
                    )
                  )
                | Paktgeschenk({translations}) =>
                  translations
                  |> Paktgeschenk.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      Paktgeschenk({effect: groupTranslation.effect}): groupSpecific
                    )
                  )
                | Kesselzauber({brew, property, translations}) =>
                  translations
                  |> Kesselzauber.TranslationMap.Decode.getFromLanguageOrder(
                       langs,
                     )
                  <&> (
                    (groupTranslation) => (
                      Kesselzauber({
                        effect: groupTranslation.effect,
                        aeCost: groupTranslation.aeCost,
                        volume: groupTranslation.volume,
                        bindingCost: groupTranslation.bindingCost,
                        brew,
                        property,
                      }): groupSpecific
                    )
                  )
                }
              )
              <&> (groupSpecific => (translation, x.group, groupSpecific))
          )
        );
    };

    type multilingual = {
      id: int,
      levels: option(int),
      max: option(int),
      selectOptionCategories: option(list(SelectOption.Decode.Category.t)),
      selectOptions: SelectOption.Map.t(SelectOption.Decode.multilingual),
      prerequisites: Prerequisite.Collection.General.Decode.multilingual,
      apValue: option(Advantage.Static.apValue),
      groupSpecific: GroupSpecific.multilingual,
      src: list(PublicationRef.Decode.multilingual),
    };

    let multilingual = json =>
      Json_Decode_Strict.{
        id: json |> field("id", int),
        levels: json |> optionalField("levels", int),
        max: json |> optionalField("max", int),
        selectOptionCategories:
          json
          |> optionalField(
               "selectOptionCategories",
               list(SelectOption.Decode.Category.t),
             ),
        selectOptions:
          json
          |> optionalField(
               "selectOptions",
               list(SelectOption.Decode.multilingualAssoc),
             )
          |> Ley_Option.option(
               SelectOption.Map.empty,
               SelectOption.Map.fromList,
             ),
        prerequisites:
          json
          |> field(
               "prerequisites",
               Prerequisite.Collection.General.Decode.multilingual,
             ),
        apValue:
          json |> optionalField("apValue", Advantage.Static.Decode.apValue),
        groupSpecific:
          json |> field("groupSpecific", GroupSpecific.multilingual),
        src: json |> field("src", PublicationRef.Decode.multilingualList),
      };

    let resolveTranslations =
        (
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
          langs,
          x: multilingual,
        ) =>
      Ley_Option.Infix.(
        x.groupSpecific
        |> GroupSpecific.resolveTranslations(langs)
        <&> (
          ((translation, gr, groupSpecific)) => {
            let src =
              PublicationRef.Decode.resolveTranslationsList(langs, x.src);
            let errata = translation.errata;

            {
              id: x.id,
              name: translation.name,
              nameInWiki: translation.nameInWiki,
              levels: x.levels,
              max: x.max,
              selectOptions:
                x.selectOptionCategories
                |> SelectOption.Decode.ResolveCategories.resolveCategories(
                     ~blessings,
                     ~cantrips,
                     ~combatTechniques,
                     ~liturgicalChants,
                     ~skills,
                     ~spells,
                     ~tradeSecrets,
                     ~languages,
                     ~scripts,
                     ~animalShapes,
                     ~spellEnhancements,
                     ~liturgicalChantEnhancements,
                     ~src,
                     ~errata=errata |> Ley_Option.fromOption([]),
                   )
                |> SelectOption.Decode.ResolveCategories.mergeSelectOptions(
                     SelectOption.Map.mapMaybe(
                       SelectOption.Decode.resolveTranslations(langs),
                       x.selectOptions,
                     ),
                   ),
              input: translation.input,
              prerequisites:
                Prerequisite.Collection.General.Decode.resolveTranslations(
                  langs,
                  x.prerequisites,
                ),
              prerequisitesText: translation.prerequisites,
              prerequisitesTextStart: translation.prerequisitesStart,
              prerequisitesTextEnd: translation.prerequisitesEnd,
              apValue: x.apValue,
              apValueText: translation.apValue,
              apValueTextAppend: translation.apValueAppend,
              gr,
              groupSpecific,
              src:
                PublicationRef.Decode.resolveTranslationsList(langs, x.src),
              errata: translation.errata |> Ley_Option.fromOption([]),
            };
          }
        )
      );

    let t =
        (
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
          langs,
          json,
        ) =>
      json
      |> multilingual
      |> resolveTranslations(
           ~blessings,
           ~cantrips,
           ~combatTechniques,
           ~liturgicalChants,
           ~skills,
           ~spells,
           ~tradeSecrets,
           ~languages,
           ~scripts,
           ~animalShapes,
           ~spellEnhancements,
           ~liturgicalChantEnhancements,
           langs,
         );

    let toAssoc = (x: t) => (x.id, x);

    let assoc =
        (
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
        ) =>
      Decoder.decodeAssoc(
        t(
          ~blessings,
          ~cantrips,
          ~combatTechniques,
          ~liturgicalChants,
          ~skills,
          ~spells,
          ~tradeSecrets,
          ~languages,
          ~scripts,
          ~animalShapes,
          ~spellEnhancements,
          ~liturgicalChantEnhancements,
        ),
        toAssoc,
      );

    let modifyParsed = specialAbilities =>
      specialAbilities
      |> Ley_IntMap.adjust(
           (specialAbility: t) =>
             Ley_IntMap.lookup(
               Id.SpecialAbility.toInt(Language),
               specialAbilities,
             )
             |> Ley_Option.option(specialAbility, (language: t) =>
                  {...specialAbility, selectOptions: language.selectOptions}
                ),
           Id.SpecialAbility.toInt(LanguageSpecializations),
         );
  };
};
