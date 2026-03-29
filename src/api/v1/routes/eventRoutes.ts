import express from "express";
import { validateRequest } from "../middleware/eventMiddleware";
import * as eventController from "../controllers/eventController";
import { postSchemas } from "../validation/eventValidation";

const router = express.Router();


// Create post(POST) - validates body only
/**
 * @openapi
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: General Meeting
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Event data is ISO format and must be greater than now
 *                 example: 2025-12-31T23:59:59Z
 *               capacity:
 *                 type: integer
 *                 minimum: 5
 *                 default: 5
 *                 example: 100
 *               registrationCount:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: cannot exceed ref:capacity
 *                 maximum: ref:capacity
 *                 example: 50
 *               status:
 *                 type: string
 *                 enum: [active, cancelled, completed]
 *                 default: active
 *               category:
 *                 type: string
 *                 enum: [conference, workshop, meetup, seminar, general]
 *                 default: general
 *     responses:
 *       '201':
 *         description: event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 */
router.post("/events", validateRequest(postSchemas.create), eventController.createEvent);

// Get all post - validates params and optional query
/**
 * @openapi
 * /events:
 *   get:
 *     summary: Retrieve all events
 *     tags: [Events]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/events'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 */
router.get("/events", validateRequest(postSchemas.getById), eventController.getAllEvent);

// Get single post - validates params and optional query
/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Retrieve a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/events'
 *       '404':
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 */
router.get("/events/:id", validateRequest(postSchemas.getById), eventController.getEventById);

// Update Put - validates both params and body
/**
 * @openapi
 * /events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the event to update
 *       example: 64b8f0c2e1d2c3a4b5c6d7e8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: Conference meeting 2026
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Event data is ISO format and must be greater than now
 *                 example: 2025-12-31T23:59:59Z
 *               capacity:
 *                 type: integer
 *                 minimum: 5
 *                 default: 5
 *                 example: 100
 *               registrationCount:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 description: cannot exceed ref:capacity
 *                 maximum: ref:capacity
 *                 example: 50
 *               status:
 *                 type: string
 *                 enum: [active, cancelled, completed]
 *                 default: active
 *               category:
 *                 type: string
 *                 enum: [conference, workshop, meetup, seminar, general]
 *                 default: general
 *     responses:
 *       '200':
 *         description: event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 *       '404':
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 */
router.put("/events/:id", validateRequest(postSchemas.update), eventController.updateEvent);

// Delete post - validates params only
/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     summary: Delete an existing event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/events'
 *       '404':
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/events'
 */
router.delete("/events/:id", validateRequest(postSchemas.delete), eventController.deleteEvent);

export default router;