import express from "express";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());
// GET endpoint
app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;

  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();

  const db = client.db("react-blog-db");

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

  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  const db = client.db("react-blog-db");

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

app.post("/api/articles/:name/comments", (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  console.log(postedBy);
  const article = articlesInfo.find((a) => a.name === name);
  if (article) {
    article.comments.push({ postedBy, text });
    res.send(article.comments);
  } else {
    res.send("Article doesn't exists!");
  }
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000.");
});
