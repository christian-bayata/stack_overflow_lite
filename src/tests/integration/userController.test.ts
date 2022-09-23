import { setup as setupApplication } from "../../app";
export const app = setupApplication();
import request from "supertest";
import models from "../../models/index";
import crypto from "crypto";

describe("User Resource", () => {
  let server: any;
  let port = process.env.TEST_PORT;
  let BASE_URL = "/api/users";

  const setupTestServer = () => {
    return app.listen(port, () => console.log(`Listening on testing port ${port}`));
  };

  beforeEach(() => {
    server = setupTestServer();
    //await models.User.truncate({ force: true });
  });

  afterEach(async () => {
    server.close();
    await models.Code.truncate({ force: true });
    await models.User.truncate({ force: true });
  });

  describe("Health Check", () => {
    it("should check for the health of the API", async () => {
      const response = await request(server).get("/health-check");
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/welcome/i);
    });
  });

  describe("User Verification Code", () => {
    it("should fail if user email already exists", async () => {
      await models.User.create({ firstName: "test_first", lastName: "test_last", email: "test_email@gmail.com", password: "password", reputation: 0, address: "test_address", phone: "098765432345", city: "test_city", state: "test_state", userTypes: "user" });
      const createVerCode = await models.Code.create({ email: "test_email@gmail.com", code: crypto.randomBytes(3).toString("hex").toUpperCase() });

      const response = await request(server).post(`${BASE_URL}/get-verification-code`).send(createVerCode);
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/have an account/i);
      expect(response.body.success).toBeFalsy();
    });
  });
});
