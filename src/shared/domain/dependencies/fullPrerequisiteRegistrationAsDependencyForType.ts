import { Draft } from "@reduxjs/toolkit"
import {
  LiturgyIdentifier,
  SpellworkIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import {
  LiturgyPrerequisites,
  SpellworkPrerequisites,
} from "optolith-database-schema/types/_Prerequisite"
import { Character } from "../character.ts"
import { registerOrUnregisterPlainPrerequisites } from "./prerequisiteCombinatorRegistrationAsDependency.ts"
import {
  registerOrUnregisterPrerequisiteOfLiturgyAsDependency,
  registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
} from "./prerequisiteRegistrationAsDependencyForType.ts"
import { RegistrationMethod } from "./registrationHelpers.ts"

/**
 * Register or unregister all prerequisites of a spellwork as dependencies on
 * the character's draft.
 */
export const registerOrUnregisterPrerequisitesOfSpellworkAsDependencies = (
  method: RegistrationMethod,
  character: Draft<Character>,
  p: SpellworkPrerequisites,
  sourceId: SpellworkIdentifier,
): void =>
  registerOrUnregisterPlainPrerequisites(
    method,
    character,
    p,
    sourceId,
    registerOrUnregisterPrerequisiteOfSpellworkAsDependency,
  )

/**
 * Register or unregister all prerequisites of a liturgy as dependencies on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisitesOfLiturgyAsDependencies = (
  method: RegistrationMethod,
  character: Draft<Character>,
  p: LiturgyPrerequisites,
  sourceId: LiturgyIdentifier,
): void =>
  registerOrUnregisterPlainPrerequisites(
    method,
    character,
    p,
    sourceId,
    registerOrUnregisterPrerequisiteOfLiturgyAsDependency,
  )
