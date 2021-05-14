const expressJwt = require("express-jwt");
const BASE_URL = process.env.BASE_URL;

function authJwt() {
  return expressJwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${BASE_URL}/accounts/login`,
      `${BASE_URL}/accounts/signup`,
    ],
  });
}

async function isRevoked(req, payload, next) {
  if (!payload.isAdmin) {
    next(null, true);
  }

  next();
}

module.exports = authJwt;
