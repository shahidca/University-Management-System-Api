ALTER TABLE "CoursePrerequisite"
ADD CONSTRAINT "CoursePrerequisite_no_self_reference"
CHECK ("courseId" <> "prerequisiteId");