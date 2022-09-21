import { Request, Response } from "express";
import ResponseHandler from "../utils/responseHandler";
import { esClient } from "../config/esClientConfig";
import { ClientIndexDocType, ClientSearchDocType } from "../types/config.types";

/**
 *
 * @param req
 * @param res
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

/*****************************************************************************************************************************
 *
 **************************************** ELASTIC SEARCH FOR USERS **********************************
 *
 ******************************************************************************************************************************
 */

/**
 *
 * @param req
 * @param res
 * @returns Returns the result of the created user on elsatic search
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

/**
 *
 * @param req
 * @param res
 * @returns Searches by first and last names and returns the result of the operation
 */
const esSearchUserByName = async (req: Request, res: Response) => {
  const { flag, name } = req.query;

  const validFlags: any = ["first_name", "last_name"];
  if (!validFlags.includes(flag)) return ResponseHandler.badRequest({ res, error: "Please provide a valid flag" });

  try {
    const result =
      flag == "first_name"
        ? await esClient.search({
            index: process.env.ES_CLIENT_INDEX,
            query: { fuzzy: { firstName: name } },
          } as ClientSearchDocType)
        : await esClient.search({
            index: process.env.ES_CLIENT_INDEX,
            query: { fuzzy: { lastName: name } },
          } as ClientSearchDocType);

    return ResponseHandler.success({ res, message: `Document(s) successfully found`, data: result.hits.hits });
  } catch (error: any) {
    return ResponseHandler.fatalError({ res, error });
  }
};

/*****************************************************************************************************************************
 *
 **************************************** ELASTIC SEARCH FOR QUESTIONS **********************************
 *
 ******************************************************************************************************************************
 */

const esCreateQuestion = async (req: Request, res: Response) => {
  const { op_type } = req.query;
  const { id, question } = req.body;

  if (!op_type) return ResponseHandler.badRequest({ res, error: "Please provide the operation type" });

  const data = { id, question };

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

const esSearchQuestion = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const result = await esClient.search({
      index: process.env.ES_CLIENT_INDEX,
      query: { fuzzy: { question: query } },
    } as ClientSearchDocType);

    return ResponseHandler.success({ res, message: `Document(s) successfully found`, data: result.hits.hits });
  } catch (error: any) {
    return ResponseHandler.fatalError({ res, error });
  }
};

export default { createESIndex, esCreateUsers, esSearchUserByName, esCreateQuestion, esSearchQuestion };
