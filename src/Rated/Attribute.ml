module Static = struct
  type t = { id : Id.Attribute.t; name : string; abbr : string }

  module Decode = struct
    open Json.Decode

    type translation = { name : string; nameAbbr : string }

    let translation json =
      {
        name = json |> field "name" string;
        nameAbbr = json |> field "nameAbbr" string;
      }

    type multilingual = {
      id : Id.Attribute.t;
      translations : translation TranslationMap.t;
    }

    let multilingual json =
      {
        id = json |> field "id" Id.Attribute.Decode.t;
        translations =
          json |> field "translations" (TranslationMap.Decode.t translation);
      }

    let make_assoc locale_order json =
      let open Option.Infix in
      json |> multilingual |> fun multilingual ->
      multilingual.translations |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
        {
          id = multilingual.id;
          name = translation.name;
          abbr = translation.nameAbbr;
        } )
  end
end

module Dynamic = Rated.Dynamic.Make (struct
  type static = Static.t

  let ic _ = IC.D

  let min_value = 8
end)
