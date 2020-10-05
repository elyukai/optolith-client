# Decode

Here you'll find some useful information about the design of the YAML decoder.

## Steps

All *static types* (i.e. all types defined in YAMLs) share a common structure concerning their decode process.

### 1. Decode a multilingual entry

Since language-specific values are always defined in dictionaries, we always split the language-specific and the language-independent parts.

The language-specific part of a type is always defined in a separate module `Translation` as record `t`. The `Translation` module is used for the functor `TranslationMap.Make`, which creates functions to decode the dictionaries and to resolve them later (see next step).

The language-independent part of a type is defined as record `multilingual` and always has the property `translations`, which is the `TranslationMap` type created by the `TranslationMap.Make` functor.

Now we can decode all language-independent values and the `TranslationMap`. Using the `decode` function on the `TranslationMap`, it is not completely decoded, but instead only which languages are available, which is important because we need to check whether this entry is available in one of the selected languages.

The corresponding function is called `decodeMultilingual`.

### 2. Resolve translation maps with language settings

In the second steps, the translations maps are reduced to one language to form the main type together with the language-independent values.

By making use of the `getFromLanguageOrder` function on the translation map, we can get the values in the most preferred language and decode them at once. Since it returns an `Option`, we can safely continue only if a matching language has been found. Then we can build the main record based on the decoded language-specific part and the language-independent part.

The corresponding function is called `resolveTranslations`.

Together, `decodeMultilingual` and `resolveTranslations` form the `decode` function for the main type.

## Code structure

Due to the similar behavior, the code outline is also shared between decodable types.

```re
type t = {
  // ...
};

module Translation = {
  type t = {
    // ...
  };

  type decode = Json.Decode.{
    // ...
  }
}

module TranslationMap = TranslationMap.Make(Translation);

type multilingual = {
  // ...
  translations: TranslationMap.t,
}

let decodeMultilingual = json =>
  Json.Decode.{
    // ...
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Infix.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (translation => {
      // ...
    })
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
```

## Main types

In order to be used easier, the `resolveTranslations` for main types should return a pair of the entry's id as well as the entry itself, since then it is easier to build a map of them. Some nested types use that, too. In those cases, the main `decode` function is usually called `decodeAssoc`.

## Nested types

Some types have nested types that have own translations (like professions and their variants). In those cases, you basically take the same steps mentioned above, although you can skip creating a main `decode` function since that can't be used.

Instead, the main type's `multilingual` type includes the nested type's `multilingual` and `decodeMultilingual` uses the nested type's `decodeMultilingual` function.

In step 2, it is basically the same: `resolveTranslations` of the nested type is called in `resolveTranslations` of the main type.

## Visibility conventions

For main types, only the main type itself and it's `decode` function should be exposed. For nested types in the same module (as submodules), you can hide all decode types and functions. For nested types in a different module, you'll need to expose `decodeMultilingual`, `resolveTranslations` and thus the `multilingual` type, which should *always* be abstract, since it otherwise impairs the type inference.

## Naming conventions
