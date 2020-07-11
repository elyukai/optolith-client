module IM = Ley_IntMap;
module L = Ley_List;

let getFromGroup = (getGroup, group: int, pairs) =>
  IM.filter(((staticEntry, _)) => getGroup(staticEntry) === group, pairs);

let getActiveFromGroup = (isActive, getGroup, group: int, pairs) =>
  IM.filter(
    fun
    | (staticEntry, Some(heroEntry)) =>
      getGroup(staticEntry) === group && isActive(heroEntry)
    | _ => false,
    pairs,
  );

let countActiveFromGroup = (isActive, getGroup, group: int, pairs) =>
  IM.countWith(
    fun
    | (staticEntry, Some(heroEntry)) =>
      getGroup(staticEntry) === group && isActive(heroEntry)
    | _ => false,
    pairs,
  );

let countActiveFromGroups = (isActive, getGroup, groups: list(int), pairs) =>
  IM.countWith(
    fun
    | (staticEntry, Some(heroEntry)) =>
      L.elem(getGroup(staticEntry), groups) && isActive(heroEntry)
    | _ => false,
    pairs,
  );

let hasActiveFromGroup = (isActive, getGroup, group: int, pairs) =>
  IM.Foldable.any(
    fun
    | (staticEntry, Some(heroEntry)) =>
      getGroup(staticEntry) === group && isActive(heroEntry)
    | _ => false,
    pairs,
  );

let hasActiveFromGroups = (isActive, getGroup, groups: list(int), pairs) =>
  IM.Foldable.any(
    fun
    | (staticEntry, Some(heroEntry)) =>
      L.elem(getGroup(staticEntry), groups) && isActive(heroEntry)
    | _ => false,
    pairs,
  );

module CombatTechnique = {
  let getFromGroup =
      (group, pairs: IM.t((CombatTechnique.t, option(Hero.Skill.t)))) =>
    getFromGroup(
      ({CombatTechnique.gr, _}) => gr,
      Id.CombatTechnique.Group.toInt(group),
      pairs,
    );
};

module SpecialAbility = {
  let getFromGroup =
      (group, pairs: IM.t((SpecialAbility.t, option(Hero.Activatable.t)))) =>
    getFromGroup(
      ({SpecialAbility.gr, _}) => gr,
      Id.SpecialAbility.Group.toInt(group),
      pairs,
    );

  let countActiveFromGroup = (group, pairs) =>
    countActiveFromGroup(
      Activatable_Accessors.isActive,
      ({SpecialAbility.gr, _}) => gr,
      Id.SpecialAbility.Group.toInt(group),
      pairs,
    );

  let countActiveFromGroups = (groups, pairs) =>
    countActiveFromGroups(
      Activatable_Accessors.isActive,
      ({SpecialAbility.gr, _}) => gr,
      L.map(Id.SpecialAbility.Group.toInt, groups),
      pairs,
    );

  let hasActiveFromGroup = (group, pairs) =>
    hasActiveFromGroup(
      Activatable_Accessors.isActive,
      ({SpecialAbility.gr, _}) => gr,
      Id.SpecialAbility.Group.toInt(group),
      pairs,
    );

  let hasActiveFromGroups = (groups, pairs) =>
    hasActiveFromGroups(
      Activatable_Accessors.isActive,
      ({SpecialAbility.gr, _}) => gr,
      L.map(Id.SpecialAbility.Group.toInt, groups),
      pairs,
    );
};
