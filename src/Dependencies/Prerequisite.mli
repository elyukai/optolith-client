(** All kinds of different prerequisite types. Different entries may have
    different sets/groups of prerequisite types as prerequisites. Usually,
    though, they don't only have a single prerequisite from the group but a collection of prerequisites from the respective group instead. *)

module Sex : sig
  (** Binary sex prerequisite. *)
  type t = Male | Female

  val matches : Sex.t -> t -> bool
  (** [matches sex prerequisite] validates a binary sex prerequisite against a
      character's sex. *)
end

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
  (** Race prerequisite. *)
end

module Culture : sig
  type t = int NonEmptyList.t
  (** Culture prerequisite. If the list has more than one entry, any of the
      listed cultures must be selected. *)
end

module PrimaryAttribute : sig
  (** Primary attribute prerequisite. It may require either the magical or the
      blessed primary attribute on a certain minimum value. *)
  type t = Magical of int | Blessed of int
end

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
  (** Pact prerequisite. *)
end

module SocialStatus : sig
  type t = int
  (** Social status prerequisite. The required minimum social status. *)
end

module State : sig
  type t = int NonEmptyList.t
  (** State prerequisite. If the list has more than one entry, any of the listed
      states must be active. *)
end

module Rule : sig
  type t = IdGroup.ExtensionRule.t
  (** Rule prerequisite. Both focus rules and optional rules can be required to
      be active. *)
end

module Publication : sig
  type t = int
  (** Publication prerequisite. A publication may be required to be active. This
      is only used for prerequisites in a [when_] clause (see below) where the
      prerequisite can only be ensured if a certain publication has been
      activated. *)
end

module Influence : sig
  type t = { id : int; active : bool }
  (** Influence prerequisite. An influence must or must not be active. *)
end

module Activatable : sig
  type t = {
    id : IdGroup.Activatable.t;
        (** The targeted activatable entry identifier. *)
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
  (** Activatable prerequisite. *)

  module AnyOf : sig
    type t = {
      id : IdGroup.Activatable.Many.t;
          (** The set of possible activatable entry targets as identifiers. *)
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

    module Select : sig
      type t = {
        id : IdGroup.Activatable.t;
            (** The targeted activatable entry identifier. *)
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

module Rated : sig
  type t = { id : IdGroup.Rated.t; value : int }

  module AnyOf : sig
    type t = { id : IdGroup.Rated.Many.t; value : int }
  end
end

module AnimistPower : sig
  type t = { id : IdGroup.AnimistPower.t; level : int option; value : int }
end

module DisplayOption : sig
  type t = Generate | Hide | ReplaceWith of string
end

module When : sig
  type t = Publication of Publication.t
end

module Config : sig
  type 'a t = {
    value : 'a;
    displayOption : DisplayOption.t;
    when_ : When.t list;
  }
end

module Group : sig
  module Unified : sig
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
  end

  module General : sig
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

    val unify : t -> Unified.t
  end

  module Profession : sig
    type value =
      | Sex of Sex.t
      | Race of Race.t
      | Culture of Culture.t
      | Activatable of Activatable.t
      | Rated of Rated.t

    type t = value Config.t

    val unify : t -> Unified.t
  end

  module AdvantageDisadvantage : sig
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

    val unify : t -> Unified.t
  end

  module ArcaneTradition : sig
    type value = Sex of Sex.t | Culture of Culture.t

    type t = value Config.t

    val unify : t -> Unified.t
  end

  module PersonalityTrait : sig
    type value = Culture of Culture.t | Special

    type t = value Config.t

    val unify : t -> Unified.t
  end

  module Spellwork : sig
    type value = Rule of Rule.t | Rated of Rated.t

    type t = value Config.t

    val unify : t -> Unified.t
  end

  module Liturgy : sig
    type value = Rule of Rule.t

    type t = value Config.t

    val unify : t -> Unified.t
  end

  module Influence : sig
    type value = Influence of Influence.t | Special

    type t = value Config.t

    val unify : t -> Unified.t
  end

  module Language : sig
    type value = Race of Race.t | Activatable of Activatable.t

    type t = value Config.t

    val unify : t -> Unified.t
  end

  module AnimistPower : sig
    type value = AnimistPower of AnimistPower.t

    type t = value Config.t

    val unify : t -> Unified.t
  end
end

module Collection : sig
  module Plain : sig
    type 'a t = 'a list
  end

  module ByLevel : sig
    type 'a t = Plain of 'a list | ByLevel of 'a list IntMap.t

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

  module General : sig
    type t = Group.General.t ByLevel.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module Profession : sig
    type t = Group.Profession.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module AdvantageDisadvantage : sig
    type t = Group.AdvantageDisadvantage.t ByLevel.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module ArcaneTradition : sig
    type t = Group.ArcaneTradition.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module PersonalityTrait : sig
    type t = Group.PersonalityTrait.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module Spellwork : sig
    type t = Group.Spellwork.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module Liturgy : sig
    type t = Group.Liturgy.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module Influence : sig
    type t = Group.Influence.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module Language : sig
    type t = Group.Language.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end

  module AnimistPower : sig
    type t = Group.AnimistPower.t Plain.t

    module Decode : sig
      val make : Locale.Order.t -> t Json.Decode.decoder
    end
  end
end
