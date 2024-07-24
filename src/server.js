const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const PORT = 3000;
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const verifyToken = require("../middleware/auth");

//importing userRoutes
const userRoutes = require("../routes/userRoutes");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Use environment variables for OAuth credentials
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = "http://localhost:3000/auth/google/callback";

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

app.get("/protected_route", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.get("/auth/login", (req, res) => {
  console.log("login");
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });

  res.redirect(authorizationUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  console.log(code);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log(tokens);
    // tokens.access_token

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const googleUser = await oauth2.userinfo.get();
    console.log(googleUser.data);
    // check against the DB

    res.redirect(`http://localhost:5173/callback?token=${tokens.id_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Authentication failed!");
  }
});

app.get("/", (req, res) => {
  res.send("Hello from the backend -- You are currently at the / route");
});

//user routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
