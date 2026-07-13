import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sources: [
    {
      file: { type: String },
      page: { type: Number },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "New Chat",
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", chatSchema);
