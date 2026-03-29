import { postSchemas } from "../src/api/v1/validation/eventValidation";

describe("POST /events validation", () => {
  const schema = postSchemas.create.body;

  // --------------------------
  // VALID CASES
  // --------------------------
  it("should pass validation for a valid event body (video demo)", () => {
    // Arrange
    const validEvent = {
      name: "Tech Conference 2025",
      date: "2026-12-25T09:00:00.000Z",
      capacity: 200,
      registrationCount: 50,
      status: "active",
      category: "conference"
    };

    // Act
    const { error, value } = schema.validate(validEvent);

    // Assert
    expect(error).toBeUndefined();
    expect(value.category).toBe("conference");
  });

  it("Event is successfully created with defaults if optional fields missing", () => {
    // Arrange
    const validEvent = {
      name: "ABC",
      date: "2026-12-25T09:00:00.000Z",
      capacity: 100
    };

    // Act
    const { error, value } = schema.validate(validEvent);

    // Assert
    expect(error).toBeUndefined();
    expect(value.registrationCount).toBe(0); // default
    expect(value.status).toBe("active");     // default
    expect(value.category).toBe("general");  // default
  });

  // --------------------------
  // INVALID CASES
  // --------------------------
  it("should fail if 'name' is missing", () => {
    // Arrange
    const invalidEvent = {
      date: "2026-12-25T09:00:00.000Z",
      capacity: 200
    };

    // Act
    const { error } = schema.validate(invalidEvent);

    // Assert
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"name" is required');
  });

  it("should fail if 'name' length < 3", () => {
    // Arrange
    const invalidEvent = {
      name: "AB",
      date: "2026-12-25T09:00:00.000Z",
      capacity: 200
    };

    // Act
    const { error } = schema.validate(invalidEvent);

    // Assert
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"name" length must be at least 3 characters long');
  });

  it("should fail if 'capacity' < 5", () => {
    // Arrange
    const invalidEvent = {
      name: "Valid Name",
      date: "2026-12-25T09:00:00.000Z",
      capacity: 3
    };

    // Act
    const { error } = schema.validate(invalidEvent);

    // Assert
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"capacity" must be greater than or equal to 5');
  });

  it("should fail if 'capacity' is not integer", () => {
  const invalidEvent = {
    name: "Valid Name",
    date: "2026-12-25T09:00:00.000Z",
    capacity: 50.5
  };

  const { error } = schema.validate(invalidEvent);

  expect(error).toBeDefined();
  expect(error?.details[0].message).toContain('capacity');
  expect(error?.details[0].message).toContain('integer');
});

  it("should fail if 'status' is invalid", () => {
    // Arrange
    const invalidEvent = {
      name: "Valid Name",
      date: "2026-12-25T09:00:00.000Z",
      capacity: 10,
      status: "pending"
    };

    // Act
    const { error } = schema.validate(invalidEvent);

    // Assert
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"status" must be one of [active, cancelled, completed]');
  });

  it("should fail if 'category' is invalid", () => {
    // Arrange
    const invalidEvent = {
      name: "Valid Name",
      date: "2026-12-25T09:00:00.000Z",
      capacity: 10,
      category: "party"
    };

    // Act
    const { error } = schema.validate(invalidEvent);

    // Assert
    expect(error).toBeDefined();
    expect(error?.details[0].message)
      .toBe('"category" must be one of [conference, workshop, meetup, seminar, general]');
  });

  it("should fail if 'registrationCount' exceeds 'capacity'", () => {
    // Arrange
    const invalidEvent = {
      name: "Valid Name",
      date: "2026-12-25T09:00:00.000Z",
      capacity: 5,
      registrationCount: 10
    };

    // Act
    const { error } = schema.validate(invalidEvent);

    // Assert
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"registrationCount" must be less than or equal to ref:capacity');
  });

  it("should fail if 'date' is in the past", () => {
    // Arrange
    const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const invalidEvent = {
      name: "Valid Name",
      date: pastDate,
      capacity: 10
    };

    // Act
    const { error } = schema.validate(invalidEvent);

    // Assert
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"date" must be greater than now');
  });

});
