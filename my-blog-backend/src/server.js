import fs from "fs";
import admin from "firebase-admin";
import express from "express";
import { db, connectToDB } from "./db.js";

const credentials = JSON.parse(fs.readFileSync("../credentials.json"));
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());
app.use(async (res, req, next) => {
    const { authtoken } = req.headers;
    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch (e) {
            res.sendStatus(400);
        }
    }
    next();
});

// GET endpoint
app.get("/api/articles/:name", async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const article = await db.collection("articles").findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.include(uid);
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

app.use((res, req, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
});
//PUT endpoint
app.put("/api/articles/:name/upvote", async (req, res) => {
    const { name } = req.params;

    const article = await db.collection("articles").findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.include(uid);
        if (canUpvote) {
            await db.collection("articles").updateOne(
                { name },
                {
                    $inc: { upvotes: 1 },
                    $push: { upvoteIds: uid },
                }
            );
        }
        const updatedArticle = await db
            .collection("articles")
            .findOne({ name });
        res.json(updatedArticle);
    } else {
        res.send("Article doesn't exists!");
    }
});

app.post("/api/articles/:name/comments", async (req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const { email } = req.user;
    await db.collection("articles").updateOne(
        { name },
        {
            $push: { comments: { postedBy: email, text } },
        }
    );

    const article = await db.collection("articles").findOne({ name });
    if (article) {
        res.json(article);
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
