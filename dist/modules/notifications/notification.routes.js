import { Router } from "express";
import { getMyNotificationByIdController, getMyNotificationsController, getMyUnreadCountController, markAllNotificationsAsReadController, markNotificationAsReadController, deleteMyNotificationController, } from "./notification.controller.js";
import { notificationIdParamsSchema, notificationListQuerySchema, } from "./notification.validation.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
const router = Router();
router.get("/", validateRequest({
    query: notificationListQuerySchema,
}), getMyNotificationsController);
router.get("/unread-count", getMyUnreadCountController);
router.patch("/read-all", markAllNotificationsAsReadController);
router.get("/:id", validateRequest({
    params: notificationIdParamsSchema,
}), getMyNotificationByIdController);
router.patch("/:id/read", validateRequest({
    params: notificationIdParamsSchema,
}), markNotificationAsReadController);
router.delete("/:id", validateRequest({
    params: notificationIdParamsSchema,
}), deleteMyNotificationController);
export default router;
//# sourceMappingURL=notification.routes.js.map