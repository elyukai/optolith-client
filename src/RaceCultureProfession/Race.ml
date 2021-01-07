module O = Ley_Option
module IM = Ley_IntMap
module IS = Ley_IntSet

module Static = struct
  module Variant = struct
    type t = {
      id : int;
      name : string;
      common_cultures : IS.t;
      common_advantages : int list;
      common_advantages_text : string option;
      common_disadvantages : int list;
      common_disadvantages_text : string option;
      uncommon_advantages : int list;
      uncommon_advantages_text : string option;
      uncommon_disadvantages : int list;
      uncommon_disadvantages_text : string option;
      hair_colors : int list;
      eye_colors : int list;
      size_base : int;
      size_random : Dice.t list;
    }

    module Decode = Json_Decode_Static.Nested.Make (struct
      type nonrec t = t

      module Translation = struct
        type t = {
          name : string;
          common_advantages : string option;
          common_disadvantages : string option;
          uncommon_advantages : string option;
          uncommon_disadvantages : string option;
        }

        let t json =
          Json_Decode_Strict.
            {
              name = json |> field "name" string;
              common_advantages =
                json |> optionalField "commonAdvantages" string;
              common_disadvantages =
                json |> optionalField "commonDisadvantages" string;
              uncommon_advantages =
                json |> optionalField "uncommonAdvantages" string;
              uncommon_disadvantages =
                json |> optionalField "uncommonDisadvantages" string;
            }

        let pred _ = true
      end

      type multilingual = {
        id : int;
        common_cultures : int list;
        common_advantages : int list option;
        common_disadvantages : int list option;
        uncommon_advantages : int list option;
        uncommon_disadvantages : int list option;
        hair_colors : int list;
        eye_colors : int list;
        size_base : int;
        size_random : Dice.t list;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual decode_translations json =
        Json_Decode_Strict.
          {
            id = json |> field "id" int;
            common_cultures = json |> field "commonCultures" (list int);
            common_advantages =
              json |> optionalField "commonAdvantages" (list int);
            common_disadvantages =
              json |> optionalField "commonDisadvantages" (list int);
            uncommon_advantages =
              json |> optionalField "uncommonAdvantages" (list int);
            uncommon_disadvantages =
              json |> optionalField "uncommonDisadvantages" (list int);
            hair_colors = json |> field "hairColors" (list int);
            eye_colors = json |> field "eyeColors" (list int);
            size_base = json |> field "sizeBase" int;
            size_random = json |> field "sizeRandom" (list Dice.Decode.t);
            translations = json |> field "translations" decode_translations;
          }

      let make _ (multilingual : multilingual) (translation : Translation.t) =
        Some
          {
            id = multilingual.id;
            name = translation.name;
            common_cultures = multilingual.common_cultures |> IS.fromList;
            common_advantages =
              multilingual.common_advantages |> O.fromOption [];
            common_advantages_text = translation.common_advantages;
            common_disadvantages =
              multilingual.common_disadvantages |> O.fromOption [];
            common_disadvantages_text = translation.common_disadvantages;
            uncommon_advantages =
              multilingual.uncommon_advantages |> O.fromOption [];
            uncommon_advantages_text = translation.uncommon_advantages;
            uncommon_disadvantages =
              multilingual.uncommon_disadvantages |> O.fromOption [];
            uncommon_disadvantages_text = translation.uncommon_disadvantages;
            hair_colors = multilingual.hair_colors;
            eye_colors = multilingual.eye_colors;
            size_base = multilingual.size_base;
            size_random = multilingual.size_random;
          }

      module Accessors = struct
        let id (x : t) = x.id

        let translations x = x.translations
      end
    end)
  end

  type starting_age_options = {
    experience_level : int;
    base : int;
    random : Dice.t;
  }

  type variant_options =
    | WithVariants of { variants : Variant.t Ley_IntMap.t }
    | WithoutVariants of {
        common_cultures : Ley_IntSet.t;
        hair_colors : int list;
        eye_colors : int list;
        size_base : int;
        size_random : Dice.t list;
      }

  type t = {
    id : int;
    name : string;
    ap_value : int;
    lp : int;
    spi : int;
    tou : int;
    mov : int;
    attribute_adjustments : int IM.t;
    attribute_adjustments_selection_value : int;
    attribute_adjustments_selection_list : IS.t;
    attribute_adjustments_text : string;
    automatic_advantages : int list;
    automatic_advantages_text : string option;
    strongly_recommended_advantages : int list;
    strongly_recommended_advantages_text : string option;
    strongly_recommended_disadvantages : int list;
    strongly_recommended_disadvantages_text : string option;
    common_advantages : int list;
    common_advantages_text : string option;
    common_disadvantages : int list;
    common_disadvantages_text : string option;
    uncommon_advantages : int list;
    uncommon_advantages_text : string option;
    uncommon_disadvantages : int list;
    uncommon_disadvantages_text : string option;
    weight_base : int;
    weight_random : Dice.t list;
    starting_age : starting_age_options IM.t;
    variant_options : variant_options;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        attribute_adjustments : string;
        automatic_advantages : string option;
        strongly_recommended_advantages : string option;
        strongly_recommended_disadvantages : string option;
        common_advantages : string option;
        common_disadvantages : string option;
        uncommon_advantages : string option;
        uncommon_disadvantages : string option;
        errata : Erratum.list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            attribute_adjustments = json |> field "attributeAdjustments" string;
            automatic_advantages =
              json |> optionalField "automaticAdvantages" string;
            strongly_recommended_advantages =
              json |> optionalField "stronglyRecommendedAdvantages" string;
            strongly_recommended_disadvantages =
              json |> optionalField "stronglyRecommendedDisadvantages" string;
            common_advantages = json |> optionalField "commonAdvantages" string;
            common_disadvantages =
              json |> optionalField "commonDisadvantages" string;
            uncommon_advantages =
              json |> optionalField "uncommonAdvantages" string;
            uncommon_disadvantages =
              json |> optionalField "uncommonDisadvantages" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type variant_options_multilingual =
      | WithVariants of { variants : Variant.Decode.multilingual list }
      | WithoutVariants of {
          common_cultures : int list;
          hair_colors : int list;
          eye_colors : int list;
          size_base : int;
          size_random : Dice.t list;
        }

    type multilingual = {
      id : int;
      ap_value : int;
      lp : int;
      spi : int;
      tou : int;
      mov : int;
      attribute_adjustments : (int * int) list option;
      attribute_adjustments_selection_value : int;
      attribute_adjustments_selection_list : int list;
      automatic_advantages : int list option;
      strongly_recommended_advantages : int list option;
      strongly_recommended_disadvantages : int list option;
      common_advantages : int list option;
      common_disadvantages : int list option;
      uncommon_advantages : int list option;
      uncommon_disadvantages : int list option;
      weight_base : int;
      weight_random : Dice.t list;
      starting_age : starting_age_options list;
      variant_options : variant_options_multilingual;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let starting_age_options json =
      Json.Decode.
        {
          experience_level = json |> field "experienceLevelId" int;
          base = json |> field "base" int;
          random = json |> field "random" Dice.Decode.t;
        }

    let variant_options_multilingual =
      Json_Decode_Strict.(
        field "type" string
        |> andThen (function
             | "WithVariants" ->
                 field "value" (fun json ->
                     ( WithVariants
                         {
                           variants =
                             json
                             |> field "variants"
                                  (list Variant.Decode.multilingual);
                         }
                       : variant_options_multilingual ))
             | "WithoutVariants" ->
                 field "value" (fun json ->
                     ( WithoutVariants
                         {
                           common_cultures =
                             json |> field "commonCultures" (list int);
                           hair_colors = json |> field "hairColors" (list int);
                           eye_colors = json |> field "eyeColors" (list int);
                           size_base = json |> field "sizeBase" int;
                           size_random =
                             json |> field "sizeRandom" (list Dice.Decode.t);
                         }
                       : variant_options_multilingual ))
             | str -> raise (DecodeError ("Unknown variant options: " ^ str))))

    let multilingual decode_translations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          ap_value = json |> field "apValue" int;
          lp = json |> field "lp" int;
          spi = json |> field "spi" int;
          tou = json |> field "tou" int;
          mov = json |> field "mov" int;
          attribute_adjustments =
            json |> optionalField "attributeAdjustments" (list (pair int int));
          attribute_adjustments_selection_value =
            json |> field "attributeAdjustmentsSelectionValue" int;
          attribute_adjustments_selection_list =
            json |> field "attributeAdjustmentsSelectionList" (list int);
          automatic_advantages =
            json |> optionalField "automaticAdvantages" (list int);
          strongly_recommended_advantages =
            json |> optionalField "stronglyRecommendedAdvantages" (list int);
          strongly_recommended_disadvantages =
            json |> optionalField "stronglyRecommendedDisadvantages" (list int);
          common_advantages =
            json |> optionalField "commonAdvantages" (list int);
          common_disadvantages =
            json |> optionalField "commonDisadvantages" (list int);
          uncommon_advantages =
            json |> optionalField "uncommonAdvantages" (list int);
          uncommon_disadvantages =
            json |> optionalField "uncommonDisadvantages" (list int);
          weight_base = json |> field "weightBase" int;
          weight_random = json |> field "weightRandom" (list Dice.Decode.t);
          starting_age = json |> field "startingAge" (list starting_age_options);
          variant_options =
            json |> field "typeSpecific" variant_options_multilingual;
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decode_translations;
        }

    let make langs (x : multilingual) (translation : Translation.t) =
      Some
        {
          id = x.id;
          name = translation.name;
          ap_value = x.ap_value;
          lp = x.lp;
          spi = x.spi;
          tou = x.tou;
          mov = x.mov;
          attribute_adjustments =
            x.attribute_adjustments
            |> Ley_Option.option Ley_IntMap.empty Ley_IntMap.fromList;
          attribute_adjustments_selection_value =
            x.attribute_adjustments_selection_value;
          attribute_adjustments_selection_list =
            x.attribute_adjustments_selection_list |> Ley_IntSet.fromList;
          attribute_adjustments_text = translation.attribute_adjustments;
          automatic_advantages =
            x.automatic_advantages |> Ley_Option.fromOption [];
          automatic_advantages_text = translation.automatic_advantages;
          strongly_recommended_advantages =
            x.strongly_recommended_advantages |> Ley_Option.fromOption [];
          strongly_recommended_advantages_text =
            translation.strongly_recommended_advantages;
          strongly_recommended_disadvantages =
            x.strongly_recommended_disadvantages |> Ley_Option.fromOption [];
          strongly_recommended_disadvantages_text =
            translation.strongly_recommended_disadvantages;
          common_advantages = x.common_advantages |> Ley_Option.fromOption [];
          common_advantages_text = translation.common_advantages;
          common_disadvantages =
            x.common_disadvantages |> Ley_Option.fromOption [];
          common_disadvantages_text = translation.common_disadvantages;
          uncommon_advantages =
            x.uncommon_advantages |> Ley_Option.fromOption [];
          uncommon_advantages_text = translation.uncommon_disadvantages;
          uncommon_disadvantages =
            x.uncommon_disadvantages |> Ley_Option.fromOption [];
          uncommon_disadvantages_text = translation.uncommon_disadvantages;
          weight_base = x.weight_base;
          weight_random = x.weight_random;
          starting_age =
            x.starting_age
            |> Ley_IntMap.from_list_with (fun x -> (x.experience_level, x));
          variant_options =
            ( match x.variant_options with
            | WithVariants options ->
                WithVariants
                  {
                    variants =
                      options.variants
                      |> O.mapOption (Variant.Decode.resolveTranslations langs)
                      |> IM.from_list_with (fun (v : Variant.t) -> (v.id, v));
                  }
            | WithoutVariants
                {
                  common_cultures;
                  hair_colors;
                  eye_colors;
                  size_base;
                  size_random;
                } ->
                WithoutVariants
                  {
                    common_cultures = common_cultures |> IS.fromList;
                    hair_colors;
                    eye_colors;
                    size_base;
                    size_random;
                  } );
          src = PublicationRef.Decode.resolveTranslationsList langs x.src;
          errata = translation.errata |> Ley_Option.fromOption [];
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end

module Dynamic = struct
  type id = Base of int | WithVariant of { base : int; variant : int }

  type t = { id : id; static : Static.t option }
end
