// pages/api/uploadFile.ts
import { NextApiRequest, NextApiResponse } from "next";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const apiKey = process.env.API_KEY!;
const fileManager = new GoogleAIFileManager(apiKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { file, mimeType, displayName } = req.body;

      if (!file || !mimeType || !displayName) {
        return res.status(400).json({ error: "Missing file, mimeType, or displayName" });
      }

      const uploadResponse = await fileManager.uploadFile(file, {
        mimeType,
        displayName,
      });

      return res.status(200).json({ fileUri: uploadResponse.file.uri });
    } catch (error) {
      console.error("File upload error:", error);
      return res.status(500).json({ error: "Failed to upload file" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
