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

// importing routes
import commentRoute from "./routes/comment.routes.js"
import friendRoute from "./routes/friendRequests.routes.js"
import postRoute from "./routes/post.routes.js"
import saves from "./routes/saves.routes.js"
import userRoute from "./routes/user.routes.js"

app.use("/api/comment", commentRoute);
app.use("/api/friendRequests", friendRoute);
app.use("/api/posts", postRoute);
app.use("/api/saves", saves);
app.use("/api/user", userRoute);


export {app}