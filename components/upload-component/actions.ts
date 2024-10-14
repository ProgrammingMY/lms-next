"use server";

import { createClient } from "@/utils/supabase/server";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const generateFileName = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export interface signedURLParams {
  status: string;
  data: {
    file: File | null;
    url: string;
  }[];
  message: string;
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

async function uploadFileToS3(file: File, filename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const params = {
    Bucket: process.env.CF_BUCKET_NAME as string,
    Key: `${filename}`,
    Body: buffer,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading file to S3");
  }
}

export const uploadFileAction = async (prevState: any, formData: FormData) => {
  try {
    const files = formData.getAll("file");
    const uploadedFiles = [];

    if (!files) {
      return { status: "error", message: "No attachment provided" };
    }

    for (const file of files as File[]) {
      const response = await uploadFileToS3(file, file.name);
      if (response.$metadata.httpStatusCode !== 200) {
        continue;
      }

      uploadedFiles.push(file.name);
    }
    return { status: "success", message: "File uploaded successfully" };
  } catch (error) {
    return { status: "error", message: "Something went wrong" };
  }
};

export async function getURL(formData: FormData) {
  // accepted types

  const files = formData.getAll("file") as File[];

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return JSON.stringify({
      status: "error",
      data: [],
      message: "Something went wrong",
    });
  }

  try {
    let signedURLs = [];

    signedURLs = await Promise.all(
      files.map(async (file: File) => {
        const params: PutObjectCommandInput = {
          Bucket: process.env.CF_BUCKET_NAME as string,
          Key: generateFileName(),
          ContentType: file.type,
          ContentLength: file.size,
          Metadata: {
            userId: user.id,
          },
        };

        const command = new PutObjectCommand({ ...params, ACL: "public-read" });

        const signedURL = await getSignedUrl(s3Client, command, {
          expiresIn: 60, // 60 seconds
        });

        return {
          file,
          url: signedURL,
        };
      })
    );

    return JSON.stringify({
      status: "success",
      data: [...signedURLs],
      message: "File uploaded successfully",
    });
  } catch (error) {
    return JSON.stringify({
      status: "error",
      data: [],
      message: "Something went wrong",
    });
  }
}
