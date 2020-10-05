# Decoding

Here you'll find some useful information about the design of the YAML decoders.

## Overview

Decoding the database is splitted into parsing the YAML files and decoding the result. Parsing is done by the `Yaml_Parse` module and the `Yaml_Decode` module controls the decoding of the various entry types. The `Yaml` module then combines all functions into a single exported function.

## Decode Entry Types

### Basic decoder structure

All decodable types share a common decoder layout. All values only relevant while decoding are inside a `Decode` module at the same level as the type it is the decoder for.

```re
// Since this is the actual type, it's not really part of the decoding pipeline
// but I'll keep it here to make the definitions complete.
type t = {
  // ...
};

module Decode = {
  module Translation = {
    type t = {
      // ... (language-specific properties)
    };

    let t = Json.Decode.{
      // ... (decode language-specific properties)
    };
  }

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    // ... (language-independent properties)
    translations: TranslationMap.t,
  }

  let multilingual = json =>
    Json.Decode.{
      // ... (decode language-independent properties)
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> (translation => {
        // ... (merge language-independent and language-specific properties)
      })
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);
};
```

### The two steps of decoding

All *static types* (i.e., all data defined in YAML files) share a common structure concerning their decode process.

#### 1. Decode a multilingual entry

Since language-specific values in the YAML files are always defined in dictionaries, we always split the language-specific and the language-independent parts.

The language-specific part of a type is always defined in a separate module `Translation` as record `t`. The `Translation` module is used for the functor `TranslationMap.Make`, which creates functions to decode the dictionaries and to resolve them later (see next step).

The language-independent part of a type is defined as record `multilingual` and always has the property `translations`, which is the `TranslationMap` type created by the `TranslationMap.Make` functor.

Now we can decode all language-independent values and the `TranslationMap`. Using the `Decode.t` function on the `TranslationMap`, it is not completely decoded, but instead only which languages are available, which is important because we need to check whether this entry is available in one of the selected languages. This then almost mirrors the structure of the data in the YAML files.

The corresponding function is called `multilingual`.

#### 2. Resolve translation maps with language settings

In the second steps, the translations maps are reduced to one language to form the main type together with the language-independent values.

By making use of the `Decode.getFromLanguageOrder` function on the translation map, we can get the values in the most preferred language and decode them at once. Since it returns an `Option`, we can safely continue only if a matching language has been found. Then we can build the main record based on the decoded language-specific part and the language-independent part.

The corresponding function is called `resolveTranslations`.

Together, `multilingual` and `resolveTranslations` form the `t` decoder function for the main type.

### Main types

In order to be used easier, an `assoc` auxiliary decoder function should be created to return a pair of the entry's id as well as the entry itself, since then it is easier to build a map of them. Some nested types use that, too.

### Nested types

Some types have nested types that have own translations (like professions and their variants). In those cases, you basically take the same steps mentioned above, although you can skip creating a main `t` decoder since that can't be used.

Instead, the main type's `multilingual` type references the nested type's `multilingual` and the `multilingual` decoder uses the nested type's `multilingual` decoder.

In step 2, it is basically the same: `resolveTranslations` of the nested type is called in `resolveTranslations` of the main type.

### Visibility conventions

For main types, only the main type itself and it's `t` (or `assoc`) function should be exposed. For nested types in the same module (as submodules), you can hide all decode types and functions. For nested types in a different module, you'll need to expose the `multilingual` and `resolveTranslations` functions and thus the `multilingual` type, which should always be abstract, since it should never be changed outside of the module.

As a rule of thumb: Just export what is *really* needed and also always check if a decode type can be made abstract.

### Naming conventions

- The language-specific module is always named `Translation` and contains a type `t` with a corresponding decoder `t` (the latter two are a requirement for the `TranslationMap.Make` functor anyway).
- The built translation map module is called `TranslationMap`.
- The record containing all language-independent values as well as the translation map is called `multilingual` and the translation map is at the property `translations` (just like in the source).
- A decoder for a specific type has the same name as the type.
- The function resolving the translation map and returning the actual main type is called `resolveTranslations`.
- The function combining `multilingual` and `resolveTranslations` is called `t`, since it decodes the type `t`.

You can, of course, always create additional helper functions for `multilingual`, `resolveTranslations` and `decode` if your type is usually in a container, then you need to provide a proper suffix for the function as well, so you basically get, for example, `multilingual` and `multilingualList` (if your type is in a list). Exception: If your type is `t`, just use the suffix instead, for example, `t` and `assoc` (if your type is used in a map) then.
