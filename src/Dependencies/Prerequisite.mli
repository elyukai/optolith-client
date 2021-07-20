(** All kinds of different prerequisite types. Different entries may have
    different sets/groups of prerequisite types as prerequisites. Usually,
    though, they don't only have a single prerequisite from the group but a collection of prerequisites from the respective group instead. *)

(** Binary sex prerequisite. *)
module Sex : sig
  type t = Male | Female

  val matches : Sex.t -> t -> bool
  (** [matches sex prerequisite] validates a binary sex prerequisite against a
      character's sex. *)
end

(** Race prerequisite. *)
module Race : sig
  type t = {
    id : int NonEmptyList.t;
        (** If the list has more than one entry, any of the listed races must be
            selected (or not, depending on [active]). *)
    active : bool;
        (** [true] if any of the listed races must be present, [false] if all of
            the listed races must not be present. The latter one may be used as
            a shorthand for requiring multiple races to not be selected using a
            single prerequisite entry. *)
  }
end

(** Culture prerequisite. *)
module Culture : sig
  type t = int NonEmptyList.t
  (** One or more culture identifiers. If the list has more than one entry, any
      of the listed cultures must be selected. *)
end

(** Primary attribute prerequisite. *)
module PrimaryAttribute : sig
  (** It may require either the magical or the blessed primary attribute on a
      certain minimum value. *)
  type t = Magical of int | Blessed of int
end

(** Pact prerequisite. *)
module Pact : sig
  type t = {
    category : int;  (** The required pact category. *)
    domain : int NonEmptyList.t option;
        (** The pact may be required to be linked to a creature from one or more
            specific domains. *)
    level : int option;
        (** The pact may be required to be on a certain level. The definition of
            a level may vary between different pact categories. *)
  }
end

(** Social status prerequisite. *)
module SocialStatus : sig
  type t = int
  (** The required minimum social status. *)
end

(** State prerequisite. *)
module State : sig
  type t = int NonEmptyList.t
  (** If the list has more than one entry, any of the listed states must be
      active. *)
end

(** Rule prerequisite. *)
module Rule : sig
  type t = IdGroup.ExtensionRule.t
  (** Both focus rules and optional rules can be required to be active. *)
end

(** Publication prerequisite. *)
module Publication : sig
  type t = int
  (** A publication may be required to be active. This is only used for
      prerequisites in a [when_] clause (see below) where the prerequisite can
      only be ensured if a certain publication has been activated. *)
end

(** Influence prerequisite. *)
module Influence : sig
  type t = { id : int; active : bool }
  (** An influence must or must not be active. *)
end

(** Activatable prerequisite. *)
module Activatable : sig
  type t = {
    id : IdGroup.Activatable.t;  (** The target activatable entry identifier. *)
    active : bool;
        (** If [true], the entry must meet the prerequisite, if [false], the
            entry must not meet the prerequisite. *)
    options : IdGroup.SelectOption.t list;
        (** The entry must have some specific options set. This causes this
            prerequisite to not apply to an entry in general but only to entry
            instances that meet the required options. *)
    level : int option;
        (** The entry may be required to be on a certain minimum level. *)
  }

  (** Activatable prerequisite for one of a list of entries. *)
  module AnyOf : sig
    type t = {
      id : IdGroup.Activatable.Many.t;
          (** The set of identifiers of possible activatable entry targets. *)
      active : bool;
          (** If [true], any entry must meet the prerequisite, if [false], all
              entries must not meet the prerequisite. The latter one may be used
              as a shorthand for requiring multiple activatable to not meet a
              prerequisite using a single prerequisite entry. *)
      options : IdGroup.SelectOption.t list;
          (** The entry must have some specific options set. This causes this
              prerequisite to not apply to an entry in general but only to entry
              instances that meet the required options. *)
      level : int option;
          (** The entry may be required to be on a certain minimum level. *)
    }
    (** Activatable prerequisite where any of the listed activatable entries
        must match the prerequisite. *)

    (** Activatable prerequisite for one of a list of options of an entry. *)
    module Select : sig
      type t = {
        id : IdGroup.Activatable.t;
            (** The target activatable entry identifier. *)
        active : bool;
            (** If [true], the entry must meet the prerequisite, if [false], the
                entry must not meet the prerequisite. *)
        first_option : IdGroup.SelectOption.t NonEmptyList.t;
            (** A set of options where the first option of the entry needs to be
                in this set. *)
        other_options : IdGroup.SelectOption.t list;
            (** The entry must have some other specific options set. The first
                entry in this list applies to the second option of the entry,
                the second with the third, and so on. This causes this
                prerequisite to not apply to an entry in general but only to
                entry instances that meet the required options. *)
        level : int option;
            (** The entry may be required to be on a certain minimum level. *)
      }
      (** Activatable prerequisite where the target entry must have any of the
          listed options as the first option. *)
    end
  end
end

(** Rated prerequisite. *)
module Rated : sig
  type t = {
    id : IdGroup.Rated.t;  (** The target rated entry identifier. *)
    value : int;  (** The required minimum value. *)
  }

  (** Rated prerequisite for one of a list of entries. *)
  module AnyOf : sig
    type t = {
      id : IdGroup.Rated.Many.t;
          (** The set of identifiers of possible rated entry targets. *)
      value : int;  (** The required minimum value. *)
    }
    (** Rated prerequisite where any of the listed rated entries must match the
        prerequisite. *)
  end
end

(** Rated prerequisite specified to animist powers. *)
module AnimistPower : sig
  type t = {
    id : IdGroup.AnimistPower.t;  (** The target rated entry identifier. *)
    level : int option;
        (** Since animist powers can have multiple levels where each has its own
            rating, the level may be specified here. Defaults to [1]. *)
    value : int;  (** The required minimum value. *)
  }
end

(** Spellwork or liturgy enhancement prerequisite. *)
module Enhancement : sig
  type t = int
  (** The identifier of the required enhancement of the associated entry. *)
end

(** The mode in which the prerequisite's text should be generated. *)
module DisplayMode : sig
  type t =
    | Generate  (** Generate the text. The default. *)
    | Hide  (** Do not render the prerequisite. *)
    | ReplaceWith of string
        (** Do not generate the prerequisite's text and instead use the value of
            the associated string as the text. *)
end

(** Possible prerequisites that must be met for a prerequisite to take effect.
    *)
module When : sig
  type t = Publication of Publication.t
end

(** Full configuration of a single prerequisite. *)
module Config : sig
  type 'a t = {
    value : 'a;  (** The actual prerequisite definition *)
    displayMode : DisplayMode.t;
        (** The display mode for rendering the prerequisite as text. *)
    when_ : When.t list;
        (** If non-empty, the prerequisite only takes effect if all
            sub-prerequisites in this list are met. *)
  }
end

(** Grouped prerequisite types specialized for specific entry types. *)
module Group : sig
  (** Unified prerequisites. They are not used by entries directly but instead
      to perform unified operations on prerequisite definitions. *)
  module Unified : sig
    (** A unified set of possible prerequisite definitions. *)
    type value =
      | CommonSuggestedByRCP
      | Sex of Sex.t
      | Race of Race.t
      | Culture of Culture.t
      | Pact of Pact.t
      | SocialStatus of SocialStatus.t
      | PrimaryAttribute of PrimaryAttribute.t
      | State of State.t
      | Rule of Rule.t
      | Influence of Influence.t
      | Activatable of Activatable.t
      | ActivatableAnyOf of Activatable.AnyOf.t
      | ActivatableAnyOfSelect of Activatable.AnyOf.Select.t
      | Rated of Rated.t
      | RatedAnyOf of Rated.AnyOf.t
      | AnimistPower of AnimistPower.t
      | Other

    type t = value Config.t
    (** Full configuration of a unified prerequisite definition. *)
  end

  (** Possible prerequisites of special abilities. *)
  module SpecialAbility : sig
    (** A set of possible prerequisite definitions of special abilities. *)
    type value =
      | Sex of Sex.t
      | Race of Race.t
      | Culture of Culture.t
      | Pact of Pact.t
      | SocialStatus of SocialStatus.t
      | PrimaryAttribute of PrimaryAttribute.t
      | State of State.t
      | Rule of Rule.t
      | Activatable of Activatable.t
      | ActivatableAnyOf of Activatable.AnyOf.t
      | ActivatableAnyOfSelect of Activatable.AnyOf.Select.t
      | Rated of Rated.t
      | RatedAnyOf of Rated.AnyOf.t

    type t = value Config.t
    (** Full configuration of a special ability prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of professions. *)
  module Profession : sig
    (** A set of possible prerequisite definitions of professions. *)
    type value =
      | Sex of Sex.t
      | Race of Race.t
      | Culture of Culture.t
      | Activatable of Activatable.t
      | Rated of Rated.t

    type t = value Config.t
    (** Full configuration of a profession prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of advantages and disadvantages. *)
  module AdvantageDisadvantage : sig
    (** A set of possible prerequisite definitions of advantages and
        disadvantages. *)
    type value =
      | CommonSuggestedByRCP
      | Sex of Sex.t
      | Race of Race.t
      | Culture of Culture.t
      | Pact of Pact.t
      | SocialStatus of SocialStatus.t
      | PrimaryAttribute of PrimaryAttribute.t
      | State of State.t
      | Rule of Rule.t
      | Activatable of Activatable.t
      | ActivatableAnyOf of Activatable.AnyOf.t
      | ActivatableAnyOfSelect of Activatable.AnyOf.Select.t
      | Rated of Rated.t
      | RatedAnyOf of Rated.AnyOf.t

    type t = value Config.t
    (** Full configuration of an advantages or disadvantages prerequisite
        definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of arcane traditions. *)
  module ArcaneTradition : sig
    (** A set of possible prerequisite definitions of arcane traditions. *)
    type value = Sex of Sex.t | Culture of Culture.t

    type t = value Config.t
    (** Full configuration of an arcane tradition prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of personality traits. *)
  module PersonalityTrait : sig
    (** A set of possible prerequisite definitions of personality traits. *)
    type value = Culture of Culture.t | Special

    type t = value Config.t
    (** Full configuration of a personality trait prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of spellworks. *)
  module Spellwork : sig
    (** A set of possible prerequisite definitions of spellworks. *)
    type value = Rule of Rule.t | Rated of Rated.t

    type t = value Config.t
    (** Full configuration of a spellwork prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of liturgies. *)
  module Liturgy : sig
    (** A set of possible prerequisite definitions of liturgies. *)
    type value = Rule of Rule.t

    type t = value Config.t
    (** Full configuration of a liturgy prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of influences. *)
  module Influence : sig
    (** A set of possible prerequisite definitions of influences. *)
    type value = Influence of Influence.t | Special

    type t = value Config.t
    (** Full configuration of a influence prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of languages. *)
  module Language : sig
    (** A set of possible prerequisite definitions of languages. *)
    type value = Race of Race.t | Activatable of Activatable.t

    type t = value Config.t
    (** Full configuration of a language prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of animist powers. *)
  module AnimistPower : sig
    (** A set of possible prerequisite definitions of animist powers. *)
    type value = AnimistPower of AnimistPower.t

    type t = value Config.t
    (** Full configuration of an animist power prerequisite definition. *)

    val unify : t -> Unified.t
    (** Convert a specialized configuration to a unified configuration. *)
  end

  (** Possible prerequisites of enhancements. *)
  module Enhancement : sig
    (** A set of possible prerequisite definitions of enhancements. *)
    type t = Enhancement of Enhancement.t
  end
end

(** Entries may feature multiple prerequisites at once and it depends on the
    entry type if prerequisites can exist for multiple levels of an entry. These
    prerequisite collections are directly used by entries, specialized to each
    entry type. There are also decoders for those collections available. *)
module Collection : sig
  (** Entries may specify multiple prerequisites for activation. *)
  module Plain : sig
    type 'a t = 'a list
  end

  (** Entries may specify multiple prerequisites for activation as well as
      prerequisites to reach certain levels. *)
  module ByLevel : sig
    type 'a t =
      | Plain of 'a Plain.t
          (** Prerequisites are only defined for activation. *)
      | ByLevel of 'a Plain.t IntMap.t
          (** Prerequisites may be defined for activation and to reach certain
              levels. Activation prerequisites, if any, are present at key [1].
              *)

    val first_level : 'a t -> 'a list
    (** [first_level prerequisites] returns a list of the prerequisites that
        must always be met to activate the associated entry. *)

    val concat_range :
      old_level:IntMap.key option ->
      new_level:IntMap.key option ->
      'a t ->
      'a list
    (** [concat_range ~old_level ~new_level prerequisites] returns a list of the
        prerequisites of the matching levels of the passed prerequisites. *)
  end

  (** The collection of prerequisites of special abilities. *)
  module SpecialAbility : sig
    type t = Group.SpecialAbility.t ByLevel.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of special abilities. *)
  module Profession : sig
    type t = Group.Profession.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of advantages and disadvantages. *)
  module AdvantageDisadvantage : sig
    type t = Group.AdvantageDisadvantage.t ByLevel.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of arcane traditions. *)
  module ArcaneTradition : sig
    type t = Group.ArcaneTradition.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of personality traits. *)
  module PersonalityTrait : sig
    type t = Group.PersonalityTrait.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of spellworks. *)
  module Spellwork : sig
    type t = Group.Spellwork.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of liturgies. *)
  module Liturgy : sig
    type t = Group.Liturgy.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of influences. *)
  module Influence : sig
    type t = Group.Influence.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of languages. *)
  module Language : sig
    type t = Group.Language.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of animist powers. *)
  module AnimistPower : sig
    type t = Group.AnimistPower.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end

  (** The collection of prerequisites of enhancements. *)
  module Enhancement : sig
    type t = Group.Enhancement.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Decoders_bs.Decode.decoder
    end
  end
end
