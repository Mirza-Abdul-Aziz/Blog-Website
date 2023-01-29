import express from "express";

const app = express();
app.use(express.json());
// GET endpoint

app.put("/api/articles/:name/upvote", (req, res) => {
  const { name } = req.params;
  const article = articlesInfo.find((a) => a.name === name);
  if (article) {
    article.upvotes += 1;
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
