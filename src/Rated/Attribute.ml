module Static = struct
  type t = {
    id : Id.Attribute.t;
    name : string;
    abbr : string;
    description : string;
  }

  module Decode = struct
    open Decoders_bs.Decode

    type translation = {
      name : string;
      nameAbbr : string;
      description : string;
    }

    let translation =
      field "name" string
      >>= fun name ->
      field "nameAbbr" string
      >>= fun nameAbbr ->
      field "description" string
      >>= fun description -> succeed { name; nameAbbr; description }

    type multilingual = {
      id : Id.Attribute.t;
      translations : translation TranslationMap.t;
    }

    let multilingual =
      field "id" Id.Attribute.Decode.t
      >>= fun id ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations -> succeed { id; translations }

    let make_assoc locale_order =
      let open Option.Infix in
      multilingual
      >|= fun multilingual ->
      multilingual.translations
      |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
        {
          id = multilingual.id;
          name = translation.name;
          abbr = translation.nameAbbr;
          description = translation.description;
        } )
  end
end

module Dynamic = Rated.Dynamic.Make (struct
  open Static

  type id = Id.Attribute.t

  type static = t

  let ic _ = ImprovementCost.D

  let min_value = 8
end)
