require("dotenv").config();
import { Response } from "express";

class ResponseHandler {
  public static success({ res, status = 200, message = "Operation successful", data = null }: { res: Response; status?: number; message?: string; data: any }) {
    return res.status(status).json({ success: true, message, data });
  }

  public static created({ res, status = 201, message = "Successfully created" }: { res: Response; status?: number; message?: string }) {
    return res.status(status).json({ success: true, message });
  }

  public static notFound({ res, status = 404, error = "Resource not found" }: { res: Response; status?: number; error?: string }) {
    return res.status(status).json({ success: false, error });
  }

  public static badRequest({ res, status = 400, error = "Operation failed" }: { res: Response; status?: number; error?: string }) {
    return res.status(status).json({ success: false, error });
  }

  public static unAuthorized({ res, status = 401, error = "Unauthorized" }: { res: Response; status?: number; error?: string }) {
    return res.status(status).json({ success: false, error });
  }

  public static fatalError({ res, error }: { res: Response; error?: string }) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export default ResponseHandler;
