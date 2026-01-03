import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    answerCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
