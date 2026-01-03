import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import { Question } from "../models/Question.js";
import { Answer } from "../models/Answer.js";

dotenv.config({ path: ".env" });

console.log("ENV CHECK:", {
  hasMongoUri: Boolean(process.env.MONGO_URI),
  port: process.env.PORT
});

async function run() {
  console.log("Connecting to MongoDB...");
  await connectDB(process.env.MONGO_URI);

  console.log("Clearing collections...");
  await Promise.all([
    User.deleteMany({}),
    Topic.deleteMany({}),
    Question.deleteMany({}),
    Answer.deleteMany({})
  ]);

  console.log("Creating users...");
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const [cassy, diego, maria] = await User.insertMany([
    { username: "cassy", email: "cassy@example.com", passwordHash },
    { username: "dev_diego", email: "diego@example.com", passwordHash },
    { username: "mentor_maria", email: "maria@example.com", passwordHash }
  ]);

  console.log("Creating topics...");
  const topics = await Topic.insertMany([
    { category: "Frontend", name: "React", slug: "frontend-react", description: "Hooks, components, state" },
    { category: "Frontend", name: "CSS", slug: "frontend-css", description: "Layouts, grid, responsiveness" },
    { category: "Frontend", name: "JavaScript", slug: "frontend-javascript", description: "Core JS, async, DOM" },
    { category: "Backend", name: "Node/Express", slug: "backend-node-express", description: "APIs, routing, middleware" },
    { category: "Backend", name: "Auth/JWT", slug: "backend-auth-jwt", description: "Login, tokens, security basics" },
    { category: "Database", name: "MongoDB", slug: "database-mongodb", description: "Collections, queries" },
    { category: "Database", name: "Mongoose", slug: "database-mongoose", description: "Schemas, validation, populate" }
  ]);

  const tReact = topics.find((t) => t.slug === "frontend-react");
  const tAuth = topics.find((t) => t.slug === "backend-auth-jwt");
  const tMongo = topics.find((t) => t.slug === "database-mongodb");

  console.log("Creating questions...");
  const [q1, q2, q3] = await Question.insertMany([
    {
      topicId: tReact._id,
      authorId: diego._id,
      title: "Why does my useEffect run twice in development?",
      body: "In React dev mode my useEffect seems to fire twice even with empty deps. Is this a bug?",
      tags: ["react", "useeffect", "strictmode"]
    },
    {
      topicId: tAuth._id,
      authorId: cassy._id,
      title: "Where should I store my JWT token in React?",
      body: "Should I store JWT in localStorage or memory? What are the tradeoffs for a bootcamp project?",
      tags: ["auth", "jwt", "react"]
    },
    {
      topicId: tMongo._id,
      authorId: maria._id,
      title: "How do I model questions and answers in MongoDB?",
      body: "Should I embed answers in questions or keep a separate answers collection? I need good query performance.",
      tags: ["mongodb", "schema", "mongoose"]
    }
  ]);

  console.log("Creating answers...");
  await Answer.insertMany([
    {
      questionId: q1._id,
      authorId: maria._id,
      body: "In dev, React StrictMode can double-invoke effects to detect side effects. Production runs once."
    },
    {
      questionId: q2._id,
      authorId: diego._id,
      body: "For bootcamp projects, localStorage is fine. For stronger security, httpOnly cookies are preferred."
    },
    {
      questionId: q3._id,
      authorId: cassy._id,
      body: "Separate collection is simpler for pagination. Keep answerCount on the question for faster lists."
    }
  ]);

  await Question.updateMany({}, { $set: { answerCount: 1 } });

  console.log("Seed complete!");
  console.log("Demo login: cassy@example.com / Password123!");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
  });
