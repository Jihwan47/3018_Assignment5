import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// GET endpoint to get health status
export const healthCheck = (req: Request, res: Response): void => {
    res.status(HTTP_STATUS.OK).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
};