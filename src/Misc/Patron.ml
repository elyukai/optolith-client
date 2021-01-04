module Category = struct
  type t = { id : int; name : string; primaryPatronCultures : Ley_IntSet.t }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = { name : string }

      let t json = Json_Decode_Strict.{ name = json |> field "name" string }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      primaryPatronCultures : int list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          primaryPatronCultures =
            json |> field "primaryPatronCultures" (list int);
          translations = json |> field "translations" decodeTranslations;
        }

    let make _ (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          primaryPatronCultures =
            multilingual.primaryPatronCultures |> Ley_IntSet.fromList;
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end

type t = {
  id : int;
  name : string;
  category : int;
  skills : int * int * int;
  limitedToCultures : Ley_IntSet.t;
  isLimitedToCulturesReverse : bool;
}

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = { name : string }

    let t json = Json_Decode_Strict.{ name = json |> field "name" string }

    let pred _ = true
  end

  type multilingual = {
    id : int;
    category : int;
    skills : int * int * int;
    limitedToCultures : int list;
    isLimitedToCulturesReverse : bool;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json_Decode_Strict.
      {
        id = json |> field "id" int;
        category = json |> field "category" int;
        skills = json |> field "skills" (tuple3 int int int);
        limitedToCultures = json |> field "limitedToCultures" (list int);
        isLimitedToCulturesReverse =
          json |> field "isLimitedToCulturesReverse" bool;
        translations = json |> field "translations" decodeTranslations;
      }

  let make _ (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        category = multilingual.category;
        skills = multilingual.skills;
        limitedToCultures =
          multilingual.limitedToCultures |> Ley_IntSet.fromList;
        isLimitedToCulturesReverse = multilingual.isLimitedToCulturesReverse;
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
