module Dynamic = struct
  type state =
    | Inactive
    | Basic of { value : int; base : int }
    | Energy of {
        value : int;
        base : int;
        modifier : int;
        currentAdded : int;
        maxAddable : int;
        permanentLost : int;
      }
    | EnergyWithBoughtBack of {
        value : int;
        base : int;
        modifier : int;
        currentAdded : int;
        maxAddable : int;
        permanentLost : int;
        permanentBoughtBack : int;
      }

  type t = { id : int; calc : string; state : state }
end

module Static = struct
  type t = {
    id : int;
    name : string;
    nameAbbr : string;
    calc : string;
    calcHalfPrimary : string option;
    calcNoPrimary : string option;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        nameAbbr : string;
        calc : string;
        calcHalfPrimary : string option;
        calcNoPrimary : string option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            nameAbbr = json |> field "nameAbbr" string;
            calc = json |> field "calc" string;
            calcHalfPrimary = json |> optionalField "calcHalfPrimary" string;
            calcNoPrimary = json |> optionalField "calcNoPrimary" string;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          translations = json |> field "translations" decodeTranslations;
        }

    let make _ (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          nameAbbr = translation.nameAbbr;
          calc = translation.calc;
          calcHalfPrimary = translation.calcHalfPrimary;
          calcNoPrimary = translation.calcNoPrimary;
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end
