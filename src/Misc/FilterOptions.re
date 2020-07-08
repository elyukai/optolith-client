type heroListSortOptions =
  | Name
  | DateModified;

type heroListVisibilityFilter =
  | All
  | Own
  | Shared;

type racesSortOptions =
  | Name
  | Cost;

type culturesSortOptions =
  | Name
  | Cost;

type culturesVisibilityFilter =
  | All
  | Common;

type professionsSortOptions =
  | Name
  | Cost;

type professionsVisibilityFilter =
  | All
  | Common;

type professionsGroupVisibilityFilter =
  | All
  | Mundane
  | Magical
  | Blessed;

type skillsSortOptions =
  | Name
  | Group
  | IC;

type specialAbilitiesSortOptions =
  | Name
  | Group;

type combatTechniquesSortOptions =
  | Name
  | Group
  | IC;

type spellsSortOptions =
  | Name
  | Group
  | Property
  | IC;

type liturgicalChantsSortOptions =
  | Name
  | Group
  | IC;

type equipmentSortOptions =
  | Name
  | Group
  | Where
  | Weight;

type theme =
  | Dark
  | Light;

type tab =
  | Herolist
  | Grouplist
  | Wiki
  | Faq
  | Imprint
  | ThirdPartyLicenses
  | LastChanges
  | Profile
  | PersonalData
  | CharacterSheet
  | Pact
  | Rules
  | Races
  | Cultures
  | Professions
  | Attributes
  | Advantages
  | Disadvantages
  | Skills
  | CombatTechniques
  | SpecialAbilities
  | Spells
  | LiturgicalChants
  | Equipment
  | ZoneArmor
  | Pets;
