import User from "../models/User.js";

export const getUserRole = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ message: "User not found" });
  res.send({ role: user.role, status: user.status });
};

export const getUserByEmail = async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).send({ message: "User not found" });
  res.send(user);
};

export const updateUser = async (req, res) => {
  const { name, photo, phone, gender } = req.body;
  const updated = await User.findOneAndUpdate(
    { email: req.params.email },
    { $set: { name, photo, phone, gender } },
    { new: true },
  );
  res.send(updated);
};

export const getAllUsers = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.send({
    users,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

export const updateUserStatus = async (req, res) => {
  const { status } = req.body; // "active" | "suspended"
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  res.send(updated);
};

export const deleteUser = async (req, res) => {
  const result = await User.findByIdAndDelete(req.params.id);
  res.send(result);
};
