type t = {
  id: int,
  check: SkillCheck.t,
  name: string,
  fullName: string,
};

module Decode: {let assoc: Decoder.assocDecoder(t);};
