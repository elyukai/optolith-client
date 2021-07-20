module Static = struct
  type t = {
    id : Id.Curse.t;
    name : string;
    check : Check.t;
    check_mod : Check.Modifier.t option;
    effect : string;
    cost : Rated.Static.Activatable.MainParameter.t;
    duration : Rated.Static.Activatable.MainParameter.t;
    property : int;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Decoders_bs.Decode

    type translation = {
      name : string;
      effect : string;
      cost : Rated.Static.Activatable.MainParameter.Decode.translation;
      duration : Rated.Static.Activatable.MainParameter.Decode.translation;
      errata : Erratum.list option;
    }

    let translation =
      field "name" string
      >>= fun name ->
      field "effect" string
      >>= fun effect ->
      field "cost" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun cost ->
      field "duration" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun duration ->
      field_opt "errata" Erratum.Decode.list
      >>= fun errata -> succeed { name; effect; cost; duration; errata }

    type multilingual = {
      id : Id.Curse.t;
      check : Check.t;
      checkMod : Check.Modifier.t option;
      property : int;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" Id.Curse.Decode.t
      >>= fun id ->
      field "check" Check.Decode.t
      >>= fun check ->
      field_opt "checkMod" Check.Modifier.Decode.t
      >>= fun checkMod ->
      field "property" int
      >>= fun property ->
      field "src" (PublicationRef.Decode.make_list locale_order)
      >>= fun src ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed { id; check; checkMod; property; src; translations }

    let make_assoc locale_order =
      let open Option.Infix in
      multilingual locale_order
      >|= fun multilingual ->
      multilingual.translations
      |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
        {
          id = multilingual.id;
          name = translation.name;
          check = multilingual.check;
          check_mod = multilingual.checkMod;
          effect = translation.effect;
          cost =
            Rated.Static.Activatable.MainParameter.Decode.make false
              translation.cost;
          duration =
            Rated.Static.Activatable.MainParameter.Decode.make false
              translation.duration;
          property = multilingual.property;
          src = multilingual.src;
          errata = translation.errata |> Option.value ~default:[];
        } )
  end
end

module Dynamic = Rated.Dynamic.Activatable.Make (struct
  open Static

  type id = Id.Curse.t

  type static = t

  let ic _ = ImprovementCost.B
end)
