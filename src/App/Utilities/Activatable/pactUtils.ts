import { Record } from "../../../Data/Record";
import { Pact } from "../../Models/Hero/Pact";

const { domain, name, category } = Pact.AL

export const isPactFromStateValid =
  (pact: Record<Pact>) => {
    const currentDomain = domain (pact)

    const validDomain =
      typeof currentDomain === "number" ? currentDomain > 0 : currentDomain .length > 0
    const validName = category (pact) === 2 || name (pact) .length > 0

    return validDomain && validName
  }
