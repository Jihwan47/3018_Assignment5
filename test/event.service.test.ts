import * as eventService from "../src/api/v1/services/eventService";
import * as eventRepository from "../src/api/v1/repositories/eventRepository";
import { Event, CreateEventRequest, Status, Category } from "../src/api/v1/models/postModel";

jest.mock("../src/api/v1/repositories/eventRepository"); // repository mock

describe("Event Service Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------
  // CREATE EVENT
  // --------------------------
  describe("createEvent", () => {
    it("should create an event and return formatted Event", async () => {
      // Arrange
      const mockEvent: Partial<Event> = {
        name: "Test Event",
        date: new Date(),
        capacity: 10,
        registrationCount: 0,
        status: Status.active,
        category: Category.general,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (eventRepository.createDocument as jest.Mock).mockResolvedValue("doc123");
      (eventRepository.getDocuments as jest.Mock).mockResolvedValue({ size: 0 });
      (eventRepository.getDocumentById as jest.Mock).mockResolvedValue({
        id: "doc123",
        data: () => mockEvent
      });

      const input: CreateEventRequest = {
        name: "Test Event",
        date: new Date(),
        capacity: 10
      };

      // Act
      const result = await eventService.createEvent(input);

      // Assert
      expect(result.id).toBe("evt_000001");
      expect(result.name).toBe("Test Event");
      expect(eventRepository.createDocument).toHaveBeenCalledTimes(1);
    });

    it("should throw error if repository fails", async () => {
      // Arrange
      (eventRepository.createDocument as jest.Mock).mockRejectedValue(new Error("Firestore error"));

      // Act & Assert
      await expect(eventService.createEvent({ name: "Fail Event", date: new Date(), capacity: 10 }))
        .rejects
        .toThrow("Firestore error");
    });
  });

  // --------------------------
  // GET ALL EVENTS
  // --------------------------
  describe("getAllEvents", () => {
    it("should return an array of events", async () => {
      // Arrange
      const mockDocs = [{ data: () => ({ name: "E1", capacity: 5 }) }];
      (eventRepository.getDocuments as jest.Mock).mockResolvedValue({ docs: mockDocs });

      // Act
      const result = await eventService.getAllEvents();

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("E1");
    });

    it("should return empty array if no events", async () => {
      // Arrange
      (eventRepository.getDocuments as jest.Mock).mockResolvedValue({ docs: [] });

      // Act
      const result = await eventService.getAllEvents();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // --------------------------
  // GET EVENT BY ID
  // --------------------------
  describe("getEventById", () => {
    it("should return event if id exists", async () => {
      // Arrange
      const mockDoc = {
        id: "doc123",
        data: () => ({
          name: "E1",
          capacity: 5,
          date: new Date(),
          status: Status.active,
          category: Category.general,
          registrationCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };
      (eventRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

      // Act
      const result = await eventService.getEventById("doc123");

      // Assert
      expect(result?.id).toBe("doc123");
      expect(result?.name).toBe("E1");
    });

    it("should throw error if id does not exist", async () => {
      // Arrange
      (eventRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(eventService.getEventById("wrongId")).rejects.toThrow("Id is invalid");
    });
  });

  // --------------------------
  // UPDATE EVENT
  // --------------------------
  describe("updateEvent", () => {
    it("should update an event and merge data", async () => {
      // Arrange
      const mockExisting: Event = {
        id: "doc1",
        name: "Old",
        date: new Date(),
        capacity: 5,
        registrationCount: 0,
        status: Status.active,
        category: Category.general,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (eventService.getEventById as jest.Mock) = jest.fn().mockResolvedValue(mockExisting);
      (eventRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);

      const updatedData: Omit<Event, "id" | "createdAt"> = {
        name: "Updated",
        capacity: 10,
        date: new Date(),
        registrationCount: 0,
        status: Status.active,
        category: Category.general,
        updatedAt: new Date()
      };

      // Act
      const result = await eventService.updateEvent("doc1", updatedData);

      // Assert
      expect(result.name).toBe("Updated");
      expect(result.capacity).toBe(10);
      expect(eventRepository.updateDocument).toHaveBeenCalledTimes(1);
    });

    it("should throw error if event id does not exist", async () => {
      // Arrange
      (eventService.getEventById as jest.Mock) = jest.fn().mockRejectedValue(new Error("Id is invalid"));

      // Act & Assert
      await expect(eventService.updateEvent("wrongId", {} as any)).rejects.toThrow("Id is invalid");
    });
  });

  // --------------------------
  // DELETE EVENT
  // --------------------------
  describe("deleteEvent", () => {
    it("should delete event successfully", async () => {
      // Arrange
      const mockDoc: Event = {
        id: "doc1",
        name: "Event to Delete",
        date: new Date(),
        capacity: 5,
        registrationCount: 0,
        status: Status.active,
        category: Category.general,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (eventService.getEventById as jest.Mock) = jest.fn().mockResolvedValue(mockDoc);
      (eventRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

      // Act
      await eventService.deleteEvent("doc1");

      // Assert
      expect(eventRepository.deleteDocument).toHaveBeenCalledWith("events", "doc1");
    });

    it("should throw error if id does not exist", async () => {
      // Arrange
      (eventService.getEventById as jest.Mock) = jest.fn().mockRejectedValue(new Error("Id is invalid"));

      // Act & Assert
      await expect(eventService.deleteEvent("wrongId")).rejects.toThrow("Id is invalid");
    });
  });
});
