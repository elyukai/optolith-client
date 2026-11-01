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

  constructor(educationalInstitutionId: Curriculum_ID, lessonPackageId?: LessonPackage_ID) {
    this.educationalInstitutionId = educationalInstitutionId
    this.lessonPackageId = lessonPackageId
  }

  static fromJSON(raw: RawCurriculum): CharacterCurriculum {
    return new CharacterCurriculum(raw.educationalInstitution, raw.lessonPackage)
  }

  toJSON(): RawCurriculum {
    return {
      educationalInstitution: this.educationalInstitutionId,
      lessonPackage: this.lessonPackageId,
    }
  }
}
