type t = {
  id: int,
  check: SkillCheck.t,
  name: string,
  fullName: string,
};

let decode: Decoder.entryType(t);
