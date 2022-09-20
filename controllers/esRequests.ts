import { Request, Response } from "express";
import ResponseHandler from "../utils/responseHandler";
import { esClient } from "../config/esClientConfig";
import { ClientIndexDocType } from "../types/config.types";

/**
 *
 *@param req
 *@param res
 * @returns Returns the created elastic search index
 */
const createESIndex = async (req: Request, res: Response) => {
  try {
    await esClient.indices.create({ index: req.body.index });
    return ResponseHandler.success({ res, message: "Elastic Search Index created" });
  } catch (error: any) {
    return ResponseHandler.fatalError({ res, error });
  }
};

/**
 *
 * @param req
 * @param res
 * @returns Returns the result of the operation
 */
const esCreateUsers = async (req: Request, res: Response) => {
  const { op_type } = req.query;
  const { id, firstName, lastName, email } = req.body;

  if (!op_type) return ResponseHandler.badRequest({ res, error: "Please provide the operation type" });

  const data = { id, firstName, lastName, email };

  try {
    const result = await esClient.index({
      index: process.env.ES_CLIENT_INDEX,
      document: data,
    } as ClientIndexDocType);

    return ResponseHandler.success({ res, message: `Document successfully inserted into index`, data: result });
  } catch (error: any) {
    return ResponseHandler.fatalError({ res, error });
  }
};

export default { esCreateUsers, createESIndex };
