module Sex : sig
  type t = Sex.t

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Race : sig
  type t = { id : int NonEmptyList.t; active : bool }

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Culture : sig
  type t = int NonEmptyList.t

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module SocialStatus : sig
  type t = int

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Pact : sig
  type t = {
    category : int;
    domain : int NonEmptyList.t option;
    level : int option;
  }

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module PrimaryAttribute : sig
  type t = Magical of int | Blessed of int

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Activatable : sig
  type t = {
    id : Id.Activatable.t;
    active : bool;
    options : Id.Activatable.SelectOption.t list;
    level : int option;
  }

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module ActivatableMultiEntry : sig
  type activatableIds =
    | Advantages of int list
    | Disadvantages of int list
    | SpecialAbilities of int list

  type t = {
    id : activatableIds;
    active : bool;
    options : Id.Activatable.SelectOption.t list;
    level : int option;
  }

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module ActivatableMultiSelect : sig
  type t = {
    id : Id.Activatable.t;
    active : bool;
    firstOption : Id.Activatable.SelectOption.t list;
    otherOptions : Id.Activatable.SelectOption.t list;
    level : int option;
  }

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Increasable : sig
  type t = { id : Id.Increasable.t; value : int }

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module IncreasableMultiEntry : sig
  type increasableIds =
    | Attributes of int list
    | Skills of int list
    | CombatTechniques of int list
    | Spells of int list
    | LiturgicalChants of int list

  type t = { id : increasableIds; value : int }

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module DisplayOption : sig
  type t = Generate | Hide | ReplaceWith of string
end

module Config : sig
  type 'a t = { value : 'a; displayOption : DisplayOption.t }
end

module Unified : sig
  type value =
    | CommonSuggestedByRCP
    | Sex of Sex.t
    | Race of Race.t
    | Culture of Culture.t
    | Pact of Pact.t
    | SocialStatus of SocialStatus.t
    | PrimaryAttribute of PrimaryAttribute.t
    | Activatable of Activatable.t
    | ActivatableMultiEntry of ActivatableMultiEntry.t
    | ActivatableMultiSelect of ActivatableMultiSelect.t
    | Increasable of Increasable.t
    | IncreasableMultiEntry of IncreasableMultiEntry.t

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
    | Activatable of Activatable.t
    | ActivatableMultiEntry of ActivatableMultiEntry.t
    | ActivatableMultiSelect of ActivatableMultiSelect.t
    | Increasable of Increasable.t
    | IncreasableMultiEntry of IncreasableMultiEntry.t

  type t = value Config.t

  val unify : t -> Unified.t

  module Decode : sig
    type multilingual

    val multilingual : multilingual Json.Decode.decoder

    val resolveTranslations : Locale.Order.t -> multilingual -> t
  end
end

module Profession : sig
  type value =
    | Sex of Sex.t
    | Race of Race.t
    | Culture of Culture.t
    | Activatable of Activatable.t
    | Increasable of Increasable.t

  type t = value Config.t

  val unify : t -> Unified.t

  module Decode : sig
    type multilingual

    val multilingual : multilingual Json.Decode.decoder

    val resolveTranslations : Locale.Order.t -> multilingual -> t
  end
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
    | Activatable of Activatable.t
    | ActivatableMultiEntry of ActivatableMultiEntry.t
    | ActivatableMultiSelect of ActivatableMultiSelect.t
    | Increasable of Increasable.t
    | IncreasableMultiEntry of IncreasableMultiEntry.t

  type t = value Config.t

  val unify : t -> Unified.t

  module Decode : sig
    type multilingual

    val multilingual : multilingual Json.Decode.decoder

    val resolveTranslations : Locale.Order.t -> multilingual -> t
  end
end

module ArcaneTradition : sig
  type value = Sex of Sex.t | Culture of Culture.t

  type t = value Config.t

  val unify : t -> Unified.t

  module Decode : sig
    type multilingual

    val multilingual : multilingual Json.Decode.decoder

    val resolveTranslations : Locale.Order.t -> multilingual -> t
  end
end

module ActivatableOnly : sig
  type value = Activatable.t

  type t = value Config.t

  val unify : t -> Unified.t

  module Decode : sig
    type multilingual

    val multilingual : multilingual Json.Decode.decoder

    val resolveTranslations : Locale.Order.t -> multilingual -> t
  end
end

module IncreasableOnly : sig
  type value = Increasable.t

  type t = value Config.t

  val unify : t -> Unified.t

  module Decode : sig
    type multilingual

    val multilingual : multilingual Json.Decode.decoder

    val resolveTranslations : Locale.Order.t -> multilingual -> t
  end
end

module Collection : sig
  module ByLevel : sig
    type 'a t = Plain of 'a list | ByLevel of 'a list Ley_IntMap.t

    val getFirstLevel : 'a t -> 'a list
    (**
     * `getFirstLevel prerequisites` returns a list of the prerequisites that
     * must always be met to activate the associated entry.
     *)

    val concatRange : int option -> int option -> 'a t -> 'a list
    (**
     * `concatRange oldLevel newLevel prerequisites` returns a list of the
     * prerequisites of the matching levels of the passed prerequisites.
     *)
  end

  module General : sig
    type t = General.t ByLevel.t

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.Order.t -> multilingual -> t
    end
  end

  module Profession : sig
    type t = Profession.t list

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.Order.t -> multilingual -> t
    end
  end

  module AdvantageDisadvantage : sig
    type t = AdvantageDisadvantage.t ByLevel.t

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.Order.t -> multilingual -> t
    end
  end

  module ArcaneTradition : sig
    type t = ArcaneTradition.t list

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.Order.t -> multilingual -> t
    end
  end

  module Activatable : sig
    type t = ActivatableOnly.t list

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.Order.t -> multilingual -> t
    end
  end

  module Increasable : sig
    type t = IncreasableOnly.t list

    module Decode : sig
      type multilingual

      val multilingual : multilingual Json.Decode.decoder

      val resolveTranslations : Locale.Order.t -> multilingual -> t
    end
  end
end
