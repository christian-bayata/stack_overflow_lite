import { Client } from "@elastic/elasticsearch";
import { ESClientCloud } from "../types/config.types";

/* Initialize the elastic client cloud */
export const esClient = new Client({
  cloud: {
    id: process.env.ES_CLOUD_ID,
  },
  auth: {
    username: process.env.ES_USER,
    password: process.env.ES_PASS,
  },
} as ESClientCloud);
