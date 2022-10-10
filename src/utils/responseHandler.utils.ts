require("dotenv").config();
import { configureDataInput } from "../interfaces/response.interface";
import helper from "./helper.utils";
class ResponseHandler {
  public static success({ res, status = 200, message = "Ok", data = null }: configureDataInput) {
    return helper.buildSuccessResponse({ res, status, message, data });
  }

  public static created({ res, status = 201, message = "Created", data }: configureDataInput) {
    return helper.buildSuccessResponse({ res, status, message, data });
  }

  public static notFound({ res, status = 404, error = "Not found" }: configureDataInput) {
    return helper.buildErrorResponse({ res, status, error });
  }

  public static badRequest({ res, status = 400, error = "Bad request" }: configureDataInput) {
    return helper.buildErrorResponse({ res, status, error });
  }

  public static unAuthorized({ res, status = 401, error = "Unauthorized" }: configureDataInput) {
    return helper.buildErrorResponse({ res, status, error });
  }

  public static fatalError({ res, status = 500, error = "Internal server error" }: configureDataInput) {
    return helper.buildErrorResponse({ res, status, error });
  }
}

export default ResponseHandler;
