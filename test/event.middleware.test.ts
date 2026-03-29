import { postSchemas } from "../src/api/v1/validation/eventValidation";
import { validateRequest } from "../src/api/v1/middleware/eventMiddleware";
import { Request, Response, NextFunction } from "express";
import { Status, Category } from "../src/api/v1/models/postModel";

describe("ValidateRequest Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();
  });

  // ----------------------
  // CREATE EVENT
  // ----------------------
  it("should call next() for valid payload", () => {
    mockReq.body = { 
      name: "Valid Event", 
      date: new Date(Date.now() + 3600000).toISOString(), 
      capacity: 10, 
      registrationCount: 0, 
      status: Status.active, 
      category: Category.general 
    };

    const middleware = validateRequest({ body: postSchemas.create.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should return 400 if name missing", () => {
    mockReq.body = { date: new Date().toISOString(), capacity: 10 };
    const middleware = validateRequest({ body: postSchemas.create.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 400 if date invalid", () => {
    mockReq.body = { name: "E1", date: "abc", capacity: 5 };
    const middleware = validateRequest({ body: postSchemas.create.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if capacity < 5", () => {
    mockReq.body = { name: "E1", date: new Date().toISOString(), capacity: 3 };
    const middleware = validateRequest({ body: postSchemas.create.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if registrationCount > capacity", () => {
    mockReq.body = { name: "E1", date: new Date().toISOString(), capacity: 5, registrationCount: 10 };
    const middleware = validateRequest({ body: postSchemas.create.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if status invalid", () => {
    mockReq.body = { name: "E1", date: new Date().toISOString(), capacity: 5, status: "pending" };
    const middleware = validateRequest({ body: postSchemas.create.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if category invalid", () => {
    mockReq.body = { name: "E1", date: new Date().toISOString(), capacity: 5, category: "party" };
    const middleware = validateRequest({ body: postSchemas.create.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  // ----------------------
  // UPDATE EVENT
  // ----------------------
  it("should call next() for valid update payload", () => {
    mockReq.body = { name: "Updated Event", capacity: 10 };

    const middleware = validateRequest({ body: postSchemas.update.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should fail if update payload name missing", () => {
    mockReq.body = { capacity: 10 };
    const middleware = validateRequest({ body: postSchemas.update.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should fail if update payload registrationCount exceeds capacity", () => {
    mockReq.body = { name: "E1", capacity: 5, registrationCount: 10 };
    const middleware = validateRequest({ body: postSchemas.update.body });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
