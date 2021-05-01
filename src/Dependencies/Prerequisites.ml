module Sex = struct
  type t = Sex.prerequisite

  module Decode = struct
    let t = Sex.Decode.prerequisite
  end
end

module Race = struct
  type t = { id : int NonEmptyList.t; active : bool }

  module Decode = struct
    open Json.Decode

    let t =
      oneOf
        [
          (fun json ->
            { id = json |> NonEmptyList.Decode.one_or_many int; active = true });
          (fun json ->
            {
              id = json |> field "races" (NonEmptyList.Decode.one_or_many int);
              active = json |> field "active" bool;
            });
        ]
  end
end

module Culture = struct
  type t = int NonEmptyList.t

  module Decode = struct
    open Json.Decode

    let t = NonEmptyList.Decode.one_or_many int
  end
end

module PrimaryAttribute = struct
  type t = Magical of int | Blessed of int

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "Blessed" -> field "value" int |> map (fun value -> Blessed value)
           | "Magical" -> field "value" int |> map (fun value -> Magical value)
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"PrimaryAtribute"
                 ~invalid:str)
  end
end

module Pact = struct
  type t = {
    category : int;
    domain : int NonEmptyList.t option;
    level : int option;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    let t json =
      {
        category = json |> field "category" int;
        domain =
          json |> optionalField "domain" (NonEmptyList.Decode.one_or_many int);
        level = json |> optionalField "level" int;
      }
  end
end

module SocialStatus = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module State = struct
  type t = int NonEmptyList.t

  module Decode = struct
    open Json.Decode

    let t = NonEmptyList.Decode.one_or_many int
  end
end

module Rule = struct
  type t = IdGroup.ExtensionRule.t

  module Decode = struct
    let t = IdGroup.ExtensionRule.Decode.t
  end
end

module Publication = struct
  type t = int

  module Decode = struct
    let t = Json.Decode.int
  end
end

module Activatable = struct
  module AnyOf = struct
    module Select = struct
      type t = {
        id : IdGroup.Activatable.t;
        active : bool;
        firstOption : IdGroup.SelectOption.t NonEmptyList.t;
        otherOptions : IdGroup.SelectOption.t list;
        level : int option;
      }

      module Decode = struct
        open Json.Decode
        open JsonStrict

        let t json =
          {
            id = json |> field "id" IdGroup.Activatable.Decode.t;
            active = json |> field "active" bool;
            firstOption =
              json
              |> field "firstOption"
                   (NonEmptyList.Decode.t IdGroup.SelectOption.Decode.t);
            otherOptions =
              json
              |> optionalField "otherOptions"
                   (list IdGroup.SelectOption.Decode.t)
              |> Option.fromOption [];
            level = json |> optionalField "level" int;
          }
      end
    end

    type t = {
      id : IdGroup.Activatable.Many.t;
      active : bool;
      options : IdGroup.SelectOption.t list;
      level : int option;
    }

    module Decode = struct
      open Json.Decode
      open JsonStrict

      let t json =
        {
          id = json |> field "id" IdGroup.Activatable.Many.Decode.t;
          active = json |> field "active" bool;
          options =
            json
            |> optionalField "options" (list IdGroup.SelectOption.Decode.t)
            |> Option.fromOption [];
          level = json |> optionalField "level" int;
        }
    end
  end

  type t = {
    id : IdGroup.Activatable.t;
    active : bool;
    options : IdGroup.SelectOption.t list;
    level : int option;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    let t json =
      {
        id = json |> field "id" IdGroup.Activatable.Decode.t;
        active = json |> field "active" bool;
        options =
          json
          |> optionalField "options" (list IdGroup.SelectOption.Decode.t)
          |> Option.fromOption [];
        level = json |> optionalField "level" int;
      }
  end
end

module Rated = struct
  module AnyOf = struct
    type t = { id : IdGroup.Rated.Many.t; value : int }

    module Decode = struct
      let t json =
        Json.Decode.
          {
            id = json |> field "id" IdGroup.Rated.Many.Decode.t;
            value = json |> field "value" int;
          }
    end
  end

  type t = { id : IdGroup.Rated.t; value : int }

  module Decode = struct
    let t json =
      Json.Decode.
        {
          id = json |> field "id" IdGroup.Rated.Decode.t;
          value = json |> field "value" int;
        }
  end
end

module DisplayOption = struct
  type t = Generate | Hide | ReplaceWith of string

  module Decode = struct
    open Json.Decode

    type translation = string

    let translation = string

    type multilingual =
      | MultilingualGenerate
      | MultilingualHide
      | MultilingualReplaceWith of translation TranslationMap.t

    let multilingual =
      field "type" string
      |> andThen (function
           | "Hide" -> fun _ -> MultilingualHide
           | "ReplaceWith" ->
               field "value" (TranslationMap.Decode.t translation)
               |> map (fun mp -> MultilingualReplaceWith mp)
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"DisplayOption"
                 ~invalid:str)

    let make locale_order json =
      json |> multilingual |> fun multilingual ->
      match multilingual with
      | MultilingualGenerate -> Generate
      | MultilingualHide -> Hide
      | MultilingualReplaceWith mp ->
          mp
          |> TranslationMap.preferred locale_order
          |> Option.fromOption Chars.mdash
          |> fun str -> ReplaceWith str
  end
end

module When = struct
  type t = Publication of Publication.t

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "Publication" ->
               field "value" Publication.Decode.t
               |> map (fun x -> Publication x)
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"When"
                 ~invalid:str)
  end
end

module Config = struct
  type 'a t = {
    value : 'a;
    displayOption : DisplayOption.t;
    when_ : When.t list;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type 'a multilingual = {
      value : 'a;
      displayOption : DisplayOption.t option;
      when_ : When.t NonEmptyList.t option;
    }

    let multilingual locale_order decoder (wrap : 'a -> 'b) json =
      ( {
          value = json |> field "value" decoder |> wrap;
          displayOption =
            json
            |> optionalField "displayOption"
                 (DisplayOption.Decode.make locale_order);
          when_ =
            json |> optionalField "when" (NonEmptyList.Decode.t When.Decode.t);
        }
        : 'a multilingual )

    let make locale_order decoder (wrap : 'a -> 'b) json =
      json |> multilingual locale_order decoder wrap |> fun multilingual ->
      ( {
          value = multilingual.value;
          displayOption =
            multilingual.displayOption
            |> Option.fromOption DisplayOption.Generate;
          when_ = multilingual.when_ |> Option.option [] NonEmptyList.to_list;
        }
        : 'a t )
  end
end
