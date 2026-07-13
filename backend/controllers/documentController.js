import Document from "../models/Document.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const document = await Document.create({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.user._id,
      chat: req.body.chatId || null,
      status: "uploaded",
    });

    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const pythonRes = await axios.post(
        `${process.env.PYTHON_API}/ingest`,
        formData,
        {
          params: {
            chatId: req.body.chatId,
          },
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      document.status = "indexed";
      await document.save();

      res.status(201).json({
        message: "Document uploaded and indexed successfully",
        document,
        pythonData: pythonRes.data,
      });
    } catch (ingestError) {
      console.error("Python AI Ingestion Failed:", ingestError.message);
      
      document.status = "failed_ingest";
      await document.save();

      res.status(201).json({
        message: "Document uploaded but ingestion failed",
        document,
        error: ingestError.message,
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Upload failed",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const getChatDocuments = async (req, res) => {
  try {
    const { chatId } = req.params;

    const documents = await Document.find({
      chat: chatId,
      uploadedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error getting chat documents:", error);
    res.status(500).json({
      message: "Failed to load documents for this chat session",
    });
  }
};