export const validate = (schema) => {
    return (req, _res, next) => {
        req.body = schema.parse(req.body);
        next();
    };
};
export const validateRequest = (schemas) => {
    return (req, _res, next) => {
        if (schemas.body) {
            req.body = schemas.body.parse(req.body);
        }
        if (schemas.query) {
            const parsedQuery = schemas.query.parse(req.query);
            Object.assign(req.query, parsedQuery);
        }
        if (schemas.params) {
            const parsedParams = schemas.params.parse(req.params);
            Object.assign(req.params, parsedParams);
        }
        next();
    };
};
//# sourceMappingURL=validation.middleware.js.map