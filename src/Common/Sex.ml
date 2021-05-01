type binary_handling = { as_male : bool; as_female : bool }

type t =
  | Male
  | Female
  | BalThani of binary_handling
  | Tsajana of binary_handling
  | Custom of { binary_handling : binary_handling; name : string }

type prerequisite = Male | Female

let matches (sex : t) (prerequisite : prerequisite) =
  match (prerequisite, sex) with
  | Male, Male | Female, Female -> true
  | Male, Female | Female, Male -> false
  | Male, BalThani { as_male = as_sex; _ }
  | Male, Tsajana { as_male = as_sex; _ }
  | Male, Custom { binary_handling = { as_male = as_sex; _ }; _ }
  | Female, BalThani { as_female = as_sex; _ }
  | Female, Tsajana { as_female = as_sex; _ }
  | Female, Custom { binary_handling = { as_female = as_sex; _ }; _ } ->
      as_sex

module Decode = struct
  open Json.Decode

  let binary_handling json =
    {
      as_male = json |> field "as_male" bool;
      as_female = json |> field "as_female" bool;
    }

  let t =
    oneOf
      [
        string
        |> map (function
             | "Male" -> (Male : t)
             | "Female" -> Female
             | str ->
                 JsonStatic.raise_unknown_variant ~variant_name:"Sex"
                   ~invalid:str);
        field "type" string
        |> andThen (function
             | "BalThani" ->
                 field "value" (field "binary_handling" binary_handling)
                 |> map (fun opt -> BalThani opt)
             | "Tsajana" ->
                 field "value" (field "binary_handling" binary_handling)
                 |> map (fun opt -> Tsajana opt)
             | "Custom" ->
                 field "value" (fun json ->
                     Custom
                       {
                         binary_handling =
                           json |> field "binary_handling" binary_handling;
                         name = json |> field "name" string;
                       })
             | str ->
                 JsonStatic.raise_unknown_variant ~variant_name:"Sex"
                   ~invalid:str);
      ]

  let prerequisite =
    string
    |> map (function
         | "Male" -> (Male : prerequisite)
         | "Female" -> Female
         | str ->
             JsonStatic.raise_unknown_variant ~variant_name:"Sex" ~invalid:str)
end

module Encode = struct
  open Json.Encode

  let binary_handling { as_male; as_female } =
    object_ [ ("as_male", bool as_male); ("as_female", bool as_female) ]

  let t (sex : t) =
    match sex with
    | Male -> string "Male"
    | Female -> string "Female"
    | BalThani bin ->
        object_
          [
            ("type", string "BalThani");
            ("value", object_ [ ("binary_handling", binary_handling bin) ]);
          ]
    | Tsajana bin ->
        object_
          [
            ("type", string "BalThani");
            ("value", object_ [ ("binary_handling", binary_handling bin) ]);
          ]
    | Custom { binary_handling = bin; name } ->
        object_
          [
            ("type", string "BalThani");
            ( "value",
              object_
                [
                  ("binary_handling", binary_handling bin); ("name", string name);
                ] );
          ]
end
