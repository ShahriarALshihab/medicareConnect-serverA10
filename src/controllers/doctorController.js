import Doctor from "../models/Doctor.js";


export const getDoctors = async (req, res) => {
  const { search = "", sortBy = "", page = 1, limit = 6 } = req.query;

  const query = { verificationStatus: "verified" };
  if (search) {
    query.$or = [
      { doctorName: { $regex: search, $options: "i" } },
      { specialization: { $regex: search, $options: "i" } },
    ];
  }

  let sort = { createdAt: -1 };
  if (sortBy === "fee") sort = { consultationFee: 1 };
  if (sortBy === "experience") sort = { experience: -1 };
  if (sortBy === "rating") sort = { ratingAverage: -1 };

  const total = await Doctor.countDocuments(query);
  const doctors = await Doctor.find(query)
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.send({ doctors, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};


export const getFeaturedDoctors = async (req, res) => {
  const doctors = await Doctor.find({ verificationStatus: "verified" })
    .sort({ ratingAverage: -1 })
    .limit(6);
  res.send(doctors);
};


export const getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).send({ message: "Doctor not found" });
  res.send(doctor);
};


export const getDoctorByEmail = async (req, res) => {
  const doctor = await Doctor.findOne({ userEmail: req.params.email });
  if (!doctor) return res.status(404).send({ message: "Doctor profile not found" });
  res.send(doctor);
};


export const updateDoctorProfile = async (req, res) => {
  const { qualifications, experience, consultationFee, hospitalName, specialization, profileImage } = req.body;
  const updated = await Doctor.findOneAndUpdate(
    { userEmail: req.params.email },
    { $set: { qualifications, experience, consultationFee, hospitalName, specialization, profileImage } },
    { new: true }
  );
  res.send(updated);
};


export const addSchedule = async (req, res) => {
  const { day, times } = req.body;
  const doctor = await Doctor.findOne({ userEmail: req.params.email });
  doctor.availableSlots.push({ day, times });
  await doctor.save();
  res.send(doctor);
};


export const updateSchedule = async (req, res) => {
  const { times } = req.body;
  const doctor = await Doctor.findOne({ userEmail: req.params.email });
  const slot = doctor.availableSlots.find((s) => s.day === req.params.day);
  if (slot) slot.times = times;
  await doctor.save();
  res.send(doctor);
};


export const removeSchedule = async (req, res) => {
  const doctor = await Doctor.findOne({ userEmail: req.params.email });
  doctor.availableSlots = doctor.availableSlots.filter((s) => s.day !== req.params.day);
  await doctor.save();
  res.send(doctor);
};




export const getAllDoctorsAdmin = async (req, res) => {
  const { status = "", page = 1, limit = 10 } = req.query;
  const query = status ? { verificationStatus: status } : {};
  const total = await Doctor.countDocuments(query);
  const doctors = await Doctor.find(query)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  res.send({ doctors, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};


export const updateVerificationStatus = async (req, res) => {
  const { verificationStatus } = req.body;
  const updated = await Doctor.findByIdAndUpdate(req.params.id, { verificationStatus }, { new: true });
  res.send(updated);
};
