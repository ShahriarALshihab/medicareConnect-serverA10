import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";


export const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, symptoms, patientEmail } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).send({ message: "Doctor not found" });

    const patient = await User.findOne({ email: patientEmail });
    if (!patient) return res.status(404).send({ message: "Patient not found" });

    const appointment = await Appointment.create({
      patientId: patient._id,
      patientEmail: patient.email,
      patientName: patient.name,
      doctorId: doctor._id,
      doctorEmail: doctor.userEmail,
      doctorName: doctor.doctorName,
      appointmentDate,
      appointmentTime,
      symptoms,
      fee: doctor.consultationFee,
    });

    res.status(201).send(appointment);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


export const getPatientAppointments = async (req, res) => {
  const { status } = req.query;
  const query = { patientEmail: req.params.email };
  if (status) query.appointmentStatus = status;
  const appointments = await Appointment.find(query).sort({ createdAt: -1 });
  res.send(appointments);
};


export const getDoctorAppointments = async (req, res) => {
  const { status } = req.query;
  const query = { doctorEmail: req.params.email };
  if (status) query.appointmentStatus = status;
  const appointments = await Appointment.find(query).sort({ createdAt: -1 });
  res.send(appointments);
};


export const rescheduleAppointment = async (req, res) => {
  const { appointmentDate, appointmentTime } = req.body;
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { appointmentDate, appointmentTime, appointmentStatus: "pending" },
    { new: true }
  );
  res.send(updated);
};


export const cancelAppointment = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { appointmentStatus: "cancelled" },
    { new: true }
  );
  res.send(updated);
};

export const updateAppointmentStatus = async (req, res) => {
  const { appointmentStatus } = req.body; // "accepted" | "rejected" | "completed"
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { appointmentStatus },
    { new: true }
  );
  res.send(updated);
};

export const getAppointmentById = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).send({ message: "Appointment not found" });
  res.send(appointment);
};


export const getAllAppointmentsAdmin = async (req, res) => {
  const { status = "", page = 1, limit = 10 } = req.query;
  const query = status ? { appointmentStatus: status } : {};
  const total = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  res.send({ appointments, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};


export const countByStatus = async (email, field, status) => {
  return Appointment.countDocuments({ [field]: email, appointmentStatus: status });
};
