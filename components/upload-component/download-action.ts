"use server";

import { createClient } from "@/utils/supabase/server";
import {
  GetObjectCommand,
  ListObjectsV2CommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/lib/db";
import { MessageCircle } from "lucide-react";
import { Attachment } from "@prisma/client";
import { stat } from "fs";

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
  tableName: "attachments" | "image",
  id: string
) => {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "401",
      message: "Unathorized",
      data: [],
    };
  }

  try {
    const data = await db.attachment.findMany({
      where: {
        courseId: id,
      },
    });

    const signedURL: string[] = [];

    data.map(async (item: Attachment) => {
      const params = new GetObjectCommand({
        Bucket: process.env.CF_BUCKET_NAME as string,
        Key: item.fileName,
      });

      signedURL.push(
        await getSignedUrl(s3Client, params, {
          expiresIn: 60, // 60 seconds
        })
      );
    });

    return {
      status: "200",
      message: "Success",
      data: signedURL,
    };
  } catch (error) {
    return {
      status: "404",
      message: error,
      data: [],
    };
  }
};
