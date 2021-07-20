module Order = struct
  type t = string list

  let from_list def xs = match xs with [] -> [ def ] | prefs -> prefs

  let to_list xs = xs

  let preferred = List.hd
end

module Supported = struct
  type t = { id : string; name : string; region : string }

  let system_locale_to_id supported_locales system_locale =
    system_locale |> Js.String.split "-"
    |> (fun arr -> arr.(0))
    |> fun systemLocaleStart ->
    StrMap.find
      (fun { id; _ } -> Js.String.startsWith systemLocaleStart id)
      supported_locales
    |> Option.fold ~none:"en-US" ~some:(fun locale -> locale.id)

  module Decode = struct
    open Decoders_bs.Decode

    type multilingual = {
      id : string;
      name : string;
      region : string;
      isMissingImplementation : bool option;
    }

    let multilingual =
      field "id" string
      >>= fun id ->
      field "name" string
      >>= fun name ->
      field "region" string
      >>= fun region ->
      field_opt "isMissingImplementation" bool
      >>= fun isMissingImplementation ->
      succeed { id; name; region; isMissingImplementation }
      >|= Option.ensure (fun { isMissingImplementation; _ } ->
              Option.dis isMissingImplementation)

    let make_assoc =
      multilingual
      >|= function
      | None -> None
      | Some multilingual ->
          Some
            ( multilingual.id,
              {
                id = multilingual.id;
                name = multilingual.name;
                region = multilingual.region;
              } )

    let make_strmap = list make_assoc >|= Option.catOptions >|= StrMap.fromList
  end
end

(* let filterBySupported def supportedLocales order =
  order
  |> Ley_List.filter (Ley_Function.flip Ley_StrMap.member supportedLocales)
  |> function
  | [] -> [ def ]
  | order -> order *)
