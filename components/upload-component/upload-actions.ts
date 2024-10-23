"use server";

import { isTeacher } from "@/lib/teacher";
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

export async function getURL(formData: FormData) {
  // accepted types

  const files = formData.getAll("file") as File[];

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isTeacher(user?.id)) {
    return JSON.stringify({
      status: "error",
      data: [],
      message: "Not authorized",
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
