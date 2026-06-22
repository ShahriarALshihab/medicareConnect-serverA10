import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    // decoded = { email, role }
    req.decoded = decoded;
    next();
  });
};

export const verifySelfOrAdmin = (req, res, next) => {
  const requestedEmail = req.params.email || req.query.email;
  if (req.decoded.role !== "admin" && req.decoded.email !== requestedEmail) {
    return res.status(403).send({ message: "Forbidden access" });
  }
  next();
};
