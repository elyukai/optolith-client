import { Record } from "../../../Data/Record"
import { Pact } from "../../Models/Hero/Pact"

const { domain, name, category, type } = Pact.AL

export const isPactFromStateValid =
  (pact: Record<Pact>) => {
    const currentDomain = domain (pact)

    const validDomain =
      typeof currentDomain === "number" ? currentDomain > 0 : currentDomain .length > 0

    const validName = category (pact) === 2 || name (pact) .length > 0

    const validType = category (pact) === 1
                      || (category (pact) === 2 && ((currentDomain < 13 && type (pact) === 1)
                                                    || (currentDomain >= 13 && type (pact) === 2)))

    return validDomain && validName && validType
  }
