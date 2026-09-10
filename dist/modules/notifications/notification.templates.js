import { NotificationType, } from "@prisma/client";
export const enrollmentNotification = (courseCode, sectionCode) => ({
    type: NotificationType.ENROLLMENT,
    title: "Course Enrollment Confirmed",
    message: `Your enrollment in ${courseCode} (Section ${sectionCode}) has been confirmed.`,
    metadata: {
        courseCode,
        sectionCode,
    },
});
export const examPublishedNotification = (courseCode, examTitle) => ({
    type: NotificationType.EXAM,
    title: "Exam Published",
    message: `${examTitle} for ${courseCode} has been published.`,
    metadata: {
        courseCode,
        examTitle,
    },
});
export const resultPublishedNotification = (courseCode, examTitle) => ({
    type: NotificationType.RESULT,
    title: "Result Published",
    message: `Your ${examTitle} result for ${courseCode} is now available.`,
    metadata: {
        courseCode,
        examTitle,
    },
});
export const invoiceCreatedNotification = (invoiceNumber, amount) => ({
    type: NotificationType.INVOICE,
    title: "New Invoice Created",
    message: `A new invoice ${invoiceNumber} has been created for BDT ${amount}.`,
    metadata: {
        invoiceNumber,
        amount,
    },
});
export const paymentSuccessfulNotification = (transactionId, amount) => ({
    type: NotificationType.PAYMENT,
    title: "Payment Successful",
    message: `Your payment of BDT ${amount} was completed successfully.`,
    metadata: {
        transactionId,
        amount,
    },
});
export const transcriptIssuedNotification = (transcriptNo) => ({
    type: NotificationType.TRANSCRIPT,
    title: "Transcript Issued",
    message: `Your transcript ${transcriptNo} has been issued.`,
    metadata: {
        transcriptNo,
    },
});
//# sourceMappingURL=notification.templates.js.map