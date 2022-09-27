import { setup as setupApplication } from "../../app";
import usersQueries from "../../queries/users";
export const app = setupApplication();
import request from "supertest";
import models from "../../models/index";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { UserPayloadWithVerCode, UserSignUpDto } from "../../extensions/dto/users.dto";

jest.setTimeout(10000);

describe("User Resource", () => {
  let server: any;
  let port = process.env.TEST_PORT;
  let BASE_URL = "/api/users";

  const setupTestServer = () => {
    return app.listen(port, () => console.log(`Listening on testing port ${port}`));
  };

  beforeEach(async () => {
    server = setupTestServer();
    await models.Code.truncate({ force: true });
    await models.User.truncate({ force: true });
  });

  afterEach(async () => {
    server.close();
  });

  describe("Health Check", () => {
    it("should check for the health of the API", async () => {
      const response = await request(server).get("/health-check").expect(200);
      expect(response.body).toMatchObject({
        message: "Welcome to stack overflow lite API!",
      });
    });
  });

  /*****************************************************************************************************************************
   *
   **************************************** USER VERIFICATION CODE **********************************
   *
   ******************************************************************************************************************************
   */

  describe("User Verification Code", () => {
    it("should fail if user email already exists", async () => {
      await models.User.create({ firstName: "Samuel", lastName: "Adetula", email: "samueladetula@gmail.com", phone: "08098765432", password: "samuel123", city: "Ogudu", state: "Lagos", userTypes: "user" });

      const payload = { email: "samueladetula@gmail.com" };

      const response = await request(server).post(`${BASE_URL}/get-verification-code`).send(payload).expect(400);
      expect(response.body.success).toMatchObject({
        success: false,
        error: "You already have an account with us",
      });
    });

    it("should fail if email is not provided in the payload ", async () => {
      const payload = { email: "" };

      const response = await request(server).post(`${BASE_URL}/get-verification-code`).send(payload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Please provide email and/or email must be a valid email",
      });
    });

    // TODO .......
    it("should pass if a valid email is sent in the payload", async () => {
      const payload = { email: "samueladetula@gmail.com", code: crypto.randomBytes(3).toString("hex").toUpperCase() };

      const response = await request(server).post(`${BASE_URL}/get-verification-code`).send(payload).expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: "Code successfully sent",
      });
    });
  });

  /*****************************************************************************************************************************
   *
   **************************************** USERS SIGNUP **********************************
   *
   ******************************************************************************************************************************
   */

  describe("User signup", () => {
    let signupPayload: UserPayloadWithVerCode;
    beforeEach(() => {
      signupPayload = {
        firstName: "lkjhgffghj",
        lastName: "kjhgfghjkj",
        email: "kjhgdgfhgjhkjl@gmail.com",
        phone: "08098765432",
        password: bcrypt.hashSync("dfiuoghk123", 10),
        city: "hhfhgjhkjl",
        state: "gfdgfhgjhkjl",
        userTypes: "user",
        verCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
      };
    });

    it("should fail if first name is missing from the payload", async () => {
      signupPayload.firstName = "";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "First name must not be empty and must contain only letters",
      });
    });

    it("should fail if last name is missing from the payload", async () => {
      signupPayload.lastName = "";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Last name must not be empty and must contain only letters",
      });
    });

    it("should fail if email is missing from the payload", async () => {
      signupPayload.email = "";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Email must be a valid email",
      });
    });

    it("should fail if password is missing from the payload", async () => {
      signupPayload.password = "";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Password must be more than 7 characters",
      });
    });

    it("should fail if phone number is missing from the payload", async () => {
      signupPayload.phone = "";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Phone number must be valid",
      });
    });

    it("should fail if phone number is less than 11", async () => {
      signupPayload.phone = "09876678";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Phone number must be valid",
      });
    });

    it("should fail if the city information is not provided", async () => {
      signupPayload.city = "";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "City information must be provided and/or valid",
      });
    });

    it("should fail if the state is not provided", async () => {
      signupPayload.state = "";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "State must be provided and/or valid",
      });
    });

    it("should fail if user does not provide verification code", async () => {
      signupPayload.verCode = "";
      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Please provide your verification code",
      });
    });

    it("should fail if the userTypes is not provided", async () => {
      signupPayload.verCode = crypto.randomBytes(3).toString("hex").toUpperCase();
      signupPayload.userTypes = "";

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Please provide your user type",
      });
    });

    it("should fail if the user email and verification code cannot be found", async () => {
      await models.Code.create({ email: "test_email1@gmail.com", code: "ABCDEF" });

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Invalid verification code or email",
      });
    });

    it("should fail if the user verification code exceeds 30 minutes", async () => {
      const userVerCode = await models.Code.create({ email: "test_email1@gmail.com", code: crypto.randomBytes(3).toString("hex").toUpperCase() });

      const timeDiff = Date.now() - userVerCode.createdAt.getTime();

      if (timeDiff > 30) {
        const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);
        expect(response.body).toMatchObject({
          success: false,
          error: "The verification code has expired, please request another one.",
        });
      }
    });

    it("should fail if the user already exists", async () => {
      await models.User.create({ firstName: "iuytrertyui", lastName: "hgfddfnb", email: "kjhgdgfhgjhkjl@gmail.com", phone: "08098765432", password: bcrypt.hashSync("oiuytsdghjk535", 10), city: "lkjhgffg", state: "jhgfgh", userTypes: "user" });

      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(400);
      expect(response.body).toMatchObject({
        success: false,
        error: "User with this email and/or phone number already exists.",
      });
    });

    it("should pass if the user supplies all the valid signup details", async () => {
      const response = await request(server).post(`${BASE_URL}/signup`).send(signupPayload).expect(200);
      expect(response.body).toMatchObject({
        success: true,
        error: "User successfully created",
      });
    });

    /*****************************************************************************************************************************
     *
     **************************************** USERS LOGIN **********************************
     *
     ******************************************************************************************************************************
     */
  });
});
