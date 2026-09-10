import { createNotification, } from "./notification.service.js";
export const sendNotification = async (input) => {
    try {
        await createNotification(input);
    }
    catch (error) {
        console.error("Failed to create notification:", error);
    }
};
//# sourceMappingURL=notification.helper.js.map