import { setup as setupApplication } from "../../app";
export const app = setupApplication();
import request from "supertest";

describe("User Resource", () => {
  let server: any;
  let port = process.env.TEST_PORT;

  const setupTestServer = () => {
    return app.listen(port, () => console.log(`Listening on testing port ${port}`));
  };

  beforeEach(() => {
    server = setupTestServer();
    //await models.User.truncate({ force: true });
  });

  afterEach(async () => {
    server.close();
  });

  describe("Health Check", () => {
    it("should check for the health of the API", async () => {
      const response = await request(server).get("/health-check");
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/welcome/i);
    });
  });

  // describe("User should get verification code ");
});
