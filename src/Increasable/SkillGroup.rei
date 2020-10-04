type t = {
  id: int,
  check: SkillCheck.t,
  name: string,
  fullName: string,
};

let decode: list(string) => Json.Decode.decoder(option((int, t)));
