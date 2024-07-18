const express = require("express");
const app = express()
const port = 3000


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })