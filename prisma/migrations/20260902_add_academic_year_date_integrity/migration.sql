ALTER TABLE "AcademicYear"
ADD CONSTRAINT "AcademicYear_valid_date_range"
CHECK ("startDate" < "endDate");