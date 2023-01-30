import express from "express";
import { db, connectToDB } from "./db.js";

const app = express();
app.use(express.json());

// GET endpoint
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;

  const article = await db.collection("articles").findOne({ name });

  if (article) {
    res.send(article);
  } else {
    res.send("Article not found!");
  }
});

//PUT endpoint
app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;

  await db.collection("articles").updateOne(
    { name },
    {
      $inc: { upvotes: 1 },
    }
  );
  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.send(`The ${article.name} article now has ${article.upvotes} upvotes!`);
  } else {
    res.send("Article doesn't exists!");
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  await db.collection("articles").updateOne(
    { name },
    {
      $push: { comments: { postedBy, text } },
    }
  );

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    res.send(article.comments);
  } else {
    res.send("Article doesn't exists!");
  }
});

connectToDB(() => {
  console.log("Successfully connected to the database.");
  app.listen(8000, () => {
    console.log("Server is listening on port 8000.");
  });
});
