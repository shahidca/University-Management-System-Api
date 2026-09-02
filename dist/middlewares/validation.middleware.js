export const validate = (schema) => {
    return (req, _res, next) => {
        req.body = schema.parse(req.body);
        next();
    };
};
//# sourceMappingURL=validation.middleware.js.map