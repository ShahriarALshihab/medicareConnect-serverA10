import jwt from "jsonwebtoken";
import { getAdminAuth } from "../config/firebaseAdmin.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";


export const issueJWT = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Firebase ID token missing" });
    }
    const idToken = authHeader.split(" ")[1];

    const decodedFirebaseUser = await getAdminAuth().verifyIdToken(idToken);
    const email = decodedFirebaseUser.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found. Please register first." });
    }

    if (user.status === "suspended") {
      return res.status(403).send({ message: "This account has been suspended." });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.send({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(401).send({ message: "Invalid or expired Firebase token" });
  }
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, photo, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.send({ message: "User already exists", insertedId: null });
    }

    const finalRole = role === "doctor" ? "doctor" : "patient";

    const newUser = await User.create({
      name,
      email,
      photo: photo || "",
      role: finalRole,
    });

   
    if (finalRole === "doctor") {
      const { specialization, qualifications, experience, consultationFee, hospitalName } = req.body;
      await Doctor.create({
        userEmail: email,
        doctorName: name,
        specialization: specialization || "General Physician",
        qualifications: qualifications || "",
        experience: experience || 0,
        consultationFee: consultationFee || 0,
        hospitalName: hospitalName || "",
        profileImage: photo || "",
        verificationStatus: "pending",
      });
    }

    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
