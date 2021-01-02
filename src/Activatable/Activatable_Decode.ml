module Id = struct
  type t = int

  module Decode = struct
    type t = int

    let t = Json.Decode.int
  end
end

module Name = struct
  type t = string

  module Decode = struct
    type t = string

    let t = Json.Decode.string
  end
end

module NameInLibrary = struct
  type t = string

  module Decode = struct
    type t = string

    let t = Json.Decode.string
  end
end

module Levels = struct
  type t = int

  module Decode = struct
    type t = int

    let t = Json.Decode.int
  end
end

module Maximum = struct
  type t = int

  module Decode = struct
    type t = int

    let t = Json.Decode.int
  end
end

module SelectOptions = struct
  module Decode = struct
    type derivedSelectOptionPrerequisite = {
      target : Id.Activatable.t;
      active : bool;
      level : int option;
    }

    type derivedIncreasablePrerequisite =
      | Self of int
      | SelectOption of derivedSelectOptionPrerequisite

    type derivedIncreasableApValue =
      | DerivedFromIc of int
      | Fixed of { list : int Ley_IntMap.t; default : int }

    type specific = Include of int list | Exclude of int list

    type derived =
      | Blessings of { specific : int list option }
      | Cantrips of { specific : int list option }
      | TradeSecrets of { specific : int list option }
      | Scripts of { specific : int list option }
      | AnimalShapes of { specific : int list option }
      | SpellEnhancements of { specific : int list option }
      | LiturgicalChantEnhancements of { specific : int list option }
      | ArcaneBardTraditions of { specific : int list option }
      | ArcaneDancerTraditions of { specific : int list option }
      | Elements of { specific : int list option }
      | Properties of { requireKnowledge : bool option }
      | Aspects of {
          requireKnowledge : bool option;
          useMasterOfSuffixAsName : bool option;
        }
      | Diseases of { useHalfLevelAsApValue : bool option }
      | Poisons of { useHalfLevelAsApValue : bool option }
      | Languages of {
          prerequisites : derivedSelectOptionPrerequisite list option;
        }
      | MeleeCombatTechniques of {
          groups : int list option;
          specific : specific option;
          prerequisites : derivedIncreasablePrerequisite list option;
          apValue : derivedIncreasableApValue option;
        }
      | RangedCombatTechniques of {
          groups : int list option;
          specific : specific option;
          prerequisites : derivedIncreasablePrerequisite list option;
          apValue : derivedIncreasableApValue option;
        }
      | LiturgicalChants of {
          groups : int list option;
          specific : specific option;
          prerequisites : derivedIncreasablePrerequisite list option;
          apValue : derivedIncreasableApValue option;
        }
      | Ceremonies of {
          groups : int list option;
          specific : specific option;
          prerequisites : derivedIncreasablePrerequisite list option;
          apValue : derivedIncreasableApValue option;
        }
      | Skills of {
          groups : int list option;
          specific : specific option;
          prerequisites : derivedIncreasablePrerequisite list option;
          apValue : derivedIncreasableApValue option;
        }
      | Spells of {
          groups : int list option;
          specific : specific option;
          prerequisites : derivedIncreasablePrerequisite list option;
          apValue : derivedIncreasableApValue option;
        }
      | Rituals of {
          groups : int list option;
          specific : specific option;
          prerequisites : derivedIncreasablePrerequisite list option;
          apValue : derivedIncreasableApValue option;
        }

    type explicit =
      | Preset of {
          id : Id.Activatable.SelectOption.t;
          prerequisites : Prerequisite.Collection.General.t option;
          apValue : int option;
          src : PublicationRef.t list option;
        }
      | Custom of {
          id : int;
          prerequisites : Prerequisite.Collection.General.t option;
          apValue : int option;
          src : PublicationRef.t list option;
        }

    type t = Derived of derived list | Explicit of SelectOption.t list
  end
end

(* "SelectOptions": {
         "oneOf": [
           {
             "type": "object",
             "properties": {
               "type": { "const": "Explicit" },
               "value": {
                 "description": "A list of explicit select options. If the id has a specific type, it's entry is the base of this select option, where values defined here override values from the base. Define the \"src\" property if the options are not derived from the rules text of the advantage/disadvantage/special ability but instead are listed in a separate block and/or on a separate page.",
                 "type": "array",
                 "items": {
                   "oneOf": [
                     {
                       "type": "object",
                       "properties": {
                         "id": {
                           "description": "An increasing integer or an entry id.",
                           "type": "integer",
                           "minimum": 1
                         },
                         "prerequisites": {
                           "$ref": "_Prerequisites.schema.json#/definitions/GeneralListOrByLevel"
                         },
                         "apValue": {
                           "description": "Specific AP cost for the select option.",
                           "type": "integer",
                           "minimum": 1
                         },
                         "src": { "$ref": "_SourceRefs.schema.json" },
                         "translations": {
                           "type": "object",
                           "description": "All translations for the entry, identified by IETF language tag (BCP47).",
                           "patternProperties": {
                             "^[a-z]{2}-[A-Z]{2}$": {
                               "type": "object",
                               "properties": {
                                 "name": {
                                   "description": "The name of the select option.",
                                   "type": "string",
                                   "minLength": 1
                                 },
                                 "description": {
                                   "description": "The description of the select option. Useful for Bad Habits, Trade Secrets and other entries where a description is available. Markdown is available.",
                                   "type": "string",
                                   "minLength": 1
                                 },
                                 "errata": { "$ref": "_Errata.schema.json" }
                               },
                               "required": ["name"],
                               "additionalProperties": false
                             }
                           },
                           "minProperties": 1,
                           "additionalProperties": false
                         }
                       },
                       "required": ["id", "translations"],
                       "additionalProperties": false
                     },
                     {
                       "type": "object",
                       "properties": {
                         "id": {
                           "description": "An increasing integer or an entry id.",
                           "type": "object",
                           "properties": {
                             "type": {
                               "enum": [
                                 "Skill",
                                 "MeleeCombatTechnique",
                                 "RangedCombatTechnique"
                               ]
                             },
                             "value": { "type": "integer", "minimum": 1 }
                           },
                           "required": ["type", "value"],
                           "additionalProperties": false
                         },
                         "prerequisites": {
                           "$ref": "_Prerequisites.schema.json#/definitions/GeneralListOrByLevel"
                         },
                         "apValue": {
                           "description": "Specific AP cost for the select option.",
                           "type": "integer",
                           "minimum": 1
                         },
                         "src": { "$ref": "_SourceRefs.schema.json" },
                         "translations": {
                           "type": "object",
                           "description": "All translations for the entry, identified by IETF language tag (BCP47).",
                           "patternProperties": {
                             "^[a-z]{2}-[A-Z]{2}$": {
                               "type": "object",
                               "properties": {
                                 "errata": { "$ref": "_Errata.schema.json" }
                               },
                               "required": [],
                               "additionalProperties": false,
                               "minProperties": 1
                             }
                           },
                           "minProperties": 1,
                           "additionalProperties": false
                         }
                       },
                       "required": ["id"],
                       "additionalProperties": false,
                       "minProperties": 2
                     }
                   ]
                 },
                 "minItems": 1,
                 "additionalItems": false
               }
             },
             "required": ["type", "value"],
             "additionalProperties": false
           }
         ]
       },
       "Options": {
         "$comment": "Unfinished generalized options handling.",
         "type": "array",
         "minItems": 1,
         "items": {
           "oneOf": [
             {
               "type": "object",
               "properties": {
                 "type": { "const": "List" },
                 "value": {
                   "type": "object",
                   "properties": {
                     "list": {
                       "oneOf": [
                         {
                           "type": "object",
                           "properties": {
                             "type": { "const": "Generate" },
                             "value": { "$ref": "#/definitions/SelectOptionCategories" }
                           },
                           "required": ["type", "value"],
                           "additionalProperties": false
                         },
                         {
                           "type": "object",
                           "properties": {
                             "type": { "const": "Explicit" },
                             "value": { "$ref": "#/definitions/SelectOptions" }
                           },
                           "required": ["type", "value"],
                           "additionalProperties": false
                         }
                       ]
                     },
                     "multiple": {
                       "description": "Sometimes, multiple options from a single list have to or can be chosen. Its possible to define a number of options that have to be selected or a range of numbers of options that can be selected.",
                       "oneOf": [
                         {
                           "type": "object",
                           "properties": {
                             "type": { "const": "Fixed" },
                             "value": {
                               "description": "The number of options that have to be selected.",
                               "type": "integer",
                               "minimum": 2
                             }
                           },
                           "required": ["type", "value"],
                           "additionalProperties": false
                         },
                         {
                           "type": "object",
                           "properties": {
                             "type": { "const": "Range" },
                             "value": {
                               "type": "object",
                               "properties": {
                                 "min": {
                                   "description": "The minimum number of options that need to be selected. If left empty it defaults to 1.",
                                   "type": "integer",
                                   "minimum": 2
                                 },
                                 "max": {
                                   "description": "The maximum number of options that need to be selected.",
                                   "type": "integer",
                                   "minimum": 2
                                 }
                               },
                               "required": ["max"],
                               "additionalProperties": false
                             }
                           },
                           "required": ["type", "value"],
                           "additionalProperties": false
                         }
                       ]
                     }
                   },
                   "required": ["list"],
                   "additionalProperties": false
                 }
               },
               "required": ["type", "value"],
               "additionalProperties": false
             },
             {
               "type": "object",
               "properties": {
                 "type": { "const": "TextInput" },
                 "value": {
                   "type": "object",
                   "properties": {
                     "label": {
                       "type": "object",
                       "description": "All translations for the entry, identified by IETF language tag (BCP47).",
                       "patternProperties": {
                         "^[a-z]{2}-[A-Z]{2}$": {
                           "description": "The text input label.",
                           "type": "string",
                           "minLength": 1
                         }
                       },
                       "minProperties": 1,
                       "additionalProperties": false
                     }
                   },
                   "required": ["label"],
                   "additionalProperties": false
                 }
               },
               "required": ["type", "value"],
               "additionalProperties": false
             }
           ]
         }
       },
       "Input": {
         "description": "A string that is used as a placeholder text for an input field.",
         "type": "string",
         "minLength": 1
       },
       "Rules": {
         "description": "The rule text. Markdown is available.",
         "type": "string",
         "minLength": 1
       },
       "Effect": {
         "description": "The effect description. Markdown is available.",
         "type": "string",
         "minLength": 1
       },
       "CombatSpecialAbilityType": {
         "description": "Type of combat special ability. The type id.",
         "enum": ["Passive", "BaseManeuver", "SpecialManeuver"]
       },
       "Penalty": {
         "description": "The penalty the special ability gives when used.",
         "type": "string",
         "minLength": 1
       },
       "AeCost": {
         "description": "The AE Cost.",
         "type": "string",
         "minLength": 1
       },
       "Volume": {
         "description": "The volume points the enchantment needs.",
         "type": "string",
         "minLength": 1
       },
       "BindingCost": {
         "description": "The binding cost for an enchantment.",
         "type": "string",
         "minLength": 1
       },
       "Property": {
         "description": "The magic property. See `Properties` to get the id. Use DependingOnProperty if there is no clear property.",
         "oneOf": [
           {
             "type": "object",
             "properties": {
               "type": { "const": "DependingOnProperty" }
             },
             "required": ["type"],
             "additionalProperties": false
           },
           {
             "type": "object",
             "properties": {
               "type": { "const": "Single" },
               "value": { "type": "integer", "minimum": 1 }
             },
             "required": ["type"],
             "additionalProperties": false
           }
         ]
       },
       "Aspect": {
         "description": "The blessed aspect. See `Liturgical Chants` for the aspects array to get the ID.",
         "type": "integer",
         "minimum": 1
       },
       "AdvancedSpecialAbility": {
         "oneOf": [
           {
             "type": "object",
             "properties": {
               "id": { "type": "integer", "minimum": 1 },
               "option": {
                 "description": "Specify, if only one specific select option or one of a set of select options is allowed for the referenced advanced special ability.",
                 "oneOf": [
                   {
                     "type": "integer",
                     "minimum": 1
                   },
                   {
                     "type": "array",
                     "items": {
                       "type": "integer",
                       "minimum": 1
                     },
                     "uniqueItems": true,
                     "minItems": 2
                   }
                 ]
               }
             },
             "required": ["id"],
             "additionalProperties": false
           },
           {
             "type": "array",
             "items": { "type": "integer", "minimum": 1 },
             "additionalItems": false
           }
         ]
       },
       "AdvancedSpecialAbilities": {
         "description": "The Advanced Special Abilities for the respective Style Special Ability. Sometimes, only a specific select option or a set of select options of an entry is allowed, which can be modelled by the option property. It can also be that you can choose from a set of special abilities, but then you cant specify an option.",
         "type": "array",
         "items": [
           { "$ref": "#/definitions/AdvancedSpecialAbility" },
           { "$ref": "#/definitions/AdvancedSpecialAbility" },
           { "$ref": "#/definitions/AdvancedSpecialAbility" }
         ],
         "additionalItems": false
       },
       "ApplicableCombatTechniques": {
         "description": "Applicable combat techniques. Specify a list of combat technique IDs if only specific combat techniques are applicable, but you can also specify a specific combat technique group. Leave empty if entry has no specific associated combat techniques (\"–\"). 1: All; 2: All melee CTs; 3: All ranged CTs; 4: All melee CTs with parry; 5: All melee CTs used with one-handed weapons.",
         "oneOf": [
           {
             "type": "object",
             "properties": {
               "type": { "const": "None" }
             },
             "required": ["type"],
             "additionalProperties": false
           },
           {
             "type": "object",
             "properties": {
               "type": { "const": "All" },
               "value": {
                 "type": "array",
                 "items": {
                   "oneOf": [
                     {
                       "type": "object",
                       "properties": {
                         "type": { "enum": ["Improvised", "PointedBlade", "Mount"] }
                       },
                       "required": ["type"],
                       "additionalProperties": false
                     },
                     {
                       "type": "object",
                       "properties": {
                         "type": { "const": "Species" },
                         "value": { "type": "integer", "minimum": 1 }
                       },
                       "required": ["type", "value"],
                       "additionalProperties": false
                     },
                     {
                       "type": "object",
                       "properties": {
                         "type": { "const": "ExcludeTechniques" },
                         "value": {
                           "type": "array",
                           "items": {
                             "type": "object",
                             "properties": {
                               "type": {
                                 "enum": [
                                   "MeleeCombatTechnique",
                                   "RangedCombatTechnique"
                                 ]
                               },
                               "value": { "type": "integer", "minimum": 1 }
                             },
                             "required": ["type", "value"],
                             "additionalProperties": false
                           },
                           "minItems": 1,
                           "additionalItems": false
                         }
                       },
                       "required": ["type", "value"],
                       "additionalProperties": false
                     }
                   ]
                 },
                 "minItems": 1
               }
             },
             "required": ["type"],
             "additionalProperties": false
           },
           {
             "type": "object",
             "properties": {
               "type": { "const": "AllMelee" },
               "value": {
                 "type": "array",
                 "items": {
                   "oneOf": [
                     {
                       "type": "object",
                       "properties": {
                         "type": { "enum": ["Improvised", "PointedBlade", "Mount", "HasParry", "OneHanded"] }
                       },
                       "required": ["type"],
                       "additionalProperties": false
                     },
                     {
                       "type": "object",
                       "properties": {
                         "type": { "const": "Species" },
                         "value": { "type": "integer", "minimum": 1 }
                       },
                       "required": ["type", "value"],
                       "additionalProperties": false
                     },
                     {
                       "type": "object",
                       "properties": {
                         "type": { "const": "ExcludeTechniques" },
                         "value": {
                           "type": "array",
                           "items": { "type": "integer", "minimum": 1 },
                           "minItems": 1,
                           "additionalItems": false
                         }
                       },
                       "required": ["type", "value"],
                       "additionalProperties": false
                     }
                   ]
                 },
                 "minItems": 1
               }
             },
             "required": ["type"],
             "additionalProperties": false
           },
           {
             "type": "object",
             "properties": {
               "type": { "const": "AllRanged" },
               "value": {
                 "type": "array",
                 "items": {
                   "oneOf": [
                     {
                       "type": "object",
                       "properties": {
                         "type": { "enum": ["Improvised", "PointedBlade", "Mount"] }
                       },
                       "required": ["type"],
                       "additionalProperties": false
                     },
                     {
                       "type": "object",
                       "properties": {
                         "type": { "const": "Species" },
                         "value": { "type": "integer", "minimum": 1 }
                       },
                       "required": ["type", "value"],
                       "additionalProperties": false
                     },
                     {
                       "type": "object",
                       "properties": {
                         "type": { "const": "ExcludeTechniques" },
                         "value": {
                           "type": "array",
                           "items": { "type": "integer", "minimum": 1 },
                           "minItems": 1,
                           "additionalItems": false
                         }
                       },
                       "required": ["type", "value"],
                       "additionalProperties": false
                     }
                   ]
                 },
                 "minItems": 1
               }
             },
             "required": ["type"],
             "additionalProperties": false
           },
           {
             "type": "object",
             "properties": {
               "type": { "const": "Specific" },
               "value": {
                 "type": "array",
                 "items": {
                   "type": "object",
                   "properties": {
                     "id": {
                       "type": "object",
                       "properties": {
                         "type": {
                           "enum": [
                             "MeleeCombatTechnique",
                             "RangedCombatTechnique"
                           ]
                         },
                         "value": { "type": "integer", "minimum": 1 }
                       },
                       "required": ["type", "value"],
                       "additionalProperties": false
                     },
                     "restrictions": {
                       "type": "array",
                       "items": {
                         "oneOf": [
                           {
                             "type": "object",
                             "properties": {
                               "type": { "enum": ["Improvised", "PointedBlade", "Mount"] }
                             },
                             "required": ["type"],
                             "additionalProperties": false
                           },
                           {
                             "type": "object",
                             "properties": {
                               "type": { "enum": ["Species", "Level"] },
                               "value": { "type": "integer", "minimum": 1 }
                             },
                             "required": ["type", "value"],
                             "additionalProperties": false
                           },
                           {
                             "type": "object",
                             "properties": {
                               "type": { "const": "Weapons" },
                               "value": {
                                 "type": "array",
                                 "items": { "type": "integer", "minimum": 1 },
                                 "minItems": 1,
                                 "additionalItems": false
                               }
                             },
                             "required": ["type", "value"],
                             "additionalProperties": false
                           }
                         ]
                       },
                       "minItems": 1
                     }
                   },
                   "required": ["id"],
                   "additionalProperties": false
                 },
                 "minItems": 1,
                 "additionalItems": false
               }
             },
             "required": ["type", "value"],
             "additionalProperties": false
           },
           {
             "type": "object",
             "properties": {
               "type": { "const": "DependingOnCombatStyle" }
             },
             "required": ["type"],
             "additionalProperties": false
           }
         ]
       },
       "ApValue": {
         "description": "The AP value you have to pay for.\n\n- If the AP costs depend on the selection, leave empty.\n- If the AP costs depend on the selected skill's improvement cost, insert an array. The first entry represents A, the second B and so on. `Always` start from A. If there is no AP value given for IC A, type 0. If you use an array, contact the developer, this has to be implemented manually.",
         "oneOf": [
           {
             "type": "object",
             "properties": {
               "type": { "const": "Flat" },
               "value": {
                 "type": "integer",
                 "minimum": 0
               }
             },
             "required": ["type", "value"],
             "additionalProperties": false
           },
           {
             "type": "object",
             "properties": {
               "type": { "const": "PerLevel" },
               "value": {
                 "type": "array",
                 "items": {
                   "type": "integer",
                   "minimum": 0
                 },
                 "minItems": 1,
                 "additionalItems": false
               }
             },
             "required": ["type", "value"],
             "additionalProperties": false
           },
           {
             "description": "Used if AP value is defined by the selected option(s).",
             "type": "object",
             "properties": {
               "type": { "const": "Option" }
             },
             "required": ["type"],
             "additionalProperties": false
           }
         ]
       },
       "ApValueReplacement": {
         "description": "The AP value. Only use this if the text provides different information than `X adventure points`, e.g. for Special Ability Property Knowledge it is \"10 adventure points for the first *Property Knowledge*, 20 adventure points for the second, 40 adventure points for the third\". Markdown is available.",
         "type": "string",
         "minLength": 1
       },
       "ApValueAppend": {
         "description": "An addition to the default AP value schema. Only use this if the text provides information appended to `X adventure points` and if `apValue` is not used. Markdown is available.",
         "type": "string",
         "minLength": 1
       },
       "PrerequisitesReplacement": {
         "description": "Use if text cannot be generated by the app. Markdown is available.",
         "type": "string",
         "minLength": 1
       },
       "PrerequisitesStart": {
         "description": "Prepends the provided string to the main prerequisites string. No effect if `prerequisites` field is used in l10n file. Markdown is available.",
         "type": "string",
         "minLength": 1
       },
       "PrerequisitesEnd": {
         "description": "Appends the provided string to the main prerequisites string. No effect if `prerequisites` field is used in l10n table. Markdown is available.",
         "type": "string",
         "minLength": 1
       }
     }
   } *)
