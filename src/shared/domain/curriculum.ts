import type { Curriculum as RawCurriculum } from "@optolith/character-schema/types"
import type { Curriculum_ID, LessonPackage_ID } from "@optolith/database-schema/gen"
import { observable } from "mobx"

export class CharacterCurriculum {
  /**
   * The educational institution's curriculum identifier.
   */
  @observable accessor educationalInstitutionId: Curriculum_ID

  /**
   * The lesson package identifier.
   */
  @observable accessor lessonPackageId: LessonPackage_ID | undefined

  constructor(
    ...args:
      | [raw: RawCurriculum]
      | [educationalInstitutionId: Curriculum_ID, lessonPackageId?: LessonPackage_ID]
  ) {
    if (typeof args[0] === "string") {
      this.educationalInstitutionId = args[0]
      this.lessonPackageId = args[1]
    } else {
      this.educationalInstitutionId = args[0].educationalInstitution
      this.lessonPackageId = args[0].lessonPackage
    }
  }

  toJSON(): RawCurriculum {
    return {
      educationalInstitution: this.educationalInstitutionId,
      lessonPackage: this.lessonPackageId,
    }
  }
}
