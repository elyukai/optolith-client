module Melee = struct
  module Static = struct
    type t = {
      id : int;
      name : string;
      ic : IC.t;
      primary : int list;
      special : string option;
      hasNoParry : bool;
      breakingPointRating : int;
      gr : int;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

    module Decode = Json_Decode_Static.Make (struct
      type nonrec t = t

      module Translation = struct
        type t = {
          name : string;
          special : string option;
          errata : Erratum.list option;
        }

        let t json =
          Json_Decode_Strict.
            {
              name = json |> field "name" string;
              special = json |> optionalField "special" string;
              errata = json |> optionalField "errata" Erratum.Decode.list;
            }

        let pred _ = true
      end

      type multilingual = {
        id : int;
        ic : IC.t;
        primary : int list;
        hasNoParry : bool;
        breakingPointRating : int;
        gr : int;
        src : PublicationRef.Decode.multilingual list;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual decodeTranslations json =
        Json.Decode.
          {
            id = json |> field "id" int;
            ic = json |> field "ic" IC.Decode.t;
            primary = json |> field "primary" (list int);
            hasNoParry = json |> field "hasNoParry" bool;
            breakingPointRating = json |> field "breakingPointRating" int;
            gr = json |> field "gr" int;
            src = json |> field "src" PublicationRef.Decode.multilingualList;
            translations = json |> field "translations" decodeTranslations;
          }

      let make langs (multilingual : multilingual) (translation : Translation.t)
          =
        Some
          {
            id = multilingual.id;
            name = translation.name;
            ic = multilingual.ic;
            primary = multilingual.primary;
            special = translation.special;
            hasNoParry = multilingual.hasNoParry;
            breakingPointRating = multilingual.breakingPointRating;
            gr = multilingual.gr;
            src =
              PublicationRef.Decode.resolveTranslationsList langs
                multilingual.src;
            errata = translation.errata |> Ley_Option.fromOption [];
          }

      module Accessors = struct
        let id (x : t) = x.id

        let translations x = x.translations
      end
    end)
  end

  module Dynamic = Increasable.Dynamic.Make (struct
    type static = Static.t

    let min_value = 6
  end)
end

module Ranged = struct
  module Static = struct
    type t = {
      id : int;
      name : string;
      ic : IC.t;
      primary : int list;
      special : string option;
      breakingPointRating : int;
      gr : int;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

    module Decode = Json_Decode_Static.Make (struct
      type nonrec t = t

      module Translation = struct
        type t = {
          name : string;
          special : string option;
          errata : Erratum.list option;
        }

        let t json =
          Json_Decode_Strict.
            {
              name = json |> field "name" string;
              special = json |> optionalField "special" string;
              errata = json |> optionalField "errata" Erratum.Decode.list;
            }

        let pred _ = true
      end

      type multilingual = {
        id : int;
        ic : IC.t;
        primary : int list;
        breakingPointRating : int;
        gr : int;
        src : PublicationRef.Decode.multilingual list;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual decodeTranslations json =
        Json.Decode.
          {
            id = json |> field "id" int;
            ic = json |> field "ic" IC.Decode.t;
            primary = json |> field "primary" (list int);
            breakingPointRating = json |> field "breakingPointRating" int;
            gr = json |> field "gr" int;
            src = json |> field "src" PublicationRef.Decode.multilingualList;
            translations = json |> field "translations" decodeTranslations;
          }

      let make langs (multilingual : multilingual) (translation : Translation.t)
          =
        Some
          {
            id = multilingual.id;
            name = translation.name;
            ic = multilingual.ic;
            primary = multilingual.primary;
            special = translation.special;
            breakingPointRating = multilingual.breakingPointRating;
            gr = multilingual.gr;
            src =
              PublicationRef.Decode.resolveTranslationsList langs
                multilingual.src;
            errata = translation.errata |> Ley_Option.fromOption [];
          }

      module Accessors = struct
        let id (x : t) = x.id

        let translations x = x.translations
      end
    end)
  end

  module Dynamic = Increasable.Dynamic.Make (struct
    type static = Static.t

    let min_value = 6
  end)
end
