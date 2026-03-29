import { postSchemas } from "../src/api/v1/validation/eventValidation";
import { Status, Category } from "../src/api/v1/models/postModel";

describe("Create Event Validation Schema", () => {
  const schema = postSchemas.create.body;

  const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 항상 미래 날짜

  it("should fail when 'name' is missing", () => {
    // Arrange
    const payload = { date: futureDate, capacity: 10 };
    // Act
    const { error } = schema.validate(payload);
    // Assert
    expect(error?.message).toContain('"name" is required');
  });

  it("should fail when 'name' is less than 3 characters", () => {
    // Arrange
    const payload = { name: "ab", date: futureDate, capacity: 10 };
    // Act
    const { error } = schema.validate(payload);
    // Assert
    expect(error?.message).toContain('"name" length must be at least 3 characters long');
  });

  it("should fail when 'date' is in the past", () => {
    // Arrange
    const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const payload = { name: "Valid Name", date: pastDate, capacity: 10 };
    // Act
    const { error } = schema.validate(payload);
    // Assert
    expect(error?.message).toContain('"date" must be greater than now');
  });

  it("should fail when 'capacity' is less than 5", () => {
    // Arrange
    const payload = { name: "Valid Name", date: futureDate, capacity: 3 };
    // Act
    const { error } = schema.validate(payload);
    // Assert
    expect(error?.message).toContain('"capacity" must be greater than or equal to 5');
  });

  it("should fail when 'registrationCount' exceeds 'capacity'", () => {
    // Arrange
    const payload = { name: "Valid Name", date: futureDate, capacity: 5, registrationCount: 10 };
    // Act
    const { error } = schema.validate(payload);
    // Assert
    expect(error?.message).toContain('"registrationCount" must be less than or equal to ref:capacity');
  });

  it("should fail when 'status' is invalid", () => {
    // Arrange
    const payload = { name: "Valid Name", date: futureDate, capacity: 5, status: "pending" };
    // Act
    const { error } = schema.validate(payload);
    // Assert
    expect(error?.message).toContain('"status" must be one of [active, cancelled, completed]');
  });

  it("should fail when 'category' is invalid", () => {
    // Arrange
    const payload = { name: "Valid Name", date: futureDate, capacity: 5, category: "party" };
    // Act
    const { error } = schema.validate(payload);
    // Assert
    expect(error?.message).toContain('"category" must be one of [conference, workshop, meetup, seminar, general]');
  });

  it("should pass with all valid fields", () => {
    // Arrange
    const payload = { 
      name: "Valid Event", 
      date: futureDate,
      capacity: 10,
      registrationCount: 5,
      status: Status.active,   // enum 사용
      category: Category.workshop // enum 사용
    };
    // Act
    const { error, value } = schema.validate(payload);
    // Assert
    expect(error).toBeUndefined();
    expect(value.name).toBe("Valid Event");
  });
});
