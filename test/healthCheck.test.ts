// import supertest
import request, { Response } from "supertest";
// import app
import app from "../src/app";

// Testing health check endpoint
describe("GET /api/v1/health", () => {
    it("should return server health status", async () => {
        // Act: make the get request to the API
        const response: Response = await request(app).get("/api/v1/health");

        // Assert: verify the API response
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
        expect(response.body).toHaveProperty("uptime");
        expect(response.body).toHaveProperty("timestamp");
        expect(response.body).toHaveProperty("version");
    });
});