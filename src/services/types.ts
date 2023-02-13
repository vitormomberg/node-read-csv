import type { GetObjectOutput, ObjectList } from "aws-sdk/clients/s3";

export type ParamListBucketFiles = {
  bucketName: string;
};

export type ListBucketFiles = (
  param: ParamListBucketFiles
) => Promise<ObjectList>;

export type ParamGetBucketFile = {
  bucketFileName: string;
  bucketName: string;
};

export type GetBucketFile = (
  param: ParamGetBucketFile
) => Promise<GetObjectOutput>;
