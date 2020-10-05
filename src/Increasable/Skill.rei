/**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a skill.
 */

module Dynamic: Increasable.Dynamic.T;

module Static: {
  module Application: {
    type t = {
      id: int,
      name: string,
      prerequisite: option(Prerequisite.Activatable.t),
    };
  };

  module Use: {
    type t = {
      id: int,
      name: string,
      prerequisite: Prerequisite.Activatable.t,
    };
  };

  type encumbrance =
    | True
    | False
    | Maybe(option(string));

  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    encumbrance,
    gr: int,
    ic: IC.t,
    applications: Ley_IntMap.t(Application.t),
    applicationsInput: option(string),
    uses: Ley_IntMap.t(Use.t),
    tools: option(string),
    quality: string,
    failed: string,
    critical: string,
    botch: string,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let decode: Decoder.entryType(t);
};
