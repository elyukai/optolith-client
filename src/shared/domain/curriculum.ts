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
}
