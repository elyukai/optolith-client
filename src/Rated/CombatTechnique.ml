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

    module Decode = struct
      open Json.Decode
      open JsonStrict

      type translation = {
        name : string;
        special : string option;
        errata : Erratum.list option;
      }

      let translation json =
        {
          name = json |> field "name" string;
          special = json |> optionalField "special" string;
          errata = json |> optionalField "errata" Erratum.Decode.list;
        }

      type multilingual = {
        id : int;
        ic : IC.t;
        primary : int list;
        hasNoParry : bool;
        breakingPointRating : int;
        gr : int;
        src : PublicationRef.list;
        translations : translation TranslationMap.t;
      }

      let multilingual locale_order json =
        {
          id = json |> field "id" int;
          ic = json |> field "ic" IC.Decode.t;
          primary = json |> field "primary" (list int);
          hasNoParry = json |> field "hasNoParry" bool;
          breakingPointRating = json |> field "breakingPointRating" int;
          gr = json |> field "gr" int;
          src =
            json |> field "src" (PublicationRef.Decode.make_list locale_order);
          translations =
            json |> field "translations" (TranslationMap.Decode.t translation);
        }

      let make_assoc locale_order json =
        let open Option.Infix in
        json |> multilingual locale_order |> fun multilingual ->
        multilingual.translations |> TranslationMap.preferred locale_order
        <&> fun translation ->
        ( multilingual.id,
          {
            id = multilingual.id;
            name = translation.name;
            ic = multilingual.ic;
            primary = multilingual.primary;
            special = translation.special;
            hasNoParry = multilingual.hasNoParry;
            breakingPointRating = multilingual.breakingPointRating;
            gr = multilingual.gr;
            src = multilingual.src;
            errata = translation.errata |> Option.fromOption [];
          } )
    end
  end

  module Dynamic = Rated.Dynamic.Make (struct
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

    module Decode = struct
      open Json.Decode
      open JsonStrict

      type translation = {
        name : string;
        special : string option;
        errata : Erratum.list option;
      }

      let translation json =
        {
          name = json |> field "name" string;
          special = json |> optionalField "special" string;
          errata = json |> optionalField "errata" Erratum.Decode.list;
        }

      type multilingual = {
        id : int;
        ic : IC.t;
        primary : int list;
        breakingPointRating : int;
        gr : int;
        src : PublicationRef.list;
        translations : translation TranslationMap.t;
      }

      let multilingual locale_order json =
        {
          id = json |> field "id" int;
          ic = json |> field "ic" IC.Decode.t;
          primary = json |> field "primary" (list int);
          breakingPointRating = json |> field "breakingPointRating" int;
          gr = json |> field "gr" int;
          src =
            json |> field "src" (PublicationRef.Decode.make_list locale_order);
          translations =
            json |> field "translations" (TranslationMap.Decode.t translation);
        }

      let make_assoc locale_order json =
        let open Option.Infix in
        json |> multilingual locale_order |> fun multilingual ->
        multilingual.translations |> TranslationMap.preferred locale_order
        <&> fun translation ->
        ( multilingual.id,
          {
            id = multilingual.id;
            name = translation.name;
            ic = multilingual.ic;
            primary = multilingual.primary;
            special = translation.special;
            breakingPointRating = multilingual.breakingPointRating;
            gr = multilingual.gr;
            src = multilingual.src;
            errata = translation.errata |> Option.fromOption [];
          } )
    end
  end

  module Dynamic = Rated.Dynamic.Make (struct
    type static = Static.t

    let min_value = 6
  end)
end
