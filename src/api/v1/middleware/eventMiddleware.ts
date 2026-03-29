import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// what parts of the req i want to validate
interface RequestSchemas {
    body?: ObjectSchema;    // request body schema (POST/ events)
    params?: ObjectSchema;  // route params (/events/:id)
    query?: ObjectSchema;   // query string
}

// check if unknow fields are striped
interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

/**
 * Creates an Express middleware function that validates different parts of the request
 * against separate Joi schemas and strips unknown fields appropriately.
 *
 * @param schemas - Object containing separate schemas for body, params, and query
 * @param options - Validation options for stripping behavior
 * @returns Express middleware function that performs the validation
 */
export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
) => {
    // stripParams - Usually don't strip params as they're route-defined
    const defaultOptions = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options,
    };

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // stores all validate error messages
            const errors: string[] = [];

            /**
             * Validates a specific part of the request (body, params, or query) against a Joi schema.
             * Collects validation errors and optionally strips unknown fields from the data.
             *
             * @param schema - Joi schema to validate against
             * @param data - The request data to validate (req.body, req.params, or req.query)
             * @param partName - Name of the request part for error prefixing (e.g., "Body", "Params", "Query")
             * @param shouldStrip - Whether to strip unknown fields from the validated data
             * @returns The original data if validation fails or stripping is disabled, otherwise the stripped/validated data
             */
            const validatePart = (
                schema: ObjectSchema,
                data: any,
                shouldStrip: boolean
            ) => {
                const { error, value } = schema.validate(data, {
                    abortEarly: false,          // collect all errors 
                    stripUnknown: shouldStrip,  // strip undefined fields as necessary
                });

                // returns multiple error details
                // error messages are pushed into errors (array)
                if (error) {
                    errors.push(
                        ...error.details.map(
                            (detail) => `${detail.message}`
                        )
                    );
                // if validation success, return the data whether its striped or not
                } else if (shouldStrip) {
                    return value;
                }
                return data;
            };

            // Validate each request part if body schema is provided
            if (schemas.body) {
                req.body = validatePart(
                    schemas.body,
                    req.body,
                    defaultOptions.stripBody
                );
            }
            // Validate each request part if route schema is provided
            if (schemas.params) {
                req.params = validatePart(
                    schemas.params,
                    req.params,
                    defaultOptions.stripParams
                );
            }
            // Validate each request part if query schema is provided
            if (schemas.query) {
                req.query = validatePart(
                    schemas.query,
                    req.query,
                    defaultOptions.stripQuery
                );
            }

            // If there are any validation errors, return them
            if (errors.length > 0) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    error: `Validation error: ${errors.join(", ")}`,
                });
            }

            next();

        // catch any unexpected runtime error.
        } catch (error: unknown) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: (error as Error).message,
            });
        }
    };
};