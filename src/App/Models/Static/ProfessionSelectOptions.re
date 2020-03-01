module CantripSelection = {
  type t = {
    amount: int,
    sid: list(string),
  };
};

module CombatTechniqueSelection = {
  type second = {
    amount: int,
    value: int,
  };

  type t = {
    amount: int,
    value: int,
    second: option(second),
    sid: list(string),
  };

  type tForVariant =
    | Remove
    | Overwrite(t);
};

module CurseSelection = {
  type t = int;
};

module LanguageScriptSelection = {
  type t = int;

  type tForVariant =
    | Remove
    | Overwrite(t);
};

module SkillSpecializationSelection = {
  type t =
    | Single(string)
    | OneOf(list(string));
};

module SkillSelection = {
  type t = {
    /**
     * If specified, only choose from skills of the specified group.
     */
    gr: option(int),
    /**
     * The AP value the user can spend.
     */
    value: int,
  };
};

module TerrainKnowledgeSelection = {
  type t = list(int);
};

type t = {
  cantrips: option(CantripSelection.t),
  combatTechniques: option(CombatTechniqueSelection.t),
  curses: option(CurseSelection.t),
  languagesScripts: option(LanguageScriptSelection.t),
  skillSpecialization: option(SkillSpecializationSelection.t),
  skills: option(SkillSelection.t),
  terrainKnowledge: option(TerrainKnowledgeSelection.t),
  guildMageUnfamiliarSpell: bool,
};

type tForVariant = {
  cantrips: option(CantripSelection.t),
  combatTechniques: option(CombatTechniqueSelection.tForVariant),
  curses: option(CurseSelection.t),
  languagesScripts: option(LanguageScriptSelection.tForVariant),
  skillSpecialization: option(SkillSpecializationSelection.t),
  skills: option(SkillSelection.t),
  terrainKnowledge: option(TerrainKnowledgeSelection.t),
  guildMageUnfamiliarSpell: bool,
};
