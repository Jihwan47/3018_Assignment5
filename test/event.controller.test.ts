import { Request, Response, NextFunction } from "express";
import * as eventController from "../src/api/v1/controllers/eventController"; // controller 경로 주의
import * as eventService from "../src/api/v1/services/eventService";
import { Event, Status, Category } from "../src/api/v1/models/postModel";

jest.mock("../src/api/v1/services/eventService");

describe("Event Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  // ----------------------
  // CREATE EVENT
  // ----------------------
  describe("createEvent", () => {
    it("should return created event", async () => {
      const mockEvent: Event = { id: "evt_000001", name: "E1", date: new Date(), capacity: 5, registrationCount: 0, status: Status.active, category: Category.general, createdAt: new Date(), updatedAt: new Date() };
      (eventService.createEvent as jest.Mock).mockResolvedValue(mockEvent);
      mockReq.body = { name: "E1", date: new Date(), capacity: 5 };

      await eventController.createEvent(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockEvent }));
    });

    it("should call next with error if service fails", async () => {
      const err = new Error("Service Error");
      (eventService.createEvent as jest.Mock).mockRejectedValue(err);
      mockReq.body = { name: "E1", date: new Date(), capacity: 5 };

      await eventController.createEvent(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(err);
    });
  });

  // ----------------------
  // GET ALL EVENTS
  // ----------------------
  describe("getAllEvent", () => {
    it("should return all events", async () => {
      const events: Event[] = [{ id: "1", name: "E1", date: new Date(), capacity: 5, registrationCount: 0, status: Status.active, category: Category.general, createdAt: new Date(), updatedAt: new Date() }];
      (eventService.getAllEvents as jest.Mock).mockResolvedValue(events);

      await eventController.getAllEvent(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: events }));
    });

    it("should call next with error if service fails", async () => {
      const err = new Error("GetAll Failed");
      (eventService.getAllEvents as jest.Mock).mockRejectedValue(err);

      await eventController.getAllEvent(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(err);
    });
  });

  // ----------------------
  // GET BY ID
  // ----------------------
  describe("getEventById", () => {
    it("should return event by id", async () => {
      const mockEvent: Event = { id: "evt1", name: "E1", date: new Date(), capacity: 5, registrationCount: 0, status: Status.active, category: Category.general, createdAt: new Date(), updatedAt: new Date() };
      (eventService.getEventById as jest.Mock).mockResolvedValue(mockEvent);
      mockReq.params = { id: "evt1" };

      await eventController.getEventById(mockReq as Request, mockRes as Response, mockNext);

      expect(eventService.getEventById).toHaveBeenCalledWith("evt1");
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockEvent }));
    });

    it("should call next with error if id invalid", async () => {
      const err = new Error("Invalid ID");
      (eventService.getEventById as jest.Mock).mockRejectedValue(err);
      mockReq.params = { id: "wrongId" };

      await eventController.getEventById(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(err);
    });
  });

  // ----------------------
  // UPDATE EVENT
  // ----------------------
  describe("updateEvent", () => {
    it("should update event successfully", async () => {
      const updated: Event = { id: "evt1", name: "Updated", date: new Date(), capacity: 10, registrationCount: 0, status: Status.active, category: Category.general, createdAt: new Date(), updatedAt: new Date() };
      (eventService.updateEvent as jest.Mock).mockResolvedValue(updated);
      mockReq.params = { id: "evt1" };
      mockReq.body = { name: "Updated", capacity: 10 };

      await eventController.updateEvent(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: updated }));
    });

    it("should call next with error if update fails", async () => {
      const err = new Error("Update failed");
      (eventService.updateEvent as jest.Mock).mockRejectedValue(err);
      mockReq.params = { id: "evt1" };
      mockReq.body = { name: "Updated" };

      await eventController.updateEvent(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(err);
    });
  });

  // ----------------------
  // DELETE EVENT
  // ----------------------
  describe("deleteEvent", () => {
    it("should delete event successfully", async () => {
      (eventService.deleteEvent as jest.Mock).mockResolvedValue(undefined);
      mockReq.params = { id: "evt1" };

      await eventController.deleteEvent(mockReq as Request, mockRes as Response, mockNext);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: undefined }));
    });

    it("should call next with error if delete fails", async () => {
      const err = new Error("Delete failed");
      (eventService.deleteEvent as jest.Mock).mockRejectedValue(err);
      mockReq.params = { id: "evt1" };

      await eventController.deleteEvent(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(err);
    });
  });
});
