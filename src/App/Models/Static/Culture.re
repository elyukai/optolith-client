type commonProfessionId =
  | Profession(string)
  | ProfessionGroup(int);

type commonProfessions =
  | All
  | OneOf(list(commonProfessionId))
  | ExceptFor(list(commonProfessionId));

module IncreaseSkill = {
  type t = {
    id: string,
    value: int,
  };
};

type t = {
  id: string,
  name: string,
  culturalPackageAdventurePoints: int,
  languages: list(int),
  scripts: list(int),
  socialStatus: list(int),
  areaKnowledge: string,
  areaKnowledgeShort: string,
  commonProfessions: (
    commonProfessions,
    commonProfessions,
    commonProfessions,
  ),
  commonMundaneProfessions: option(string),
  commonMagicProfessions: option(string),
  commonBlessedProfessions: option(string),
  commonAdvantages: list(string),
  commonAdvantagesText: option(string),
  commonDisadvantages: list(string),
  commonDisadvantagesText: option(string),
  uncommonAdvantages: list(string),
  uncommonAdvantagesText: option(string),
  uncommonDisadvantages: list(string),
  uncommonDisadvantagesText: option(string),
  commonSkills: list(string),
  uncommonSkills: list(string),
  commonNames: string,
  culturalPackageSkills: list(IncreaseSkill.t),
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};
