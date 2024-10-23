"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface returnDownloadProps {
  status: string;
  message: string;
  data: string;
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY as string,
    secretAccessKey: process.env.R2_SECRET_KEY as string,
  },
  forcePathStyle: true,
});

export const getDownloadURL = async (
  fileUrl: string
): Promise<returnDownloadProps> => {
  try {
    const params = new GetObjectCommand({
      Bucket: process.env.CF_BUCKET_NAME as string,
      Key: fileUrl,
    });

    const signedURL = await getSignedUrl(s3Client, params, {
      expiresIn: 60, // 60 seconds
    });

    return {
      status: "200",
      message: "Success",
      data: signedURL,
    };
  } catch (error) {
    return {
      status: "404",
      message: "Something went wrong",
      data: "",
    };
  }
};
