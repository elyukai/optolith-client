module Order = struct
  type t = string list

  let from_list def xs = match xs with [] -> [ def ] | prefs -> prefs

  let to_list xs = xs

  let preferred = List.hd
end

module Supported = struct
  type t = { id : string; name : string; region : string }

  let system_locale_to_id supported_locales system_locale =
    (system_locale |> Js.String.split "-" |> fun arr -> arr.(0))
    |> fun systemLocaleStart ->
    StrMap.find
      (fun { id; _ } -> Js.String.startsWith systemLocaleStart id)
      supported_locales
    |> Option.option "en-US" (fun locale -> locale.id)

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type multilingual = {
      id : string;
      name : string;
      region : string;
      isMissingImplementation : bool option;
    }

    let multilingual json =
      {
        id = json |> field "id" string;
        name = json |> field "name" string;
        region = json |> field "region" string;
        isMissingImplementation =
          json |> optionalField "isMissingImplementation" bool;
      }
      |> Option.ensure (fun { isMissingImplementation; _ } ->
             Option.dis isMissingImplementation)

    let make_assoc json =
      let open Option.Infix in
      json |> multilingual <&> fun multilingual ->
      ( multilingual.id,
        {
          id = multilingual.id;
          name = multilingual.name;
          region = multilingual.region;
        } )

    let make_strmap json =
      json |> list make_assoc |> Option.catOptions |> StrMap.fromList
  end
end

(* let filterBySupported def supportedLocales order =
  order
  |> Ley_List.filter (Ley_Function.flip Ley_StrMap.member supportedLocales)
  |> function
  | [] -> [ def ]
  | order -> order *)
