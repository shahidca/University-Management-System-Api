[33mcommit 442c267b102df7e9c59946c1b5e9cbd47664f323[m
Author: Md. Shahid Hossain <mdshahidca123@gmail.com>
Date:   Wed Sep 2 15:11:54 2026 +0600

    feat: enforce course prerequisite integrity

[1mdiff --git a/prisma/migrations/20260902090356_add_course_soft_delete/migration.sql b/prisma/migrations/20260902090356_add_course_soft_delete/migration.sql[m
[1mindex 2ef97f7..f7fc2a8 100644[m
[1m--- a/prisma/migrations/20260902090356_add_course_soft_delete/migration.sql[m
[1m+++ b/prisma/migrations/20260902090356_add_course_soft_delete/migration.sql[m
[36m@@ -1,5 +1,3 @@[m
[31m--- AlterTable[m
[31m-ALTER TABLE "Course" ADD COLUMN     "deletedAt" TIMESTAMP(3);[m
[31m-[m
[31m--- CreateIndex[m
[31m-CREATE INDEX "Course_deletedAt_idx" ON "Course"("deletedAt");[m
[32m+[m[32mALTER TABLE "CoursePrerequisite"[m
[32m+[m[32mADD CONSTRAINT "CoursePrerequisite_no_self_reference"[m
[32m+[m[32mCHECK ("courseId" <> "prerequisiteId");[m
\ No newline at end of file[m

[33mcommit 4f17a79b4f5740bbec1e77ac8fd2670cb7b1afcf[m
Author: Md. Shahid Hossain <mdshahidca123@gmail.com>
Date:   Wed Sep 2 15:04:14 2026 +0600

    feat: add soft delete support for courses

[1mdiff --git a/prisma/migrations/20260902090356_add_course_soft_delete/migration.sql b/prisma/migrations/20260902090356_add_course_soft_delete/migration.sql[m
[1mnew file mode 100644[m
[1mindex 0000000..2ef97f7[m
[1m--- /dev/null[m
[1m+++ b/prisma/migrations/20260902090356_add_course_soft_delete/migration.sql[m
[36m@@ -0,0 +1,5 @@[m
[32m+[m[32m-- AlterTable[m
[32m+[m[32mALTER TABLE "Course" ADD COLUMN     "deletedAt" TIMESTAMP(3);[m
[32m+[m
[32m+[m[32m-- CreateIndex[m
[32m+[m[32mCREATE INDEX "Course_deletedAt_idx" ON "Course"("deletedAt");[m
