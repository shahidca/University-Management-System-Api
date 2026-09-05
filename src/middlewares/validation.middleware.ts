import type {
  RequestHandler,
} from "express";
import type {
  ZodType,
} from "zod";

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export const validate = (
  schema: ZodType,
): RequestHandler => {
  return (req, _res, next) => {
    req.body = schema.parse(
      req.body,
    );

    next();
  };
};

export const validateRequest = (
  schemas: ValidationSchemas,
): RequestHandler => {
  return (req, _res, next) => {
    if (schemas.body) {
      req.body = schemas.body.parse(
        req.body,
      );
    }

    if (schemas.query) {
      const parsedQuery =
        schemas.query.parse(
          req.query,
        );

      Object.assign(
        req.query,
        parsedQuery,
      );
    }

    if (schemas.params) {
      const parsedParams =
        schemas.params.parse(
          req.params,
        );

      Object.assign(
        req.params,
        parsedParams,
      );
    }

    next();
  };
};