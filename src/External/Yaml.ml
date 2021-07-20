type options = { mapAsMap : bool; prettyErrors : bool } [@@bs.deriving abstract]

external parse : string -> Js.Json.t = "parse"
  [@@bs.module "yaml"]
(** [parse str]. [str] should be a string with YAML formatting.

    The returned value will match the type of the root value of the parsed YAML
    document, so Maps become objects, Sequences arrays, and scalars result in
    nulls, booleans, numbers and strings.

    [parse] may throw on error, and it may log warnings using [Js.Console.warn].
    It only supports input consisting of a single YAML document; for
    multi-document support you should use [parseAllDocuments]. *)

external parse' : string -> options -> Js.Json.t = "parse"
  [@@bs.module "yaml"]
(** [parse str options]. [str] should be a string with YAML formatting.

    The returned value will match the type of the root value of the parsed YAML
    document, so Maps become objects, Sequences arrays, and scalars result in
    nulls, booleans, numbers and strings.

    [parse] may throw on error, and it may log warnings using [Js.Console.warn].
    It only supports input consisting of a single YAML document; for
    multi-document support you should use [parseAllDocuments]. *)

external stringify : Js.Json.t -> string = "stringify"
  [@@bs.module "yaml"]
(** [stringify value]. [value] can be of any type. The returned string will
    always include [\n] as the last character, as is expected of YAML documents.

    As strings in particular may be represented in a number of different styles,
    the simplest option for the value in question will always be chosen,
    depending mostly on the presence of escaped or control characters and
    leading & trailing whitespace.

    To create a stream of documents, you may call [stringify] separately for
    each document's [value], and concatenate the documents with the string
    [...\n] as a separator. *)

external stringify' : Js.Json.t -> options -> string = "stringify"
  [@@bs.module "yaml"]
(** [stringify value options]. [value] can be of any type. The returned string
    will always include [\n] as the last character, as is expected of YAML
    documents.

    As strings in particular may be represented in a number of different styles,
    the simplest option for the value in question will always be chosen,
    depending mostly on the presence of escaped or control characters and
    leading & trailing whitespace.

    To create a stream of documents, you may call [stringify] separately for
    each document's [value], and concatenate the documents with the string
    [...\n] as a separator. *)
