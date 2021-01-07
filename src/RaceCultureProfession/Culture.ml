module IM = Ley_IntMap

module Static = struct
  type frequency_exception = Single of int | Group of int

  type t = {
    id : int;
    name : string;
    language : int list;
    script : int list option;
    area_knowledge : string;
    area_knowledge_short : string;
    social_status : int list;
    common_mundane_professions_all : bool;
    common_mundane_professions_exceptions : frequency_exception list option;
    common_mundane_professions_text : string option;
    common_magic_professions_all : bool;
    common_magic_professions_exceptions : frequency_exception list option;
    common_magic_professions_text : string option;
    common_blessed_professions_all : bool;
    common_blessed_professions_exceptions : frequency_exception list option;
    common_blessed_professions_text : string option;
    common_advantages : int list;
    common_advantages_text : string option;
    common_disadvantages : int list;
    common_disadvantages_text : string option;
    uncommon_advantages : int list;
    uncommon_advantages_text : string option;
    uncommon_disadvantages : int list;
    uncommon_disadvantages_text : string option;
    common_skills : int list;
    uncommon_skills : int list;
    common_names : string;
    cultural_package_skills : int IM.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        area_knowledge : string;
        area_knowledge_short : string;
        common_mundane_professions : string option;
        common_magical_professions : string option;
        common_blessed_professions : string option;
        common_advantages : string option;
        common_disadvantages : string option;
        uncommon_advantages : string option;
        uncommon_disadvantages : string option;
        common_names : string;
        errata : Erratum.list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            area_knowledge = json |> field "areaKnowledge" string;
            area_knowledge_short = json |> field "areaKnowledgeShort" string;
            common_mundane_professions =
              json |> optionalField "commonMundaneProfessions" string;
            common_magical_professions =
              json |> optionalField "commonMagicalProfessions" string;
            common_blessed_professions =
              json |> optionalField "commonBlessedProfessions" string;
            common_advantages = json |> optionalField "commonAdvantages" string;
            common_disadvantages =
              json |> optionalField "commonDisadvantages" string;
            uncommon_advantages =
              json |> optionalField "uncommonAdvantages" string;
            uncommon_disadvantages =
              json |> optionalField "uncommonDisadvantages" string;
            common_names = json |> field "commonNames" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      languages : int list;
      literacy : int list option;
      social : int list;
      common_mundane_professions_all : bool;
      common_mundane_professions_exceptions : frequency_exception list option;
      common_magical_professions_all : bool;
      common_magical_professions_exceptions : frequency_exception list option;
      common_blessed_professions_all : bool;
      common_blessed_professions_exceptions : frequency_exception list option;
      common_advantages : int list option;
      common_disadvantages : int list option;
      uncommon_advantages : int list option;
      uncommon_disadvantages : int list option;
      common_skills : int list;
      uncommon_skills : int list option;
      cultural_package_skills : (int * int) list;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let frequency_exception =
      Json_Decode_Strict.(
        field "type" string
        |> andThen (function
             | "Single" -> field "value" int |> map (fun x -> Single x)
             | "Group" -> field "value" int |> map (fun x -> Group x)
             | str ->
                 raise (DecodeError ("Unknown frequency exception: " ^ str))))

    let multilingual decode_translations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          languages = json |> field "languages" (list int);
          literacy = json |> optionalField "literacy" (list int);
          social = json |> field "social" (list int);
          common_mundane_professions_all =
            json |> field "commonMundaneProfessionsAll" bool;
          common_mundane_professions_exceptions =
            json
            |> optionalField "commonMundaneProfessionsExceptions"
                 (list frequency_exception);
          common_magical_professions_all =
            json |> field "commonMagicalProfessionsAll" bool;
          common_magical_professions_exceptions =
            json
            |> optionalField "commonMagicalProfessionsExceptions"
                 (list frequency_exception);
          common_blessed_professions_all =
            json |> field "commonBlessedProfessionsAll" bool;
          common_blessed_professions_exceptions =
            json
            |> optionalField "commonBlessedProfessionsExceptions"
                 (list frequency_exception);
          common_advantages =
            json |> optionalField "commonAdvantages" (list int);
          common_disadvantages =
            json |> optionalField "commonDisadvantages" (list int);
          uncommon_advantages =
            json |> optionalField "uncommonAdvantages" (list int);
          uncommon_disadvantages =
            json |> optionalField "uncommonDisadvantages" (list int);
          common_skills = json |> field "commonSkills" (list int);
          uncommon_skills = json |> optionalField "uncommonSkills" (list int);
          cultural_package_skills =
            json
            |> field "culturalPackageSkills"
                 (list (fun json ->
                      (json |> field "id" int, json |> field "value" int)));
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decode_translations;
        }

    let make langs (x : multilingual) (translation : Translation.t) =
      Some
        {
          id = x.id;
          name = translation.name;
          language = x.languages;
          script = x.literacy;
          area_knowledge = translation.area_knowledge;
          area_knowledge_short = translation.area_knowledge_short;
          social_status = x.social;
          common_mundane_professions_all = x.common_mundane_professions_all;
          common_mundane_professions_exceptions =
            x.common_mundane_professions_exceptions;
          common_mundane_professions_text =
            translation.common_mundane_professions;
          common_magic_professions_all = x.common_magical_professions_all;
          common_magic_professions_exceptions =
            x.common_magical_professions_exceptions;
          common_magic_professions_text = translation.common_magical_professions;
          common_blessed_professions_all = x.common_blessed_professions_all;
          common_blessed_professions_exceptions =
            x.common_blessed_professions_exceptions;
          common_blessed_professions_text =
            translation.common_blessed_professions;
          common_advantages = x.common_advantages |> Ley_Option.fromOption [];
          common_advantages_text = translation.common_advantages;
          common_disadvantages =
            x.common_disadvantages |> Ley_Option.fromOption [];
          common_disadvantages_text = translation.common_disadvantages;
          uncommon_advantages =
            x.uncommon_advantages |> Ley_Option.fromOption [];
          uncommon_advantages_text = translation.uncommon_advantages;
          uncommon_disadvantages =
            x.uncommon_disadvantages |> Ley_Option.fromOption [];
          uncommon_disadvantages_text = translation.uncommon_disadvantages;
          common_skills = x.common_skills;
          uncommon_skills = x.uncommon_skills |> Ley_Option.fromOption [];
          common_names = translation.common_names;
          cultural_package_skills =
            x.cultural_package_skills |> Ley_IntMap.fromList;
          src = PublicationRef.Decode.resolveTranslationsList langs x.src;
          errata = translation.errata |> Ley_Option.fromOption [];
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end

module Dynamic = struct
  type t = { id : int; static : Static.t option }
end
