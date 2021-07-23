type resistance = Spirit | Toughness | LowerOfSpiritAndToughness

module Cause = struct
  type chance = Percent of int | Text of string

  type t = { chance : chance; name : string }

  module Decode = struct
    open Decoders_bs.Decode

    type translation = { name : string; chance : string option }

    let translation =
      field "name" string
      >>= fun name ->
      field_opt "chance" string
      >>= fun chance -> succeed ({ name; chance } : translation)

    type multilingual = {
      chance : int option;
      translations : translation TranslationMap.t;
    }

    let multilingual =
      field_opt "chance" int
      >>= fun chance ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations -> succeed { chance; translations }

    let make locale_order =
      multilingual
      >>= fun multilingual ->
      multilingual.translations
      |> TranslationMap.preferred locale_order
      |> function
      | Some translation ->
          (match (multilingual.chance, translation.chance) with
          | Some percent, _ -> succeed (Percent percent)
          | None, Some text -> succeed (Text text)
          | None, None ->
              fail "Either a percent chance or a text chance must be defined")
          >>= fun chance ->
          succeed (Some ({ chance; name = translation.name } : t))
      | None -> succeed None
  end
end

type alternative_name = { name : string; region : string option }

type varying_parameter = { default : string; lessened : string option }

type t = {
  id : Id.Disease.t;
  name : string;
  alternative_names : alternative_name list;
  level : int;
  progress : string;
  resistance : resistance;
  incubation_time : string;
  damage : varying_parameter;
  duration : varying_parameter;
  cause : Cause.t list;
  special : string option;
  treatment : string;
  cure : string;
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode = struct
  open Decoders_bs.Decode

  let alternative_name =
    one_of
      [
        ("simple", string >>= fun name -> succeed { name; region = None });
        ( "regional",
          field "name" string
          >>= fun name ->
          field "region" string
          >>= fun region -> succeed { name; region = Some region } );
      ]

  let varying_parameter =
    field "default" string
    >>= fun default ->
    field_opt "lessened" string
    >>= fun lessened -> succeed { default; lessened }

  type translation = {
    name : string;
    alternative_names : alternative_name list option;
    progress : string;
    incubation_time : string;
    damage : varying_parameter;
    duration : varying_parameter;
    special : string option;
    treatment : string;
    cure : string;
    errata : Erratum.list option;
  }

  let translation =
    field "name" string
    >>= fun name ->
    field_opt "alternative_names" (list alternative_name)
    >>= fun alternative_names ->
    field "progress" string
    >>= fun progress ->
    field "incubation_time" string
    >>= fun incubation_time ->
    field "damage" varying_parameter
    >>= fun damage ->
    field "duration" varying_parameter
    >>= fun duration ->
    field_opt "special" string
    >>= fun special ->
    field "treatment" string
    >>= fun treatment ->
    field "cure" string
    >>= fun cure ->
    field_opt "errata" Erratum.Decode.list
    >>= fun errata ->
    succeed
      {
        name;
        alternative_names;
        progress;
        incubation_time;
        damage;
        duration;
        special;
        treatment;
        cure;
        errata;
      }

  let resistance =
    string
    >>= function
    | "Spirit" -> succeed Spirit
    | "Toughness" -> succeed Toughness
    | "LowerOfSpiritAndToughness" -> succeed LowerOfSpiritAndToughness
    | _ -> fail "Expected a resistance"

  type multilingual = {
    id : Id.Disease.t;
    level : int;
    resistance : resistance;
    cause : Cause.t list;
    src : PublicationRef.list;
    translations : translation TranslationMap.t;
  }

  let multilingual locale_order =
    field "id" Id.Disease.Decode.t
    >>= fun id ->
    field "level" int
    >>= fun level ->
    field "resistance" resistance
    >>= fun resistance ->
    field "cause" (list (Cause.Decode.make locale_order))
    >|= Option.catOptions
    >>= fun cause ->
    field "src" (PublicationRef.Decode.make_list locale_order)
    >>= fun src ->
    field "translations" (TranslationMap.Decode.t translation)
    >>= fun translations ->
    succeed { id; level; resistance; cause; src; translations }

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
        alternative_names =
          translation.alternative_names |> Option.value ~default:[];
        level = multilingual.level;
        progress = translation.progress;
        resistance = multilingual.resistance;
        incubation_time = translation.incubation_time;
        damage = translation.damage;
        duration = translation.duration;
        cause = multilingual.cause;
        special = translation.special;
        treatment = translation.treatment;
        cure = translation.cure;
        src = multilingual.src;
        errata = translation.errata |> Option.value ~default:[];
      } )
end
