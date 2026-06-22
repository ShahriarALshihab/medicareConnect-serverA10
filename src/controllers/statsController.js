import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Review from "../models/Review.js";
import Payment from "../models/Payment.js";

export const getPlatformStats = async (req, res) => {
  const totalDoctors = await Doctor.countDocuments({
    verificationStatus: "verified",
  });
  const totalPatients = await User.countDocuments({ role: "patient" });
  const totalAppointments = await Appointment.countDocuments();
  const totalReviews = await Review.countDocuments();
  res.send({ totalDoctors, totalPatients, totalAppointments, totalReviews });
};

export const getPatientStats = async (req, res) => {
  const email = req.params.email;

  const upcomingAppointments = await Appointment.countDocuments({
    patientEmail: email,
    appointmentStatus: { $in: ["pending", "accepted"] },
  });
  const appointmentHistory = await Appointment.countDocuments({
    patientEmail: email,
  });

  const payments = await Payment.find({ patientEmail: email });
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  const appointments = await Appointment.find({ patientEmail: email });
  const doctorFrequency = {};
  appointments.forEach((a) => {
    doctorFrequency[a.doctorName] = (doctorFrequency[a.doctorName] || 0) + 1;
  });
  const favoriteDoctors = Object.entries(doctorFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

  res.send({
    upcomingAppointments,
    appointmentHistory,
    totalPayments,
    favoriteDoctors,
  });
};

export const getDoctorStats = async (req, res) => {
  const email = req.params.email;
  const doctor = await Doctor.findOne({ userEmail: email });

  const totalPatients = await Appointment.distinct("patientEmail", {
    doctorEmail: email,
  });

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaysAppointments = await Appointment.countDocuments({
    doctorEmail: email,
    appointmentDate: todayName,
    appointmentStatus: { $in: ["pending", "accepted"] },
  });
  const reviewsReceived = doctor ? doctor.ratingCount : 0;

  res.send({
    totalPatients: totalPatients.length,
    todaysAppointments,
    reviewsReceived,
    ratingAverage: doctor ? doctor.ratingAverage : 0,
  });
};

export const getAdminStats = async (req, res) => {
  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await User.countDocuments({ role: "patient" });
  const totalAppointments = await Appointment.countDocuments();

  const doctorPerformance = await Doctor.find({
    verificationStatus: "verified",
  })
    .sort({ ratingAverage: -1 })
    .limit(10)
    .select("doctorName ratingAverage ratingCount specialization");

  const statusBreakdown = await Appointment.aggregate([
    { $group: { _id: "$appointmentStatus", count: { $sum: 1 } } },
  ]);

  res.send({
    totalDoctors,
    totalPatients,
    totalAppointments,
    doctorPerformance,
    statusBreakdown,
  });
};
