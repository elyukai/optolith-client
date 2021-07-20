type binary_handling = { as_male : bool; as_female : bool }

type t =
  | Male
  | Female
  | BalThani of binary_handling
  | Tsajana of binary_handling
  | Custom of { binary_handling : binary_handling; name : string }

module Decode = struct
  open Decoders_bs.Decode

  let binary_handling =
    field "as_male" bool
    >>= fun as_male ->
    field "as_female" bool >>= fun as_female -> succeed { as_male; as_female }

  let t =
    one_of
      [
        ( "Binary",
          string
          >>= function
          | "Male" -> succeed Male
          | "Female" -> succeed Female
          | _ -> fail "Expected a binary sex" );
        ( "Non-binary",
          field "type" string
          >>= function
          | "BalThani" ->
              field "value" (field "binary_handling" binary_handling)
              >|= fun opt -> BalThani opt
          | "Tsajana" ->
              field "value" (field "binary_handling" binary_handling)
              >|= fun opt -> Tsajana opt
          | "Custom" ->
              field "value"
                (field "binary_handling" binary_handling
                >>= fun binary_handling ->
                field "name" string
                >>= fun name -> succeed (Custom { binary_handling; name }))
          | _ -> fail "Expected a non-binary sex" );
      ]
end

module Encode = struct
  open Decoders_bs.Encode

  let binary_handling { as_male; as_female } =
    obj [ ("as_male", bool as_male); ("as_female", bool as_female) ]

  let t (sex : t) =
    match sex with
    | Male -> string "Male"
    | Female -> string "Female"
    | BalThani bin ->
        obj
          [
            ("type", string "BalThani");
            ("value", obj [ ("binary_handling", binary_handling bin) ]);
          ]
    | Tsajana bin ->
        obj
          [
            ("type", string "BalThani");
            ("value", obj [ ("binary_handling", binary_handling bin) ]);
          ]
    | Custom { binary_handling = bin; name } ->
        obj
          [
            ("type", string "BalThani");
            ( "value",
              obj
                [
                  ("binary_handling", binary_handling bin); ("name", string name);
                ] );
          ]
end
