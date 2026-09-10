export declare const enrollmentNotification: (courseCode: string, sectionCode: string) => {
    type: "ENROLLMENT";
    title: string;
    message: string;
    metadata: {
        courseCode: string;
        sectionCode: string;
    };
};
export declare const examPublishedNotification: (courseCode: string, examTitle: string) => {
    type: "EXAM";
    title: string;
    message: string;
    metadata: {
        courseCode: string;
        examTitle: string;
    };
};
export declare const resultPublishedNotification: (courseCode: string, examTitle: string) => {
    type: "RESULT";
    title: string;
    message: string;
    metadata: {
        courseCode: string;
        examTitle: string;
    };
};
export declare const invoiceCreatedNotification: (invoiceNumber: string, amount: string) => {
    type: "INVOICE";
    title: string;
    message: string;
    metadata: {
        invoiceNumber: string;
        amount: string;
    };
};
export declare const paymentSuccessfulNotification: (transactionId: string, amount: string) => {
    type: "PAYMENT";
    title: string;
    message: string;
    metadata: {
        transactionId: string;
        amount: string;
    };
};
export declare const transcriptIssuedNotification: (transcriptNo: string) => {
    type: "TRANSCRIPT";
    title: string;
    message: string;
    metadata: {
        transcriptNo: string;
    };
};
//# sourceMappingURL=notification.templates.d.ts.map