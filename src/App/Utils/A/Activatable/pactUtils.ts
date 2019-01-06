import { Record } from "../../../../Data/Record";
import { Pact } from "../../../Models/Hero/Pact";

const { domain, name } = Pact.A

export const isPactFromStateValid =
  (pact: Record<Pact>) => {
    const currentDomain = domain (pact)

    const validDomain =
      typeof currentDomain === "number" ? currentDomain > 0 : currentDomain .length > 0

    const validName = name (pact) .length > 0

    return validDomain && validName
  }
