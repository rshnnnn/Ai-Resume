const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
<<<<<<< HEAD
    origin:"http://localhost:5173",
=======
    origin:"https://resumefrontend-s1gy.onrender.com",
>>>>>>> 1c0757a0433b7fa943493a862053362ab9d8c9e0
    credentials:true
}))
const authRouter = require("./routes/auth.route")
const interviewRouter = require("./routes/interview.route")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


module.exports = app;
