const express = require("express");
const app = express()
const port = 3000

//importing userRoutes
const userRoutes = require(".routes/userRoutes");

app.get("/", (req, res) => {
  res.send("Hello from the backend -- You are currently at the / route");
})

//user routes
app.use("/users", userRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })