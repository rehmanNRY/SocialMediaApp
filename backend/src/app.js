import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

// Default route to test if the server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// importing routes
import commentRoute from "./routes/comment.routes.js"
import friendRoute from "./routes/friendRequests.routes.js"
import postRoute from "./routes/post.routes.js"
import saves from "./routes/saves.routes.js"
import userRoute from "./routes/user.routes.js"
import storyRoute from "./routes/story.routes.js"
import notificationRoute from "./routes/notification.routes.js"

app.use("/api/comments", commentRoute);
app.use("/api/friendRequests", friendRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/posts", postRoute);
app.use("/api/saves", saves);
app.use("/api/user", userRoute);
app.use("/api/story", storyRoute);

export {app}