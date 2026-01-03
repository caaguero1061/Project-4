import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Topic = mongoose.model("Topic", topicSchema);
