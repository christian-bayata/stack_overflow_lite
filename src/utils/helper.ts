import CryptoJS from "crypto-js";
import { configureDataInput } from "../interfaces/response.interface";

const formatUserData = (data: string) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), "!@#109Tyuuryfqowp085rjf{}[])_+.//||").toString();
  return ciphertext;
};

const statusCodes = 200 | 201 | 400 | 401 | 404 | 500;

const buildSuccessResponse = (options: configureDataInput) => {
  const { res, data, message, status = statusCodes } = options;

  return res.status(status).json({ success: true, message, data });
};

const buildErrorResponse = (options: configureDataInput) => {
  const { res, error, status = statusCodes } = options;

  return res.status(status).json({ success: false, error });
};

export default {
  formatUserData,
  buildSuccessResponse,
  buildErrorResponse,
};
