/**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a skill.
 */

module Dynamic: Increasable.Dynamic;

module Static: {
  module Application: {
    type t = {
      id: int,
      name: string,
      prerequisite: option(Prerequisite.activatable),
    };
  };

  module Use: {
    type t = {
      id: int,
      name: string,
      prerequisite: Prerequisite.activatable,
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

  let decode: list(string) => Json.Decode.decoder(option(t));
};
