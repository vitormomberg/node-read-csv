import { ColumnOption } from "csv-parse/.";

export const headersFiles: HeadersFiles = {
  ["default"]: ["id", "firstname", "lastname", "profession"],
  "2": ["id", "firstname", "lastname", "profession"],
  "3": ["id", "firstname", "lastname", "profissao"],
  rapido: [
    "id",
    "firstname",
    "lastname",
    "profession",
    "ano",
    "idade",
    "mes",
    "dia",
    "hetero",
  ],
};

export type HeadersFiles = {
  [key: string]: ColumnOption[];
};

export const PARTITION_KEY = "id";

export const BUCKET_NAME = "node-read-csv-entrada";
export const DELIMITER = ";";
export const EXTENSION = ".csv";
