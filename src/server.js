const express = require("express");
const app = express()
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT || 3000

//importing userRoutes
const userRoutes = require("../routes/userRoutes");
const postRoutes = require("../routes/postRoutes");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello from the backend -- You are currently at the / route");
});

//user routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});