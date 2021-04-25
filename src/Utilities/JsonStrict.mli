(** Strict extensions for [!Json.Decode]

    This module includes all contents of [!Json.Decode] as well. *)

val optionalField : Js.Dict.key -> (Js.Json.t -> 'a) -> Js.Json.t -> 'a option
(** [optionalField key decoder json] decodes a JSON object with a specific
    optional field into the value of that field.

    Returns an ['a option] if the JSON value is a JSON object and if a value is
    present, it must be successfully decoded with the given decoder. If the
    value is not present, [None] is returned.

    @raise [DecodeError] if not an object or unsuccessful *)
