import AWS from "aws-sdk";
import type { GetBucketFile, ListBucketFiles } from "./types";

export const listBucketFiles: ListBucketFiles = async ({ bucketName }) => {
  console.time("s3-list-bucket");

  const s3 = new AWS.S3({
    s3ForcePathStyle: true,
  });

  const bucketFiles = await s3.listObjects({ Bucket: bucketName }).promise();

  console.log(JSON.stringify(bucketFiles));
  console.timeEnd("s3-list-bucket");

  return bucketFiles.Contents || [];
};

export const getBucketFile: GetBucketFile = async ({
  bucketFileName,
  bucketName,
}) => {
  console.time("s3-get-objet");

  const s3 = new AWS.S3({
    s3ForcePathStyle: true,
    maxRetries: 0,
  });

  const bucketFile = await s3
    .getObject({ Bucket: bucketName, Key: bucketFileName })
    .promise();

  console.log(`Leu ${bucketFileName}`);
  console.timeEnd("s3-get-objet");

  return bucketFile;
};

// {
//   IsTruncated: false,
//   Marker: '',
//   Contents: [
//     {
//       Key: '1.csv',
//       LastModified: 2023-02-11T13:38:10.000Z,
//       ETag: '"7035129c04c848f965638e0834c68bdf-2"',
//       ChecksumAlgorithm: [],
//       Size: 16473716,
//       StorageClass: 'STANDARD',
//       Owner: [Object]
//     },
//     {
//       Key: '10.csv',
//       LastModified: 2023-02-11T13:37:57.000Z,
//       ETag: '"7035129c04c848f965638e0834c68bdf-2"',
//       ChecksumAlgorithm: [],
//       Size: 16473716,
//       StorageClass: 'STANDARD',
//       Owner: [Object]
//     },
//   ],
//   Name: 'entrada',
//   MaxKeys: 1000,
//   CommonPrefixes: []
// }
