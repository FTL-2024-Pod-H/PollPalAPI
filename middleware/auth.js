const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUrl = "http://localhost:3000/auth/google/callback";

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

async function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401); // No token provided

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401); // No token in the authorization header

  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    req.user = payload; // Attach user information to the request
    next(); // Proceed to the next middleware or route handler
  } catch (e) {
    return res.sendStatus(403); // Invalid token
  }
}

module.exports = verifyToken;
