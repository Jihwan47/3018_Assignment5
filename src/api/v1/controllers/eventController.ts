import { NextFunction, Request, Response } from "express";
import { successResponse } from "../models/responseModel";
import * as eventService from "../services/eventService"

/**
 * GET /api/v1/events
 * Retrieve all events in the database
 * validate required fields
 */
export const getAllEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get all events
        const event = await eventService.getAllEvents();
        // count the number of events in the database
        const totalCount = event.length;
        res.status(200).json(successResponse(event, "Succesfully retreived", totalCount));
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * GET /api/v1/events/:id
 * retreive a specific events by its id
 */
export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = String(req.params.id);
        const event = await eventService.getEventById(id);

        res.status(200).json(successResponse(event, "Event retrieved successfully"));
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * POST /api/v1/events
 * create a new event
 */
export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(201).json(successResponse(event, "Event created succesfully"));
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * PUT /api/v1/events/:id
 * update a specific event by its id
 */
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = String(req.params.id);

        const event = await eventService.updateEvent(id, req.body);
        res.status(200).json(successResponse(event, "Event updated succesfully"));
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * DELETE /api/v1/events/:id
 * delete a specific event by its id
 */
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = String(req.params.id);

        const event = await eventService.deleteEvent(id);
        res.status(200).json(successResponse(event, "Event deleted succesfully"));
    } catch (error: unknown) {
        next(error);
    }
};
