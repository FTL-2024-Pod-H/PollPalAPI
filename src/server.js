// server.js
const express = require("express");
const app = express()
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const PORT = 3000

//importing userRoutes
const userRoutes = require("../routes/userRoutes");
const chatRoutes = require("../routes/chatRoutes");
const {rateLimiter} = require("../utlis/security");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("Hello from the backend -- You are currently at the / route");
})

app.use("/chat", chatRoutes);

//user routes
app.use("/users", userRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })