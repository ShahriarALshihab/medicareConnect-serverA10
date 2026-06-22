import User from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await User.findOne({ email });
  if (!user || user.role !== "admin") {
    return res.status(403).send({ message: "Forbidden access: admins only" });
  }
  next();
};

export const verifyDoctor = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await User.findOne({ email });
  if (!user || user.role !== "doctor") {
    return res.status(403).send({ message: "Forbidden access: doctors only" });
  }
  next();
};

export const verifyPatient = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await User.findOne({ email });
  if (!user || user.role !== "patient") {
    return res.status(403).send({ message: "Forbidden access: patients only" });
  }
  next();
};
