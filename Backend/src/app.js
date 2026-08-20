const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://resumefrontend-s1gy.onrender.com",
    credentials:true
}))
const authRouter = require("./routes/auth.route")
const interviewRouter = require("./routes/interview.route")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


module.exports = app;
