import Joi from "joi";

// Post operation schemas organized by request part
export const postSchemas = {
// POST /posts - Create new post
// validate all the require fields when creating
/**
 * @openapi
 * components:
 *   schemas:
 *     events:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: General Meeting
 *         date:
 *           type: string
 *           format: date-time
 *           description: Event data is ISO format and must be greater than now
 *           example: 2025-12-31T23:59:59Z
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           default: 5
 *           example: 100
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           description: cannot exceed ref:capacity
 *           maximum: ref:capacity
 *           example: 50
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           default: active
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           default: general
 */
    create: {
        body: Joi.object({
            name: Joi.string().min(3).required().messages({
                "any.required": '"name" is required',
                "string.empty": '"name" cannot be empty',
                "string.min": '"name" length must be at least 3 characters long',
                "string.base": '"name" must be a string'
            }),

            date: Joi.date().iso().greater('now').default(() => new Date()).messages({
                "date.greater": '"date" must be greater than now',
                "date.format": "'date' must be in ISO format"
            }),

            capacity: Joi.number().integer().min(5).default(5).messages({
                "number.min": '"capacity" must be greater than or equal to 5',
                "number.integer": '"capacity" must be an integer"',
                "number.base": '"capacity" must be a number'
            }),

            registrationCount: Joi.number().integer().min(0).default(0).max(Joi.ref('capacity')).messages({
                "number.max": '"registrationCount" must be less than or equal to ref:capacity',
                "number.min": '"registrationCount" must be greater than 0',
                "number.integer": '"registrationCount" must be an integer',
            }),

            status: Joi.string().valid("active", "cancelled", "completed").default("active").messages({
                "string.valid": '"status" must be one of [active, cancelled, completed]'
            }),

            category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general").default("general").messages({
                "string.valid": '"category" must be one of [conference, workshop, meetup, seminar, general]'
            }),
        }),
    },

// validate all the require fields when updating
    update: {
        body: Joi.object({
            name: Joi.string().min(3).required().messages({
                "any.required": '"name" is required',
                "string.empty": '"name" cannot be empty',
                "string.min": '"name" length must be at least 3 characters long',
                "string.base": '"name" must be a string'
            }),

            date: Joi.date().iso().greater('now').messages({
                "date.greater": '"date" must be greater than now',
                "date.format": "'date' must be in ISO format"
            }),

            capacity: Joi.number().integer().min(5).messages({
                "number.min": '"capacity" must be greater than or equal to 5',
                "number.integer": '"capacity" must be an integer"',
                "number.base": '"capacity" must be a number'
            }),

            registrationCount: Joi.number().integer().min(0).max(Joi.ref('capacity')).messages({
                "number.max": '"registrationCount" must be less than or equal to ref:capacity',
                "number.min": '"registrationCount" must be greater than 0',
                "number.integer": '"registrationCount" must be an integer',
            }),

            status: Joi.string().valid("active", "cancelled", "completed").messages({
                "string.valid": '"status" must be one of [active, cancelled, completed]'
            }),

            category: Joi.string().valid("conference", "workshop", "meetup", "seminar", "general").messages({
                "string.valid": '"category" must be one of [conference, workshop, meetup, seminar, general]'
            }),
        }),
    },
// validate all the require fields when calling an event by its id
// Get single post - validates params and optional query
    getById: {
        body: Joi.object({
            id: Joi.string().required()
        }),
    },

// validate all the require fields when deleting an event by its id
// Delete post - validates params only
    delete: {
        body: Joi.object({
            id: Joi.string().required()
        }),
    },
    
}