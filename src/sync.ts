import { parse } from "csv-parse/sync";
import { getBucketFile, listBucketFiles } from "./services/s3";
import {
  BUCKET_NAME,
  DELIMITER,
  EXTENSION,
  HeadersFiles,
  headersFiles,
  PARTITION_KEY,
} from "./constants/headers";

type ItemGroup = {
  key: string;
  value: string;
};

type Item = {
  id: string;
  groups: ItemGroup[];
};

type Line = {
  [PARTITION_KEY]: string;
  [key: string]: string | number | boolean | undefined | null;
};

export const handler = async ({ event }: any): Promise<any> => {
  try {
    console.time();

    const customerId = event?.customerId || "510098";

    const bucketFiles = await listBucketFiles({ bucketName: BUCKET_NAME });

    const item: Item = {
      [PARTITION_KEY]: customerId,
      groups: [],
    };

    for (const bucketFile of bucketFiles) {
      if (!bucketFile.Key) continue;

      const groupName: string = String(bucketFile.Key).replace(EXTENSION, "");

      const fileContent = await getBucketFile({
        bucketFileName: bucketFile.Key,
        bucketName: BUCKET_NAME,
      });

      const headers =
        headersFiles[groupName as keyof HeadersFiles] ||
        headersFiles["default"];

      const records = parse(fileContent.Body as Buffer, {
        delimiter: DELIMITER,
        columns: headers,
        relax_column_count: true,
        on_record: (line: Line) => {
          if (line[PARTITION_KEY] !== customerId) return;

          return line;
        },
      });

      records.forEach((element: Line) => {
        const elementFormatted: ItemGroup = {
          key: groupName,
          value: JSON.stringify({ ...element, [PARTITION_KEY]: undefined }),
        };

        item.groups.push(elementFormatted);
      });
    }

    console.log(item);
    console.timeEnd();
    return item;
  } catch (error) {
    console.log("Error on lambda", error);
    throw error;
  }
};
// handler({ event: { customerId: "510098" } });
