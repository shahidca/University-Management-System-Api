import {
  NotificationType,
} from "@prisma/client";

export const enrollmentNotification = (
  courseCode: string,
  sectionCode: string,
) => ({
  type: NotificationType.ENROLLMENT,
  title: "Course Enrollment Confirmed",
  message: `Your enrollment in ${courseCode} (Section ${sectionCode}) has been confirmed.`,
  metadata: {
    courseCode,
    sectionCode,
  },
});

export const examPublishedNotification = (
  courseCode: string,
  examTitle: string,
) => ({
  type: NotificationType.EXAM,
  title: "Exam Published",
  message: `${examTitle} for ${courseCode} has been published.`,
  metadata: {
    courseCode,
    examTitle,
  },
});

export const resultPublishedNotification = (
  courseCode: string,
  examTitle: string,
) => ({
  type: NotificationType.RESULT,
  title: "Result Published",
  message: `Your ${examTitle} result for ${courseCode} is now available.`,
  metadata: {
    courseCode,
    examTitle,
  },
});

export const invoiceCreatedNotification = (
  invoiceNumber: string,
  amount: string,
) => ({
  type: NotificationType.INVOICE,
  title: "New Invoice Created",
  message: `A new invoice ${invoiceNumber} has been created for BDT ${amount}.`,
  metadata: {
    invoiceNumber,
    amount,
  },
});

export const paymentSuccessfulNotification = (
  transactionId: string,
  amount: string,
) => ({
  type: NotificationType.PAYMENT,
  title: "Payment Successful",
  message: `Your payment of BDT ${amount} was completed successfully.`,
  metadata: {
    transactionId,
    amount,
  },
});

export const transcriptIssuedNotification = (
  transcriptNo: string,
) => ({
  type: NotificationType.TRANSCRIPT,
  title: "Transcript Issued",
  message: `Your transcript ${transcriptNo} has been issued.`,
  metadata: {
    transcriptNo,
  },
});