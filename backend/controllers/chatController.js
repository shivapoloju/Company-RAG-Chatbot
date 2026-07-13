import axios from "axios";
import Chat from "../models/Chat.js";

// Create a new chat session
export const createSession = async (req, res) => {
  try {
    const chat = await Chat.create({
      user: req.user._id,
      title: "New Chat",
      messages: [],
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ message: "Failed to create chat session" });
  }
};

// List all chat sessions (metadata only)
export const listSessions = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("title updatedAt createdAt")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error listing chat sessions:", error);
    res.status(500).json({ message: "Failed to load chat sessions" });
  }
};

// Get detailed message history for a specific session
export const getSession = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });

    if (!chat) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error getting chat session:", error);
    res.status(500).json({ message: "Failed to load chat history" });
  }
};

// Delete a chat session
export const deleteSession = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    res.status(200).json({ message: "Chat session deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    res.status(500).json({ message: "Failed to delete chat session" });
  }
};

// Add messages (User question and AI answer) to session
export const addMessage = async (req, res) => {
  try {
    const { question } = req.body;
    const { id } = req.params;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // Find the session
    const chat = await Chat.findOne({ _id: id, user: req.user._id });
    if (!chat) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // Call Python AI backend for answer & sources
    let answer = "I encountered an issue communicating with the AI service.";
    let sources = [];

    try {
      const pythonRes = await axios.post(`${process.env.PYTHON_API}/ask`, {
        question,
        chatId: id,
      });
      answer = pythonRes.data.answer;
      sources = pythonRes.data.sources || [];
    } catch (error) {
      console.error("Error calling Python AI ask endpoint:", error.message);
    }

    // Create user message object
    const userMsg = {
      type: "user",
      text: question,
      sources: [],
    };

    // Create AI message object
    const aiMsg = {
      type: "ai",
      text: answer,
      sources: sources,
    };

    // Add both to messages array
    chat.messages.push(userMsg);
    chat.messages.push(aiMsg);

    // If it's a new chat, auto-update the title based on the first question
    if (chat.title === "New Chat" && chat.messages.length <= 2) {
      const cleanedTitle = question.trim().substring(0, 30);
      chat.title = cleanedTitle.length >= 30 ? `${cleanedTitle}...` : cleanedTitle;
    }

    await chat.save();

    res.status(200).json({
      chatId: chat._id,
      title: chat.title,
      messages: chat.messages.slice(-2), // return only the two newly created messages
    });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to post message" });
  }
};
