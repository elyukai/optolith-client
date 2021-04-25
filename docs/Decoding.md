# Decoding

Here you'll find some useful information about the design of the YAML decoders.

## Overview

Decoding the database is splitted into parsing the YAML files and decoding the result. Parsing is done by the `Yaml_Parse` module and the `Yaml_Decode` module controls the decoding of the various entry types. The `Yaml` module then combines all functions into a single exported function.

## Decode Entry Types

### Decoder structure

All decodable main types share a common decoder layout. All values only relevant while decoding are inside a `Decode` module at the same level as the type it is the decoder for.

```ml
(** Since this is the actual type, it's not really part of the decoding pipeline
    but I'll keep it here to make the definitions complete. *)
type t = {
  (* ... *)
}

module Decode = struct
  open Json.Decode
  open JsonStrict

  type translation = { (* ... language-specific properties *) }

  let translation json =
    {
      (* ... decode language-specific properties *)
    }

  type multilingual = {
    (* ... language-independent properties *)
    translations : translation TranslationMap.t;
  }

  let multilingual json =
    {
      (* ... decode language-independent properties *)
      translations =
        json |> field "translations" (TranslationMap.Decode.t translation);
    }

  let make_assoc locale_order json =
    let open Option.Infix in
    json |> multilingual |> fun multilingual ->
    multilingual.translations |> TranslationMap.preferred locale_order
    <&> fun (translation : translation) ->
    ( multilingual.id,
      {
        (* ... merge language-independent and language-specific properties *)
      } )
end
```

#### Decoding types

Since language-specific values in the YAML files are always defined in dictionaries where the keys map to the locale identifiers, we always split the language-specific and the language-independent parts.

The language-specific part of a type is always defined as type `translation`. The corresponding `translation` decoder function is later used to decode the translation dictionary, also called *translation map*.

The language-independent part of a type is defined as type `multilingual` and usually has the property `translations`, which is the dictionary of all translations. The corresponding `multilingual` decoder function uses the `translation` decoder together with the translation map decoder from the `TranslationMap` module to fully decode the dictionary of translations.

Using a list of preferred locales, sorted by preference, (`Locale.Order.t`) we can retrieve the most preferred translation using `TranslationMap.preferred` and then combine the translation values and the multilingual values to form the final record type. Following OCaml conventions, this function is called `make`.

Often, in order to be used more easily, the `make` function returns a pair of the respective entry's identifier and the entry itself to create a `Map` more easily. To hint at this specific use, the function is then called `make_assoc`. If a nested type is only decoded in a context of collection type (like a list), this decoder can be provided using a `make` variant as well (in this case, `make_list`).

If other decodable types are nested withing a type, the `multilingual` function usually takes the list of preferred locales as well to be able to pass it down to the nested types' decoders.

### `Decode` module visibility conventions

Only the `make` function or its variant should be exposed.

### Naming conventions

- The language-specific tyüe is always named `translation`.
- The record containing all language-independent values as well as the translation map is called `multilingual` and the translation map is at the property `translations` (just like in the source).
- A decoder for a specific type has the same name as the type.
- The function resolving the translation map and returning the actual main type is called `make`.
- A potential helper function that decodes the type as part of a collection is called `make_c`, where `c` is the name of the collection, e.g. `make_list`.
