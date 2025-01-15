import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the "Bearer" header

  if (!token) return res.status(401).send("Access token required.");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid or expired token.");
    req.user = user; // Attach user information to the request
    next();
  });
};